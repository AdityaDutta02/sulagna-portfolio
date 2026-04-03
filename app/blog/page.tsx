import Link from 'next/link';
import { getAllPosts, getAllTopics } from '@/lib/blog';
import { PostCard } from '@/components/blog/post-card';
import { TopicFilter } from '@/components/blog/topic-filter';
import { Sidebar } from '@/components/blog/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Science Insights — Power BI, Python & Market Intelligence',
  description: 'Data science insights from the intersection of analytics and industry intelligence. Power BI tutorials, Python automation, SQL patterns, data visualization best practices, and aluminium market analysis by Sulagna Dey.',
  keywords: ['data science blog', 'Power BI tutorials', 'Python automation', 'SQL patterns', 'data visualization', 'market intelligence', 'aluminium market', 'data analysis'],
  alternates: { canonical: 'https://sulagna.dev/blog' },
  openGraph: { images: [{ url: '/og', width: 1200, height: 630, alt: 'Sulagna Dey — Data Science Insights' }], title: 'Data Science Insights — Power BI, Python & Market Intelligence', description: 'Power BI tutorials, Python automation, SQL patterns, and aluminium market analysis.' },
};

const BASE_URL = 'https://sulagna.dev';

export default function BlogIndex() {
  const posts = getAllPosts();
  const topics = getAllTopics();
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => p !== featured);

  // Static JSON-LD — derived from MDX frontmatter (title, slug, date), not user input
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Sulagna Dey — Data Science Insights',
    url: `${BASE_URL}/blog`,
    description: 'Data science news, Power BI tutorials, and market intelligence analysis',
    author: { '@type': 'Person', name: 'Sulagna Dey', url: BASE_URL },
    hasPart: posts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };

  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-4 sm:px-8 py-7 pb-20">
      {/* Static JSON-LD structured data — not user input, safe to render directly */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', backdropFilter: 'blur(8px)', paddingTop: '8px', paddingBottom: '8px' }}>
        <Link href="/" className="text-xs no-underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>&larr; Back to Dashboard</Link>
        <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>RESEARCH FEED</div>
        <div className="px-3 py-1.5 rounded-lg text-[10px]" style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}><a href="/blog/feed.xml" className="no-underline" style={{ color: 'inherit' }} title="RSS Feed">RSS Feed</a></div>
      </div>
      <TopicFilter topics={topics} activeTopic={null} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          {featured && <PostCard post={featured} featured />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {rest.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Sidebar posts={posts} topics={topics} />
        </div>
      </div>
    </main>
  );
}
