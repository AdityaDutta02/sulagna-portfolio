import Link from 'next/link';
import { ReadingBar } from './reading-bar';

interface PostLayoutProps { children: React.ReactNode; }

export function PostLayout({ children }: PostLayoutProps) {
  return (
    <>
      <ReadingBar />
      {/* Sticky nav bar */}
      <nav
        className="sticky top-0 z-10 px-4 sm:px-8 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(246,245,241,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-xs no-underline transition-colors hover:text-[var(--amber)]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
          >
            &larr; Research Feed
          </Link>
          <span className="text-[10px]" style={{ color: 'var(--border)' }}>|</span>
          <Link
            href="/"
            className="text-xs no-underline transition-colors hover:text-[var(--amber)]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}
          >
            Sulagna Dey
          </Link>
        </div>
        <a
          href="/blog/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] no-underline transition-colors hover:text-[var(--amber)]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}
          title="Subscribe via RSS"
        >
          RSS ↗
        </a>
      </nav>

      {/* Article container */}
      <article className="max-w-[680px] mx-auto px-5 sm:px-6 pt-10 pb-16">
        {children}
      </article>
    </>
  );
}
