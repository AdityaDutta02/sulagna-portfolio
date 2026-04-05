'use client';

export default function LogoutButton() {
  async function handleLogout() {
    await fetch('/api/admin/auth?action=logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'fixed',
        bottom: 16,
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
  );
}
