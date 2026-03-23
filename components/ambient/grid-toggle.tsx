'use client';

import { useEffect } from 'react';

/**
 * Sets data-grid attribute on <body> when mounted.
 * Only rendered on dashboard page — blog pages omit this
 * so the excel-style grid overlay never appears there.
 */
export function GridToggle() {
  useEffect(() => {
    document.body.setAttribute('data-grid', '');
    return () => {
      document.body.removeAttribute('data-grid');
    };
  }, []);

  return null;
}
