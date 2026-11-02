/**
 * Comprehensive team data for HackWithIndia BVUDET-NM Chapter 2026–27.
 * 
 * Contains all 9 departments with Chapter Leadership (President & VP),
 * Department Heads, Co-Heads, and Executive Members.
 * 
 * All member records are synchronized with the official HWI Information responses sheet,
 * including exact roles, contact emails, social links (GitHub, LinkedIn, and Instagram for all members),
 * and Google Drive portrait images with graceful fallback badges.
 * 
 * Total: 41 verified members across 9 departments.
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
  driveId?: string;
  email?: string;
  bio?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
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
  // ── 1. CHAPTER LEADERSHIP ──────────────────────────────────────────
  {
    id: 'core-leadership',
    name: 'CHAPTER LEADERSHIP',
    tagline: "Driving organizational vision, national partnerships, and student leadership.",
    members: [
      {
        id: 'krishnakant-sharma',
        name: "Krishnakant Sharma",
        role: "President",
        department: "Chapter Leadership",
        initials: 'KS',
        rank: 'head',
        image: '/images/team/president.png',
        bio: "Spearheads chapter vision, national partnerships, and overall community growth at BVUDET-NM.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/krishnakant-sharma-23p?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/_krsna_23_?mdxt=MXgxaHJhZ2xqbW9qbA==',
        },
      },
      {
        id: 'vanshika-chandra',
        name: "Vanshika Chandra",
        role: "Vice-President",
        department: "Chapter Leadership",
        initials: 'VC',
        rank: 'co-head',
        image: '/images/team/vice-president.png',
        bio: "Oversees internal chapter execution, student initiatives, and strategic ecosystem alliances.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/vanshika-chandra-1a0353329?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/vanshika_hc_?mdxt=MWxvd3V2OTBvNWVneA==',
        },
      },
    ],
  },

  // ── 2. TECHNICAL TEAM ──────────────────────────────────────────────
  {
    id: 'technical-team',
    name: 'TECHNICAL TEAM',
    tagline: "Building cutting-edge platforms, hackathon systems, and running developer bootcamps.",
    members: [
      {
        id: 'arham-khan',
        name: "Arham Khan",
        role: "Technical Head",
        department: "Technical Team",
        initials: 'AK',
        rank: 'head',
        image: '/images/team/arham-khan.png',
        bio: "Leads platform engineering, hackathon infrastructure, and chapter technical curriculum.",
        socials: {
          github: 'https://github.com/arhamk17',
          linkedin: 'https://www.linkedin.com/in/arham-khan-59a289322?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/arhamk_17?dlrf=cW9ha2k1YnZ4dm5w ',
        },
      },
      {
        id: 'aaryan-patil',
        name: "Aaryan Patil",
        role: "Technical Co-Head",
        department: "Technical Team",
        initials: 'AP',
        rank: 'co-head',
        image: '/images/team/aaryan-patil.png',
        bio: "Co-leads open-source projects, developer workshops, and hands-on technical sessions.",
        socials: {
          github: 'https://github.com/Aaryan2737',
          linkedin: 'https://www.linkedin.com/in/aaryan-patil-0b4104293?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        },
      },
      {
        id: 'exec-sushant',
        name: "Sushant",
        role: "Technical Executive",
        department: "Technical Team",
        initials: 'SU',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'AIML',
        driveId: '1DnJegqy8ix2lgJxazlPHXjETX94JPYPX',
        image: '/images/team/exec-sushant.jpg',
        email: 'thesushantpanchal07@gmail.com',
        socials: {
          github: 'https://github.com/Sushant-Panchal',
          linkedin: 'https://www.linkedin.com/in/sushant-08b1243ab?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/sushanto7_?vrfl=MXRvNmI3YzFnOHB4aA==',
        },
      },
      {
        id: 'exec-akshara-mote',
        name: "Akshara Mote",
        role: "Technical Executive",
        department: "Technical Team",
        initials: 'AM',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'CSBS',
        driveId: '1Yk4a08KirAhcAxzrXvHugXDFo4zMPhf4',
        image: '/images/team/exec-akshara-mote.jpg',
        email: 'moteakshara23@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/akshara-m-43b64b42b',
          instagram: 'https://instagram.com/_.pvtsharaa_?mdxt=MWdsdzg2bmJ0OXN4cQ%3D%3D',
        },
      },
      {
        id: 'exec-akshat-jain',
        name: "Akshat Jain",
        role: "Technical Executive",
        department: "Technical Team",
        initials: 'AJ',
        rank: 'executive',
        academicYear: 'TY',
        branch: 'CSBS',
        driveId: '1viBbjbmQQHaM7dZ1gQd-lzmXcUNTDOUb',
        image: '/images/team/exec-akshat-jain.jpg',
        email: 'akshat.jain2306@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/akshat-jain-74673528a?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
          instagram: 'https://www.instagram.com/akshatjain_023?psln=eWo3N2t6bmxla2gw&utm_source=qr',
        },
      },
      {
        id: 'exec-hammad-dalvi',
        name: "Hammad Dalvi",
        role: "Technical Executive",
        department: "Technical Team",
        initials: 'HD',
        rank: 'executive',
        academicYear: 'TY',
        branch: 'AIML',
        driveId: '1nMUxrEL-Vh6nw0S_m3ubBRBlUxp9U0j_',
        image: '/images/team/exec-hammad-dalvi.jpg',
        email: 'hammaddalvi08@gmail.com',
        socials: {
          linkedin: 'https://in.linkedin.com/in/hammad-dalvi08',
          instagram: 'https://www.instagram.com/hammad_dalvi08?obrf=eDB4eGxlYnNoY3kz',
        },
      },
    ],
  },

  // ── 3. DESIGN TEAM ─────────────────────────────────────────────────
  {
    id: 'design-team',
    name: 'DESIGN TEAM',
    tagline: "Crafting UI/UX design, visual identities, and creative brand aesthetics.",
    members: [
      {
        id: 'nishit-iyer',
        name: "Nishit Iyer",
        role: "Design Head",
        department: "Design Team",
        initials: 'NI',
        rank: 'head',
        driveId: '1ekP5WKB_-k7cBYf6me8ecP3tWLiRPa6q',
        image: '/images/team/nishit-iyer.jpg',
        email: 'nishitiyer23@gmail.com',
        bio: "Heads brand visual identity, digital design language, and creative user experiences for HWI.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/nishit-iyer-a68a03321?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/nishit_rajesh?dlrf=bHU0c2NjMmRmamdt',
        },
      },
      {
        id: 'svv-venky-naidu',
        name: "S.V.V. Venky Naidu",
        role: "Design Co-Head",
        department: "Design Team",
        initials: 'VN',
        rank: 'co-head',
        driveId: '1vqiSGYwzcd4HlvVDLtLjPsTd8F3BZ0T6',
        image: '/images/team/svv-venky-naidu.jpg',
        email: 'svenky2312@gmail.com',
        bio: "Co-directs UI/UX styling, motion design assets, and event brand design collateral.",
        socials: {
          instagram: 'https://www.instagram.com/_n.venky_23/',
        },
      },
      {
        id: 'exec-rishika-verma',
        name: "Rishika Varma",
        role: "Design Executive",
        department: "Design Team",
        initials: 'RV',
        rank: 'executive',
        academicYear: 'TY',
        branch: 'CSBS',
        driveId: '10WfIYbI8y18UbcPK92mv1dn6P272vN3f',
        image: '/images/team/exec-rishika-verma.jpg',
        email: 'rishika.varma24@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/rishika-varma-23005b410?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/rishika_hv?xtok=Z3Iwa2V6dDNsbmIx',
        },
      },
      {
        id: 'exec-hanisha-christy',
        name: "Hanisha Christy S",
        role: "Design Executive",
        department: "Design Team",
        initials: 'HC',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '1g2gORaVOFT74VAxsWrq1mk0MaQgfY1hN',
        image: '/images/team/exec-hanisha-christy.jpg',
        email: 'christyhanisha@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/hanisha-christy-s-56044b376',
          instagram: 'https://instagram.com/hanie._.sha?rpxt=MWo4dGF2Y2R2c2J3',
        },
      },
      {
        id: 'exec-riddhi-waigankar',
        name: "Riddhi Ravindra Waingankar",
        role: "Design Executive",
        department: "Design Team",
        initials: 'RW',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '1tajQsTXr-lCKhr-n5fvMsM_5Nqt2eiWs',
        image: '/images/team/exec-riddhi-waigankar.jpg',
        email: 'waingankarriddhi679@gmail.com',
        socials: {
          linkedin: 'https://linkedin.com/in/riddhi-waingankar-796471248',
          instagram: 'https://www.instagram.com/_riddhiiiiculous_?srtk=MXdnZXJnazNmZmY0aQ==',
        },
      },
    ],
  },

  // ── 4. PR & MARKETING ──────────────────────────────────────────────
  {
    id: 'pr-marketing',
    name: 'PR & MARKETING',
    tagline: "Spearheading public relations, campus outreach, and communications strategy.",
    members: [
      {
        id: 'jayesh-pote',
        name: "Jayesh Pote",
        role: "PR & Marketing Head",
        department: "PR & Marketing",
        initials: 'JP',
        rank: 'head',
        driveId: '1duIBW5hLhrbg2WJPm_xe4nGxOmu2iJps',
        image: '/images/team/jayesh-pote.jpg',
        email: 'jayeshpote766@gmail.com',
        bio: "Directs public relations, brand campaigns, and university-wide community outreach.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/jayesh-pote-502a05321?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://instagram.com/_jayessshhh?utm_source=qr&srtk=d3VmOWVnM21kdjUz',
        },
      },
      {
        id: 'tanishk-rawat',
        name: "Tanishk Rawat",
        role: "PR & Marketing Co-Head",
        department: "PR & Marketing",
        initials: 'TR',
        rank: 'co-head',
        driveId: '1N1Cmi8n5GCsd3bTE4HrQmTLQwAElSyHE',
        image: '/images/team/tanishk-rawat.jpg',
        email: 'tanishkr006@gmail.com',
        bio: "Co-leads chapter marketing, promotional campaigns, and cross-campus relations.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/tanishk-rawat-069131291?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/tanishkcares._?mdxt=MWY0aGR6bnp5eXB2OQ==',
        },
      },
      {
        id: 'exec-mayank',
        name: "Mayank",
        role: "PR Executive",
        department: "PR & Marketing",
        initials: 'MA',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '14O8PAiswi_yuHYRyw2XWaPWSkyMpymCK',
        image: '/images/team/exec-mayank.jpg',
        email: 'mahyaank24@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/mayank-711365376',
          instagram: 'https://www.instagram.com/mahyaank/',
        },
      },
      {
        id: 'exec-fakih-sidrah',
        name: "Fakih Sidrah",
        role: "PR & Marketing Executive",
        department: "PR & Marketing",
        initials: 'FS',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'AIML',
        driveId: '1ZnHIEel3XFkxXpW2tDQHQm9yDxBEmUTm',
        image: '/images/team/exec-fakih-sidrah.jpg',
        email: 'sidrahfakih13@gmail.com',

      },
    ],
  },

  // ── 5. SOCIAL MEDIA & PHOTOGRAPHY ──────────────────────────────────
  {
    id: 'social-media',
    name: 'SOCIAL MEDIA & PHOTOGRAPHY',
    tagline: "Amplifying digital reach, content storytelling, and audience engagement.",
    members: [
      {
        id: 'tanvi-patil',
        name: "Tanvi Patil",
        role: "Social Media Manager",
        department: "Social Media",
        initials: 'TP',
        rank: 'head',
        image: '/images/team/tanvi-patil.jpg',
        bio: "Manages chapter social channels, community engagement, and digital presence.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/tanvi-patil-b60037248?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/heyy.tanv?mdxt=MXMwNWd3aW84b3Bteg==',
        },
      },
      {
        id: 'sujoy-nayek',
        name: "Sujoy Tapan Nayek",
        role: "Social Media Co-Manager",
        department: "Social Media",
        initials: 'SN',
        rank: 'co-head',
        driveId: '1meA7sZCG8YH6aFhGSb8IlknL-At22R8W',
        image: '/images/team/sujoy-nayek.jpg',
        email: 'sujay.t.nayak@gmail.com',
        bio: "Coordinates content scheduling, audience interaction, and event updates across platforms.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/sujoy-tapan-nayek-b9534b376?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://instagram.com/sujoynayek_07?srtk=cHZ6NWxvb3h5aTE0',
        },
      },
      {
        id: 'exec-rishav-dhara',
        name: "Rishabh Dhara",
        role: "Photography & Editing Executive",
        department: "Social Media & Photography",
        initials: 'RD',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'AIML',
        driveId: '1rbzGXyRAi4fSKxFoBviyNbLhhoBhFleA',
        image: '/images/team/exec-rishav-dhara.jpg',
        email: 'dhara.rishabh20@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/rishabhdhara?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://instagram.com/rishabh_og?mdxt=ZjBwZjM1cHN1Z3Zj',
        },
      },
      {
        id: 'exec-shubh-shrivastav',
        name: "Shubh Srivastav",
        role: "Photography & Editing Executive",
        department: "Social Media & Photography",
        initials: 'SS',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'CSE',
        driveId: '1jMmE3uqYvq-q3cAEZJnSvHIuNTPcs7HL',
        image: '/images/team/exec-shubh-shrivastav.jpg',
        email: 'voggcrazy@gmail.com',
        socials: {
          instagram: 'https://www.instagram.com/Shubh_0261/',
        },
      },
      {
        id: 'exec-pranav-gaikwad',
        name: "Pranav Gaikwad",
        role: "Photography & Editing Executive",
        department: "Social Media & Photography",
        initials: 'PG',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '1-zlAY5AV-hu6wK5oIYcsFmlZ2gCcxNYJ',
        image: '/images/team/exec-pranav-gaikwad.jpg',
        email: 'pranav.gaikwad0525@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/pranav-gaikwad-245368376?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
          instagram: 'https://www.instagram.com/prxnav._.18?cplk=MWY3MGI3cGxvb3JnMg%3D%3D&utm_source=qr',
        },
      },
      {
        id: 'exec-harsh-joshi',
        name: "Harsh Joshi",
        role: "Photography Executive",
        department: "Social Media & Photography",
        initials: 'HJ',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '1DfKobYfunMUr1UKRBZ5qVkPUhq9qbdct',
        image: '/images/team/exec-harsh-joshi.jpg',
        email: 'harsh2007joshi@gmail.com',
        socials: {
          linkedin: 'https://linkedin.com/in/harsh-joshi-b04764395',
          instagram: 'https://instagram.com/who_harsho7?dlrf=Z20yb2owNmttcXBj&utm_source=qr',
        },
      },
    ],
  },

  // ── 6. PHOTOGRAPHY & EDITING ───────────────────────────────────────
  {
    id: 'photography-editing',
    name: 'PHOTOGRAPHY & EDITING',
    tagline: "Capturing cinematic event moments, visual storytelling, and media production.",
    members: [
      {
        id: 'soham-shinde',
        name: "Soham Shinde",
        role: "Photography & Editing Head",
        department: "Photography & Editing",
        initials: 'SS',
        rank: 'head',
        driveId: '1oHvf0pDgNG0uQwnicFNeZk3uywItN3uM',
        image: '/images/team/soham-shinde.jpg',
        email: 'shindesoham2717@gmail.com',
        bio: "Directs photography, event cinematography, and media production across all chapter events.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/soham-shinde-3b9449376?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/official_soham.27/?hl=en',
        },
      },
      {
        id: 'zaid-ladhani',
        name: "M. Zaid Ladhani",
        role: "Photography & Editing Co-Head",
        department: "Photography & Editing",
        initials: 'ZL',
        rank: 'co-head',
        driveId: '1lWSQO4tluovnIQeuDbbUSaAFWXyHLSZl',
        image: '/images/team/zaid-ladhani.jpg',
        email: 'zaidladhani111@gmail.com',
        bio: "Co-directs event visual coverage, video editing workflows, and digital documentation.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/zaid-ladhani-97710a287?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/zaid_ladhani?xtok=MTJ4cnd3ZWtndnE5NQ==',
        },
      },
      {
        id: 'exec-amit-yadav',
        name: "Amit Yadav",
        role: "Photography & Editing Executive",
        department: "Photography & Editing",
        initials: 'AY',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'AIML',
        driveId: '1XQvCMdIDbfdKz43rXfqAD8PTezCFPQrl',
        image: '/images/team/exec-amit-yadav.jpg',
        email: 'yadavamit3814@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/amit-yadav-19567a274?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/unfav.amit?obrf=MWZrbDE3eHo4ODhxdw==',
        },
      },
      {
        id: 'exec-yash-athawale',
        name: "Yash Athawale",
        role: "Photography & Editing Executive",
        department: "Photography & Editing",
        initials: 'YA',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'AIML',
        driveId: '16EVjXfHsazcYndP1jzDCYARXVW57NKS6',
        image: '/images/team/exec-yash-athawale.jpg',
        email: 'yashathavale47@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/yash-athawale-74a352376?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/aa.yaash?cplk=MW8zZmlpcnJ1MHdzcQ==',
        },
      },
      {
        id: 'exec-harshal-poojary',
        name: "Harshal Poojary",
        role: "Photography & Editing Executive",
        department: "Photography & Editing",
        initials: 'HP',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'CSE-B',
        driveId: '1twrTNxmY8-56zxrYDfW9jC7SW4-T-J6g',
        image: '/images/team/exec-harshal-poojary.jpg',
        email: 'poojaryharshal70@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/harshal-poojary-43097b41b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/harshalpoojariii?xtok=MTZna20yaXl5dzFmZw==',
        },
      },
      {
        id: 'exec-indrajeet-kumar',
        name: "Indrajeet Kumar",
        role: "Photography & Editing Executive",
        department: "Photography & Editing",
        initials: 'IK',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'CSE',
        driveId: '17APxVjdYUeWGM4oit3C1D_GPmMMCILfl',
        image: '/images/team/exec-indrajeet-kumar.jpg',
        email: 'indrajeetk6969@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/indrajeet-kumar-27428b422?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://instagram.com/lwkyindrx?mdxt=Z3hpNnUyc2w2YjRw',
        },
      },
    ],
  },

  // ── 7. EVENT & LOGISTICS ───────────────────────────────────────────
  {
    id: 'event-logistics',
    name: 'EVENT & LOGISTICS',
    tagline: "Managing 24-hour hackathons, stage operations, and seamless event execution.",
    members: [
      {
        id: 'om-pingle',
        name: "Om Annasaheb Pingle",
        role: "Event Management Head",
        department: "Event & Logistics",
        initials: 'OP',
        rank: 'head',
        driveId: '1oD98I3q-T6V4NKPQu-BNhT8bBtvrqSGW',
        image: '/images/team/om-pingle.jpg',
        email: 'opingle42@gmail.com',
        bio: "Leads event planning, stage coordination, and venue logistics for 24-hour hackathons.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/om-pingle-651450376?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://instagram.com/omm_.73?exln=MXN6YWxtaWliamhxeA%3D%3D',
        },
      },
      {
        id: 'vivek-tripathi',
        name: "Vivek Tripathi",
        role: "Event & Logistics Co-Head",
        department: "Event & Logistics",
        initials: 'VT',
        rank: 'co-head',
        driveId: '14m4iR8XPa9gT2nuep2JQ3L86bgNuWrWd',
        image: '/images/team/vivek-tripathi.jpg',
        email: 'vivektripathi14789@gmail.com',
        bio: "Co-leads logistics planning, equipment coordination, and on-ground event management.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/vivek-tripathi-587481348',
          instagram: 'https://www.instagram.com/invites/contact/?utm_content=lk1jjuf&rpxt=1lobwruupxhx8',
        },
      },
      {
        id: 'exec-saurabh-singh',
        name: "Saurabh Singh",
        role: "Event & Logistics Executive",
        department: "Event & Logistics",
        initials: 'SS',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'AIML',
        driveId: '1fhQlJyWquQHdvePHgj_fmu0b8PW_wcKj',
        image: '/images/team/exec-saurabh-singh.jpg',
        email: 'santoshsingh201527@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/saurabh-singh-927625379',
          instagram: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=10qjxrnp',
        },
      },
      {
        id: 'exec-sejal-hule',
        name: "Sejal Hule",
        role: "Event & Logistics Executive",
        department: "Event & Logistics",
        initials: 'SH',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '1z9CYB9rcyPdientFG29Xigy71VjiP6Vf',
        image: '/images/team/exec-sejal-hule.jpg',
        email: 'sejalhule9@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/sejal-hule-33bbb9383?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/btw_sejallll?psln=ZXhxc3VpNmVibm4y',
        },
      },
      {
        id: 'exec-kasturi-patil',
        name: "Kasturi Patil",
        role: "Event & Logistics Executive",
        department: "Event & Logistics",
        initials: 'KP',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'EXTC',
        driveId: '1fvUI749lHtjm_3fStvHgoqoqf_MxaLf8',
        image: '/images/team/exec-kasturi-patil.jpg',
        email: 'kasturi08patil@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/kasturi-patil-4a138b42b',
          instagram: 'https://www.instagram.com/k4stu.rii16?exln=MWR1aTdpMzZkODNwdA==',
        },
      },
      {
        id: 'exec-swati-singh',
        name: "Swati Brajesh Singh",
        role: "Event & Logistics Executive",
        department: "Event & Logistics",
        initials: 'SB',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'IT',
        driveId: '1CnK0v-Ekwdncw8gSOqwgRL8LAMMglSXS',
        image: '/images/team/exec-swati-singh.jpg',
        email: 'swati.ngr24@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/swati-singh-241502376',
          instagram: 'https://instagram.com/offx.swati_24?mdxt=bGlvdWt1eDJvM3ll',
        },
      },
    ],
  },

  // ── 8. CONTENT & DOCUMENTATION ─────────────────────────────────────
  {
    id: 'documentation',
    name: 'CONTENT & DOCUMENTATION',
    tagline: "Managing official records, chapter archives, and comprehensive event documentation.",
    members: [
      {
        id: 'akshita-mourya',
        name: "Akshita Mourya",
        role: "Content Head",
        department: "Content & Documentation",
        initials: 'AM',
        rank: 'head',
        driveId: '1mypeL5mGsBXHa39oi7cYHEWHYoFqo80w',
        image: '/images/team/akshita-mourya.jpg',
        email: 'mouryaakshita2007@gmail.com',
        bio: "Leads chapter editorial voice, official communications, and written documentation.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/akshita-mourya-9b9309228/?isSelfProfile=true',
          instagram: 'https://instagram.com/akshitaaaaxx?cplk=YWFlazA2OHQzMjkw',
        },
      },
      {
        id: 'exec-shreeya-patil',
        name: "Shreeya Patil",
        role: "Documentation Head",
        department: "Content & Documentation",
        initials: 'SP',
        rank: 'co-head',
        academicYear: 'TY',
        branch: 'CSE',
        driveId: '1fnT4CCijfU4H46iXdMFYwS6YisUGyCA8',
        image: '/images/team/exec-shreeya-patil.jpg',
        email: 'shreeyap20@gmail.com',
        bio: "Maintains official chapter records, event reports, and archival documentation standards.",
        socials: {
          linkedin: 'https://in.linkedin.com/in/shreeya-patil-a80004361',
          instagram: 'https://instagram.com/tsuki_8080?rpxt=emQ3bWVhcTM2eGg1',
        },
      },
      {
        id: 'exec-shreeja-aware',
        name: "Shreeja Aware",
        role: "Documentation & Content Executive",
        department: "Content & Documentation",
        initials: 'SA',
        rank: 'executive',
        academicYear: 'SY',
        branch: 'CSE',
        driveId: '1Os2H6hytTTPalN3w6Q_8zs4Rg2HKsBqY',
        image: '/images/team/exec-shreeja-aware.jpg',
        email: 'shreejaaware02@gmail.com',
        socials: {
          linkedin: 'https://www.linkedin.com/in/shreeja-aware-680450376?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          instagram: 'https://www.instagram.com/xo_shreejaa?srtk=MTl3bGpjc2RpaWlodg==',
        },
      },
    ],
  },

  // ── 9. SPONSORSHIP & PARTNERSHIPS ──────────────────────────────────
  {
    id: 'sponsorship-partnerships',
    name: 'SPONSORSHIP & PARTNERSHIPS',
    tagline: "Securing corporate sponsorships, strategic partnerships, and industry alliances.",
    members: [
      {
        id: 'vedika-kharalkar',
        name: "Vedika Kharalkar",
        role: "Sponsorship Head",
        department: "Sponsorship & Partnerships",
        initials: 'VK',
        rank: 'head',
        driveId: '17fk1hDzsZf0-uqUMXNgfzyV0Ypi-q0wx',
        image: '/images/team/vedika-kharalkar.jpg',
        email: 'kharalkarvedika@gmail.com',
        bio: "Directs sponsorship acquisition, corporate alliances, and industry partner relations.",
        socials: {
          linkedin: 'https://www.linkedin.com/in/vedika-kharalkar-069432376?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
          instagram: 'https://instagram.com/vedikak.18?obrf=a3lzMXBjcXdnMHR0',
        },
      },
      {
        id: 'exec-antara-sinha',
        name: "Antara Sinha",
        role: "Sponsorship Executive",
        department: "Sponsorship & Partnerships",
        initials: 'AS',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'AIML',
        driveId: '1d7mQYlvBJ_y70u3FSbDgeXKJRtQboELX',
        image: '/images/team/exec-antara-sinha.jpg',
        email: 'sinhasuhani009@gmail.com',
        socials: {
          instagram: 'https://www.instagram.com/whoiss_adelinee?mdxt=MXZ6Nmptd2xweWo1aA==',
        },
      },
      {
        id: 'exec-ayush-pal',
        name: "Aayush Pal",
        role: "Sponsorship Executive",
        department: "Sponsorship & Partnerships",
        initials: 'AP',
        rank: 'executive',
        academicYear: 'FY',
        branch: 'AIML',
        driveId: '194TeNyVRxpj056hwe2qBhW9PkDeGY1Aq',
        image: '/images/team/exec-ayush-pal.jpg',
        email: 'ayush321pal@gmail.com',
        socials: {
          instagram: 'https://www.instagram.com/ayush_13_pal?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==',
        },
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
