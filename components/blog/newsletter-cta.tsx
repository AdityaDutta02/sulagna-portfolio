import Link from 'next/link';

export function NewsletterCta() {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid var(--amber-light)' }}>
      <div className="text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--warm-brown)' }}>
        Follow my data analysis journey
      </div>
      <div className="text-[11px] mb-3" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        I write about Power BI, Python automation, and market intelligence. Connect on LinkedIn for the latest posts.
      </div>
      <Link
        href="https://linkedin.com/in/sulagna-dey"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold no-underline transition-all"
        style={{
          background: 'var(--amber)',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Follow on LinkedIn &rarr;
      </Link>
    </div>
  );
}
