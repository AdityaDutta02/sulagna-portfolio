'use client';
import { motion } from 'framer-motion';
import { KpiTile } from './kpi-tile';
import { ProjectsTile } from './projects-tile';
import { SkillsTile } from './skills-tile';
import { TimelineTile } from './timeline-tile';
import { ContactTile } from './contact-tile';
import { type Kpi } from '@/lib/data';

interface DashboardGridProps {
  kpis: Kpi[];
}

function AnimatedRow({
  delay,
  children,
  className = 'col-span-12 grid grid-cols-12 gap-3',
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function DashboardGrid({ kpis }: DashboardGridProps) {
  return (
    <section aria-label="Portfolio dashboard" className="grid grid-cols-12 gap-3">
      {/* Row 1: KPI tiles */}
      <AnimatedRow delay={0.25} className="contents">
        {kpis.map((kpi) => (
          <KpiTile key={kpi.id} kpi={kpi} className="col-span-12 sm:col-span-6 lg:col-span-3" />
        ))}
      </AnimatedRow>

      {/* Row 2: Projects + Skills */}
      <AnimatedRow delay={0.55}>
        <ProjectsTile className="col-span-12 lg:col-span-8" />
        <SkillsTile className="col-span-12 lg:col-span-4" />
      </AnimatedRow>

      {/* Row 3: Timeline + Contact */}
      <AnimatedRow delay={0.70}>
        <TimelineTile className="col-span-12 lg:col-span-8" />
        <ContactTile className="col-span-12 lg:col-span-4" />
      </AnimatedRow>
    </section>
  );
}
