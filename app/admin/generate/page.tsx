import React, { Suspense } from 'react';
import { GenerateClient } from '@/components/admin/generate-client';

export default function GeneratePage(): React.JSX.Element {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        GENERATE
      </h2>
      <Suspense fallback={<p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading…</p>}>
        <GenerateClient />
      </Suspense>
    </div>
  );
}
