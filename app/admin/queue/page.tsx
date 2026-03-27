import React from 'react';
import { QueueClient } from '@/components/admin/queue-client';

export default function QueuePage(): React.JSX.Element {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        QUEUE
      </h2>
      <QueueClient />
    </div>
  );
}
