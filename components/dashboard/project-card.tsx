'use client';

import { motion } from 'framer-motion';
import { type Project } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <motion.div
      className={`relative cursor-pointer rounded-lg p-4 overflow-hidden ${className}`}
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
      }}
      whileHover={{
        y: -2,
        borderColor: project.colour,
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => {}}
      data-drill={project.reportId}
      data-testid={`project-card-${project.id}`}
    >
      {/* Bottom accent bar */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-0.5"
        style={{ background: project.colour }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />

      {/* Status tag */}
      <div
        className="inline-flex items-center gap-1 mb-2"
        data-testid={`project-status-${project.id}`}
      >
        <span
          className="rounded-full"
          style={{
            width: '5px',
            height: '5px',
            background: project.colour,
            display: 'inline-block',
            animation: project.status === 'live' ? 'dot-pulse 1.4s ease-in-out infinite' : 'none',
          }}
          aria-hidden="true"
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: project.colour,
          }}
        >
          {project.statusLabel}
        </span>
      </div>

      {/* Project name */}
      <div
        className="text-sm font-bold mb-1.5"
        style={{ color: 'var(--text)' }}
        data-testid={`project-name-${project.id}`}
      >
        {project.name}
      </div>

      {/* Description */}
      <div
        className="leading-relaxed mb-2.5"
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        {project.description}
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1" data-testid={`project-stack-${project.id}`}>
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded border"
            style={{
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 500,
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
