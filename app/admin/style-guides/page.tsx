import React from 'react';
import { StyleGuidesClient } from '@/components/admin/style-guides-client';

export default function StyleGuidesPage(): React.JSX.Element {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        STYLE GUIDES
      </h2>
      <StyleGuidesClient />
    </div>
  );
}
