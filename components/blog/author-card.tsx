import Link from 'next/link';
import { PixelAvatar } from '@/components/dashboard/pixel-avatar';
export function AuthorCard() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl mt-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ border: '2px solid var(--amber)', background: 'var(--cream)' }}>
        <PixelAvatar size={32} />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-mono)' }}>Sulagna Dey</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Data Analyst @ AlCircle | PL-300 Certified</div>
        <div className="flex gap-3 mt-1">
          <Link href="https://linkedin.com/in/sulagna-dey" target="_blank" rel="noopener" className="text-[10px] no-underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>LinkedIn</Link>
          <Link href="/blog" className="text-[10px] no-underline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>All Posts</Link>
        </div>
      </div>
    </div>
  );
}
