import Link from 'next/link';
import { getPostsByTopic, getAllTopics } from '@/lib/blog';
import { PostCard } from '@/components/blog/post-card';
import { TopicFilter } from '@/components/blog/topic-filter';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  return { title: `${topic} Posts` };
}

export function generateStaticParams() {
  return getAllTopics().map(t => ({ topic: t }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const posts = getPostsByTopic(topic);
  const topics = getAllTopics();
  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-8 py-7 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Link href="/blog" className="text-xs no-underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>&larr; Back to Feed</Link>
        <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>RESEARCH FEED</div>
        <div />
      </div>
      <TopicFilter topics={topics} activeTopic={topic} />
      <div className="grid grid-cols-2 gap-4">
        {posts.map(post => <PostCard key={post.slug} post={post} />)}
      </div>
      {posts.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No posts for this topic yet.</p>}
    </main>
  );
}
