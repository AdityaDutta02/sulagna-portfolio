import React from 'react';
import { SourcesClient } from '@/components/admin/sources-client';

export default function SourcesPage(): React.JSX.Element {
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
        SOURCES
      </h2>
      <SourcesClient />
    </div>
  );
}
