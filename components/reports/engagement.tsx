import { ImpactCard } from '@/components/drill-through/impact-card';
import { KpiRow, type KpiRowItem } from '@/components/drill-through/kpi-row';

const metrics: KpiRowItem[] = [
  { label: 'Report Open Rate', value: '78%', colour: 'var(--blue)', delta: '↑ from 52%', deltaUp: true },
  { label: 'Avg. Time on Report', value: '4.2m', colour: 'var(--amber)', delta: '↑ from 1.8m', deltaUp: true },
  { label: 'Client Retention', value: '92%', colour: 'var(--green)', delta: '↑ from 80%', deltaUp: true },
];

export function Engagement() {
  return (
    <div data-testid="report-engagement">
      <ImpactCard value="35%" colour="var(--blue)" description="Higher client engagement driven by monthly industry reports with interactive visualisations and actionable market intelligence." />
      <KpiRow items={metrics} />
    </div>
  );
}
