// Blog utility — reads MDX files from content/blog/, parses frontmatter via gray-matter.
// Supports two layouts:
//   - content/blog/<slug>.mdx          (existing flat format)
//   - content/blog/<slug>/index.mdx    (Keystatic CMS format)

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  topic: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
  status?: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string;
  dataPoints?: number;
  sources?: number;
  insightScore?: number;
  featured?: boolean;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const WORDS_PER_MINUTE = 200;

function computeReadingTime(rawContent: string): number {
  const wordCount = rawContent.trim().split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

function optionalField<T>(
  data: Record<string, unknown>,
  key: string,
  coerce: (value: unknown) => T
): T | undefined {
  return data[key] !== undefined ? coerce(data[key]) : undefined;
}

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return [raw];
  return [];
}

function parseOptionalFields(
  data: Record<string, unknown>
): Pick<BlogPost, 'updated' | 'status' | 'scheduledDate' | 'dataPoints' | 'sources' | 'insightScore' | 'featured'> {
  const rawStatus = data['status'];
  const status =
    rawStatus === 'draft' || rawStatus === 'published' || rawStatus === 'scheduled'
      ? rawStatus
      : undefined;

  return {
    updated: optionalField(data, 'updated', String),
    status,
    scheduledDate: optionalField(data, 'scheduledDate', String),
    dataPoints: optionalField(data, 'dataPoints', Number),
    sources: optionalField(data, 'sources', Number),
    insightScore: optionalField(data, 'insightScore', Number),
    featured: optionalField(data, 'featured', Boolean),
  };
}

function parseMdxFile(filePath: string, slug: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const requiredFields = {
    slug: String(data['slug'] ?? slug),
    title: String(data['title'] ?? ''),
    date: String(data['date'] ?? ''),
    topic: String(data['topic'] ?? ''),
    excerpt: String(data['excerpt'] ?? ''),
    tags: parseTags(data['tags']),
    readingTime: computeReadingTime(content),
    content,
  };

  return { ...requiredFields, ...parseOptionalFields(data) };
}

/** Resolve the file path for a slug, checking flat then directory layout. */
function resolveFilePath(slug: string): string | null {
  const flat = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(flat)) return flat;

  const indexed = path.join(BLOG_DIR, slug, 'index.mdx');
  if (fs.existsSync(indexed)) return indexed;

  return null;
}

/** Collect all {slug, filePath} pairs from both flat and directory layouts. */
function collectEntries(): Array<{ slug: string; filePath: string }> {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const entries: Array<{ slug: string; filePath: string }> = [];

  for (const entry of fs.readdirSync(BLOG_DIR)) {
    const full = path.join(BLOG_DIR, entry);

    if (entry.endsWith('.mdx')) {
      entries.push({ slug: entry.replace(/\.mdx$/, ''), filePath: full });
    } else if (fs.statSync(full).isDirectory()) {
      const indexMdx = path.join(full, 'index.mdx');
      if (fs.existsSync(indexMdx)) {
        entries.push({ slug: entry, filePath: indexMdx });
      }
    }
  }

  return entries;
}

/** Return true if a post should appear on the public blog. */
function isPublishable(post: BlogPost): boolean {
  if (post.status === 'draft') return false;

  if (post.status === 'scheduled') {
    if (!post.scheduledDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(post.scheduledDate) <= today;
  }

  // No status field (existing posts) or status === 'published' → show
  return true;
}

/** Return all published blog posts sorted by date descending. */
export function getAllPosts(): BlogPost[] {
  return collectEntries()
    .map(({ slug, filePath }) => parseMdxFile(filePath, slug))
    .filter(isPublishable)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Return a single post matching the given slug, or null if not found. */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = resolveFilePath(slug);
  if (!filePath) return null;
  return parseMdxFile(filePath, slug);
}

/** Return all unique topic values across every published post. */
export function getAllTopics(): string[] {
  return Array.from(new Set(getAllPosts().map((post) => post.topic)));
}

/** Return all published posts belonging to the given topic. */
export function getPostsByTopic(topic: string): BlogPost[] {
  return getAllPosts().filter((post) => post.topic === topic);
}
