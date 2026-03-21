'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface BarChartRow {
  label: string;
  width: string;
  colour: string;
  text: string;
}

export function BarChart({ rows }: { rows: BarChartRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20px 0px' });

  return (
    <div ref={ref} data-testid="bar-chart">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className="flex items-center gap-2.5 mb-2"
          data-testid={`bar-chart-row-${index}`}
        >
          <div
            className="text-right shrink-0"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              width: '110px',
            }}
          >
            {row.label}
          </div>

          <div
            className="flex-1 rounded overflow-hidden"
            style={{
              height: '20px',
              background: 'var(--bg-subtle)',
            }}
          >
            <motion.div
              className="h-full rounded flex items-center"
              style={{ background: row.colour }}
              initial={{ width: '0%' }}
              animate={inView ? { width: row.width } : { width: '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.08 }}
            >
              <span
                className="pl-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.text}
              </span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}
