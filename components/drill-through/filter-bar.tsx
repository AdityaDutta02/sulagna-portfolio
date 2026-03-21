'use client';

import { useState } from 'react';

interface FilterBarProps {
  items: string[];
}

export function FilterBar({ items }: FilterBarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-2 mb-5 flex-wrap" data-testid="filter-bar">
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={item}
            onClick={() => setActiveIndex(index)}
            className="cursor-pointer transition-all duration-200"
            style={{
              paddingLeft: '14px',
              paddingRight: '14px',
              paddingTop: '6px',
              paddingBottom: '6px',
              borderRadius: '9999px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              border: `1px solid ${isActive ? 'var(--amber)' : 'var(--border)'}`,
              background: isActive ? 'var(--amber)' : 'var(--bg)',
              color: isActive ? '#ffffff' : 'var(--text)',
            }}
            data-testid={`filter-pill-${index}`}
            aria-pressed={isActive}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
