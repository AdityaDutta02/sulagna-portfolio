import React from 'react';
import { InboxClient } from '@/components/admin/inbox-client';

export default function InboxPage(): React.JSX.Element {
  return (
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
        }}
      >
        INBOX
      </h2>
      <InboxClient />
    </div>
  );
}
