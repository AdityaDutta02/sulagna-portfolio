// @vitest-environment node

import { describe, it, expect } from 'vitest';
import {
  getAllPosts,
  getPostBySlug,
  getAllTopics,
  getPostsByTopic,
} from '../blog';

describe('getAllPosts', () => {
  it('returns an array with at least 1 post', () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThanOrEqual(1);
  });

  it('seed post has all required frontmatter fields', () => {
    const posts = getAllPosts();
    const seed = posts.find((p) => p.slug === 'hello-world');
    expect(seed).toBeDefined();
    expect(typeof seed!.title).toBe('string');
    expect(seed!.title.length).toBeGreaterThan(0);
    expect(typeof seed!.slug).toBe('string');
    expect(seed!.slug.length).toBeGreaterThan(0);
    expect(typeof seed!.date).toBe('string');
    expect(seed!.date.length).toBeGreaterThan(0);
    expect(typeof seed!.topic).toBe('string');
    expect(seed!.topic.length).toBeGreaterThan(0);
    expect(Array.isArray(seed!.tags)).toBe(true);
    expect(seed!.tags.length).toBeGreaterThan(0);
    expect(typeof seed!.excerpt).toBe('string');
    expect(seed!.excerpt.length).toBeGreaterThan(0);
  });

  it('posts are sorted by date descending', () => {
    const posts = getAllPosts();
    for (let i = 0; i < posts.length - 1; i++) {
      const current = new Date(posts[i]!.date).getTime();
      const next = new Date(posts[i + 1]!.date).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('readingTime is a positive number for every post', () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(typeof post.readingTime).toBe('number');
      expect(post.readingTime).toBeGreaterThan(0);
    }
  });
});

describe('getPostBySlug', () => {
  it('returns the seed post for slug "hello-world"', () => {
    const post = getPostBySlug('hello-world');
    expect(post).not.toBeNull();
    expect(post!.slug).toBe('hello-world');
    expect(post!.title).toBe('Welcome to the Research Feed');
  });

  it('returns null for a nonexistent slug', () => {
    const post = getPostBySlug('nonexistent-slug-xyz');
    expect(post).toBeNull();
  });
});

describe('getAllTopics', () => {
  it('returns an array of strings', () => {
    const topics = getAllTopics();
    expect(Array.isArray(topics)).toBe(true);
    for (const topic of topics) {
      expect(typeof topic).toBe('string');
    }
  });

  it('includes "industry-trends" from the seed post', () => {
    const topics = getAllTopics();
    expect(topics).toContain('industry-trends');
  });

  it('contains no duplicate topics', () => {
    const topics = getAllTopics();
    expect(new Set(topics).size).toBe(topics.length);
  });
});

describe('getPostsByTopic', () => {
  it('returns posts matching the given topic', () => {
    const posts = getPostsByTopic('industry-trends');
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThanOrEqual(1);
    for (const post of posts) {
      expect(post.topic).toBe('industry-trends');
    }
  });

  it('result contains the seed post', () => {
    const posts = getPostsByTopic('industry-trends');
    const seed = posts.find((p) => p.slug === 'hello-world');
    expect(seed).toBeDefined();
  });

  it('returns an empty array for a topic with no posts', () => {
    const posts = getPostsByTopic('nonexistent-topic-xyz');
    expect(posts).toEqual([]);
  });
});
