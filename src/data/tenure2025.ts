/**
 * =========================================================================
 * HWI CHAPTER TENURE 2025–26 DIRECTORY DATA
 * =========================================================================
 * 
 * You can edit member names, roles, departments, and photos directly in this file.
 * 
 * Image naming format:
 * - /images/team/deepbhai.jpeg (Technical Head)
 * - /images/team/des25.jpeg    (Design Head)
 * - /images/team/dis25.jpeg    (Event & Logistics / Discipline Head)
 * - /images/team/doc25.jpeg    (Content & Documentation Head)
 * - /images/team/photo25.jpeg  (Photography & Editing Head)
 * - /images/team/spon25.jpeg   (Sponsorship & Partnerships Head)
 */

export interface Tenure2025Member {
  id: string;
  name: string;        // Editable: Name of the leader/head
  role: string;        // Position / Designation (displayed below the name)
  department: string;  // Department affiliation
  category: 'leadership' | 'head';
  badge: string;       // HUD chip badge on top-right of the card
  initials: string;
  image?: string;      // Image path under public/
  socials?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

// ─── 1. EXECUTIVE COUNCIL (PRESIDENT & VICE PRESIDENT) ───────────────────
export const TENURE_2025_LEADERSHIP: Tenure2025Member[] = [
  {
    id: 'ayush-pandey',
    name: 'Ayush Pandey',
    role: 'Chapter President (2025–26)',
    department: 'Chapter Leadership',
    category: 'leadership',
    badge: 'PRESIDENT',
    initials: 'AP',
    image: '/images/team/vicechair.jpeg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ayush-pandey-2005/',
    },
  },
  {
    id: 'ansh-verma',
    name: 'Ansh Verma',
    role: 'Vice-President (2025–26)',
    department: 'Chapter Leadership',
    category: 'leadership',
    badge: 'VICE-PRESIDENT',
    initials: 'AV',
    image: '/images/team/ansh_u3cnux.jpg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ansh-verma-0414a3290/',
    },
  },
];

// ─── 2. DEPARTMENT HEADS (8 OPERATIONAL DEPARTMENTS) ─────────────────────
// You can directly edit the 'name' field for each head below:
export const TENURE_2025_HEADS: Tenure2025Member[] = [
  {
    id: 'head-technical',
    name: 'Deepanshu Ghosalkar', // Edit name here
    role: 'Technical Head',
    department: 'Technical Team',
    category: 'head',
    badge: 'TECHNICAL',
    initials: 'DG',
    image: '/images/team/deepbhai.jpeg',
  },
  {
    id: 'head-design',
    name: 'Ravikishan Singh', // Edit name here
    role: 'Design Head',
    department: 'Design Team',
    category: 'head',
    badge: 'DESIGN',
    initials: 'RS',
    image: '/images/team/des25.jpeg',
  },
  {
    id: 'head-event-logistics',
    name: 'Khushi Chowta', // Edit name here (dis25)
    role: 'Event & Logistics Head',
    department: 'Event & Logistics',
    category: 'head',
    badge: 'EVENT & LOGISTICS',
    initials: 'KC',
    image: '/images/team/dis25.jpeg',
  },
  {
    id: 'head-documentation',
    name: 'Akanksha Mishra', // Edit name here
    role: 'Content & Documentation Head',
    department: 'Content & Documentation',
    category: 'head',
    badge: 'DOCUMENTATION',
    initials: 'AM',
    image: '/images/team/doc25.jpeg',
  },
  {
    id: 'head-photography-editing',
    name: 'Aryan Naik', // Edit name here
    role: 'Photography & Editing Head',
    department: 'Photography & Editing',
    category: 'head',
    badge: 'PHOTOGRAPHY',
    initials: 'AN',
    image: '/images/team/AN.jpeg',
  },
  {
    id: 'head-sponsorship-partnerships',
    name: 'Krishnakanth Sharma', // Edit name here
    role: 'Sponsorship Head',
    department: 'Sponsorship & Partnerships',
    category: 'head',
    badge: 'SPONSORSHIP',
    initials: 'KK',
    image: '/images/team/spon25.jpeg',
  },
  {
    id: 'head-pr-marketing',
    name: 'Khushi Borhade', // Edit name here
    role: 'PR & Marketing Head',
    department: 'PR & Marketing',
    category: 'head',
    badge: 'PR & MARKETING',
    initials: 'KB',
    image: '/images/team/KB.jpeg', // Drop pr25.jpeg into public/images/team/ when ready
  },
  {
    id: 'head-social-media',
    name: 'Atharva Achare', // Edit name here
    role: 'Social Media Head',
    department: 'Social Media & Photography',
    category: 'head',
    badge: 'SOCIAL MEDIA',
    initials: 'AA',
    image: '/images/team/photo25.jpeg', // Drop social25.jpeg into public/images/team/ when ready
  },
];
