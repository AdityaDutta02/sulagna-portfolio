'use client';

import KeystaticApp from './keystatic';

async function logout() {
  await fetch('/api/admin/auth?action=logout', { method: 'POST' });
  window.location.href = '/admin/login';
}

export default function KeystaticLayout() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#fff' }}>
      {/* Logout button */}
      <button
        onClick={logout}
        style={{
          position: 'fixed',
          top: 12,
          right: 16,
          zIndex: 100,
          padding: '5px 12px',
          background: 'transparent',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          fontFamily: 'monospace',
          fontSize: 11,
          color: '#6b7280',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
      <KeystaticApp />
    </div>
  );
}
