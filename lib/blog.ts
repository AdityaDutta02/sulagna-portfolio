// Blog utility — reads MDX files from content/blog/, parses frontmatter via gray-matter.

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
  dataPoints?: number;
  sources?: number;
  insightScore?: number;
  featured?: boolean;
  content: string; // raw MDX body (everything after the frontmatter)
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const WORDS_PER_MINUTE = 200;

/** Estimate reading time in minutes based on average 200 wpm. */
function computeReadingTime(rawContent: string): number {
  const wordCount = rawContent.trim().split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

/** Return the absolute path to a slug's MDX file. */
function mdxFilePath(slug: string): string {
  return path.join(BLOG_DIR, `${slug}.mdx`);
}

/**
 * Extract an optional field from frontmatter data and coerce it.
 * Returns undefined when the key is absent.
 */
function optionalField<T>(
  data: Record<string, unknown>,
  key: string,
  coerce: (value: unknown) => T
): T | undefined {
  return data[key] !== undefined ? coerce(data[key]) : undefined;
}

/** Parse raw frontmatter tags into a string array. */
function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return [raw];
  return [];
}

/**
 * Build the optional metrics fields from frontmatter data.
 * Separated from required fields to keep parseMdxFile readable.
 */
function parseOptionalFields(
  data: Record<string, unknown>
): Pick<BlogPost, 'updated' | 'dataPoints' | 'sources' | 'insightScore' | 'featured'> {
  return {
    updated: optionalField(data, 'updated', String),
    dataPoints: optionalField(data, 'dataPoints', Number),
    sources: optionalField(data, 'sources', Number),
    insightScore: optionalField(data, 'insightScore', Number),
    featured: optionalField(data, 'featured', Boolean),
  };
}

/** Parse a single MDX file into a typed BlogPost. */
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

/** Return all blog posts parsed from content/blog/, sorted by date descending. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }
  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      return parseMdxFile(path.join(BLOG_DIR, file), slug);
    });

  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return posts;
}

/** Return a single post matching the given slug, or null if not found. */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = mdxFilePath(slug);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parseMdxFile(filePath, slug);
}

/** Return all unique topic values across every post. */
export function getAllTopics(): string[] {
  const topicSet = new Set(getAllPosts().map((post) => post.topic));
  return Array.from(topicSet);
}

/** Return all posts belonging to the given topic. */
export function getPostsByTopic(topic: string): BlogPost[] {
  return getAllPosts().filter((post) => post.topic === topic);
}
