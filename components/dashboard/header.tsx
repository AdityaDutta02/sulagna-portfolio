import Link from 'next/link';
import { profile } from '@/lib/data';
import { PixelAvatar } from './pixel-avatar';
import { TypingCursor } from './typing-cursor';

const badgeStyles: Record<string, string> = {
  gold: 'text-[var(--text)] shadow-sm',
  cert: 'border text-[var(--green)]',
  location: 'border text-[var(--text-muted)]',
};

const badgeBg: Record<string, React.CSSProperties> = {
  gold: { background: 'var(--amber-decorative)' },
  cert: { background: 'var(--green-bg)', borderColor: 'rgba(90,154,110,0.2)' },
  location: { background: 'var(--bg-subtle)', borderColor: 'var(--border)' },
};

export function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-5 mb-7">
      <div
        className="w-14 h-14 rounded-md flex items-center justify-center shrink-0"
        style={{
          border: '2px solid var(--amber)',
          background: 'var(--cream)',
          boxShadow: '0 0 0 4px var(--amber-glow)',
        }}
      >
        <PixelAvatar size={40} />
      </div>

      <div className="flex-1 min-w-0">
        <h1
          className="text-[22px] font-semibold mb-0.5 text-center sm:text-left"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.5px',
            color: 'var(--text)',
          }}
        >
          {profile.name} <span style={{ color: 'var(--amber)' }}>{profile.lastName}</span>
        </h1>
        <div
          className="text-[13px] text-center sm:text-left"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
        >
          {profile.tagline}
          <TypingCursor />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        {profile.badges.map((badge) => (
          <span
            key={badge.text}
            className={`px-3 py-[5px] text-[10px] font-semibold rounded-full ${badgeStyles[badge.variant]}`}
            style={{
              fontFamily: 'var(--font-mono)',
              ...badgeBg[badge.variant],
            }}
          >
            {badge.text}
          </span>
        ))}
      </div>
      <Link
        href="/blog"
        className="text-[10px] font-semibold no-underline transition-all px-3 py-1.5 rounded-lg hover:-translate-y-px"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--amber)',
          background: 'var(--amber-glow)',
          border: '1px solid var(--amber-light)',
        }}
      >
        Research Feed &rarr;
      </Link>
    </header>
  );
}
