import Link from 'next/link';
import { getPostsByTopic, getAllTopics, getAllPosts } from '@/lib/blog';
import { PostCard } from '@/components/blog/post-card';
import { TopicFilter } from '@/components/blog/topic-filter';
import { Sidebar } from '@/components/blog/sidebar';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const displayName = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${displayName} — Data Science Posts`,
    description: `Articles about ${displayName.toLowerCase()} by Sulagna Dey. Data analysis, Power BI, Python, and market intelligence insights.`,
    alternates: { canonical: `https://sulagna.dev/blog/topic/${topic}` },
  };
}

export function generateStaticParams() {
  return getAllTopics().map(t => ({ topic: t }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const posts = getPostsByTopic(topic);
  const allPosts = getAllPosts();
  const topics = getAllTopics();
  const displayName = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-4 sm:px-8 py-7 pb-20">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', backdropFilter: 'blur(8px)', paddingTop: '8px', paddingBottom: '8px' }}>
        <Link href="/blog" className="text-xs no-underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>&larr; Back to Feed</Link>
        <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{displayName.toUpperCase()}</div>
        <div className="px-3 py-1.5 rounded-lg text-[10px]" style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}><a href="/blog/feed.xml" className="no-underline" style={{ color: 'inherit' }} title="RSS Feed">RSS Feed</a></div>
      </div>
      <TopicFilter topics={topics} activeTopic={topic} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          {posts.length === 0 ? (
            <p className="text-sm py-10 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>No posts for this topic yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map(post => <PostCard key={post.slug} post={post} />)}
            </div>
          )}
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Sidebar posts={allPosts} topics={topics} />
        </div>
      </div>
    </main>
  );
}
