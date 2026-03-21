'use client';

import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  colour: string;
}

export function Sparkline({ data, colour }: SparklineProps) {
  const max = Math.max(...data);

  return (
    <div
      className="flex items-end gap-0.5"
      style={{ height: '28px' }}
      data-testid="sparkline"
      aria-hidden="true"
    >
      {data.map((value, index) => {
        const heightPercent = max > 0 ? (value / max) * 100 : 0;
        const isLast = index === data.length - 1;

        return (
          <motion.div
            key={index}
            className="flex-1"
            style={{
              background: colour,
              opacity: isLast ? 0.5 : 0.25,
              borderRadius: '1px',
              height: `${heightPercent}%`,
              transformOrigin: 'bottom',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}
