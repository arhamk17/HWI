import {
  DEPARTMENTS,
  ALL_TEAM_MEMBERS as RAW_ALL_MEMBERS,
  DepartmentMember,
} from './teamDepartments';

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  department: string;
  initials: string;
  image?: string;
  driveId?: string;
  email?: string;
  bio?: string;
  academicYear?: string;
  branch?: string;
  achievements?: string[];
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface TeamGroup {
  category: string;
  tagline: string;
  members: TeamMemberData[];
}

export const TEAM_GROUPS: TeamGroup[] = DEPARTMENTS.map((dept) => ({
  category: dept.name,
  tagline: dept.tagline,
  members: dept.members.map((m: DepartmentMember) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    department: m.department,
    initials: m.initials,
    image: m.image,
    driveId: m.driveId,
    email: m.email,
    bio: m.bio,
    academicYear: m.academicYear,
    branch: m.branch,
    socials: m.socials,
  })),
}));

export const ALL_TEAM_MEMBERS: TeamMemberData[] = RAW_ALL_MEMBERS.map((m) => ({
  id: m.id,
  name: m.name,
  role: m.role,
  department: m.department,
  initials: m.initials,
  image: m.image,
  driveId: m.driveId,
  email: m.email,
  bio: m.bio,
  academicYear: m.academicYear,
  branch: m.branch,
  socials: m.socials,
}));
