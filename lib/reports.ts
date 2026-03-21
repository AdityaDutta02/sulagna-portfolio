import type { ComponentType } from 'react';
import { ReportSpeed } from '@/components/reports/report-speed';
import { DataSources } from '@/components/reports/data-sources';
import { Engagement } from '@/components/reports/engagement';
import { Automation } from '@/components/reports/automation';
import { ProjAluminium } from '@/components/reports/proj-aluminium';
import { ProjCrime } from '@/components/reports/proj-crime';
import { ProjMamba } from '@/components/reports/proj-mamba';

export interface ReportEntry {
  title: string;
  breadcrumb: string;
  component: ComponentType;
}

export const reports: Record<string, ReportEntry> = {
  'report-speed': {
    title: 'Report Generation Speed',
    breadcrumb: 'Dashboard › KPIs › Report Speed',
    component: ReportSpeed,
  },
  'data-sources': {
    title: 'Automated Data Pipeline',
    breadcrumb: 'Dashboard › KPIs › Data Sources',
    component: DataSources,
  },
  engagement: {
    title: 'Client Engagement Impact',
    breadcrumb: 'Dashboard › KPIs › Engagement',
    component: Engagement,
  },
  automation: {
    title: 'Workflow Automation',
    breadcrumb: 'Dashboard › KPIs › Automation',
    component: Automation,
  },
  'proj-aluminium': {
    title: 'Aluminium FRP Insights',
    breadcrumb: 'Dashboard › Projects › Aluminium FRP',
    component: ProjAluminium,
  },
  'proj-crime': {
    title: 'London Crime Visualisation',
    breadcrumb: 'Dashboard › Projects › London Crime',
    component: ProjCrime,
  },
  'proj-mamba': {
    title: 'MambaBERT',
    breadcrumb: 'Dashboard › Projects › MambaBERT',
    component: ProjMamba,
  },
};
