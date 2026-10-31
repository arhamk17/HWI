/**
 * Faculty Coordinator and Chapter Mentors data for HackWithIndia BVUDET-NM.
 * Includes 1 Faculty Coordinator and 2 Chapter Mentors (Former 2025-26 Leadership).
 */

export interface FacultyMentorMember {
  id: string;
  name: string;
  role: string;
  category: 'coordinator' | 'mentor';
  categoryLabel: string;
  tag: string;
  image?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export const FACULTY_COORDINATORS: FacultyMentorMember[] = [
  {
    id: 'prof-ahmer-usmani',
    name: 'Prof. Ahmer Usmani',
    role: 'Faculty Coordinator',
    category: 'coordinator',
    categoryLabel: 'FACULTY COORDINATOR',
    tag: 'FACULTY COORDINATOR',
    image: '/images/team/2026frt_Ahmer-Usmani.jpg',
  },
];

export const STUDENT_MENTORS: FacultyMentorMember[] = [
  {
    id: 'ayush-pandey',
    name: 'Ayush Pandey',
    role: 'Chapter Mentor · Former President (2025–26)',
    category: 'mentor',
    categoryLabel: 'CHAPTER MENTOR',
    tag: 'TENURE 2025–26',
    image: '/images/team/vicechair.jpeg',
  },
  {
    id: 'ansh-verma',
    name: 'Ansh Verma',
    role: 'Chapter Mentor · Former Vice President (2025–26)',
    category: 'mentor',
    categoryLabel: 'CHAPTER MENTOR',
    tag: 'TENURE 2025–26',
    image: '/images/team/ansh_u3cnux.jpg',
  },
];

export const ALL_FACULTY_MENTORS: FacultyMentorMember[] = [
  ...FACULTY_COORDINATORS,
  ...STUDENT_MENTORS,
];
