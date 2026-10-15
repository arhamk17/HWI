export interface WhatWeDoDeliverable {
  tag: string;
  detail: string;
}

export interface WhatWeDoCategory {
  id: 'hackathons' | 'workshops' | 'community' | 'industry' | 'research';
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: WhatWeDoDeliverable[];
  particleMode: 'grids' | 'connected' | 'groups' | 'geometric' | 'orbital';
}

export const WHAT_WE_DO_CATEGORIES: WhatWeDoCategory[] = [
  {
    id: 'hackathons',
    number: '01',
    title: 'HACKATHONS',
    tagline: 'High-Velocity Sprints & Prototypes',
    description: 'We orchestrate regional 24-hour hackathons pushing students to architect, test, and deploy production software under intense real-world constraints.',
    particleMode: 'grids',
    deliverables: [
      { tag: '24H EVENTS', detail: 'Nonstop high-velocity development, rapid prototyping, and cloud deployments.' },
      { tag: 'TEAM BUILDING', detail: 'Cross-functional squads pairing system architects with UI designers.' },
      { tag: 'REAL-WORLD PROBLEMS', detail: 'Direct problem statements from enterprise sponsors and open protocols.' },
      { tag: 'MENTORSHIP', detail: 'Live debugging rounds with senior engineers and domain mentors.' },
      { tag: 'PROJECT SHOWCASE', detail: 'Public stage demos and evaluation before industry evaluation panels.' },
    ],
  },
  {
    id: 'workshops',
    number: '02',
    title: 'WORKSHOPS',
    tagline: 'Applied Systems Engineering',
    description: 'Practical, code-first masterclasses covering modern developer ecosystems. No passive slide lectures — every student leaves with a deployed project.',
    particleMode: 'connected',
    deliverables: [
      { tag: 'AI & ML RUNTIMES', detail: 'Local LLM serving, RAG architectures, and fine-tuning pipelines.' },
      { tag: 'SMART CONTRACTS', detail: 'Solidity, EVM internals, cryptographic verification, and Foundry.' },
      { tag: 'DISTRIBUTED SYSTEMS', detail: 'Microservices, WebSockets, high-performance API gateaways, and caching.' },
      { tag: 'UI/UX CRAFT', detail: 'Design tokens, spatial typography, interactive shaders, and micro-animations.' },
    ],
  },
  {
    id: 'community',
    number: '03',
    title: 'COMMUNITY',
    tagline: 'Unified National Student Developer Network',
    description: 'Cultivating a persistent peer learning culture where curious beginners collaborate with senior builders to ship impactful open-source tools.',
    particleMode: 'groups',
    deliverables: [
      { tag: 'PEER COHORTS', detail: 'Weekly study groups focusing on algorithmic problems and systems design.' },
      { tag: 'CAMPUS AMBASSADORS', detail: 'Bridging developer chapters across universities nationwide.' },
      { tag: 'OPEN DISCORD SESSIONS', detail: 'Late night code reviews, project feedback, and portfolio critiques.' },
      { tag: 'HACKER HOUSE SUMMITS', detail: 'In-person project collaboration retreats for dedicated contributors.' },
    ],
  },
  {
    id: 'industry',
    number: '04',
    title: 'INDUSTRY',
    tagline: 'Direct Corporate & Venture Alliances',
    description: 'Connecting top student talent directly into tech companies, fast-growing startups, venture accelerators, and open-source foundations.',
    particleMode: 'geometric',
    deliverables: [
      { tag: 'FAST-TRACK HIRING', detail: 'Direct resume referrals and technical interview priority for winners.' },
      { tag: 'INFRASTRUCTURE CREDITS', detail: 'Access to enterprise cloud computing, GPUs, and developer tooling.' },
      { tag: 'VENTURE MENTORS', detail: 'Advising promising student hackathon prototypes toward seed stage.' },
      { tag: 'KEYNOTE ROUNDS', detail: 'Unfiltered technical talks from CTOs and engineering directors.' },
    ],
  },
  {
    id: 'research',
    number: '05',
    title: 'RESEARCH',
    tagline: 'Experimental Tech & Technical Publications',
    description: 'Investigating emerging paradigms at the intersection of AI agents, cryptography, decentralized storage, and compiler toolchains.',
    particleMode: 'orbital',
    deliverables: [
      { tag: 'WHITE PAPERS', detail: 'Publishing student-authored architectural benchmarks and technical reviews.' },
      { tag: 'EXPERIMENTAL LABS', detail: 'Incubating proof-of-concepts using zero-knowledge proofs and edge AI.' },
      { tag: 'SECURITY AUDITING', detail: 'Rigorous fuzz testing and formal verification of campus tools.' },
      { tag: 'OPEN SPECIFICATIONS', detail: 'Contributing RFCs and tooling to established open-source projects.' },
    ],
  },
];
