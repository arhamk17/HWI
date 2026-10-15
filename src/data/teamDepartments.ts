/**
 * Comprehensive team data for HackWithIndia BVUDET-NM Chapter 2026–27.
 * 
 * Contains all 9 departments with Chapter Core Team leadership (Heads & Co-Heads)
 * and all respective Executive Members with their academic years and branches.
 * 
 * Total: 17 Core Team Leadership entries + 24 Executive Members (+ Head of Documentation) = 41 members.
 */

export interface DepartmentMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  rank: 'head' | 'co-head' | 'executive';
  department: string;
  academicYear?: string;
  branch?: string;
  image?: string;
  bio?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  members: DepartmentMember[]; // Ordered: Head first, then Co-Head (if any), then Executive Members
}

export const DEPARTMENTS: Department[] = [
  // ── 1. CHAPTER LEADERSHIP ───────────────────────────────────────
  {
    id: 'core-leadership',
    name: 'CHAPTER LEADERSHIP',
    tagline: 'Driving organizational vision, national partnerships, and student leadership.',
    members: [
      {
        id: 'krishnakant-sharma',
        name: 'Krishnakant Sharma',
        role: 'President',
        department: 'Chapter Leadership',
        initials: 'KS',
        rank: 'head',
        bio: 'Spearheads chapter vision, national partnerships, and overall community growth at BVUDET-NM.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'vanshika-chandra',
        name: 'Vanshika Chandra',
        role: 'Vice-President',
        department: 'Chapter Leadership',
        initials: 'VC',
        rank: 'co-head',
        bio: 'Oversees internal chapter execution, student initiatives, and strategic ecosystem alliances.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
    ],
  },

  // ── 2. TECHNICAL TEAM ──────────────────────────────────────────
  {
    id: 'technical-team',
    name: 'TECHNICAL TEAM',
    tagline: 'Building cutting-edge platforms, hackathon systems, and running developer bootcamps.',
    members: [
      {
        id: 'arham-khan',
        name: 'Arham Khan',
        role: 'Technical Head',
        department: 'Technical Team',
        initials: 'AK',
        rank: 'head',
        bio: 'Leads platform engineering, hackathon infrastructure, and chapter technical curriculum.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'aaryan-patil',
        name: 'Aaryan Patil',
        role: 'Technical Co-Head',
        department: 'Technical Team',
        initials: 'AP',
        rank: 'co-head',
        bio: 'Co-leads open-source projects, developer workshops, and hands-on technical sessions.',
        socials: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-sushant',
        name: 'Sushant',
        role: 'Executive Member',
        department: 'Technical Team',
        academicYear: 'FY',
        branch: 'AIML',
        initials: 'SU',
        rank: 'executive',
      },
      {
        id: 'exec-akshara-mote',
        name: 'Akshara Mote',
        role: 'Executive Member',
        department: 'Technical Team',
        academicYear: 'FY',
        branch: 'CSBS',
        initials: 'AM',
        rank: 'executive',
      },
      {
        id: 'exec-akshat-jain',
        name: 'Akshat Jain',
        role: 'Executive Member',
        department: 'Technical Team',
        academicYear: 'TY',
        branch: 'CSBS',
        initials: 'AJ',
        rank: 'executive',
      },
      {
        id: 'exec-hammad-dalvi',
        name: 'Hammad Dalvi',
        role: 'Executive Member',
        department: 'Technical Team',
        academicYear: 'TY',
        branch: 'AIML',
        initials: 'HD',
        rank: 'executive',
      },
    ],
  },

  // ── 3. DESIGN TEAM ─────────────────────────────────────────────
  {
    id: 'design-team',
    name: 'DESIGN TEAM',
    tagline: 'Crafting UI/UX design, visual identities, and creative brand aesthetics.',
    members: [
      {
        id: 'nishit-iyer',
        name: 'Nishit Iyer',
        role: 'Design Head',
        department: 'Design Team',
        initials: 'NI',
        rank: 'head',
        bio: 'Heads brand visual identity, digital design language, and creative user experiences for HWI.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'venky-naidu',
        name: 'Venky Naidu',
        role: 'Design Co-Head',
        department: 'Design Team',
        initials: 'VN',
        rank: 'co-head',
        bio: 'Co-directs UI/UX styling, motion design assets, and event brand design collateral.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-hanisha-christy',
        name: 'Hanisha Christy',
        role: 'Executive Member',
        department: 'Design Team',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'HC',
        rank: 'executive',
      },
      {
        id: 'exec-riddhi-waigankar',
        name: 'Riddhi Waigankar',
        role: 'Executive Member',
        department: 'Design Team',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'RW',
        rank: 'executive',
      },
      {
        id: 'exec-rishika-verma',
        name: 'Rishika Verma',
        role: 'Executive Member',
        department: 'Design Team',
        academicYear: 'TY',
        branch: 'CSBS',
        initials: 'RV',
        rank: 'executive',
      },
    ],
  },

  // ── 4. PR & MARKETING ──────────────────────────────────────────
  {
    id: 'pr-marketing',
    name: 'PR & MARKETING',
    tagline: 'Spearheading public relations, campus outreach, and communications strategy.',
    members: [
      {
        id: 'jayesh-pote',
        name: 'Jayesh Pote',
        role: 'PR & Marketing Head',
        department: 'PR & Marketing',
        initials: 'JP',
        rank: 'head',
        bio: 'Directs public relations, brand campaigns, and university-wide community outreach.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'tanishk-rawat',
        name: 'Tanishk Rawat',
        role: 'PR & Marketing Co-Head',
        department: 'PR & Marketing',
        initials: 'TR',
        rank: 'co-head',
        bio: 'Co-leads chapter marketing, promotional campaigns, and cross-campus relations.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-mayank',
        name: 'Mayank',
        role: 'Executive Member',
        department: 'PR & Marketing',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'MA',
        rank: 'executive',
      },
      {
        id: 'exec-sidra',
        name: 'Sidra',
        role: 'Executive Member',
        department: 'PR & Marketing',
        academicYear: 'FY',
        branch: 'AIML',
        initials: 'SI',
        rank: 'executive',
      },
    ],
  },

  // ── 5. SOCIAL MEDIA & PHOTOGRAPHY ──────────────────────────────
  {
    id: 'social-media',
    name: 'SOCIAL MEDIA & PHOTOGRAPHY',
    tagline: 'Amplifying digital reach, content storytelling, and audience engagement.',
    members: [
      {
        id: 'tanvi-patil',
        name: 'Tanvi Patil',
        role: 'Social Media Manager',
        department: 'Social Media',
        initials: 'TP',
        rank: 'head',
        bio: 'Manages chapter social channels, community engagement, and digital presence.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'sujoy-nayek',
        name: 'Assistant Social Media Manager',
        role: 'Assistant Social Media Manager',
        department: 'Social Media',
        initials: 'SN',
        rank: 'co-head',
        bio: 'Coordinates content scheduling, audience interaction, and event updates across platforms.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-rishav-dhara',
        name: 'Rishav Dhara',
        role: 'Executive Member',
        department: 'Social Media & Photography',
        academicYear: 'FY',
        branch: 'AIML',
        initials: 'RD',
        rank: 'executive',
      },
      {
        id: 'exec-shubh-shrivastav',
        name: 'Shubh Shrivastav',
        role: 'Executive Member',
        department: 'Social Media & Photography',
        academicYear: 'FY',
        branch: 'CSE',
        initials: 'SS',
        rank: 'executive',
      },
      {
        id: 'exec-pranav-gaikwad',
        name: 'Pranav Gaikwad',
        role: 'Executive Member',
        department: 'Social Media & Photography',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'PG',
        rank: 'executive',
      },
      {
        id: 'exec-harsh-joshi',
        name: 'Harsh Joshi',
        role: 'Executive Member',
        department: 'Social Media & Photography',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'HJ',
        rank: 'executive',
      },
    ],
  },

  // ── 6. PHOTOGRAPHY & EDITING ───────────────────────────────────
  {
    id: 'photography-editing',
    name: 'PHOTOGRAPHY & EDITING',
    tagline: 'Capturing cinematic event moments, visual storytelling, and media production.',
    members: [
      {
        id: 'soham-shinde',
        name: 'Soham Shinde',
        role: 'Photography & Editing Head',
        department: 'Photography & Editing',
        initials: 'SS',
        rank: 'head',
        bio: 'Directs photography, event cinematography, and media production across all chapter events.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'zaid-ladhani',
        name: 'Zaid Ladhani',
        role: 'Photography & Editing Co-Head',
        department: 'Photography & Editing',
        initials: 'ZL',
        rank: 'co-head',
        bio: 'Co-directs event visual coverage, video editing workflows, and digital documentation.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-amit-yadav',
        name: 'Amit Yadav',
        role: 'Executive Member',
        department: 'Editing',
        academicYear: 'FY',
        branch: 'AIML',
        initials: 'AY',
        rank: 'executive',
      },
      {
        id: 'exec-yash-athawale',
        name: 'Yash Athawale',
        role: 'Executive Member',
        department: 'Editing',
        academicYear: 'SY',
        branch: 'AIML',
        initials: 'YA',
        rank: 'executive',
      },
      {
        id: 'exec-harshal-poojary',
        name: 'Harshal Poojary',
        role: 'Executive Member',
        department: 'Editing',
        academicYear: 'FY',
        branch: 'CSE',
        initials: 'HP',
        rank: 'executive',
      },
      {
        id: 'exec-indrajeet-kumar',
        name: 'Indrajeet Kumar',
        role: 'Executive Member',
        department: 'Editing',
        academicYear: 'FY',
        branch: 'CSE',
        initials: 'IK',
        rank: 'executive',
      },
    ],
  },

  // ── 7. EVENT & LOGISTICS ───────────────────────────────────────
  {
    id: 'event-logistics',
    name: 'EVENT & LOGISTICS',
    tagline: 'Managing 24-hour hackathons, stage operations, and seamless event execution.',
    members: [
      {
        id: 'om-pingle',
        name: 'Om Pingle',
        role: 'Event & Logistics Head',
        department: 'Event & Logistics',
        initials: 'OP',
        rank: 'head',
        bio: 'Leads event planning, stage coordination, and venue logistics for 24-hour hackathons.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'vivek-tripathi',
        name: 'Vivek Tripathi',
        role: 'Event & Logistics Co-Head',
        department: 'Event & Logistics',
        initials: 'VT',
        rank: 'co-head',
        bio: 'Co-leads logistics planning, equipment coordination, and on-ground event management.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-saurabh-singh',
        name: 'Saurabh Singh',
        role: 'Executive Member',
        department: 'Event & Logistics',
        academicYear: 'SY',
        branch: 'AIML',
        initials: 'SS',
        rank: 'executive',
      },
      {
        id: 'exec-sejal-hule',
        name: 'Sejal Hule',
        role: 'Executive Member',
        department: 'Event & Logistics',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'SH',
        rank: 'executive',
      },
      {
        id: 'exec-kasturi-patil',
        name: 'Kasturi Patil',
        role: 'Executive Member',
        department: 'Event & Logistics',
        academicYear: 'FY',
        branch: 'EXTC',
        initials: 'KP',
        rank: 'executive',
      },
      {
        id: 'exec-swati-singh',
        name: 'Swati Singh',
        role: 'Executive Member',
        department: 'Event & Logistics',
        academicYear: 'SY',
        branch: 'IT',
        initials: 'SW',
        rank: 'executive',
      },
    ],
  },

  // ── 8. CONTENT & DOCUMENTATION ─────────────────────────────────
  {
    id: 'documentation',
    name: 'CONTENT & DOCUMENTATION',
    tagline: 'Managing official records, chapter archives, and comprehensive event documentation.',
    members: [
      {
        id: 'akshita-mourya',
        name: 'Akshita Mourya',
        role: 'Documentation Head',
        department: 'Documentation',
        initials: 'AM',
        rank: 'head',
        bio: 'Maintains official chapter records, event reports, and archival documentation standards.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-shreeya-patil',
        name: 'Shreeya Patil',
        role: 'Head of Documentation',
        department: 'Content & Documentation',
        academicYear: 'TY',
        branch: 'CSE',
        initials: 'SP',
        rank: 'co-head',
        bio: 'Oversees documentation writing, editorial standards, and official reports.',
      },
      {
        id: 'exec-shreeja-aware',
        name: 'Shreeja Aware',
        role: 'Executive Member',
        department: 'Content & Documentation',
        academicYear: 'SY',
        branch: 'CSE',
        initials: 'SA',
        rank: 'executive',
      },
    ],
  },

  // ── 9. SPONSORSHIP & PARTNERSHIPS ──────────────────────────────
  {
    id: 'sponsorship-partnerships',
    name: 'SPONSORSHIP & PARTNERSHIPS',
    tagline: 'Securing corporate sponsorships, strategic partnerships, and industry alliances.',
    members: [
      {
        id: 'vedika-kharalkar',
        name: 'Vedika Kharalkar',
        role: 'Sponsorship & Partnerships Head',
        department: 'Sponsorship & Partnerships',
        initials: 'VK',
        rank: 'head',
        bio: 'Directs sponsorship acquisition, corporate alliances, and industry partner relations.',
        socials: { linkedin: 'https://linkedin.com' },
      },
      {
        id: 'exec-antara-sinha',
        name: 'Antara Sinha',
        role: 'Executive Member',
        department: 'Sponsorship & Partnerships',
        academicYear: 'FY',
        branch: 'AIML',
        initials: 'AS',
        rank: 'executive',
      },
      {
        id: 'exec-ayush-pal',
        name: 'Ayush Pal',
        role: 'Executive Member',
        department: 'Sponsorship & Partnerships',
        academicYear: 'FY',
        branch: 'AIML',
        initials: 'AP',
        rank: 'executive',
      },
    ],
  },
];

// Flat lists for exports and helpers
export const ALL_TEAM_MEMBERS: DepartmentMember[] = DEPARTMENTS.flatMap((dept) => dept.members);

export const CORE_LEADERS: DepartmentMember[] = ALL_TEAM_MEMBERS.filter(
  (m) => m.rank === 'head' || m.rank === 'co-head'
);

export const EXECUTIVE_MEMBERS: DepartmentMember[] = ALL_TEAM_MEMBERS.filter(
  (m) => m.rank === 'executive'
);
