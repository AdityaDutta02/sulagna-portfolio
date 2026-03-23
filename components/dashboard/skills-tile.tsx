'use client';

import { motion } from 'framer-motion';
import { skills } from '@/lib/data';

interface SkillsTileProps {
  className?: string;
}

export function SkillsTile({ className = '' }: SkillsTileProps) {
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
      data-testid="skills-tile"
    >
      {/* Drill-through hint */}
      <motion.span
        className="absolute top-3.5 right-4 text-[9px] font-mono"
        style={{ color: 'var(--plum)' }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      >
        details →
      </motion.span>

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
            color: 'var(--plum)',
            marginRight: '5px',
          }}
          aria-hidden="true"
        >
          ▶
        </span>
        Skill Matrix
      </div>

      {/* Skill groups */}
      <div className="flex flex-col gap-3">
        {skills.map((group) => (
          <div key={group.groupLabel} data-testid={`skill-group-${group.groupLabel}`}>
            <div
              className="mb-1 uppercase tracking-widest"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                fontWeight: 600,
                color: 'var(--text-dim)',
              }}
            >
              {group.groupLabel}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border"
                  style={{
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    background: 'var(--bg)',
                    borderColor: 'var(--border)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    cursor: 'default',
                  }}
                  whileHover={{
                    borderColor: skill.colour,
                    background: skill.bg,
                    y: -1,
                  }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  data-testid={`skill-tag-${skill.name}`}
                >
                  {/* Icon */}
                  <span
                    className="flex items-center justify-center rounded shrink-0"
                    style={{
                      width: '14px',
                      height: '14px',
                      background: skill.iconBg,
                      color: '#fff',
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '8px',
                    }}
                    aria-hidden="true"
                  >
                    {skill.icon}
                  </span>

                  {/* Name */}
                  <span>{skill.name}</span>

                  {/* Proficiency dots */}
                  <span className="flex items-center gap-[3px]" aria-label={`Proficiency: ${skill.proficiency} of 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className="rounded-full"
                        style={{
                          width: '5px',
                          height: '5px',
                          background: i < skill.proficiency ? skill.colour : 'var(--border)',
                        }}
                      />
                    ))}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
