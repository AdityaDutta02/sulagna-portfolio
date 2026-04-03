import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers — site is live for thought leadership visibility
      { userAgent: '*', allow: '/' },
      // AI bots — explicit allow for AI-SEO
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      // Block admin routes from all crawlers
      { userAgent: '*', disallow: '/admin' },
    ],
    sitemap: 'https://sulagna.dev/sitemap.xml',
  };
}
