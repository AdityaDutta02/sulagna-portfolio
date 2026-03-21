// Portfolio data constants — typed source of truth for all dashboard components.

// ─── Tag ────────────────────────────────────────────────────────────────────

export interface Tag {
  text: string;
  bg: string;
  colour: string;
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export interface Badge {
  text: string;
  variant: 'gold' | 'cert' | 'location';
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

export interface Kpi {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  colour: string;
  barWidth: string;
  sparklineData: number[];
}

export const kpis: Kpi[] = [
  {
    id: 'report-speed',
    label: 'Report Speed',
    value: '70%',
    subtitle: 'faster generation at AlCircle',
    colour: 'var(--green)',
    barWidth: '70%',
    sparklineData: [40, 52, 38, 65, 58, 80, 88, 100],
  },
  {
    id: 'data-sources',
    label: 'Data Sources',
    value: '500+',
    subtitle: 'automated pipelines',
    colour: 'var(--amber)',
    barWidth: '95%',
    sparklineData: [30, 44, 60, 52, 78, 72, 90, 100],
  },
  {
    id: 'engagement',
    label: 'Engagement',
    value: '35%',
    subtitle: 'higher client engagement',
    colour: 'var(--blue)',
    barWidth: '35%',
    sparklineData: [22, 28, 32, 26, 30, 33, 32, 35],
  },
  {
    id: 'automation',
    label: 'Automation',
    value: '95%',
    subtitle: 'manual work eliminated',
    colour: 'var(--coral)',
    barWidth: '95%',
    sparklineData: [55, 68, 72, 78, 84, 88, 92, 95],
  },
];

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'live' | 'complete';

export interface Project {
  id: string;
  slug: string;
  name: string;
  status: ProjectStatus;
  statusLabel: string;
  colour: string;
  description: string;
  techStack: string[];
  reportId: string;
}

export const projects: Project[] = [
  {
    id: 'proj-aluminium',
    slug: 'aluminium-frp',
    name: 'Aluminium FRP Insights',
    status: 'live',
    statusLabel: 'Live',
    colour: 'var(--green)',
    description: 'Market intelligence dashboard for flat-rolled products',
    techStack: ['Power BI', 'DAX', 'ETL'],
    reportId: 'proj-aluminium',
  },
  {
    id: 'proj-crime',
    slug: 'london-crime',
    name: 'London Crime Analysis',
    status: 'complete',
    statusLabel: 'Viz',
    colour: 'var(--blue)',
    description: 'Tableau dashboard mapping crime patterns 2023-25',
    techStack: ['Tableau', 'Geospatial'],
    reportId: 'proj-crime',
  },
  {
    id: 'proj-mamba',
    slug: 'mambaBERT',
    name: 'MambaBERT',
    status: 'complete',
    statusLabel: 'ML',
    colour: 'var(--coral)',
    description: 'Hybrid SSM+BERT for long-text sentiment',
    techStack: ['Python', 'PyTorch', 'NLP'],
    reportId: 'proj-mamba',
  },
];

// ─── Skill ───────────────────────────────────────────────────────────────────

export interface Skill {
  name: string;
  icon: string;
  iconBg: string;
  proficiency: number;
  colour: string;
  bg: string;
}

export interface SkillGroup {
  groupLabel: string;
  skills: Skill[];
}

export const skills: SkillGroup[] = [
  {
    groupLabel: 'Visualization',
    skills: [
      {
        name: 'Power BI',
        icon: 'P',
        iconBg: 'var(--amber)',
        proficiency: 5,
        colour: 'var(--amber)',
        bg: 'var(--amber-glow)',
      },
      {
        name: 'Tableau',
        icon: 'T',
        iconBg: 'var(--coral)',
        proficiency: 4,
        colour: 'var(--coral)',
        bg: 'var(--coral-bg)',
      },
    ],
  },
  {
    groupLabel: 'Languages',
    skills: [
      {
        name: 'Python',
        icon: 'Py',
        iconBg: 'var(--green)',
        proficiency: 4,
        colour: 'var(--green)',
        bg: 'var(--green-bg)',
      },
      {
        name: 'SQL',
        icon: 'Q',
        iconBg: 'var(--blue)',
        proficiency: 5,
        colour: 'var(--blue)',
        bg: 'var(--blue-bg)',
      },
    ],
  },
  {
    groupLabel: 'AI & Productivity',
    skills: [
      {
        name: 'Excel/AI',
        icon: 'E',
        iconBg: 'var(--warm-brown)',
        proficiency: 4,
        colour: 'var(--warm-brown)',
        bg: 'rgba(107,93,74,0.08)',
      },
      {
        name: 'ML/DL',
        icon: 'M',
        iconBg: 'var(--plum)',
        proficiency: 3,
        colour: 'var(--plum)',
        bg: 'var(--plum-bg)',
      },
    ],
  },
];

// ─── Timeline ────────────────────────────────────────────────────────────────

export interface TimelineNode {
  role: string;
  org: string;
  date: string;
  description: string;
  tags: Tag[];
  colour: string;
  isActive: boolean;
}

export const timeline: TimelineNode[] = [
  {
    role: 'B.Sc. CS',
    org: 'Midnapore College',
    date: '2020-23',
    description: 'Gold Medalist, CGPA 9.29',
    tags: [{ text: 'GOLD MEDAL', bg: 'var(--green-bg)', colour: 'var(--green)' }],
    colour: 'var(--green)',
    isActive: false,
  },
  {
    role: 'M.Sc. CS',
    org: "St. Xavier's, Kolkata",
    date: '2023-25',
    description: 'ML specialization, MambaBERT research',
    tags: [{ text: 'PL-300', bg: 'var(--amber-glow)', colour: 'var(--amber)' }],
    colour: 'var(--amber)',
    isActive: false,
  },
  {
    role: 'Data Analyst Intern',
    org: 'Mechanismic',
    date: '2025',
    description: '500+ source automation, 60% email uplift',
    tags: [{ text: 'AUTOMATION', bg: 'var(--blue-bg)', colour: 'var(--blue)' }],
    colour: 'var(--blue)',
    isActive: false,
  },
  {
    role: 'Data Analyst',
    org: 'AlCircle',
    date: 'Jul 2025 — Now',
    description: 'Power BI dashboards, aluminium market intel',
    tags: [{ text: 'CURRENT', bg: 'var(--coral-bg)', colour: 'var(--coral)' }],
    colour: 'var(--coral)',
    isActive: false,
  },
  {
    role: 'Next: Your Team?',
    org: '',
    date: 'Open',
    description: 'Seeking upper management in data strategy',
    tags: [{ text: "LET'S TALK →", bg: 'var(--amber)', colour: '#fff' }],
    colour: 'var(--amber)',
    isActive: true,
  },
];

// ─── Certification ───────────────────────────────────────────────────────────

export interface Certification {
  text: string;
  dotColour: string;
}

export const certifications: Certification[] = [
  { text: 'Microsoft PL-300', dotColour: 'var(--amber)' },
  { text: 'Tata Data Viz', dotColour: 'var(--green)' },
  { text: 'Tata GenAI', dotColour: 'var(--blue)' },
  { text: 'Deloitte Analytics', dotColour: 'var(--coral)' },
  { text: 'NIELIT Big Data', dotColour: 'var(--plum)' },
];

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface Contact {
  email: string;
  linkedin: string;
  resumePath: string;
  calendarLink: string;
}

export const contact: Contact = {
  email: 'dey.sulagna01@gmail.com',
  linkedin: 'https://linkedin.com/in/sulagna-dey',
  resumePath: '/resume.pdf',
  calendarLink: '#book',
};

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  lastName: string;
  title: string;
  tagline: string;
  badges: Badge[];
}

export const profile: Profile = {
  name: 'Sulagna',
  lastName: 'Dey',
  title: 'Data Analyst',
  tagline: 'Data Analyst · Power BI Architect · Market Intelligence',
  badges: [
    { text: 'Gold Medalist', variant: 'gold' },
    { text: 'PL-300', variant: 'cert' },
    { text: 'Kolkata, IN', variant: 'location' },
  ],
};
