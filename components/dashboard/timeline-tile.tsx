'use client';

import { motion } from 'framer-motion';
import { timeline } from '@/lib/data';

interface TimelineTileProps {
  className?: string;
}

const nodeVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 2.4 + i * 0.4 },
  }),
};

export function TimelineTile({ className = '' }: TimelineTileProps) {
  return (
    <motion.div
      className={`relative cursor-pointer overflow-hidden rounded-xl p-5 ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      whileHover={{
        y: -3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      data-testid="timeline-tile"
    >
      {/* Full story hint */}
      <motion.span
        className="absolute top-3.5 right-4 text-[9px] font-mono"
        style={{ color: 'var(--blue)' }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      >
        full story →
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
            color: 'var(--blue)',
            marginRight: '5px',
          }}
          aria-hidden="true"
        >
          ▶
        </span>
        Career Journey
      </div>

      {/* Git-commit graph */}
      <div className="relative mt-2" style={{ paddingLeft: '28px' }}>
        {/* Static track line */}
        <div
          className="absolute w-0.5"
          style={{
            left: '9px',
            top: '4px',
            bottom: '4px',
            background: 'var(--border)',
          }}
        />

        {/* Animated fill line */}
        <motion.div
          className="absolute w-0.5"
          style={{
            left: '9px',
            top: '4px',
            bottom: '4px',
            background: 'linear-gradient(to bottom, var(--green), var(--amber), var(--blue), var(--coral), var(--amber))',
            transformOrigin: 'top',
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, delay: 0.4, ease: 'easeInOut' }}
        />

        {/* Timeline nodes */}
        {timeline.map((node, i) => (
          <motion.div
            key={`${node.role}-${node.org}`}
            className="relative flex items-start gap-3.5 pb-4"
            custom={i}
            variants={nodeVariants}
            initial="hidden"
            animate="visible"
            data-testid={`timeline-node-${i}`}
          >
            {/* Dot */}
            <motion.div
              className="absolute rounded-full shrink-0"
              style={{
                left: '-24px',
                top: '2px',
                width: node.isActive ? '14px' : '12px',
                height: node.isActive ? '14px' : '12px',
                background: node.colour,
                border: '3px solid var(--bg-card)',
                boxShadow: node.isActive
                  ? `0 0 0 2px ${node.colour}, 0 0 8px ${node.colour}`
                  : `0 0 0 2px ${node.colour}`,
                animation: node.isActive ? 'dot-pulse 1.4s ease-in-out infinite' : 'none',
              }}
              whileHover={{ scale: 1.3 }}
              transition={{ duration: 0.15 }}
              aria-hidden="true"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header row */}
              <div className="flex items-baseline gap-2.5 mb-0.5">
                <span
                  className="text-[13px] font-bold shrink-0"
                  style={{
                    color: node.isActive ? 'var(--amber)' : 'var(--text)',
                  }}
                >
                  {node.role}
                </span>
                {node.org && (
                  <span
                    className="truncate"
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {node.org}
                  </span>
                )}
                <span
                  className="ml-auto shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: node.colour,
                  }}
                >
                  {node.date}
                </span>
              </div>

              {/* Description */}
              <div
                className="leading-relaxed mt-0.5"
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                {node.description}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {node.tags.map((tag) => (
                  <span
                    key={tag.text}
                    className="rounded"
                    style={{
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      fontWeight: 600,
                      background: tag.bg,
                      color: tag.colour,
                    }}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
