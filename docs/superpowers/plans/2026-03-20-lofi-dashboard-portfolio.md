# Lofi Dashboard Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive portfolio website that looks and behaves like a Power BI dashboard with a warm lofi aesthetic, plus a blog for data science insights.

**Architecture:** Next.js 16 App Router, single-page dashboard at `/`, blog at `/blog/[slug]`. Tiles drill-through into slide-in report panels. MDX for blog posts. All pages share ambient lofi widgets and an excel-grid background.

**Tech Stack:** Next.js 16, Tailwind CSS 4, Framer Motion, Recharts, Howler.js, next-mdx-remote, Satori (@vercel/og), Vercel hosting.

**Spec:** `docs/superpowers/specs/2026-03-20-lofi-dashboard-portfolio-design.md`

**Testing approach:** This is a content-heavy portfolio site, not a SaaS app. Testing focuses on:
- **Unit tests** for data utilities (`lib/data.ts`, `lib/blog.ts`) — shape validation, sorting, filtering
- **Component smoke tests** for key interactive components (drill-through context, filter bar, music widget state)
- **Build verification** as integration test (Next.js build catches type errors, missing imports, SSR issues)
- **Lighthouse audit** as acceptance test (performance, a11y, SEO)

Vitest is used for unit/component tests. Add to Task 1 Step 2: `npm install -D vitest @testing-library/react @testing-library/jest-dom`

---

## Phase 1: Foundation + Dashboard (Tasks 1–8)

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.gitignore`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Initialize Next.js 16 with Tailwind**

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm
```

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion recharts howler next-mdx-remote @next/mdx gray-matter @vercel/og
npm install -D @types/howler
```

User confirmation required before installing packages.

- [ ] **Step 3: Configure fonts in `app/layout.tsx`**

Set up `next/font` for JetBrains Mono, DM Sans, Press Start 2P. Export CSS variables `--font-body`, `--font-mono`, `--font-pixel`. Apply to `<html>` class.

- [ ] **Step 4: Write design tokens in `app/globals.css`**

Add all CSS custom properties from spec Section 3.2:
```css
:root {
  --bg: #f6f5f1;
  --bg-card: #ffffff;
  --bg-subtle: #eeedea;
  --border: #e2e0db;
  --text: #2c2a26;
  --text-muted: #8a8780;
  --text-dim: #b5b2ac;
  --amber: #c8973e;
  --amber-light: #f0e0c0;
  --amber-glow: rgba(200,151,62,0.12);
  --cream: #f5efe3;
  --warm-brown: #6b5d4a;
  --green: #5a9a6e;
  --green-bg: rgba(90,154,110,0.08);
  --blue: #5a8aaa;
  --blue-bg: rgba(90,138,170,0.08);
  --coral: #c47058;
  --coral-bg: rgba(196,112,88,0.08);
  --plum: #8a6a9a;
  --plum-bg: rgba(138,106,154,0.08);
}
```

Also add: paper noise texture, excel grid lines (40px intervals, 25% opacity), keyframe animations for `blink`, `bar-grow`, `spark-up`, `dot-pulse`, `spin`, `eq`, `steam-float`, `float-up`, `fade-up`.

- [ ] **Step 5: Add Tailwind config for custom tokens**

Extend `tailwind.config.ts` with font families, colours referencing CSS variables, and custom animation utilities.

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — should see blank page with correct background colour and grid lines.

- [ ] **Step 7: Commit**

```bash
git init && git add package.json package-lock.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.js .gitignore app/ && git commit -m "feat: scaffold next.js project with design tokens and fonts"
```

---

### Task 2: Portfolio Data Layer

**Files:**
- Create: `lib/data.ts`

- [ ] **Step 1: Create typed data constants**

Define all portfolio data as typed TypeScript objects:
- `kpis` array: 4 KPI objects (id, label, value, subtitle, colour, barWidth, sparklineData)
- `projects` array: 3 project objects (id, slug, name, status, statusLabel, colour, description, techStack, reportId)
- `skills` array: 3 skill groups (groupLabel, skills: {name, icon, iconBg, proficiency, colour, bg})
- `timeline` array: 5 nodes (role, org, date, description, tags, colour, isActive)
- `certifications` array: 5 cert strings with dot colours
- `contact` object: email, linkedin, resumePath, calendarLink
- `profile` object: name, title, tagline, badges

All data sourced from spec Sections 2 and 4.

- [ ] **Step 2: Write unit tests for data layer**

Create `lib/__tests__/data.test.ts`:
- Test that `kpis` has exactly 4 items, each with required fields (id, label, value, colour)
- Test that `projects` has exactly 3 items, each with reportId
- Test that `skills` has 3 groups, each with non-empty skills array
- Test that `timeline` has 5 nodes, last one has `isActive: true`
- Test that `contact.email` is a valid email format

```bash
npx vitest run lib/__tests__/data.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts lib/__tests__/data.test.ts && git commit -m "feat: add typed portfolio data constants with tests"
```

---

### Task 3: Ambient Widgets

**Files:**
- Create: `components/ambient/excel-grid.tsx`
- Create: `components/ambient/particles.tsx`
- Create: `components/ambient/coffee.tsx`
- Create: `components/ambient/clock.tsx`
- Create: `components/ambient/mini-chart.tsx`
- Create: `components/ambient/music-widget.tsx`
- Create: `components/ambient/status-badge.tsx`

- [ ] **Step 1: Build `excel-grid.tsx`**

Server component. Renders the background grid lines via CSS (already in globals.css), plus the column headers (A-AH) and row numbers (1-30) as fixed-position `<div>` elements at ~18% opacity. Hidden below 768px via Tailwind `hidden md:block`.

- [ ] **Step 2: Build `particles.tsx`**

Client component (`'use client'`). On mount, generates 15 `<div>` elements with random left position, random animation duration (8-20s), random delay (0-10s). Respects `prefers-reduced-motion`.

- [ ] **Step 3: Build `coffee.tsx`**

Client component. Three animated steam lines + coffee emoji. CSS-only animation. Fixed position bottom-left.

- [ ] **Step 4: Build `clock.tsx`**

Client component. Shows current local time (HH:MM) in mono font, updates every 10s via `setInterval`. "LOCAL" label in pixel font. Fixed position top-right.

- [ ] **Step 5: Build `mini-chart.tsx`**

Client component. 7 tiny bars oscillating at different CSS animation speeds. Fixed position near coffee. ~30% opacity.

- [ ] **Step 6: Build `music-widget.tsx`**

Client component. Two states managed via `useState`:
- **Collapsed:** pill with spinning vinyl CSS animation, track name, mini EQ bars
- **Expanded:** full player with larger vinyl, 12 EQ bars, play/prev/next buttons
- Audio playback via Howler.js (lazy loaded on first play)
- Fixed position bottom-right

- [ ] **Step 6b: Create audio placeholder**

Create `public/audio/` directory. Add a note in a `public/audio/README.md` that royalty-free lofi tracks should be placed here. The music widget will gracefully handle missing audio (shows player UI but no sound). Audio source is TBD — can use a free lofi stream URL or bundled `.mp3` files from sites like Pixabay Audio.

- [ ] **Step 7: Build `status-badge.tsx`**

Server component. "open to opportunities" text with pulsing green dot. Fixed bottom-left.

- [ ] **Step 8: Add all ambient widgets to `app/layout.tsx`**

Import and render all ambient components inside the `<body>` tag, outside the `{children}` slot. They render on every page (dashboard + blog).

- [ ] **Step 9: Verify all widgets render on dev server**

```bash
npm run dev
```

Check: grid lines visible, particles floating, coffee steaming, clock ticking, music pill in corner.

- [ ] **Step 10: Commit**

```bash
git add components/ambient/ app/layout.tsx && git commit -m "feat: add ambient lofi widgets (grid, particles, coffee, clock, music)"
```

---

### Task 4: Dashboard Header + Highlights

**Files:**
- Create: `components/dashboard/pixel-avatar.tsx`
- Create: `components/dashboard/header.tsx`
- Create: `components/dashboard/highlights.tsx`

- [ ] **Step 1: Build `pixel-avatar.tsx`**

Server component. 8x8 CSS grid rendering a pixel art face using coloured divs. Props: `size` (default 40px). Uses `image-rendering: pixelated`.

- [ ] **Step 2: Build `header.tsx`**

Server component (except typing cursor needs `'use client'` — extract to a tiny `TypingCursor` client component).

Layout: flex row with avatar frame (amber border, glow shadow), header info (name in mono, tagline with cursor), and badge pills (Gold Medalist, PL-300, Kolkata IN).

Data from `lib/data.ts` → `profile` and `badges`.

- [ ] **Step 3: Build `highlights.tsx`**

Client component (for stagger animation via Framer Motion `motion.div` with `variants` and `staggerChildren: 0.08`).

Maps over `certifications` from `lib/data.ts`. Each chip: pill with coloured dot, text, hover lift.

- [ ] **Step 4: Add header + highlights to `app/page.tsx`**

```tsx
export default function Dashboard() {
  return (
    <main className="relative z-1 max-w-[1320px] mx-auto px-8 py-7 pb-20">
      <Header />
      <Highlights />
      {/* Grid tiles next */}
    </main>
  );
}
```

- [ ] **Step 5: Verify header renders correctly**

Check: pixel avatar visible, name styled in mono, tagline with blinking cursor, badges coloured, cert chips animate in.

- [ ] **Step 6: Commit**

```bash
git add components/dashboard/ app/page.tsx && git commit -m "feat: add dashboard header with pixel avatar and highlight chips"
```

---

### Task 5: KPI Tiles

**Files:**
- Create: `components/dashboard/kpi-tile.tsx`
- Create: `components/dashboard/sparkline.tsx`

- [ ] **Step 1: Build `sparkline.tsx`**

Client component. Takes `data: number[]` and `colour: string`. Renders flex row of bars that animate from `scaleY(0)` to `scaleY(1)` via Framer Motion. Last bar gets higher opacity.

- [ ] **Step 2: Build `kpi-tile.tsx`**

Client component (for hover animation + viewport-triggered bar fill).

Props: `kpi` object from data. Renders:
- Tile wrapper with hover lift, accent line, hint text (all via Framer Motion `whileHover`)
- Label with pixel `>` icon
- Large value (36px mono, accent coloured)
- Subtitle
- Animated progress bar (Framer Motion `useInView` trigger)
- Sparkline component
- `data-drill` attribute for drill-through system (click handler wired later in Task 9 Step 4; leave as `onClick={() => {}}` placeholder for now)

- [ ] **Step 3: Add 4 KPI tiles to dashboard grid in `app/page.tsx`**

12-column grid, each KPI spans 3 columns:
```tsx
<div className="grid grid-cols-12 gap-4">
  {kpis.map(kpi => <KpiTile key={kpi.id} kpi={kpi} />)}
</div>
```

- [ ] **Step 4: Verify KPIs render with animations**

Check: 4 tiles in a row, bars animate on scroll, hover lifts, sparklines visible.

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/kpi-tile.tsx components/dashboard/sparkline.tsx app/page.tsx && git commit -m "feat: add KPI tiles with animated bars and sparklines"
```

---

### Task 6: Projects + Skills + Timeline + Contact Tiles

**Files:**
- Create: `components/dashboard/projects-tile.tsx`
- Create: `components/dashboard/project-card.tsx`
- Create: `components/dashboard/skills-tile.tsx`
- Create: `components/dashboard/timeline-tile.tsx`
- Create: `components/dashboard/contact-tile.tsx`

- [ ] **Step 1: Build `project-card.tsx`**

Client component. Single project card with status tag (pulsing dot if live), name, description, tech tags. Hover: lift + bottom accent bar sweep. `data-drill` attribute. `onClick` is a placeholder (`() => {}`) — wired to drill-through context in Task 9 Step 4.

- [ ] **Step 2: Build `projects-tile.tsx`**

Wraps 3 `ProjectCard` components in a 3-column sub-grid inside a tile. Spans 8 grid columns.

- [ ] **Step 3: Build `skills-tile.tsx`**

Client component. Maps over skill groups from data. Each group: label + flex-wrap tags. Each tag: coloured icon letter, name, 5 proficiency dots (filled/empty). Hover tint. Spans 4 grid columns.

- [ ] **Step 4: Build `timeline-tile.tsx`**

Client component. Git-commit graph style:
- Vertical line with gradient fill animation (Framer Motion, 2s duration)
- 5 nodes that slide in from left with staggered delays (0.4s intervals, starting after line fills)
- Each node: dot (coloured, hover scale), role (bold), org, date (right-aligned), description, tags
- Last node: pulsing amber dot with "LET'S TALK →" tag
- Spans 8 grid columns

- [ ] **Step 5: Build `contact-tile.tsx`**

Server component. Non-drillable (`cursor: default`). Contains `<a>` tags:
- Book a Call (primary, amber, spans 2 cols) → `href` to calendar link
- Resume → `href="/resume.pdf"` download
- LinkedIn → external link
- Email → `mailto:` link
- Spans 4 grid columns

- [ ] **Step 6: Add all tiles to dashboard grid**

Update `app/page.tsx` to render full grid:
```
Row 1: 4x KpiTile (3 cols each)
Row 2: ProjectsTile (8 cols) + SkillsTile (4 cols)
Row 3: TimelineTile (8 cols) + ContactTile (4 cols)
```

- [ ] **Step 7: Add page load stagger orchestration**

Wrap each row in Framer Motion `motion.div` with stagger delays matching spec Section 6.1.

- [ ] **Step 8: Verify full dashboard renders**

```bash
npm run dev
```

Check: all tiles visible, correct grid layout, all hover animations working, page load stagger sequence plays.

- [ ] **Step 9: Commit**

```bash
git add components/dashboard/ app/page.tsx && git commit -m "feat: add projects, skills, timeline, and contact tiles"
```

---

## Phase 2: Drill-Through System (Tasks 7–9)

### Task 7: Drill-Through Panel Shell

**Files:**
- Create: `components/drill-through/drill-context.tsx`
- Create: `components/drill-through/panel.tsx`
- Create: `components/drill-through/section.tsx`

- [ ] **Step 1: Build `drill-context.tsx`**

React context + provider for managing drill-through state:
```typescript
type DrillState = { isOpen: boolean; reportId: string | null };
// openDrill(reportId), closeDrill()
// Provider wraps the dashboard in layout
```

Handles: body scroll lock when open, Escape key listener.

- [ ] **Step 2: Build `panel.tsx`**

Client component. The slide-in panel:
- Fixed position, right:0, top:0, bottom:0, width `min(720px, 90vw)`
- Framer Motion `AnimatePresence` + `motion.div` for slide animation (0.45s cubic-bezier)
- Backdrop overlay with blur (click to close)
- Sticky header: back button, title, breadcrumb
- Scrollable body area
- Renders children (the report content) passed via context

- [ ] **Step 3: Build `section.tsx`**

Server component. Reusable section wrapper:
- `title` prop → uppercase mono label with bottom border
- `children` → section content

- [ ] **Step 4: Wire drill context into `app/layout.tsx`**

Wrap `{children}` in `<DrillProvider>`. Render `<DrillPanel />` at the top level.

- [ ] **Step 5: Write tests for drill context**

Create `components/drill-through/__tests__/drill-context.test.tsx`:
- Test that `openDrill('test-id')` sets `isOpen: true` and `reportId: 'test-id'`
- Test that `closeDrill()` sets `isOpen: false` and `reportId: null`
- Test that calling `openDrill` then `closeDrill` returns to initial state

```bash
npx vitest run components/drill-through/__tests__/drill-context.test.tsx
```

- [ ] **Step 6: Verify panel opens/closes visually**

Temporarily add an `onClick` to a KPI tile that calls `openDrill('test')`. Check: panel slides in, backdrop blurs, Escape closes, back button closes.

- [ ] **Step 7: Commit**

```bash
git add components/drill-through/ app/layout.tsx && git commit -m "feat: add drill-through panel shell with context, animations, and tests"
```

---

### Task 8: Drill-Through Report Components

**Files:**
- Create: `components/drill-through/impact-card.tsx`
- Create: `components/drill-through/kpi-row.tsx`
- Create: `components/drill-through/bar-chart.tsx`
- Create: `components/drill-through/filter-bar.tsx`
- Create: `components/drill-through/data-table.tsx`

- [ ] **Step 1: Build `impact-card.tsx`**

Props: `value: string`, `colour: string`, `description: string`. Renders amber gradient card with large metric number + description text.

- [ ] **Step 2: Build `kpi-row.tsx`**

Props: `items: { label, value, colour, delta?, deltaUp? }[]`. Renders responsive grid of stat cards.

- [ ] **Step 3: Build `bar-chart.tsx`**

Client component. Props: `rows: { label, width, colour, text }[]`. Renders horizontal bars that animate fill from 0 to target width with staggered delays (100ms per bar). Uses Framer Motion `useInView` to trigger.

- [ ] **Step 4: Build `filter-bar.tsx`**

Client component. Props: `items: string[]`. Renders clickable pill filters. First item active by default. Click toggles active state (amber fill). State is local (`useState`).

- [ ] **Step 5: Build `data-table.tsx`**

Props: `headers: string[]`, `rows: (string | { text, bg, colour })[][]`. Renders table with hover-highlighted rows. Tag cells get styled pill badges.

- [ ] **Step 6: Commit**

```bash
git add components/drill-through/ && git commit -m "feat: add drill-through report components (impact card, KPI row, bar chart, filter, table)"
```

---

### Task 9: Report Content + Wiring

**Files:**
- Create: `components/reports/report-speed.tsx`
- Create: `components/reports/data-sources.tsx`
- Create: `components/reports/engagement.tsx`
- Create: `components/reports/automation.tsx`
- Create: `components/reports/proj-aluminium.tsx`
- Create: `components/reports/proj-crime.tsx`
- Create: `components/reports/proj-mamba.tsx`
- Create: `lib/reports.ts`

- [ ] **Step 1: Create `lib/reports.ts` — report registry**

Map of `reportId → { title, breadcrumb, component }`. Used by the drill panel to look up which report to render.

- [ ] **Step 2a: Build `report-speed.tsx`**

Compose: ImpactCard (70%, green) → Section "Before vs After" with KpiRow (8hrs→2.4hrs, 5.6hrs saved) → Section "Improvement by Report Type" with BarChart (Market Overview 82%, Price Tracking 75%, Client Briefs 68%, Forecast Models 55%) → Section "Methodology" with body text. Content from spec Section 5.3.

- [ ] **Step 2b: Build `data-sources.tsx`**

ImpactCard (500+, amber) → KpiRow (500+ endpoints, 95% cut, 99.2% quality) → BarChart (News 200+, Market Data 120+, Company Sites 100+, Gov 80+).

- [ ] **Step 2c: Build `engagement.tsx`**

ImpactCard (35%, blue) → KpiRow (78% open rate, 4.2m avg time, 92% retention).

- [ ] **Step 2d: Build `automation.tsx`**

ImpactCard (95%, coral) → BarChart (Month 1: 30% → Month 4+: 95%).

- [ ] **Step 2e: Build `proj-aluminium.tsx`**

ImpactCard (LIVE, green) → FilterBar (regions) → KpiRow (12K+ points, 24 clients, Monthly) → BarChart (market coverage) → DataTable (pipeline architecture) → body text. Include "Read my analysis →" link placeholder for future blog cross-linking.

- [ ] **Step 2f: Build `proj-crime.tsx`**

ImpactCard (map emoji, blue) → FilterBar (crime types) → KpiRow (48K+ records, 14 types, 7 hotspots) → body text.

- [ ] **Step 2g: Build `proj-mamba.tsx`**

ImpactCard (robot emoji, coral) → BarChart (accuracy: BERT 88% vs MambaBERT 86%) → BarChart (speed: 1.0x vs 1.7x) → DataTable (tech stack) → body text.

- [ ] **Step 3: Wire report registry into drill panel**

Update `panel.tsx` to import the report registry and render the matching component when `reportId` changes.

- [ ] **Step 4: Wire `onClick` on all dashboard tiles**

Update `kpi-tile.tsx` and `project-card.tsx` to call `openDrill(reportId)` from context on click.

- [ ] **Step 5: Verify all 7 drill-throughs work end-to-end**

```bash
npm run dev
```

Click each KPI tile and each project card. Verify: panel slides in with correct title/breadcrumb, content renders with animated bar charts, filters toggle, tables highlight on hover, back/escape/backdrop close works.

- [ ] **Step 6: Commit**

```bash
git add components/reports/ lib/reports.ts components/drill-through/panel.tsx components/dashboard/kpi-tile.tsx components/dashboard/project-card.tsx && git commit -m "feat: add 7 drill-through reports with full interactive content"
```

---

## Phase 3: Blog (Tasks 10–14)

### Task 10: MDX Blog Infrastructure

**Files:**
- Create: `lib/blog.ts`
- Create: `content/blog/hello-world.mdx` (seed post)

- [ ] **Step 1: Build `lib/blog.ts`**

Blog utility functions:
- `getAllPosts()`: reads `content/blog/*.mdx`, parses frontmatter with `gray-matter`, calculates reading time, sorts by date descending. Returns typed `BlogPost[]`.
- `getPostBySlug(slug)`: returns single post with parsed MDX content.
- `getAllTopics()`: extracts unique topics from all posts.
- `getPostsByTopic(topic)`: filters posts by topic.

Types:
```typescript
type BlogPost = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  topic: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
  dataPoints?: number;
  sources?: number;
  insightScore?: number;
  featured?: boolean;
  content: string; // raw MDX
};
```

- [ ] **Step 2: Create seed blog post `content/blog/hello-world.mdx`**

A real seed post with full frontmatter demonstrating all fields. Topic: "industry-trends". Title: "Welcome to the Research Feed". Includes a data callout, a comparison table, and a FAQ section to test all MDX components.

- [ ] **Step 3: Write unit tests for blog utilities**

Create `lib/__tests__/blog.test.ts`:
- Test `getAllPosts()` returns array with at least the seed post
- Test seed post has all required frontmatter fields (title, slug, date, topic, tags, excerpt)
- Test `getPostBySlug('hello-world')` returns the seed post
- Test `getPostBySlug('nonexistent')` returns null/undefined
- Test `getAllTopics()` includes 'industry-trends' (seed post topic)
- Test `getPostsByTopic('industry-trends')` returns array containing seed post
- Test posts are sorted by date descending
- Test `readingTime` is computed from content (number > 0) — reading time is calculated from MDX content length, not from frontmatter

```bash
npx vitest run lib/__tests__/blog.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add lib/blog.ts lib/__tests__/blog.test.ts content/blog/ && git commit -m "feat: add MDX blog infrastructure with seed post and tests"
```

---

### Task 11: Blog Components

**Files:**
- Create: `components/blog/post-card.tsx`
- Create: `components/blog/topic-filter.tsx`
- Create: `components/blog/sidebar.tsx`
- Create: `components/blog/key-metrics.tsx`
- Create: `components/blog/data-callout.tsx`
- Create: `components/blog/reading-bar.tsx`
- Create: `components/blog/author-card.tsx`
- Create: `components/blog/newsletter-cta.tsx`

- [ ] **Step 1: Build `post-card.tsx`**

Props: `post: BlogPost`, `featured?: boolean`. White card, 12px radius, same hover as dashboard tiles (lift + accent line). Shows: topic pill, title (mono), excerpt, reading time + coffee emoji, date, tiny sparkline decoration. Featured variant is larger with more excerpt text.

- [ ] **Step 2: Build `topic-filter.tsx`**

Client component. Props: `topics: string[]`, `active: string`, `onChange: (topic) => void`. Pill filters matching dashboard filter-bar style. "All" is the default active state.

- [ ] **Step 3: Build `sidebar.tsx`**

Props: `posts: BlogPost[]`, `topics: string[]`. Contains 3 sidebar widgets:
- Blog metrics: total posts, total reads (placeholder), topics count — styled as mini KPI tiles
- Trending: top 3 posts by insightScore, numbered list
- Topic breakdown: horizontal bars (reuse bar-chart pattern) showing posts per topic

- [ ] **Step 4: Build `key-metrics.tsx`**

Props: `dataPoints?: number`, `sources?: number`, `insightScore?: number`. Renders inline KPI row at top of blog posts (same style as dashboard KPI tiles but compact). Only renders metrics that are provided.

- [ ] **Step 5: Build `data-callout.tsx`**

MDX component. Props: `stat: string`, `source?: string`, `children: ReactNode`. Renders a cream-background card with amber left border, stat in mono font, description below.

- [ ] **Step 6: Build `reading-bar.tsx`**

Client component. Thin amber bar fixed at viewport top. Width tracks scroll progress (0-100%). Uses `useEffect` with scroll listener.

- [ ] **Step 7: Build `author-card.tsx`**

Server component. Renders pixel avatar + name + title + links (LinkedIn, All Posts). Same card style as dashboard tiles.

- [ ] **Step 8: Build `newsletter-cta.tsx`**

Client component. Email input + amber submit button. "Get the weekly data science digest." Form posts to Formspree or similar (URL configurable via env var).

- [ ] **Step 9: Commit**

```bash
git add components/blog/ && git commit -m "feat: add blog components (post card, sidebar, key metrics, callout, reading bar)"
```

---

### Task 12: Blog Pages

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `app/blog/topic/[topic]/page.tsx`
- Create: `components/blog/post-layout.tsx`
- Create: `components/blog/share-buttons.tsx`
- Modify: `components/dashboard/header.tsx` (add "Research Feed" link)

- [ ] **Step 1: Build `app/blog/page.tsx` — Blog Index**

Server component. Calls `getAllPosts()` and `getAllTopics()`.

Layout: sticky header ("← Back to Dashboard" + "RESEARCH FEED" + search placeholder), topic filter (client island), main grid (8-col feed + 4-col sidebar).

Featured post (first post with `featured: true`) gets large card. Remaining posts in 2-column grid below.

**Deferred to v2:** Pagination (`rel="next"`/`rel="prev"`) — not needed until 10+ posts. Search bar is a visual placeholder with "Coming soon" tooltip — real search deferred to v2.

- [ ] **Step 1b: Build `components/blog/post-layout.tsx`**

Reusable layout wrapper for blog posts: centred column (max-w-[720px]), handles reading progress bar, share/copy buttons. Used by `app/blog/[slug]/page.tsx`.

- [ ] **Step 1c: Build `components/blog/share-buttons.tsx`**

Client component. "Share" button (uses Web Share API with fallback) + "Copy link" button (copies current URL to clipboard, shows "Copied!" toast for 2s).

- [ ] **Step 2: Build `app/blog/[slug]/page.tsx` — Blog Post Page**

Server component. Calls `getPostBySlug(slug)`.

Layout: centered column (max-w-[720px]), reading progress bar, topic tag + date + reading time header, H1 title, TL;DR callout (blockquote from MDX), key metrics bar, MDX body rendered with `next-mdx-remote` using custom component overrides (DataCallout, table styling, code blocks, etc.), tags, author card, related posts (3 cards).

Generate metadata: title, description from excerpt, OG image URL.

```tsx
export async function generateMetadata({ params }) { ... }
export async function generateStaticParams() { ... }
```

- [ ] **Step 3: Build `app/blog/topic/[topic]/page.tsx` — Topic Filter**

Server component. Calls `getPostsByTopic(topic)`. Same layout as index but filtered. Topic filter shows current topic as active.

- [ ] **Step 4: Add "Research Feed" link to dashboard header**

Add a subtle mono link near the badges in `header.tsx` that navigates to `/blog`. Appears on hover or as a dim always-visible link.

- [ ] **Step 5: Verify blog index and post pages render**

```bash
npm run dev
```

Navigate to `/blog` — seed post visible. Click through to `/blog/hello-world` — full post renders with key metrics, author card, reading progress bar.

- [ ] **Step 6: Commit**

```bash
git add app/blog/ components/dashboard/header.tsx && git commit -m "feat: add blog index, post, and topic pages with MDX rendering"
```

---

### Task 13: SEO & AI-SEO

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `public/llms.txt`
- Create: `app/blog/feed.xml/route.ts`
- Create: `app/blog/og/[slug]/route.tsx`
- Modify: `app/layout.tsx` (add global metadata)
- Modify: `app/blog/[slug]/page.tsx` (add JSON-LD structured data)

- [ ] **Step 1: Build `app/sitemap.ts`**

Next.js metadata API. Auto-generates sitemap with:
- `/` (homepage)
- `/blog` (blog index)
- `/blog/[slug]` for each post (with `lastModified` from frontmatter)
- `/blog/topic/[topic]` for each topic

- [ ] **Step 2: Build `app/robots.ts`**

Allow all crawlers. Explicitly allow AI bots (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot). Reference sitemap URL.

- [ ] **Step 3: Create `public/llms.txt`**

Plain text file per spec Section 8.4 — describes the site structure for AI systems.

- [ ] **Step 4: Build RSS feed at `app/blog/feed.xml/route.ts`**

Route handler that returns XML RSS feed. Lists all blog posts with title, description, link, pubDate.

- [ ] **Step 5a: Build homepage OG image at `app/og/route.tsx`**

Use `@vercel/og` (Satori) to generate a static homepage OG image: "Sulagna Dey — Data Analyst & Power BI Specialist" with pixel avatar representation and warm amber gradient. 1200x630px.

- [ ] **Step 5b: Build blog index OG image**

Either a static image in `public/og-blog.png` or a route at `app/blog/og/route.tsx`. Shows "Data Science Insights" + post count + featured topics.

- [ ] **Step 5c: Build dynamic blog post OG images at `app/blog/og/[slug]/route.tsx`**

Use `@vercel/og` (Satori) to generate per-post OG images: post title + topic tag + pixel avatar + warm amber gradient background. 1200x630px.

- [ ] **Step 5d: Add `Person` JSON-LD to homepage**

In `app/page.tsx`, add `<script type="application/ld+json">` with `Person` schema: name, jobTitle, url, sameAs (LinkedIn), alumniOf, knowsAbout (skills), hasCredential (PL-300).

- [ ] **Step 5e: Add `Blog` + `ItemList` JSON-LD to blog index**

In `app/blog/page.tsx`, add structured data with `Blog` type + `ItemList` of recent posts.

- [ ] **Step 5f: Add canonical URLs to all pages**

In `app/layout.tsx` metadata and in blog post `generateMetadata`, set `alternates: { canonical: '...' }` for self-referencing canonical URLs on every page.

- [ ] **Step 6: Add `BlogPosting` JSON-LD structured data to blog posts**

In `app/blog/[slug]/page.tsx`, add `<script type="application/ld+json">` with `BlogPosting` schema: headline, description, author (Person), datePublished, dateModified, image, keywords.

Add `FAQPage` schema when post content contains `## FAQ` or similar heading patterns.

- [ ] **Step 7: Add global metadata to `app/layout.tsx`**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://sulagna.dev'),
  title: { default: 'Sulagna Dey — Data Analyst & Power BI Specialist', template: '%s | Sulagna Dey' },
  description: 'Interactive dashboard portfolio...',
  openGraph: { ... },
  twitter: { ... },
};
```

- [ ] **Step 8: Verify SEO outputs**

```bash
npm run dev
```

Check:
- `http://localhost:3000/sitemap.xml` returns valid XML
- `http://localhost:3000/robots.txt` allows all bots
- `http://localhost:3000/llms.txt` returns plain text
- `http://localhost:3000/blog/feed.xml` returns RSS
- View source on blog post — JSON-LD present
- OG meta tags present in `<head>`

- [ ] **Step 9: Commit**

```bash
git add app/sitemap.ts app/robots.ts public/llms.txt app/blog/feed.xml/ app/blog/og/ app/layout.tsx app/blog/\\[slug\\]/page.tsx && git commit -m "feat: add SEO infrastructure (sitemap, robots, RSS, OG images, JSON-LD, llms.txt)"
```

---

### Task 14: Responsive + Accessibility + Final Polish

**Files:**
- Modify: `app/globals.css` (responsive breakpoints)
- Modify: various components (a11y fixes)
- Create: `public/resume.pdf` (placeholder or real)

- [ ] **Step 1a: KPI tiles responsive**

Modify `app/page.tsx` grid: Tailwind `grid-cols-12 md:grid-cols-12` → on tablet (`md`): KPIs span 6 cols each (2x2 grid). On mobile (`sm`): KPIs span 12 cols (single column).

- [ ] **Step 1b: Projects tile responsive**

Modify `projects-tile.tsx`: project cards grid `grid-cols-3` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Projects tile spans 12 on mobile/tablet instead of 8.

- [ ] **Step 1c: Skills + Timeline + Contact responsive**

Skills tile: spans 12 on mobile/tablet (below projects). Timeline: spans 12 on mobile/tablet. Contact: spans 12 on mobile/tablet. All stack single-column below 1024px.

- [ ] **Step 1d: Drill-through panel responsive**

Modify `panel.tsx`: width `min(720px, 90vw)` → `w-full lg:w-[720px]` (full-width on mobile/tablet).

- [ ] **Step 1e: Blog layout responsive**

Modify `app/blog/page.tsx`: sidebar stacks below feed on tablet. Post cards go single-column on mobile. Reading bar stays on all sizes.

- [ ] **Step 1f: Ambient widgets responsive**

Excel grid: hidden below 768px (`hidden md:block`). Music widget: slightly smaller pill on mobile. Clock: hidden on mobile. Coffee/particles: stay on all sizes.

Test at 375px, 768px, 1024px, 1440px.

- [ ] **Step 2: Accessibility pass**

- Add `prefers-reduced-motion` media query: disable particles, steam, EQ bars, sparkline animations, timeline line fill
- Ensure all interactive elements are keyboard-focusable (`tabIndex`, focus-visible rings)
- Drill-through panel: trap focus when open, return focus on close (use `@radix-ui/react-focus-scope` or manual implementation)
- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>` where appropriate
- Alt text on pixel avatar
- Music never autoplays

- [ ] **Step 3: Add `resume.pdf` to public/**

Add Sulagna's resume PDF (or a placeholder) at `public/resume.pdf`.

- [ ] **Step 4: Production build test**

```bash
npm run build && npm run start
```

Verify: no build errors, no hydration mismatches, all pages render correctly.

- [ ] **Step 5: Lighthouse audit**

Run Lighthouse on both `/` and `/blog/hello-world`. Target: 95+ on Performance, Accessibility, Best Practices, SEO.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css components/ app/blog/ app/page.tsx public/resume.pdf && git commit -m "feat: add responsive layout, accessibility, and final polish"
```

---

## Post-Implementation

After all 14 tasks are complete:

1. **Deploy to Vercel:** `vercel deploy` (preview) → verify → `vercel --prod`
2. **Add real blog content:** Write 2-3 real data science posts in `content/blog/`
3. **Connect calendar:** Set up Calendly/Cal.com and update the "Book a Call" link
4. **Custom domain:** Configure via Vercel dashboard
5. **Analytics:** Enable Vercel Analytics in the dashboard
