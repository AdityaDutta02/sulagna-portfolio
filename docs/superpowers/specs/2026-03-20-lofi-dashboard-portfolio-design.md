# PRD: Lofi Dashboard Portfolio — Sulagna Dey

**Date:** 2026-03-20
**Author:** Sulagna Dey & Aditya (builder)
**Status:** Approved for implementation

---

## 1. Overview

An interactive single-page portfolio website designed to look and behave like a Power BI dashboard, styled with a warm lofi aesthetic. Every tile on the dashboard is clickable and expands into a detailed "report view" with charts, filters, data tables, and narrative — exactly like drilling through a BI report.

**Target audience:** Hiring managers at top firms and startups. Sulagna is a Data Analyst / Power BI Specialist aiming for upper management roles.

**Core insight:** The portfolio *is* a dashboard. The medium demonstrates the skill.

---

## 2. User Profile

- **Name:** Sulagna Dey
- **Current role:** Data Analyst at AlCircle (aluminium market intelligence)
- **Education:** M.Sc. CS (St. Xavier's, Kolkata), B.Sc. CS (Gold Medalist, 9.29 CGPA)
- **Key cert:** Microsoft Power BI PL-300
- **Skills:** Power BI, Tableau, Python, SQL, AI-driven Excel, Copilot, ML/DL
- **Projects:** Aluminium FRP Insights (live Power BI), London Crime Viz (Tableau), MambaBERT (hybrid ML model)
- **Impact metrics:** 70% faster reports, 500+ automated sources, 35% higher engagement, 95% manual work eliminated
- **Goal:** Upper management roles in data strategy

---

## 3. Design Concept — "The Command Centre"

### 3.1 Layout

Single-page dashboard with a 12-column CSS grid. No tabs or page navigation — everything lives on one scrollable viewport. Tiles are arranged in rows:

```
Row 0: Header (terminal-prompt style, pixel avatar, badges)
Row 0.5: Highlight chips (certifications as floating pills)
Row 1: 4x KPI tiles (3 cols each) — Report Speed, Data Sources, Engagement, Automation
Row 2: Projects tile (8 cols) + Skills tile (4 cols)
Row 3: Career Journey tile (8 cols) + Contact tile (4 cols)
```

### 3.2 Visual Language

**Theme:** Light mode with warm accents on a spreadsheet grid

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f6f5f1` | Page background |
| `--bg-card` | `#ffffff` | Card/tile surfaces |
| `--bg-subtle` | `#eeedea` | Subtle backgrounds |
| `--border` | `#e2e0db` | Default borders |
| `--text` | `#2c2a26` | Primary text |
| `--text-muted` | `#8a8780` | Secondary text |
| `--amber` | `#c8973e` | Primary accent (warm gold) |
| `--green` | `#5a9a6e` | Data viz: positive/growth |
| `--blue` | `#5a8aaa` | Data viz: info/neutral |
| `--coral` | `#c47058` | Data viz: alerts/current |
| `--plum` | `#8a6a9a` | Data viz: skills/research |
| `--warm-brown` | `#6b5d4a` | Earthy accent |
| `--cream` | `#f5efe3` | Warm highlight bg |

**Typography:**
- **Headers/numbers:** JetBrains Mono (legible monospace with character)
- **Body text:** DM Sans (clean, warm, readable)
- **Decorative only (6-8px):** Press Start 2P (pixel font — tiny labels and tile icons only)

**Background:**
- Subtle paper noise texture at 3% opacity
- **Excel-style grid lines** at 40px intervals (25% opacity)
- Column headers (A, B, C...) and row numbers (1, 2, 3...) at ~18% opacity
- Creates the spreadsheet atmosphere without competing with content

### 3.3 Lofi Aesthetic Elements

These are ambient, non-interactive decorations that create the lofi vibe:

| Element | Position | Animation |
|---------|----------|-----------|
| Pixel avatar (8x8 grid) | Header, left | Pulsing golden border glow |
| Typing cursor | Header tagline | 1.2s step blink |
| Coffee with steam | Fixed, bottom-left | 3 steam lines float up and fade (2.5s loop) |
| Live clock | Fixed, top-right | Updates every 10s, "LOCAL" pixel label |
| Ambient mini bar chart | Fixed, near coffee | 7 bars gently oscillate at varying speeds |
| Floating particles | Full page | 15 amber dots drift upward, 8-20s duration, 15% max opacity |
| "Open to opportunities" | Fixed, bottom-left | Green pulsing dot + mono text |

### 3.4 Floating Music Widget

A collapsible lofi music player in the bottom-right corner.

**Collapsed state (default):** Small pill (~180x44px) showing:
- Spinning mini vinyl record (28px)
- Track name + artist
- 5 mini EQ bars bouncing

**Expanded state (click to open):** Full player card (~260px wide):
- Larger spinning vinyl (52px)
- Track name + artist
- 12 EQ bars with gradient
- Play/prev/next controls
- Minimize button to collapse back

**Audio:** Muted by default. Click play to start ambient lofi beats. Toggle on/off freely. Audio source TBD (royalty-free lofi stream or bundled tracks).

---

## 4. Dashboard Tiles — Summary View

### 4.1 KPI Tiles (x4)

Each KPI tile contains:
- Uppercase mono label with pixel `>` icon
- Large number (36px, mono, accent-coloured)
- Subtitle description
- Animated progress bar (fills on viewport entry)
- Mini sparkline chart (8 bars, ascending trend)
- Hover: lifts 3px, accent line slides in from center, "drill through →" hint fades in

**KPIs:**

| Tile | Value | Colour | Context |
|------|-------|--------|---------|
| Report Speed | 70% | Green | Faster generation at AlCircle |
| Data Sources | 500+ | Amber | Automated scraping pipelines |
| Engagement | 35% | Blue | Higher client engagement |
| Automation | 95% | Coral | Manual work eliminated |

### 4.2 Projects Tile (8 cols)

Contains 3 project cards in a sub-grid:

| Project | Tag | Colour | Stack |
|---------|-----|--------|-------|
| Aluminium FRP Insights | LIVE (pulsing dot) | Green | Power BI, DAX, ETL |
| London Crime Analysis | VIZ | Blue | Tableau, Geospatial |
| MambaBERT | ML | Coral | Python, PyTorch, NLP |

Each card: hover lifts + bottom accent bar sweeps in. Click opens drill-through.

### 4.3 Skills Tile (4 cols)

Grouped tag-cloud with proficiency dots (5-dot scale):

| Group | Skills |
|-------|--------|
| Visualization | Power BI (5/5), Tableau (4/5) |
| Languages | Python (4/5), SQL (5/5) |
| AI & Productivity | Excel/AI (4/5), ML/DL (3/5), Copilot (4/5) |

Each tag: coloured icon letter + name + dot indicators. Hover tints with accent colour.

### 4.4 Career Journey Tile (8 cols) — Git-Commit Graph

Vertical timeline styled like `git log --graph`:
- Vertical branch line with gradient fill animation (left to right on load)
- Each node slides in from left with staggered delays
- Nodes show: role (bold), org, date (right-aligned, coloured), description, achievement tags

| Node | Colour | Role | Org | Date |
|------|--------|------|-----|------|
| 1 | Green | B.Sc. CS | Midnapore College | 2020-23 |
| 2 | Amber | M.Sc. CS | St. Xavier's | 2023-25 |
| 3 | Blue | Data Analyst Intern | Mechanismic | 2025 |
| 4 | Coral | Data Analyst | AlCircle | Jul 2025 — Now |
| 5 | Amber (pulsing) | **Next: Your Team?** | — | Open |

The "Next" node has a breathing glow animation and an amber "LET'S TALK →" action tag.

### 4.5 Contact Tile (4 cols) — "Transmit"

Non-drillable utility tile. Contains proper `<a>` links:
- **Book a Call** (primary CTA, amber, spans full width) → Calendly or similar
- **Resume** → PDF download
- **LinkedIn** → opens in new tab
- **Email** → `mailto:dey.sulagna01@gmail.com`

### 4.6 Highlight Chips

Certifications displayed as floating pill chips below the header. Stagger-animate in on page load. On hover: lift + border colour change.

- Microsoft PL-300
- Tata Data Visualisation
- Tata GenAI Analytics
- Deloitte Analytics Sim
- NIELIT Big Data & DS

---

## 5. Drill-Through System — Report Views

The core differentiator. Clicking any KPI tile or project card opens a **slide-in panel from the right** (Power BI drill-through pattern).

### 5.1 Panel Mechanics

- **Trigger:** Click any tile/card with `data-drill` attribute
- **Animation:** Panel slides in from right (720px or 90vw) with backdrop blur + overlay
- **Header:** Sticky with ← back button, report title, breadcrumb trail
- **Close:** Click back button, click backdrop, or press Escape
- **Body scroll:** Independent scroll within panel, main page scroll locked

### 5.2 Report Components (reusable)

Each drill-through report is built from these composable components:

| Component | Description |
|-----------|-------------|
| **Impact Card** | Amber gradient banner with large metric + description |
| **KPI Row** | 2-3 stat cards with label, value, delta indicator |
| **Bar Chart** | Horizontal bars with labels, animated fill on panel open, percentage labels |
| **Filter Bar** | Clickable pill filters (e.g., region, crime type) with active state toggle |
| **Data Table** | Striped table with hover highlight, tag badges in cells |
| **Body Text** | Narrative methodology/technical description |
| **Section Title** | Uppercase mono label with bottom border divider |

### 5.3 Report Content Per Tile

#### KPI: Report Speed (70%)
- Impact card: 70%, faster generation
- Before/After KPI row: 8hrs → 2.4hrs, 5.6hrs saved/month
- Bar chart: improvement by report type (Market Overview 82%, Price Tracking 75%, Client Briefs 68%, Forecast Models 55%)
- Methodology text: DAX measures, parameterized templates, row-level security

#### KPI: Data Sources (500+)
- Impact card: 500+ sources automated
- KPI row: 500+ endpoints, 95% manual cut (40hrs→2hrs/wk), 99.2% data quality
- Bar chart: source types (News 200+, Market Data 120+, Company Sites 100+, Gov 80+)

#### KPI: Engagement (35%)
- Impact card: 35% higher engagement
- KPI row: 78% open rate (↑ from 52%), 4.2m avg time (↑ from 1.8m), 92% retention (↑ from 80%)

#### KPI: Automation (95%)
- Impact card: 95% manual work eliminated
- Bar chart: automation ramp timeline (Month 1: 30% → Month 4+: 95%)

#### Project: Aluminium FRP Insights
- Impact card: LIVE production dashboard
- Filter bar: All Regions, Asia Pacific, Europe, Americas, Middle East
- KPI row: 12K+ data points, 24 active clients, Monthly cadence
- Bar chart: market coverage (Rolled Coils 90%, Foil 78%, Plate 85%, Can Stock 65%)
- Data table: pipeline architecture (Collection→Cleaning→Build→Delivery, tools, frequency, status tags)
- Technical details text: incremental refresh, 50GB+, parameterized RLS, DAX measures

#### Project: London Crime Analysis
- Impact card: geospatial crime analysis
- Filter bar: All Types, Theft, Fraud, Violence, Drugs
- KPI row: 48K+ records, 14 crime types, 7 hotspots
- Methodology text: Tableau Public, seasonal decomposition, heat maps, borough boundaries

#### Project: MambaBERT
- Impact card: hybrid Mamba SSM + BERT
- Bar chart: accuracy comparison (BERT 88% vs MambaBERT 86%)
- Bar chart: inference speed (BERT 1.0x vs MambaBERT 1.7x)
- Data table: tech stack (PyTorch, BERT-base, Mamba S6, Cloud GPU, IMDB/SST-2/Yelp)
- Architecture text: O(n) complexity, bidirectional understanding, SSM linear scaling

---

## 6. Microanimations & UX

### 6.1 Page Load Orchestration

Staggered fade-up sequence:
1. Header (0s)
2. Highlight chips (0.15s, then each chip staggers +0.08s)
3. KPI tiles cascade left→right (0.25s, +0.07s each)
4. Projects + Skills (0.55s, 0.60s)
5. Timeline + Contact (0.70s, 0.75s)
6. Music widget (1.2s)

### 6.2 Tile Interactions

| Trigger | Effect |
|---------|--------|
| Tile hover | Lifts 3px, accent line slides in from center, hint text fades in |
| Project card hover | Lifts 2px, bottom accent bar sweeps left→right |
| Skill tag hover | Lifts 1px, background tints with accent colour |
| Timeline node hover | Dot scales 1.3x with shadow |
| Contact button hover | Lifts 2px, border turns amber, background turns cream |
| KPI bar | Fills with cubic-bezier easing on viewport entry |
| Sparkline bars | Scale up from zero on load |
| Timeline line | Gradient fills top→bottom over 2s |
| Timeline dots | Pop in (scale 0→1) staggered after line fills |

### 6.3 Drill-Through Animations

| Trigger | Effect |
|---------|--------|
| Open panel | Slide in from right (0.45s cubic-bezier), backdrop fades in (0.35s) |
| Bar charts in panel | Fill sequentially after panel opens (100ms stagger per bar) |
| Filter click | Active pill gets amber fill, others reset |
| Table row hover | Background highlight with amber glow |
| Close panel | Reverse slide + fade |

---

## 7. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) | React-based, optimal for interactive SPA, Vercel-native |
| Hosting | Vercel | Free tier, custom domain, edge CDN |
| Styling | Tailwind CSS + CSS custom properties | Utility-first with design token consistency |
| Charts | Chart.js or Recharts | Lightweight, animated, interactive |
| Animations | Framer Motion | Orchestrated page load, tile transitions, drill-through |
| Fonts | Google Fonts (JetBrains Mono, DM Sans, Press Start 2P) | Free, reliable CDN |
| Audio | Howler.js | Lightweight audio library for lofi playback |
| Contact form | Resend (via Vercel Marketplace) or Formspree | Email delivery |
| Calendar | Calendly embed or Cal.com | Scheduling widget for "Book a Call" |
| Analytics | Vercel Analytics | Privacy-friendly, built-in |
| Resume | Static PDF in /public | Direct download |

### 7.1 Project Structure (Next.js App Router)

```
app/
  layout.tsx          — Root layout, fonts, metadata, shared ambient
  page.tsx            — Main dashboard (server component shell)
  globals.css         — Tailwind + CSS custom properties + grid bg
  blog/
    page.tsx          — Blog index (research feed)
    [slug]/
      page.tsx        — Individual blog post
    topic/
      [topic]/
        page.tsx      — Topic filtered view
    feed.xml/
      route.ts        — RSS feed endpoint
    og/
      [slug]/
        route.tsx     — Dynamic OG images per post (Satori)
components/
  dashboard/
    header.tsx        — Avatar, name, badges, tagline
    highlights.tsx    — Certification chips
    kpi-tile.tsx      — Reusable KPI card with sparkline
    projects-tile.tsx — Projects grid
    skills-tile.tsx   — Grouped skill tags
    timeline-tile.tsx — Git-commit graph
    contact-tile.tsx  — CTA buttons
  drill-through/
    panel.tsx         — Slide-in overlay + panel shell
    impact-card.tsx   — Hero metric banner
    kpi-row.tsx       — Stat cards row
    bar-chart.tsx     — Animated horizontal bars
    filter-bar.tsx    — Clickable filter pills
    data-table.tsx    — Sortable data table
    section.tsx       — Section title + content wrapper
  reports/
    report-speed.tsx  — Report Speed drill-through content
    data-sources.tsx  — Data Sources drill-through content
    engagement.tsx    — Engagement drill-through content
    automation.tsx    — Automation drill-through content
    proj-aluminium.tsx
    proj-crime.tsx
    proj-mamba.tsx
  ambient/
    music-widget.tsx  — Collapsible lofi player
    clock.tsx         — Live clock widget
    coffee.tsx        — Coffee steam animation
    particles.tsx     — Floating amber particles
    mini-chart.tsx    — Ambient oscillating bars
    excel-grid.tsx    — Background grid + headers
  blog/
    post-card.tsx     — Blog post card (index + related)
    post-layout.tsx   — Blog post page layout (centred column)
    reading-bar.tsx   — Scroll reading progress bar
    data-callout.tsx  — Inline data callout block
    key-metrics.tsx   — Per-post KPI bar
    topic-filter.tsx  — Topic filter pills
    sidebar.tsx       — Blog sidebar (metrics, trending, topics)
    author-card.tsx   — Author bio card at post bottom
    newsletter-cta.tsx — Email signup widget
  ui/                 — Shared primitives (if needed)
content/
  blog/               — MDX blog posts with frontmatter
lib/
  data.ts             — All portfolio data as typed constants
  blog.ts             — Blog utilities (getMdxPosts, getTopics, etc.)
public/
  resume.pdf          — Downloadable CV
  audio/              — Lofi audio files (if bundled)
  llms.txt            — AI discoverability file
```

---

## 8. Blog — Data Science Insights (`/blog`)

A separate page for tracking data science news and writing blogs with real, unique insights. Lives at `/blog` and individual posts at `/blog/[slug]`. Visually consistent with the dashboard but adapted for long-form reading.

### 8.1 Purpose & Positioning

This is not a generic "thoughts" blog. It's a **data-driven research feed** — each post reads like a mini industry report, reinforcing the "I think in dashboards" narrative. Aimed at:
- Hiring managers who want to see how Sulagna thinks (depth of analysis)
- Data science practitioners who find the blog via search/AI
- Recruiters who encounter the blog in Google AI Overviews or ChatGPT citations

### 8.2 Visual Design — "The Research Feed"

The blog page keeps the dashboard's warm palette, excel grid background, ambient widgets (coffee, clock, particles, music), and typography — but the layout shifts from tiles to a **research feed** format.

**Blog index page (`/blog`):**

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard    RESEARCH FEED    [search bar]   │  ← Sticky header
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FILTERS: [All] [Power BI] [Python] [Market Intel]      │  ← Topic filter pills
│           [Machine Learning] [Industry Trends]           │
│                                                         │
│  ┌──────────────────────────────────────┐ ┌───────────┐ │
│  │  📊 Featured Post (large card)       │ │ METRICS   │ │
│  │  Title, excerpt, reading time,       │ │ 12 posts  │ │
│  │  topic tags, date, mini sparkline    │ │ 4.2k reads│ │
│  │                                      │ │ 8 topics  │ │
│  └──────────────────────────────────────┘ │           │ │
│                                           │ TRENDING  │ │
│  ┌──────────────┐ ┌──────────────┐       │ • Post A  │ │
│  │  Post card    │ │  Post card    │       │ • Post B  │ │
│  │  (smaller)    │ │  (smaller)    │       │ • Post C  │ │
│  └──────────────┘ └──────────────┘       └───────────┘ │
│  ┌──────────────┐ ┌──────────────┐                      │
│  │  Post card    │ │  Post card    │                      │
│  └──────────────┘ └──────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

**Post card design (tile-consistent):**
- White card with border, 12px radius (same as dashboard tiles)
- Hover: lift 3px + accent line from center (same tile microinteraction)
- Content: topic tag pill (coloured), title (JetBrains Mono 16px bold), excerpt (DM Sans), reading time, date, tiny sparkline decoration
- Each card links to full post

**Sidebar widgets (4-col right rail):**
- **Blog metrics tile** — total posts, total reads, topics covered (animated counters, same KPI style)
- **Trending posts** — top 3 by read count, numbered list
- **Topic breakdown** — small horizontal bar chart showing posts per topic (same bar-chart style as dashboard)
- **Newsletter CTA** — email signup for weekly data science digest (warm amber button)

### 8.3 Blog Post Page (`/blog/[slug]`)

**Layout:** Centred content column (max 720px) with ambient dashboard elements retained (excel grid, coffee steam, clock, music widget, particles).

**Post structure:**

```
← Back to Feed                              [Share] [Copy link]

TOPIC TAG     •     March 2026     •     8 min read

# Post Title (H1, JetBrains Mono)

> TL;DR summary in a callout box (2-3 sentences)

--- Key Metrics bar (mini KPI row) ---
| Data Points: 12K+ | Sources: 8 | Insight Score: 9.2/10 |

Body text (DM Sans, 16px, 1.8 line height)...

[Inline charts / data viz embedded in post body]
[Code blocks with syntax highlighting]
[Pull quotes styled as data callouts]
[Comparison tables for analysis]

--- Tags ---
[Power BI] [Market Intelligence] [Aluminium]

--- Author Card ---
┌─────────────────────────────────────────────┐
│  [Pixel Avatar]  Sulagna Dey                │
│  Data Analyst @ AlCircle | PL-300 Certified │
│  [LinkedIn] [All Posts]                     │
└─────────────────────────────────────────────┘

--- Related Posts ---
3 post cards in a row (same card design as index)
```

**Cozy data-driven touches:**
- **Key Metrics bar** at the top of each post — styled exactly like the dashboard KPI tiles but inline. Shows data points analysed, sources consulted, and a subjective "insight score." Reinforces that every post is backed by real data.
- **Inline data visualizations** — posts can embed small Chart.js charts (bar, line, pie) inline with the text, styled with the same amber/green/blue/coral palette
- **Data callout blocks** — pull quotes styled as data cards (background `var(--cream)`, amber left border, mono font for the stat)
- **Reading progress bar** — thin amber bar at the very top of the viewport, fills as you scroll
- **Estimated read time** with a tiny animated coffee cup — "8 min read ☕"

### 8.4 SEO Architecture

#### URL Structure
```
/blog                           → Blog index (paginated)
/blog/[slug]                    → Individual post
/blog/topic/[topic]             → Topic filtered view
```

#### Technical SEO
- **Sitemap:** Auto-generated `sitemap.xml` includes all blog posts with `lastmod` dates
- **Canonical URLs:** Self-referencing canonical on every post
- **robots.txt:** Allow all AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)
- **Pagination:** Proper `rel="next"` / `rel="prev"` if paginated
- **RSS feed:** `/blog/feed.xml` for subscribers and aggregators

#### On-Page SEO (per post)
- **Title tag:** `{Post Title} | Sulagna Dey — Data Science Blog` (50-60 chars)
- **Meta description:** Unique, compelling, 150-160 chars, includes primary keyword
- **H1:** One per page, matches the post title
- **H2/H3 headings:** Match natural query phrasing ("How does X work?", "Why is Y important?")
- **Internal linking:** Every post links back to relevant dashboard tiles/drill-throughs and to related posts
- **Image alt text:** Descriptive alt on all charts and visualizations
- **Open Graph / Twitter Card:** Auto-generated OG image per post using Satori (post title + topic tag + pixel avatar + warm gradient bg)

#### Structured Data (JSON-LD per post)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post excerpt",
  "author": {
    "@type": "Person",
    "name": "Sulagna Dey",
    "jobTitle": "Data Analyst",
    "url": "https://sulagna.dev"
  },
  "datePublished": "2026-03-20",
  "dateModified": "2026-03-20",
  "image": "https://sulagna.dev/og/post-slug.png",
  "publisher": { "@type": "Person", "name": "Sulagna Dey" },
  "keywords": ["power bi", "data science", "market intelligence"]
}
```

Also add `FAQPage` schema when posts contain Q&A sections — these get extracted by AI Overviews.

#### AI-SEO Optimisation (per post)

Every post must be **extractable and citable** by AI systems:

| Principle | Implementation |
|-----------|---------------|
| **Definition-first paragraphs** | Lead every section with a direct answer in 40-60 words (optimal snippet length) |
| **Statistics with sources** | Every claim backed by specific numbers + cited source (+40% AI visibility) |
| **Expert attribution** | Author byline with credentials on every post (+25% visibility) |
| **Self-contained blocks** | Each paragraph/section works standalone if extracted out of context |
| **Comparison tables** | Use tables for any X vs Y analysis (AI prefers structured data over prose) |
| **FAQ sections** | Natural-language questions as H2/H3 headings, direct answers below |
| **Freshness signals** | "Last updated: [date]" visible on every post, updated when content changes |
| **No keyword stuffing** | Write naturally — keyword stuffing actively hurts AI visibility by 10% |
| **Cite original research** | Link to primary sources, not summaries of sources |

#### AI Bot Access (robots.txt)
```
User-agent: GPTBot
Allow: /blog/

User-agent: ChatGPT-User
Allow: /blog/

User-agent: PerplexityBot
Allow: /blog/

User-agent: ClaudeBot
Allow: /blog/

User-agent: anthropic-ai
Allow: /blog/

User-agent: Google-Extended
Allow: /blog/

User-agent: Bingbot
Allow: /blog/
```

#### llms.txt (AI discoverability)
Add `/llms.txt` at the site root — a plain-text file that tells AI systems about the site's content:
```
# Sulagna Dey — Data Analyst Portfolio & Blog
> Data science insights, Power BI tutorials, and market intelligence analysis

## Blog
- [All Posts](/blog): Data science news, tutorials, and industry analysis
- [Power BI](/blog/topic/power-bi): Dashboard design and DAX patterns
- [Market Intel](/blog/topic/market-intelligence): Aluminium and commodity market insights
- [Python](/blog/topic/python): Data automation and ML projects

## Portfolio
- [Dashboard](/): Interactive portfolio showcasing data analysis work
```

### 8.5 Content Management (v1)

Blog posts are **MDX files** stored in the repo:

```
content/
  blog/
    aluminium-market-q1-2026.mdx
    power-bi-incremental-refresh.mdx
    mamba-ssm-vs-attention.mdx
```

Each MDX file has frontmatter:
```yaml
---
title: "Aluminium Market Q1 2026: What the Data Shows"
slug: aluminium-market-q1-2026
date: 2026-03-15
updated: 2026-03-18
topic: market-intelligence
tags: [aluminium, market-data, power-bi, forecasting]
excerpt: "Q1 2026 aluminium flat-rolled product data reveals a 12% demand shift toward Asia Pacific. Here's what the numbers tell us."
readingTime: 8
dataPoints: 12400
sources: 8
insightScore: 9.2
featured: true
---
```

MDX enables embedding React components (charts, data callouts, KPI rows) directly in the markdown. Uses `next-mdx-remote` or `@next/mdx` for rendering.

### 8.6 Navigation Between Dashboard & Blog

- **Dashboard → Blog:** A small "Research Feed" link in the header (not a tab — just a mono-styled link that appears on hover near the badges area). Also a dedicated tile or link in the contact/footer area.
- **Blog → Dashboard:** "← Back to Dashboard" link in the blog header (always visible, sticky)
- **Cross-linking:** Blog posts link to relevant dashboard drill-throughs ("See my Aluminium FRP dashboard →"). Dashboard drill-throughs link to related blog posts ("Read my analysis →").
- **Shared ambient elements:** Both pages share the same music widget, coffee steam, clock, particles, and excel grid — creating continuity.

### 8.7 Blog-Specific Success Criteria

1. Posts rank for long-tail data science queries within 3 months
2. At least 1 post gets cited in a ChatGPT/Perplexity answer within 6 months
3. Blog drives 30%+ of total site traffic within 6 months
4. Every post has structured data that passes Google Rich Results Test
5. Reading experience feels cozy and data-rich — not a generic blog template

---

## 9. Responsive Behaviour

| Breakpoint | Layout Change |
|------------|---------------|
| Desktop (>1024px) | Full 12-column grid as designed |
| Tablet (768-1024px) | KPIs → 2x2 grid, Projects → 2 columns, Timeline + Contact stack full-width |
| Mobile (<768px) | All tiles stack single-column, project cards stack vertically, drill-through panel goes full-width, music widget smaller |
| Excel grid | Hidden below 768px (too noisy on small screens) |
| Blog index | Sidebar stacks below feed on tablet; single-column cards on mobile |
| Blog post | Full-width content column on all sizes; reading progress bar on all |

---

## 10. Accessibility

- All interactive elements are keyboard-focusable
- Drill-through panel traps focus when open, returns focus on close
- Colour contrast meets WCAG AA for all text (verified against light bg)
- Animations respect `prefers-reduced-motion` — disable floating particles, steam, EQ bars, sparkline animations
- Music is muted by default, never autoplays
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>` for tiles
- Alt text on pixel avatar

---

## 11. Performance

- Server Components for static shell (header, grid layout)
- Client Components only for: drill-through panel, music widget, clock, animations
- Fonts preloaded with `next/font`
- No external JS dependencies on critical path
- Chart animations triggered by Intersection Observer (not on page load)
- Audio loaded lazily on first play interaction
- Target: Lighthouse 95+ on all metrics

---

## 12. SEO & Meta

**Homepage (`/`):**
- Title: "Sulagna Dey — Data Analyst & Power BI Specialist"
- Description: "Interactive dashboard portfolio showcasing data analysis, Power BI dashboards, and market intelligence work"
- OG image: Static screenshot of the dashboard (Satori/`@vercel/og`)
- Structured data: `Person` schema with job title, skills, education

**Blog index (`/blog`):**
- Title: "Data Science Insights | Sulagna Dey"
- Description: "Data science news, Power BI tutorials, and market intelligence analysis from a certified PL-300 analyst"
- OG image: Blog-branded OG with post count and featured topics
- Structured data: `Blog` schema + `ItemList` for recent posts

**Blog posts (`/blog/[slug]`):**
- Title: `{Post Title} | Sulagna Dey — Data Science Blog`
- Description: Unique per post from frontmatter `excerpt`
- OG image: Auto-generated per post (title + topic + avatar + gradient)
- Structured data: `BlogPosting` + conditional `FAQPage` (see Section 8.4)

**Sitewide:**
- XML sitemap auto-generated (all pages + all blog posts)
- RSS feed at `/blog/feed.xml`
- `llms.txt` at site root (AI discoverability)
- `robots.txt` explicitly allowing all major AI crawlers (see Section 8.4)
- Canonical URLs on every page

---

## 13. Success Criteria

1. Hiring manager lands on the page and immediately understands "this person thinks in dashboards"
2. Every tile is clickable — no dead zones
3. Drill-through reports show depth of work, not just summary bullets
4. Page loads in <2s on 4G
5. Music widget is discoverable but never intrusive
6. "Book a Call" is the most prominent CTA
7. Mobile experience is functional (stacked layout, full-width drill-through)

---

## 14. Out of Scope (v1)

- Dark mode toggle (may add in v2)
- CMS for content editing (data is hardcoded in v1)
- Real-time data connections to live dashboards
- Multi-language support
- Custom domain setup (handled post-deploy)

---

## 15. Mockup Reference

Interactive HTML mockups are saved in:
`.superpowers/brainstorm/51414-1774021350/interactive-v5.html`

This file contains the approved design with working drill-through panels, all animations, excel grid background, cozy widgets, and collapsible music player.
