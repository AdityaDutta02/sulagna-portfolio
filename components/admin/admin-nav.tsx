'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/admin/inbox',        label: 'Inbox'        },
  { href: '/admin/queue',        label: 'Queue'        },
  { href: '/admin/generate',     label: 'Generate'     },
  { href: '/admin/style-guides', label: 'Style Guides' },
  { href: '/admin/sources',      label: 'Sources'      },
];

export function AdminNav(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout(): Promise<void> {
    await fetch('/api/admin/auth?action=logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        height: '48px',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--amber)', marginRight: '1rem', fontWeight: 600 }}>
        CMS
      </span>
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            color: pathname === href ? 'var(--amber)' : 'var(--text-muted)',
            background: pathname === href ? 'var(--amber-light)' : 'transparent',
            textDecoration: 'none',
            fontWeight: pathname === href ? 600 : 400,
          }}
        >
          {label}
        </Link>
      ))}
      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
