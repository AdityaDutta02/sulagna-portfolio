import React, { type ReactNode } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AdminNav />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '1.5rem',
        }}
      >
        {children}
      </main>
    </div>
  );
}
