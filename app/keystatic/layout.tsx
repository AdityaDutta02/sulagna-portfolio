import type { ReactNode } from 'react';
import LogoutButton from './logout-button';

// Keystatic local storage only works in the Next.js dev server.
// In production, GitHub OAuth env vars must be configured.
const isLocalMode = !process.env.KEYSTATIC_GITHUB_CLIENT_ID;
const isProd = process.env.NODE_ENV === 'production';

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  if (isLocalMode && isProd) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          fontFamily: 'monospace',
          color: '#6b7280',
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
          Keystatic CMS — GitHub storage required in production
        </p>
        <p style={{ fontSize: 12, maxWidth: 480, textAlign: 'center', lineHeight: 1.6 }}>
          Local storage only works during <code>npm run dev</code>. To use Keystatic on the
          live site, set up a GitHub OAuth app and add{' '}
          <code>KEYSTATIC_GITHUB_CLIENT_ID</code>,{' '}
          <code>KEYSTATIC_GITHUB_CLIENT_SECRET</code>,{' '}
          <code>KEYSTATIC_SECRET</code>,{' '}
          <code>GITHUB_REPO_OWNER</code>, and{' '}
          <code>GITHUB_REPO_NAME</code> in your Vercel environment variables.
        </p>
        <a
          href="https://keystatic.com/docs/github-app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: '#2563eb', textDecoration: 'underline' }}
        >
          Setup guide →
        </a>
        <a
          href="/admin"
          style={{ marginTop: 8, fontSize: 12, color: '#6b7280', textDecoration: 'underline' }}
        >
          ← Back to Admin
        </a>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#fff' }}>
      <LogoutButton />
      {children}
    </div>
  );
}
