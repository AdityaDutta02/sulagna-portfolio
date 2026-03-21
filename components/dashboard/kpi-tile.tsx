'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { type Kpi } from '@/lib/data';
import { Sparkline } from './sparkline';

interface KpiTileProps {
  kpi: Kpi;
  className?: string;
}

export function KpiTile({ kpi, className = '' }: KpiTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer overflow-hidden rounded-xl p-5 ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      whileHover={{
        y: -3,
        borderColor: 'var(--border-hover, #c5c2bb)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => {}}
      data-drill={kpi.id}
      data-testid={`kpi-tile-${kpi.id}`}
    >
      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-5 right-5 h-0.5"
        style={{ background: kpi.colour }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />

      {/* Drill-through hint */}
      <motion.span
        className="absolute top-3.5 right-4 text-[9px] font-mono"
        style={{ color: kpi.colour }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      >
        drill through →
      </motion.span>

      {/* Label */}
      <div
        className="mb-3 text-[10px] uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '6px',
            color: kpi.colour,
            marginRight: '5px',
          }}
          aria-hidden="true"
        >
          ▶
        </span>
        {kpi.label}
      </div>

      {/* Value */}
      <div
        className="text-4xl font-bold tabular-nums"
        style={{
          fontFamily: 'var(--font-mono)',
          color: kpi.colour,
        }}
        data-testid={`kpi-value-${kpi.id}`}
      >
        {kpi.value}
      </div>

      {/* Subtitle */}
      <div
        className="text-xs mt-0.5"
        style={{ color: 'var(--text-muted)' }}
      >
        {kpi.subtitle}
      </div>

      {/* Progress bar */}
      <div
        className="mt-3.5 h-1 overflow-hidden rounded-sm"
        style={{ background: 'var(--bg-subtle)' }}
        data-testid={`kpi-bar-${kpi.id}`}
      >
        <motion.div
          className="h-full rounded-sm"
          style={{
            background: kpi.colour,
            width: kpi.barWidth,
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />
      </div>

      {/* Sparkline */}
      <div className="mt-2">
        <Sparkline data={kpi.sparklineData} colour={kpi.colour} />
      </div>
    </motion.div>
  );
}
