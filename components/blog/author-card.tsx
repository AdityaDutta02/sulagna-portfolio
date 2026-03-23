import Link from 'next/link';
import { PixelAvatar } from '@/components/dashboard/pixel-avatar';

export function AuthorCard() {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-xl mt-10"
      style={{
        background: 'var(--cream)',
        border: '1px solid var(--amber-light)',
      }}
    >
      <div
        className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
        style={{
          border: '2px solid var(--amber)',
          background: 'var(--bg-card)',
          boxShadow: '0 0 0 3px var(--amber-glow)',
        }}
      >
        <PixelAvatar size={36} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
          Sulagna Dey
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--warm-brown)' }}>
          Data Analyst & Power BI Specialist at AlCircle. Gold Medalist. PL-300 Certified. Writing about data science, market intelligence, and the craft of turning numbers into decisions.
        </div>
        <div className="flex gap-4 mt-2">
          <Link
            href="https://linkedin.com/in/sulagna-dey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold no-underline hover:underline"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}
          >
            LinkedIn &rarr;
          </Link>
          <Link
            href="/blog"
            className="text-[10px] font-semibold no-underline hover:underline"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}
          >
            All Posts &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
