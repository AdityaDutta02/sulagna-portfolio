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
        <Link
          href="/blog"
          className="text-xs no-underline transition-colors hover:text-[var(--amber)]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
        >
          &larr; Research Feed
        </Link>
        <Link
          href="/"
          className="text-xs no-underline transition-colors hover:text-[var(--amber)]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}
        >
          Dashboard
        </Link>
      </nav>

      {/* Article container */}
      <div className="max-w-[680px] mx-auto px-5 sm:px-6 pt-10 pb-16">
        {children}
      </div>
    </>
  );
}
