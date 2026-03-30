# Content Studio Redesign Spec
**Date:** 2026-03-30
**Status:** Approved for implementation
**Replaces:** `/admin/inbox`, `/admin/queue`, `/admin/generate`

---

## Overview

Replace the current 3-page CMS flow (Inbox → Queue → Generate) with a single unified **Content Studio** at `/admin/create`. The redesign targets a non-technical user who needs one-shot, publish-ready content across LinkedIn, X, and Blog — with zero pipeline mental model required.

Two modes on one page: **News** (browse RSS articles, click to write) and **Topic** (type any subject, get AI-researched post ideas, generate content).

---

## Goals

1. Non-technical user can produce a publish-ready post in under 60 seconds
2. Output quality: scroll-stopping hooks, unexpected angles, platform-perfect formatting
3. All selected platforms generated in parallel — one button, one wait, done
4. Feed covers every high-signal source relevant to Sulagna's audience
5. Zero leftover complexity from old flow

---

## Navigation Changes

| Before | After |
|--------|-------|
| Inbox | — (removed) |
| Queue | — (removed) |
| Generate | Create (new) |
| Sources | Sources (kept, simplified) |
| Style Guides | Style Guides (kept as-is) |

`/admin` redirects to `/admin/create`.
Admin nav: **Create · Sources · Style Guides**

---

## Page: `/admin/create`

### Layout

Two-column split:

```
┌──────────────────────┬──────────────────────────────────────────┐
│  LEFT (360px)        │  RIGHT (workspace)                       │
│                      │                                          │
│  [📰 News] [💡 Topic]│  Selected article title / topic angle    │
│                      │  Source · Published time                 │
│  NEWS: article cards │                                          │
│  sorted by score     │  [LinkedIn ✓] [X ✓] [Blog]  ← toggles  │
│  [+ Select] per card │                                          │
│                      │  [    CREATE    ]  ← primary button      │
│  TOPIC: text input   │                                          │
│  [Get Ideas] button  │  ── after generation ──                  │
│  → 3 angle cards     │  [LinkedIn] [X] [Blog]  ← output tabs   │
│    click to load     │  Full post in active tab                 │
│                      │  [Copy ✓] per tab                        │
└──────────────────────┴──────────────────────────────────────────┘
```

### News Mode

- On page load: fetch today's items from Redis (`items:{today}`); if stale or empty, trigger `/api/admin/ingest` automatically
- Article cards sorted by `heuristicScore` descending — highest relevance first
- Each card shows: title (truncated 80 chars), source name, time since published, score badge
- Clicking a card loads it into the workspace; card highlights as selected
- **Refresh** button in header re-triggers ingest and reloads feed
- No date picker, no manual scoring UI — those are gone

### Topic Mode

- Single textarea: "What do you want to write about?"
- **Get Ideas** button → calls `/api/admin/ideas`
- Returns 3 angle cards, each with: bold hook line + one-sentence angle description
- Clicking an angle card loads it into the workspace as the active topic
- User can also skip ideas and type a specific angle directly, then hit Create

### Workspace

- Platform toggles are sticky (persisted in `localStorage`)
- **CREATE** is disabled until: item/topic selected AND at least one platform ticked
- While generating: button shows spinner, output area shows per-platform skeleton loaders
- All selected platforms generate in parallel
- Output tabs appear after generation; active tab = first selected platform
- Each tab: full formatted post + **Copy** button
- Copy button turns "Copied ✓" for 2s, then resets
- User can edit the output directly in each tab before copying
- **Save draft** persists all generated tabs back to Redis on the item (news mode only)

---

## API Changes

### Keep (modified)
- `POST /api/admin/ingest` — unchanged logic, now also auto-triggered on page load if feed is stale
- `GET /api/admin/items` — unchanged
- `PUT /api/admin/items` — unchanged (save draft)
- `GET /api/admin/feeds` — unchanged
- `PUT /api/admin/feeds` — unchanged

### Replace
- `POST /api/admin/generate` — **rewritten**: accepts `{ source: 'article' | 'topic', itemId?, date?, topic?, platforms: Platform[] }`, runs research + write pipeline in parallel per platform, returns `{ linkedin?: string, twitter?: string, blog?: string }`

### New
- `POST /api/admin/ideas` — accepts `{ topic: string }`, calls Perplexity sonar, returns `{ ideas: Array<{ hook: string, angle: string }> }` (3 items)

### Remove
- `GET/POST /api/admin/queue` — removed (queue concept eliminated)
- `POST /api/admin/rescore` — removed (no scoring UI)

---

## AI Pipeline

### Research Step (both modes)

Model: `perplexity/sonar` (via OpenRouter — live web search)

Prompt template:
```
Research the following for a data analytics content creator.
Topic/Article: {title or topic}
URL (if available): {url}

Return a JSON object:
{
  "keyFacts": ["3-5 specific facts, stats, or data points"],
  "surprisingAngle": "One counterintuitive or unexpected insight",
  "relevantContext": "2-3 sentences of background the audience needs",
  "sources": ["up to 3 source URLs found"]
}
Return only valid JSON. No markdown wrapper.
```

### Write Step (per platform, parallel)

Model: `qwen/qwen-2.5-72b-instruct` (via OpenRouter)

Each platform fires simultaneously. User message to writer:
```
Research findings:
{researchBlob as formatted bullet points}

Original source: {url or "original topic"}

Write the {platform} post now.
```

System prompt per platform: see Section below.

### Ideas Step (topic mode only)

Model: `perplexity/sonar`

```
You are a content strategist for Sulagna Dey, a data analytics thought leader.
Topic: {userTopic}

Generate exactly 3 scroll-stopping post angles for LinkedIn/X/Blog.
Return JSON array only:
[
  { "hook": "one punchy opening line", "angle": "one sentence describing the unique take" },
  ...
]
No markdown. No explanation. Just the JSON array.
```

### Model Config (env vars)

```
RESEARCH_MODEL=perplexity/sonar
WRITER_MODEL=qwen/qwen-2.5-72b-instruct
```

Swappable without code changes.

---

## Platform System Prompts

### LinkedIn

```
You write for Sulagna Dey — data analyst, thought leader. Her audience:
analysts, BI developers, Python practitioners, aspiring data scientists.

VOICE: Smart colleague sharing a real insight over coffee. Warm, direct,
never corporate. Use "I", "you", contractions. No em-dashes. No buzzwords.

STRUCTURE:
LINE 1 — HOOK (pick the sharpest):
  • Counterintuitive truth: "Most dashboards lie. Here's why."
  • Specific shocking number: "87% of Power BI reports never get opened."
  • Confession with stakes: "I spent 3 days on a dashboard. My stakeholder
    looked at it for 8 seconds."

LINES 2–4 — INSIGHT: 2-3 short paragraphs. One idea each. Surface the
unexpected connection — the "I never thought of it that way" moment. Use
every research fact provided. Be specific. Cite numbers. Name tools.

LINE 5 — THE PIVOT: One sentence that reframes everything above.

LINES 6–8 — TAKEAWAY: Concrete. What does the reader do differently tomorrow?

FINAL LINE — CTA (never use "what do you think?"):
  • Direct challenge: "Tell me your worst stakeholder dashboard story. I'll wait."
  • Bold claim: "This is why 90% of BI careers plateau — fight me in the comments."
  • Stakes question: "Have you tried this? What broke first?"

LENGTH: 150–220 words. Line break between every paragraph.
HASHTAGS: 3–4 at the very end. Specific, not generic.
FORBIDDEN: "In conclusion", "game-changer", "leverage", "synergy",
exclamation points, em-dashes.
```

### X (Twitter)

```
You write for Sulagna Dey — sharp data analyst with opinions on BI, Python,
AI. One tweet. Max 270 characters.

PICK THE STRONGEST FORMULA for this content:
A) COUNTERINTUITIVE: "[Surprising truth]. Most people [do wrong thing].
   The fix is embarrassingly simple."
B) HOT TAKE: "Unpopular opinion: [bold data/BI claim]."
C) SPECIFIC NUMBER: "[Shocking stat]. Here's what it actually means:"
D) CONFESSION: "I just [did thing]. The result? [Surprising outcome]."

RULES:
• End with a provocation ("Prove me wrong.") or cliffhanger
• Sound like a real person, not a content bot
• No hashtags unless the topic is actively trending (max 1)
• No decorative emojis

FORBIDDEN: "excited to share", "thoughts?", hashtag spam.
```

### Blog

```
You write for Sulagna Dey's blog. Audience: mid-career analysts and
aspiring data professionals who want perspective-shifting practical insight.

HEADLINE: SEO-aware but human. Lead with the unexpected.
  Bad:  "Introduction to Power BI Filters"
  Good: "The Power BI Feature That Kills More Dashboards Than Bad Data"

OPENING (50–80 words): Start mid-scene or with a provocative claim.
No "In today's world". No throat-clearing. Make something feel at stake.

BODY — 3–4 sections, H2 headers as statements not labels:
  Bad H2:  "Color Design"
  Good H2: "Why Your Color Choices Are Lying to Your Stakeholders"
  • One "wow" moment per section: unexpected stat, analogy, or insight
  • Cite specific tool names, version numbers, data points
  • Section 2 must contain the counterintuitive angle — the connection
    readers didn't see coming

CLOSING (50–80 words): Don't summarize. Synthesize. Reframe the whole
piece in one new light.

CTA — specific and personal, never generic:
  • "Forward this to the analyst still using pie charts. They need it more."
  • "I'm answering every comment this week — drop your worst data story."
  • "I wrote a free checklist for this — link in bio."

LENGTH: 450–600 words.
TONE: Smart friend who happens to be a data expert. Warm, direct, funny.
FORBIDDEN: Passive voice, "utilize", "it's worth noting", "in conclusion".
```

Style guide from Redis (`styleguide:{platform}`) is appended to each system prompt at runtime.

---

## RSS Feed Sources (52 feeds)

### Tier 1 — Data Analytics / BI (weight: 5)
| Name | URL |
|------|-----|
| Power BI Blog | https://powerbi.microsoft.com/en-us/blog/feed/ |
| Microsoft Fabric Blog | https://blog.fabric.microsoft.com/en-US/blog/feed/ |
| Tableau Blog | https://www.tableau.com/rss.xml |
| Looker / Google Data Analytics | https://cloud.google.com/blog/products/data-analytics/rss.xml |
| Sigma Computing Blog | https://www.sigmacomputing.com/blog/rss.xml |
| Mode Analytics Blog | https://mode.com/blog/rss.xml |
| The Data School | https://dataschool.com/feed.xml |
| r/PowerBI | https://www.reddit.com/r/PowerBI/.rss |
| r/BusinessIntelligence | https://www.reddit.com/r/BusinessIntelligence/.rss |

### Tier 2 — Data Storytelling / Visualisation (weight: 5)
| Name | URL |
|------|-----|
| Flowing Data | https://flowingdata.com/feed |
| Storytelling with Data | https://www.storytellingwithdata.com/blog/rss |
| Information is Beautiful | https://informationisbeautiful.net/feed/ |
| Datawrapper Blog | https://blog.datawrapper.de/feed/ |
| Nightingale (DVS) | https://nightingaledvs.com/feed/ |
| The Pudding | https://pudding.cool/feed/index.xml |
| r/dataviz | https://www.reddit.com/r/dataviz/.rss |

### Tier 3 — AI / ML Trends (weight: 4)
| Name | URL |
|------|-----|
| Google AI Blog | https://blog.research.google/feeds/posts/default |
| MIT Tech Review (AI) | https://www.technologyreview.com/feed/ |
| The Batch (deeplearning.ai) | https://www.deeplearning.ai/the-batch/feed/ |
| r/MachineLearning | https://www.reddit.com/r/MachineLearning/.rss |
| Hugging Face Blog | https://huggingface.co/blog/feed.xml |
| OpenAI Blog | https://openai.com/blog/rss.xml |
| Anthropic News | https://www.anthropic.com/news/rss.xml |
| The Gradient | https://thegradient.pub/rss/ |
| Last Week in AI | https://lastweekin.ai/feed |
| Import AI | https://importai.substack.com/feed |

### Tier 4 — Python / SQL for Data (weight: 4)
| Name | URL |
|------|-----|
| Towards Data Science | https://towardsdatascience.com/feed |
| KDnuggets | https://www.kdnuggets.com/feed |
| Analytics Vidhya | https://www.analyticsvidhya.com/feed/ |
| Real Python | https://realpython.com/atom.xml |
| Python Blog | https://blog.python.org/feeds/posts/default |
| Practical Business Python | https://pbpython.com/feeds/all.atom.xml |
| dbt Blog | https://www.getdbt.com/blog/rss.xml |
| Count.co Blog | https://count.co/blog/rss.xml |

### Tier 5 — Excel (weight: 3)
| Name | URL |
|------|-----|
| Chandoo.org | https://chandoo.org/wp/feed/ |
| Excel Campus | https://www.excelcampus.com/feed/ |
| Mr. Excel Blog | https://www.mrexcel.com/feed/ |
| Excel Jet | https://exceljet.net/feed |

### Tier 6 — Industry News (weight: 3)
| Name | URL |
|------|-----|
| Hacker News (best) | https://news.ycombinator.com/rss |
| TechCrunch AI | https://techcrunch.com/category/artificial-intelligence/feed/ |
| VentureBeat AI | https://venturebeat.com/category/ai/feed/ |

### Tier 7 — Career / Data Professionals (weight: 3)
| Name | URL |
|------|-----|
| Data Elixir | https://dataelixir.com/issues.rss |
| Locally Optimistic | https://locallyoptimistic.com/feed.xml |
| Benn Stancil | https://benn.substack.com/feed |
| Data Science Weekly | https://www.datascienceweekly.org/data-science-weekly.rss |

### Tier 8 — Data Engineering (weight: 2)
| Name | URL |
|------|-----|
| Data Engineering Weekly | https://www.dataengineeringweekly.com/feed |
| The Seattle Data Guy | https://www.theseattledataguy.com/feed/ |
| Airbyte Blog | https://airbyte.com/blog-post/rss.xml |
| Astronomer Blog | https://www.astronomer.io/blog/rss.xml |

All feeds: `enabled: true`. Weights map to tier numbers above.

---

## Redis Schema (unchanged)

- `items:{date}` hash — TrackedItem values, keyed by itemId, TTL 14 days
- `styleguide:{platform}` string — platform system prompt suffix
- `feeds` key — Feed[] array (seeded from new defaults on first run)

`queue:{platform}` hash — **retained** but no longer written by the UI. Kept for potential future use / backward compat.

---

## Types Changes

Add to `lib/types.ts`:
```typescript
export interface GenerateRequest {
  source: 'article' | 'topic';
  platforms: Platform[];
  // article mode:
  itemId?: string;
  date?: string;
  // topic mode:
  topic?: string;
}

export interface GenerateResult {
  linkedin?: string;
  twitter?: string;
  blog?: string;
}

export interface IdeaCard {
  hook: string;
  angle: string;
}
```

---

## Tech Debt

- **Glance integration** (`github.com/glanceapp/glance`): Glance has no programmatic API; direct integration is not feasible without a proxy/scraper layer. Revisit if Glance adds an API or if we build a sidecar service. Logged: 2026-03-30.

---

## Files to Create / Modify

| Action | File |
|--------|------|
| DELETE | `app/admin/inbox/page.tsx` |
| DELETE | `app/admin/queue/page.tsx` |
| DELETE | `components/admin/inbox-client.tsx` |
| DELETE | `components/admin/queue-client.tsx` |
| DELETE | `app/api/admin/queue/route.ts` |
| DELETE | `app/api/admin/rescore/route.ts` |
| CREATE | `app/admin/create/page.tsx` |
| CREATE | `components/admin/create-client.tsx` |
| CREATE | `components/admin/feed-panel.tsx` |
| CREATE | `components/admin/topic-panel.tsx` |
| CREATE | `components/admin/workspace.tsx` |
| CREATE | `app/api/admin/generate/route.ts` (replace) |
| CREATE | `app/api/admin/ideas/route.ts` |
| MODIFY | `app/admin/page.tsx` (redirect to /admin/create) |
| MODIFY | `app/admin/layout.tsx` (update nav) |
| MODIFY | `lib/feeds-default.ts` (52 feeds) |
| MODIFY | `lib/types.ts` (add GenerateRequest, GenerateResult, IdeaCard) |

---

## Success Criteria

1. Non-technical user produces a publish-ready post in < 60 seconds
2. All 3 platforms generate in parallel with one button press
3. Output passes the "scroll-stop" test: hook is punchy, angle is unexpected, CTA is specific
4. Feed surfaces 40+ items on a typical day across all tiers
5. Topic mode returns 3 usable ideas within 5 seconds
6. Zero reference to "inbox", "queue", or "score" in any user-facing UI
