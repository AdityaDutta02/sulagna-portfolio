'use client';

import { motion } from 'framer-motion';
import { projects } from '@/lib/data';
import { ProjectCard } from './project-card';

interface ProjectsTileProps {
  className?: string;
}

export function ProjectsTile({ className = '' }: ProjectsTileProps) {
  return (
    <motion.div
      className={`relative cursor-pointer overflow-hidden rounded-xl p-5 ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      whileHover={{
        y: -3,
        boxShadow: 'var(--shadow-card)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      data-testid="projects-tile"
    >
      {/* Label */}
      <div
        className="mb-4 text-[10px] uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '6px',
            color: 'var(--amber)',
            marginRight: '5px',
          }}
          aria-hidden="true"
        >
          ▶
        </span>
        Project Reports
      </div>

      {/* 3-column card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </motion.div>
  );
}
