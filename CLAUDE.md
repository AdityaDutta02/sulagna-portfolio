# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js 16, port 3000)
npm run build      # Production build
npm run lint       # ESLint
npx vitest         # Run all tests
npx vitest run lib/__tests__/blog.test.ts  # Run a single test file
```

Tests use Vitest with `environment: 'node'` — no DOM available unless switched to `jsdom`. The `@` alias resolves to the project root.

## Architecture

This is a **Next.js 16 App Router** portfolio site for Sulagna Dey, a data analyst. It uses **Tailwind CSS v4**, **Framer Motion**, and **Recharts**. No database — all data is static.

### Data layer (`lib/`)
- `lib/data.ts` — Single source of truth for all dashboard content: `kpis`, `projects`, `skills`, `timeline`, `certifications`, `contact`, `profile`. Edit this file to update portfolio content.
- `lib/blog.ts` — Reads `.mdx` files from `content/blog/`, parses frontmatter via `gray-matter`. Exports `getAllPosts`, `getPostBySlug`, `getAllTopics`, `getPostsByTopic`.
- `lib/reports.ts` — Maps `reportId` strings (from `lib/data.ts` projects) to their React report components.

### Routing (`app/`)
- `/` — Dashboard page (`app/page.tsx`)
- `/blog` — Blog index with topic filtering
- `/blog/[slug]` — Individual MDX post
- `/blog/topic/[topic]` — Posts filtered by topic
- `/blog/feed.xml` — RSS feed route handler
- `/blog/og/[slug]` and `/og` — Dynamic OG image generation via `@vercel/og`

### Component layers
- `components/dashboard/` — Dashboard tiles: `DashboardGrid` renders a bento-grid of `KpiTile`, `ProjectsTile`, `SkillsTile`, `TimelineTile`, `ContactTile`, and `HighlightsTile`. Each tile is self-contained.
- `components/ambient/` — Decorative overlays rendered in the root layout on every page: `ExcelGrid` (grid background), `Particles`, `Clock`, `Coffee`, `MiniChart`, `MusicWidget`, `StatusBadge`. `GridToggle` is a client component placed on the dashboard page to activate the excel-grid overlay — blog pages explicitly hide it.
- `components/drill-through/` — A slide-over panel system. `DrillProvider` + `DrillPanel` live in the root layout. Call `useDrill().openDrill(reportId)` from any component to open the panel. The `reportId` is looked up in `lib/reports.ts` to render the matching report component.
- `components/blog/` — Blog-specific components: `PostCard`, `PostLayout`, `Sidebar`, `ReadingBar`, `TopicFilter`, etc.
- `components/reports/` — One component per project (`proj-aluminium.tsx`, `proj-crime.tsx`, `proj-mamba.tsx`) plus reusable KPI/chart primitives (`automation.tsx`, `data-sources.tsx`, etc.). These render inside the drill-through panel.

### Design system
All colours are CSS custom properties defined in `app/globals.css`. The Tailwind v4 `@theme inline` block bridges them into Tailwind utilities (e.g. `text-amber`, `bg-green-bg`). Use the existing tokens — do not introduce raw hex values.

Fonts: `--font-body` (DM Sans), `--font-mono` (JetBrains Mono), `--font-pixel` (Press Start 2P, used sparingly for decorative labels).

### Adding a new project
1. Add a `Project` entry to `projects` in `lib/data.ts` with a unique `reportId`.
2. Create `components/reports/proj-<slug>.tsx` with the report content.
3. Register the `reportId` → component mapping in `lib/reports.ts`.
4. Clicking the project card in `ProjectsTile` will automatically open the drill-through panel.

### Adding a blog post
Create `content/blog/<slug>.mdx` with this frontmatter:
```
---
slug: <slug>
title: <string>
date: YYYY-MM-DD
topic: <string>
excerpt: <string>
tags: [tag1, tag2]
# optional: updated, dataPoints, sources, insightScore, featured
---
```
