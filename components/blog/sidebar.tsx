import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';
import { NewsletterCta } from './newsletter-cta';
interface SidebarProps { posts: BlogPost[]; topics: string[]; }
export function Sidebar({ posts, topics }: SidebarProps) {
  const trending = [...posts].sort((a, b) => (b.insightScore ?? 0) - (a.insightScore ?? 0)).slice(0, 3);
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-[8px] uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>METRICS</div>
        <div className="flex gap-6">
          <div><div className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>{posts.length}</div><div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>posts</div></div>
          <div><div className="text-xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{topics.length}</div><div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>topics</div></div>
        </div>
      </div>
      <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-[8px] uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>TRENDING</div>
        <ol className="list-none m-0 p-0 flex flex-col gap-2">
          {trending.map((post, i) => (
            <li key={post.slug} className="flex items-start gap-2">
              <span className="text-sm font-bold shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>{i + 1}</span>
              <Link href={`/blog/${post.slug}`} className="text-xs no-underline hover:underline" style={{ color: 'var(--text)', lineHeight: 1.4 }}>{post.title}</Link>
            </li>
          ))}
        </ol>
      </div>
      <NewsletterCta />
    </div>
  );
}
