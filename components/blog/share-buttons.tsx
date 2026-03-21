'use client';
import { useState } from 'react';
interface ShareButtonsProps { title: string; }
export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex gap-2">
      <button onClick={handleShare} className="px-3 py-1 rounded-full text-[10px] font-medium cursor-pointer transition-all" style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>Share</button>
      <button onClick={handleCopy} className="px-3 py-1 rounded-full text-[10px] font-medium cursor-pointer transition-all" style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg)', border: '1px solid var(--border)', color: copied ? 'var(--green)' : 'var(--text)' }}>{copied ? 'Copied!' : 'Copy link'}</button>
    </div>
  );
}
