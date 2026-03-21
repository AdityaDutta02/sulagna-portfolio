'use client';
import { useState } from 'react';
export function NewsletterCta() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid var(--amber-light)' }}>
      <div className="text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--warm-brown)' }}>Get the weekly data science digest.</div>
      {sent ? (
        <div className="text-xs" style={{ color: 'var(--green)' }}>Subscribed!</div>
      ) : (
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (email.includes('@')) setSent(true); }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
            className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', color: 'var(--text)' }} />
          <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer" style={{ background: 'var(--amber)', border: 'none', fontFamily: 'var(--font-mono)' }}>Subscribe</button>
        </form>
      )}
    </div>
  );
}
