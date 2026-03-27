# Content CMS — Design Spec
**Date:** 2026-03-27
**Status:** Approved

## Overview

An integrated content management system embedded in the existing portfolio site at `/admin/*`. It automatically tracks data analytics news, scores items by impact, and provides a studio for generating platform-specific posts (blog, LinkedIn, Twitter) using AI and user-authored style guides. No posting automation — all output is copy-paste ready.

---

## Goals

- Track relevant happenings in data analytics, Power BI, Python, SQL, Tableau, ML/AI automatically
- Score and surface the most impactful items daily
- Generate platform-appropriate drafts using per-platform style guides authored by the user
- Provide a clean weekly content planner (1 blog/week, 3 LinkedIn/week, 7 Twitter/week)
- Admin-only access via a simple password gate

## Non-Goals

- Automatic posting to any platform
- Public-facing CMS pages
- Multi-user access or role-based permissions
- Analytics or engagement tracking of published posts

---

## Architecture

**Approach:** Fully integrated into the existing Next.js 16 App Router portfolio. No separate deployment, no monorepo split.

**Storage:** Upstash Redis (via Vercel Marketplace). Free tier sufficient for this workload.

**AI:** OpenRouter (`@ai-sdk/openrouter`) for all LLM calls. No Vercel AI Gateway.

**Scheduling:** Vercel Cron Job (defined in `vercel.json`).

---

## Route Structure

```
app/
  admin/
    login/
      page.tsx               — password form
    page.tsx                 — redirect → /admin/inbox
    inbox/
      page.tsx               — tracked items sorted by score
    queue/
      page.tsx               — weekly planner (3 platform columns)
    generate/
      page.tsx               — draft studio (item + platform → AI output)
    style-guides/
      page.tsx               — per-platform style guide editor
    sources/
      page.tsx               — RSS feed manager

  api/admin/
    ingest/
      route.ts               — Vercel Cron handler + manual trigger endpoint
    rescore/
      route.ts               — on-demand AI re-score for a single item
    generate/
      route.ts               — AI post generation (streaming)
    auth/
      route.ts               — login (set cookie) + logout (clear cookie)

middleware.ts                — guards all /admin/* routes (redirects to /admin/login if no valid session)
```

---

## Auth Gate

- `ADMIN_PASSWORD` environment variable (set in Vercel dashboard, never committed)
- `POST /api/admin/auth` validates submitted password against `ADMIN_PASSWORD`
- On success: sets a signed `httpOnly; Secure; SameSite=Strict` cookie named `admin-session`
  - Value: HMAC-SHA256 signature of `ADMIN_PASSWORD` using a `ADMIN_SESSION_SECRET` env var
  - No expiry — persists until browser closes or logout
- `middleware.ts` verifies the cookie signature on every `/admin/*` request (edge-compatible, no DB call)
- `POST /api/admin/auth?action=logout` clears the cookie

**Required env vars:**
```
ADMIN_PASSWORD=<your password>
ADMIN_SESSION_SECRET=<random 32-byte hex string>
OPENROUTER_API_KEY=<your key>
UPSTASH_REDIS_REST_URL=<from Vercel Marketplace>
UPSTASH_REDIS_REST_TOKEN=<from Vercel Marketplace>
```

---

## Upstash Redis Data Model

```
feeds
  Type: JSON string (serialized array)
  Value: Feed[]
  Structure: { id, name, url, category, weight(1–5), enabled }
  Default: seeded with 20 feeds on first ingest run if key absent

items:{YYYY-MM-DD}
  Type: Hash
  Key per item: {id} (UUID)
  Value: JSON string — TrackedItem
  Structure: {
    id, title, url, source, summary,
    publishedAt, heuristicScore(0–100),
    aiScore?(1–10), platform?('blog'|'linkedin'|'twitter'),
    draft?(string), tags(string[]), discoverySource('rss'|'ai-discovery')
  }
  TTL: 14 days

queue:blog        — Hash { itemId → YYYY-WW (ISO week string) }
queue:linkedin    — Hash { itemId → YYYY-MM-DD }
queue:twitter     — Hash { itemId → YYYY-MM-DD }

styleguide:blog     — String (markdown)
styleguide:linkedin — String (markdown)
styleguide:twitter  — String (markdown)
```

---

## Daily Ingestion Pipeline

**Trigger:** Vercel Cron at `30 4 * * *` UTC (10:00 AM IST). Also callable manually via `POST /api/admin/ingest` from the Inbox UI (with cookie auth check).

**Steps:**

1. Load all `feeds` from Upstash; filter `enabled: true`
2. Fetch all feeds in parallel using native `fetch`; parse RSS/Atom XML with `fast-xml-parser`
3. For each item published within the last 24 hours:
   - Extract: `title`, `url`, `summary/description`, `publishedAt`, source name
   - Compute heuristic score (see below)
   - Skip if URL already exists in `items:{today}` (dedup by URL)
   - Store in `items:{today}` hash with 14-day TTL
4. Run AI discovery scan:
   - Single `generateText` call to `qwen/qwen2.5-7b-instruct` via OpenRouter with a web search prompt
   - Prompt: *"List 5–10 significant developments in data analytics, Power BI, Python, SQL, Tableau, or ML/AI published in the last 24 hours. Return JSON array: [{title, url, summary, tags}]"*
   - Parse response; score and store each item tagged `discoverySource: 'ai-discovery'`
   - Skip duplicates by URL
5. Return count of new items stored

**Heuristic score formula (0–100):**
```
recencyScore   = 100 * max(0, (1 - hoursOld / 168))   // decays to 0 over 7 days
keywordScore   = min(30, keywordMatches * 5)           // +5 per match, cap 30
                 keywords: Power BI, Python, SQL, Tableau, ML, AI, analytics,
                           data, visualisation, automation, dashboard, Pandas
sourceScore    = (feed.weight / 5) * 40                // weight 1→8, weight 5→40

final = (recencyScore * 0.4) + (sourceScore * 0.3) + (keywordScore * 0.3)
        clamped to [0, 100], rounded to integer
```

**On-demand AI re-score (`POST /api/admin/rescore`):**
- Input: `itemId`, `date`
- Calls `qwen/qwen2.5-7b-instruct` with item title + summary
- Prompt asks for a rating 1–10 on: relevance to data analyst audience, novelty, likely engagement
- Returns `{ relevance, novelty, engagement, composite }` — composite stored as `aiScore`
- Updates the item in Upstash

---

## AI Post Generation

**Endpoint:** `POST /api/admin/generate` (streaming)

**Input:** `{ itemId, date, platform: 'blog' | 'linkedin' | 'twitter' }`

**Steps:**
1. Fetch item from `items:{date}` hash
2. Fetch `styleguide:{platform}` from Upstash
3. Build messages:
   ```
   system: "You are a content writer for {platform}.
            Follow this style guide exactly:\n\n{styleguide}"
   user:   "Write a {platform} post about the following topic.
            Title: {title}
            Summary: {summary}
            Source URL: {url}

            Return only the post content, ready to copy and paste."
   ```
4. Stream response from `deepseek/deepseek-chat` (DeepSeek V3) via OpenRouter
5. After completion, update the TrackedItem JSON in `items:{date}` hash: set `draft` field to the generated text

**Models:**
| Task | Model | Rationale |
|------|-------|-----------|
| Discovery scan | `qwen/qwen2.5-7b-instruct` | Cheap, fast, structured JSON output |
| AI re-score | `qwen/qwen2.5-7b-instruct` | Simple scoring task |
| Post generation | `deepseek/deepseek-chat` | Quality writing, cost-efficient |

---

## Admin Dashboard UI

Uses existing design tokens (`--bg`, `--border`, `--text`, `--amber`, etc.) and fonts (DM Sans, JetBrains Mono). Clean utility layout — not the lofi aesthetic of the public site.

### `/admin/inbox`
- Table/list of all items from today (default) or date-range picker
- Columns: title (linked), source, age, heuristic score bar, AI score badge (if set), tags
- Actions per row: `[Re-score]`, `[→ Queue]` (assign to platform), `[Generate]`
- Top toolbar: date filter | platform filter | `[Run scan now]` button
- Items with `platform` assigned show a coloured tag (blog/LinkedIn/Twitter)

### `/admin/queue`
Three-column weekly planner:
- **Blog** — 1 slot per week (ISO week view)
- **LinkedIn** — 3 slots per week (Mon/Wed/Fri)
- **Twitter** — 7 slots per week (one per day)

Each card shows: title (truncated), score, source, `[Generate]` button, `[Remove]` button.
Empty slots show `[+ Assign from inbox]` which opens an item picker modal.

### `/admin/generate`
- Select item (dropdown, shows score + source)
- Select platform (Blog / LinkedIn / Twitter)
- `[Generate]` — streams response into a read-only textarea below
- `[Copy to clipboard]` button (prominent)
- Sidebar: shows active style guide name, `[Edit style guide →]` link
- Previous draft shown if one exists for this item+platform

### `/admin/style-guides`
- Three tabs: Blog | LinkedIn | Twitter
- Full-height `<textarea>` (monospace font) per tab
- `[Save]` button — writes to Upstash, shows "Saved ✓" confirmation
- First-load hint (shown when guide is empty):
  ```markdown
  ## Tone
  ## Audience
  ## Format & Length
  ## Always include
  ## Avoid
  ## Example post
  ```

### `/admin/sources`
- Table: name, URL, category, weight (1–5 select), enabled (toggle), `[Delete]`
- `[+ Add feed]` button opens inline form row
- `[Reset to defaults]` restores the 20 seeded feeds (with confirmation)
- Weight visually shown as filled dots (●●●○○)

---

## Default RSS Feeds (20)

| Name | URL | Category |
|------|-----|----------|
| Towards Data Science | `https://towardsdatascience.com/feed` | Data Science |
| KDnuggets | `https://www.kdnuggets.com/feed` | Data Science |
| Analytics Vidhya | `https://www.analyticsvidhya.com/feed/` | Data Science |
| Power BI Blog | `https://powerbi.microsoft.com/en-us/blog/feed/` | Power BI |
| Microsoft Fabric Blog | `https://blog.fabric.microsoft.com/en-US/blog/feed/` | Power BI |
| Tableau Blog | `https://www.tableau.com/rss.xml` | Visualisation |
| Python Blog | `https://blog.python.org/feeds/posts/default` | Python |
| Real Python | `https://realpython.com/atom.xml` | Python |
| Hacker News (best) | `https://news.ycombinator.com/rss` | General Tech |
| r/datascience | `https://www.reddit.com/r/datascience/.rss` | Community |
| r/MachineLearning | `https://www.reddit.com/r/MachineLearning/.rss` | ML/AI |
| r/PowerBI | `https://www.reddit.com/r/PowerBI/.rss` | Power BI |
| Google AI Blog | `https://blog.research.google/feeds/posts/default` | ML/AI |
| MIT Tech Review (AI) | `https://www.technologyreview.com/feed/` | ML/AI |
| The Batch (deeplearning.ai) | `https://www.deeplearning.ai/the-batch/feed/` | ML/AI |
| Data Elixir | `https://dataelixir.com/issues.rss` | Newsletter |
| Practical Business Python | `https://pbpython.com/feeds/all.atom.xml` | Python |
| Mode Analytics Blog | `https://mode.com/blog/rss.xml` | Analytics |
| dbt Blog | `https://www.getdbt.com/blog/rss.xml` | Data Engineering |
| Flowing Data | `https://flowingdata.com/feed` | Visualisation |

---

## Error Handling

- **Feed fetch failure:** Log the error, skip that feed, continue with others. Never fail the whole cron run.
- **AI discovery scan failure:** Log and skip. Heuristic-scored RSS items still stored normally.
- **OpenRouter API error during generation:** Return HTTP 500 with user-facing message "Generation failed — try again". No silent failure.
- **Upstash connection error:** All admin route handlers return 503 with error message. No fallback to stale data.
- **Expired/invalid session cookie:** Middleware redirects to `/admin/login`. Cookie is cleared.

---

## Testing

- **Unit:** `lib/scoring.ts` heuristic function — pure function, fully testable with Vitest
- **Unit:** `lib/rss.ts` feed parser — test against fixture XML files
- **Unit:** Auth cookie sign/verify — test HMAC logic independently
- **Integration:** Middleware redirect behaviour (no valid cookie → redirect to login)
- **Build test:** `next build` catches type errors across all new route handlers

No end-to-end tests for the admin UI (personal tool, low ROI).

---

## New Dependencies

| Package | Purpose |
|---------|---------|
| `@upstash/redis` | Upstash Redis client |
| `@ai-sdk/openrouter` | OpenRouter provider for AI SDK |
| `ai` | AI SDK core — not in current `package.json`, must be added |
| `fast-xml-parser` | RSS/Atom XML parsing |

All require user confirmation before install per project conventions.

---

## File Conventions

- New lib modules: `lib/rss.ts`, `lib/scoring.ts`, `lib/redis.ts` (Upstash client singleton)
- All admin route handlers are Server Components or Route Handlers — no `'use client'` except interactive UI components
- Admin UI components live in `components/admin/` — not shared with the public site
- Style: follows existing project conventions (kebab-case files, strict TypeScript, no `any`)
