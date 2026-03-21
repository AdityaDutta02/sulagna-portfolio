import { ImpactCard } from '@/components/drill-through/impact-card';
import { KpiRow, type KpiRowItem } from '@/components/drill-through/kpi-row';
import { FilterBar } from '@/components/drill-through/filter-bar';
import { Section } from '@/components/drill-through/section';

const findings: KpiRowItem[] = [
  { label: 'Records Analysed', value: '48K+', colour: 'var(--blue)' },
  { label: 'Crime Types', value: '14', colour: 'var(--coral)' },
  { label: 'Hotspots Found', value: '7', colour: 'var(--amber)' },
];

export function ProjCrime() {
  return (
    <div data-testid="report-proj-crime">
      <ImpactCard value="🗺" colour="var(--blue)" description="Geospatial crime analysis — Tableau dashboard mapping crime types, hotspots, and seasonal patterns across the City of London (2023-25)." />
      <Section title="Filter by Crime Type">
        <FilterBar items={['All Types', 'Theft', 'Fraud', 'Violence', 'Drugs']} />
      </Section>
      <Section title="Key Findings">
        <KpiRow items={findings} />
      </Section>
      <Section title="Tools & Methods">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Built in Tableau Public with calculated fields for seasonal decomposition. Used geospatial mapping with London borough boundaries. Created heat maps and time-series overlays to identify peak crime windows and support targeted law enforcement interventions.
        </p>
      </Section>
    </div>
  );
}
