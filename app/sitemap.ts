import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTopics } from '@/lib/blog';

const BASE_URL = 'https://sulagna.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const topics = getAllTopics();
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...topics.map(topic => ({
      url: `${BASE_URL}/blog/topic/${topic}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ];
}
