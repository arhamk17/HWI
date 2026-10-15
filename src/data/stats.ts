export interface StatItem {
  id: string;
  targetValue: number;
  suffix: string;
  label: string;
  sublabel: string;
  description: string;
}

export const HWI_STATS: StatItem[] = [
  {
    id: 'events',
    targetValue: 24,
    suffix: '+',
    label: 'EVENTS',
    sublabel: 'FLAGSHIPS & SPRINTS',
    description: 'High-intensity hackathons, engineering bootcamps, and technical tours.',
  },
  {
    id: 'participants',
    targetValue: 2400,
    suffix: '+',
    label: 'PARTICIPANTS',
    sublabel: 'STUDENT BUILDERS',
    description: 'Students and developers engaged across HWI events and chapters nationwide.',
  },
  {
    id: 'projects',
    targetValue: 180,
    suffix: '+',
    label: 'PROJECTS',
    sublabel: 'SHIPPED TO PRODUCTION',
    description: 'Production-ready tools, decentralized applications, and full-stack solutions.',
  },
  {
    id: 'mentors',
    targetValue: 35,
    suffix: '+',
    label: 'MENTORS',
    sublabel: 'INDUSTRY ARCHITECTS',
    description: 'Staff engineers, tech founders, and open-source contributors guiding cohorts.',
  },
];
