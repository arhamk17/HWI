export interface EventImage {
  id: string;
  title: string;
  caption: string;
  tag: string;
  cameraInfo?: string;
  composition?: 'wide' | 'portrait';
  aspectRatio?: string;
  hudGraphicType?: 'grid' | 'circuit' | 'terminal' | 'nodes' | 'waveform' | 'radar';
  src?: string;
}

export interface EventProject {
  name: string;
  creator: string;
  description: string;
  tag: string;
}

export interface EventWinner {
  place: string;
  team: string;
  project: string;
  prize?: string;
}

export interface EventSpeaker {
  name: string;
  role: string;
  company?: string;
  placeholderLabel?: string;
}

export interface EventItem {
  id: string;
  title: string;
  shortTitle?: string;
  year: '2026' | '2025';
  edition?: string;
  date: string;
  category: 'HACKATHONS' | 'WORKSHOPS' | 'COMMUNITY' | 'OTHER';
  theme: string;
  venue: string;
  location: string; // backwards compatibility
  duration: string;
  participants: number | string;
  projectsCount: number | string;
  status: 'upcoming' | 'past';
  badge: string;
  desc: string;
  shortDescription?: string;
  description?: string;
  fullDescription: string;
  highlights: string[];
  images: EventImage[];
  accentColor?: string;
  hudGraphicType?: 'grid' | 'circuit' | 'terminal' | 'nodes' | 'waveform' | 'radar';
  ctaLabel?: string;
  ctaUrl?: string;
  cardImage?: string;
  videoUrl?: string;
  videoPoster?: string;
  heroImage?: string;
  winners?: EventWinner[];
  featuredProjects?: EventProject[];
  speakers?: EventSpeaker[];
}

export const EVENTS_DATA: EventItem[] = [
  // 1. HackWithIndia - BVUDET Learn IT Tour — 16 July 2025
  {
    id: 'learn-it-tour',
    title: 'HACKWITHINDIA - BVUDET LEARN IT TOUR',
    shortTitle: 'LEARN IT TOUR',
    year: '2025',
    edition: 'COMMUNITY TOUR 2025',
    date: '16 JULY 2025',
    category: 'COMMUNITY',
    theme: 'Tech Ecosystem Trends, Open Source & Career Growth',
    venue: 'Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai',
    location: 'Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai',
    duration: '10:00 AM – 3:00 PM (5 Hours)',
    participants: '220 Builders',
    projectsCount: '3 Keynotes & Mentorship',
    status: 'past',
    badge: 'COMMUNITY TECH TOUR',
    desc: 'Organized in collaboration with Devnovate, the Learn IT Tour brought together 220 students from across Maharashtra for practical sessions on entrepreneurship, open source, and UX design.',
    shortDescription: 'Organized in collaboration with Devnovate, the Learn IT Tour brought together 220 students from across Maharashtra for practical sessions on entrepreneurship, open source, and UX design.',
    description: 'The HackWithIndia-BVUDET Learn IT Tour was successfully conducted on 16th July 2025 at Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai. Organized in collaboration with Devnovate, the event witnessed the enthusiastic participation of 220 students from all over Maharashtra. It provided a vibrant platform for learning, networking, and innovation while building visibility within the tech community. Featuring distinguished speaker sessions, interactive Q&A rounds, and exciting giveaways, the tour empowered students with practical insights into real-world applications of technology.',
    fullDescription: 'The HackWithIndia-BVUDET Learn IT Tour was successfully conducted on 16th July 2025 at Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai. Organized in collaboration with Devnovate, the event witnessed the enthusiastic participation of 220 students from all over Maharashtra. It provided a vibrant platform for learning, networking, and innovation while building visibility within the tech community. Featuring distinguished speaker sessions, interactive Q&A rounds, and exciting giveaways, the tour empowered students with practical insights into real-world applications of technology.',
    accentColor: '#A855F7',
    hudGraphicType: 'nodes',
    cardImage: '/images/events/learn_it_tour_image4.png',
    heroImage: '/images/events/learn_it_tour_image4.png',
    ctaLabel: 'EXPLORE DOSSIER',
    ctaUrl: '#editorial-story',
    highlights: [
      '220 active student participants representing engineering colleges across Maharashtra',
      'Distinguished sessions by Yash Mohite (CEO, DevTech), Vikas Kumar Yadav (EigenLayer), and Saurabh Saini (PW Skills)',
      'Hands-on guidance on open-source contributions, GitHub Campus programs, and UI/UX strategy',
      'High-energy interactive Q&A rounds and technical merchandise giveaways for student builders',
    ],
    speakers: [
      { name: 'Yash Mohite', role: 'CEO, DevTech IT Solutions & Event Lead, HackWithIndia', company: 'DevTech / HWI' },
      { name: 'Vikas Kumar Yadav', role: 'EigenAlpha, EigenLayer & GitHub Campus Expert', company: 'EigenLayer / GitHub' },
      { name: 'Saurabh Saini', role: 'Program Director, PW Skills & Sr. UX Designer', company: 'PW Skills' },
    ],
    images: [
      {
        id: 'lit-img-1',
        title: 'MAIN AUDITORIUM // INAUGURATION',
        caption: 'Over 220 students gathered in the central auditorium for the Learn IT Tour keynote',
        tag: 'AUDITORIUM / 10:00 AM',
        cameraInfo: 'CAM-01 • 28mm F/2.8 • ISO 400 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'nodes',
        src: '/images/events/learn_it_tour_image12.jpeg',
      },
      {
        id: 'lit-img-2',
        title: 'KEYNOTE SESSION // TECH ECOSYSTEM',
        caption: 'Speaker session discussing open source contributions and modern engineering leadership',
        tag: 'KEYNOTE / STAGE',
        cameraInfo: 'CAM-02 • 50mm F/1.8 • ISO 500 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
        src: '/images/events/learn_it_tour_image13.jpeg',
      },
      {
        id: 'lit-img-3',
        title: 'FELICITATION // SPEAKER MENTORSHIP',
        caption: 'Faculty coordinators felicitating industry mentors following interactive student Q&A',
        tag: 'FELICITATION / DECK',
        cameraInfo: 'CAM-03 • 35mm F/2.0 • ISO 640 • 1/160s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'waveform',
        src: '/images/events/learn_it_tour_image8.jpeg',
      },
    ],
    featuredProjects: [
      { name: 'Devnovate Campus Network', creator: 'Student Cohort', description: 'Collegiate knowledge sharing and mentorship routing network.', tag: 'COMMUNITY' },
      { name: 'OpenContribute Guide', creator: 'Campus Leads', description: 'Interactive roadmap for student developers entering global open source.', tag: 'OPEN SOURCE' },
    ],
  },

  // 2. HackWithMumbai — 21 September 2025
  {
    id: 'hackwithmumbai',
    title: 'HACKWITHMUMBAI',
    shortTitle: 'HACKWITHMUMBAI',
    year: '2025',
    edition: 'EDITION 01',
    date: '21 SEPTEMBER 2025',
    category: 'HACKATHONS',
    theme: 'Open Innovation & Civic Tech',
    venue: 'Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai',
    location: 'Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai',
    duration: '24 Hours Nonstop',
    participants: '247 Builders',
    projectsCount: '42 Submissions',
    status: 'past',
    badge: 'FOUNDING HACKATHON',
    desc: 'Our founding 24-hour collaborative hackathon where student builders ideated and shipped working prototypes for real-world civic and open infrastructure problems.',
    shortDescription: 'Our founding 24-hour collaborative hackathon where student builders ideated and shipped working prototypes for real-world civic and open infrastructure problems.',
    description: 'The inception of our hackathon culture at BVUDET-NM. HackWithMumbai brought together 247 student developers forming 58 teams to tackle urban mobility, digital civic tools, and open-source infrastructure. With 42 functioning prototypes deployed within 24 hours, it set the benchmark for our chapter.',
    fullDescription: 'The inception of our hackathon culture at BVUDET-NM. HackWithMumbai brought together 247 student developers forming 58 teams to tackle urban mobility, digital civic tools, and open-source infrastructure. With 42 functioning prototypes deployed within 24 hours, it set the benchmark for our chapter.',
    accentColor: '#EF4444',
    hudGraphicType: 'radar',
    cardImage: '/images/hwMUM1.jpeg',
    heroImage: '/images/hwMUM1.jpeg',
    ctaLabel: 'EXPLORE DOSSIER',
    ctaUrl: '#editorial-story',
    highlights: [
      '247 participants across 12 institutions building synchronously',
      '42 live production prototypes deployed directly to cloud test environments',
      'Founding chapter initiative establishing our collaborative hackathon culture',
      '18 industry judges and venture mentors reviewing live student demonstrations',
    ],
    images: [
      {
        id: 'hwm1-img-1',
        title: 'OPENING CEREMONY // INAUGURAL COHORT',
        caption: 'Full stage group photo with organizers, dignitaries, and builders under HackWithMumbai banner',
        tag: 'STAGE / AUDITORIUM',
        cameraInfo: 'CAM-01 • 24mm F/2.8 • ISO 400 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'radar',
        src: '/images/hwMUM1.jpeg',
      },
      {
        id: 'hwm1-img-2',
        title: 'ORGANIZING TEAM // FACULTY LAUNCH',
        caption: 'Chapter student leadership and faculty mentors launching the inaugural HackWithMumbai',
        tag: 'COMMENCEMENT / HALL 1',
        cameraInfo: 'CAM-02 • 28mm F/2.8 • ISO 500 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
        src: '/images/events/hack_with_mumbai_1_image6.jpeg',
      },
      {
        id: 'hwm1-img-3',
        title: 'PODIUM CEREMONY // WINNERS SHOWCASE',
        caption: 'Winning teams presenting their accredited projects and certificates to the faculty jury',
        tag: 'PODIUM / DEMO SPRINT',
        cameraInfo: 'CAM-03 • 70mm F/2.0 • ISO 800 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'waveform',
        src: '/images/events/hack_with_mumbai_1_image8.jpeg',
      },
    ],
    winners: [
      { place: '1st Place Overall', team: 'PulseMesh', project: 'Decentralized mesh networking for disaster relief zones', prize: '₹25,000 + Cloud Grants' },
      { place: '2nd Place', team: 'CivicSense', project: 'Computer-vision enabled municipal road defect tracker', prize: '₹15,000' },
      { place: '3rd Place', team: 'ZeroAudit', project: 'Static security scanner for Ethereum smart contracts', prize: '₹10,000' },
    ],
    featuredProjects: [
      { name: 'PulseMesh', creator: 'Team PulseMesh', description: 'Offline disaster telemetry over peer-to-peer radios.', tag: 'CIVIC TECH' },
      { name: 'CivicSense', creator: 'Team CivicSense', description: 'Automated civic road defect reporting via computer vision.', tag: 'COMPUTER VISION' },
    ],
  },

  // 3. Build IT Tour 2.0 — 27 September 2025
  {
    id: 'build-it-tour',
    title: 'BUILD IT TOUR 2.0',
    shortTitle: 'BUILD IT TOUR 2.0',
    year: '2025',
    edition: 'MICROSOFT EDITION 2025',
    date: '27 SEPTEMBER 2025',
    category: 'WORKSHOPS',
    theme: 'Fashion-Tech, System Architecture & Global Education Pathways',
    venue: 'Microsoft Office, Mumbai',
    location: 'Microsoft Office, Mumbai',
    duration: '10:00 AM Onwards (Full Day)',
    participants: '120 Builders',
    projectsCount: 'Industry Case Studies',
    status: 'past',
    badge: 'INNOVATION TOUR',
    desc: 'Hosted at Microsoft Office Mumbai, Build IT Tour 2.0 gave 120 students and aspiring founders direct immersion into AR-3D fashion apps and international business strategy.',
    shortDescription: 'Hosted at Microsoft Office Mumbai, Build IT Tour 2.0 gave 120 students and aspiring founders direct immersion into AR-3D fashion apps and international business strategy.',
    description: 'Build IT Tour 2.0, organized at the Microsoft Office in Mumbai, was held on 27th September 2025, commencing at 10:00 AM. The event witnessed the participation of 120 students along with tech enthusiasts and aspiring entrepreneurs. It provided a full day of learning, innovation, and networking. Under faculty coordinators Prof. Ahmer Usmani and Prof. Deepika Sharma, students engaged in knowledge sessions covering emerging System-Architecture fashion applications and international career development.',
    fullDescription: 'Build IT Tour 2.0, organized at the Microsoft Office in Mumbai, was held on 27th September 2025, commencing at 10:00 AM. The event witnessed the participation of 120 students along with tech enthusiasts and aspiring entrepreneurs. It provided a full day of learning, innovation, and networking. Under faculty coordinators Prof. Ahmer Usmani and Prof. Deepika Sharma, students engaged in knowledge sessions covering emerging System-Architecture fashion applications and international career development.',
    accentColor: '#0284C7',
    hudGraphicType: 'grid',
    cardImage: '/images/events/built_it_tour_image4.jpeg',
    heroImage: '/images/events/built_it_tour_image4.jpeg',
    ctaLabel: 'EXPLORE RECAP',
    ctaUrl: '#editorial-story',
    highlights: [
      'Exclusive full-day immersion hosted at Microsoft Office, Mumbai',
      '120 selected student builders, tech enthusiasts, and aspiring entrepreneurs',
      'Pioneering session on AR-3D fashion tech and draw-based app architecture by Siddhesh Shivdikar (Bootee)',
      'Global business expansion and international education consulting by Purvi Patel (Zain Global UK LTD)',
    ],
    speakers: [
      { name: 'Siddhesh Shivdikar', role: 'Founder & CEO, Bootee (AR-3D Fashion & Draw-Based Tech)', company: 'Bootee' },
      { name: 'Purvi Patel', role: 'Marketing & Business Development (Global Education Pathways)', company: 'Zain Global (UK) LTD' },
    ],
    images: [
      {
        id: 'bit-img-1',
        title: 'MICROSOFT AUDITORIUM // KEYNOTE',
        caption: 'Opening knowledge session inside the Microsoft Office Mumbai conference deck',
        tag: 'MICROSOFT / MAIN DECK',
        cameraInfo: 'CAM-01 • 35mm F/1.8 • ISO 320 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
        src: '/images/events/built_it_tour_image5.jpeg',
      },
      {
        id: 'bit-img-2',
        title: 'INTERACTIVE Q&A // FASHION-TECH',
        caption: 'Students discussing AR-3D app architecture and draw-based interface design',
        tag: 'Q&A / LAB',
        cameraInfo: 'CAM-02 • 50mm F/1.8 • ISO 400 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'circuit',
        src: '/images/events/built_it_tour_image6.jpeg',
      },
      {
        id: 'bit-img-3',
        title: 'STUDENT COHORT // MICROSOFT HEADQUARTERS',
        caption: 'Participant networking and group photo at Microsoft Office Mumbai',
        tag: 'COHORT / MICROSOFT',
        cameraInfo: 'CAM-03 • 24mm F/2.8 • ISO 500 • 1/160s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'nodes',
        src: '/images/events/built_it_tour_image7.jpeg',
      },
    ],
    featuredProjects: [
      { name: 'Bootee AR Fashion', creator: 'Industry Demo', description: 'Draw-based fashion generative pipeline over mobile augmented reality.', tag: 'AR / FASHION-TECH' },
      { name: 'Zain Global Portal', creator: 'Case Study', description: 'International education consulting and student recruitment architecture.', tag: 'GLOBAL EDTECH' },
    ],
  },

  // 4. HackWithMumbai 2.0 — 7–8 February 2026
  {
    id: 'hackwithmumbai-2-0',
    title: 'HACKWITHMUMBAI 2.0',
    shortTitle: 'HACKWITHMUMBAI 2.0',
    year: '2026',
    edition: 'EDITION 02',
    date: '7–8 FEBRUARY 2026',
    category: 'HACKATHONS',
    theme: 'Open Innovation (EdTech, HealthTech, CyberTech, AgriTech, FinTech)',
    venue: 'Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai',
    location: 'Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai',
    duration: '30 Hours Nonstop (10:00 AM – 8:30 PM)',
    participants: '280 Builders',
    projectsCount: '55 Finalist Teams',
    status: 'past',
    badge: '30H NATIONAL LEVEL HACKATHON',
    desc: 'The landmark 30-hour National Level Hackathon at BVUDET Navi Mumbai, bringing together 280 builders across 40+ colleges and 5 states with ₹64,000+ prize pool supported by SP Jain.',
    shortDescription: 'The landmark 30-hour National Level Hackathon at BVUDET Navi Mumbai, bringing together 280 builders across 40+ colleges and 5 states with ₹64,000+ prize pool supported by SP Jain.',
    description: 'HackwithIndia BVUDET Navi Mumbai Chapter successfully organized HACK WITH MUMBAI 2.0, a 30-hour National Level Hackathon, on 7th and 8th February 2026. Commencing at 10:00 AM on Saturday and continuing uninterrupted until 8:30 PM on Sunday, it marked the first-ever 30-hour National Level Hackathon hosted at BVUDET Navi Mumbai. Under the theme of Open Innovation across EdTech, HealthTech, CyberTech, AgriTech, and FinTech, 280 builders in 80 teams from 40+ colleges and 5 states competed for a prize pool exceeding ₹64,000, supported by Title Sponsor SP Jain School of Global Management and 14 partnering organizations.',
    fullDescription: 'HackwithIndia BVUDET Navi Mumbai Chapter successfully organized HACK WITH MUMBAI 2.0, a 30-hour National Level Hackathon, on 7th and 8th February 2026. Commencing at 10:00 AM on Saturday and continuing uninterrupted until 8:30 PM on Sunday, it marked the first-ever 30-hour National Level Hackathon hosted at BVUDET Navi Mumbai. Under the theme of Open Innovation across EdTech, HealthTech, CyberTech, AgriTech, and FinTech, 280 builders in 80 teams from 40+ colleges and 5 states competed for a prize pool exceeding ₹64,000, supported by Title Sponsor SP Jain School of Global Management and 14 partnering organizations.',
    accentColor: '#F97316',
    hudGraphicType: 'grid',
    cardImage: '/images/events/hack_with_mumbai_2_image5.JPG',
    heroImage: '/images/events/hack_with_mumbai_2_image16.jpeg',
    ctaLabel: 'EXPLORE RECAP',
    ctaUrl: '#editorial-story',
    highlights: [
      'First-ever 30-hour nonstop National Level Hackathon hosted at BVUDET Navi Mumbai',
      '280 builders in 80 teams representing 40+ colleges across 5 Indian states',
      '₹64,000+ prize pool supported by Title Sponsor SP Jain School of Global Management and 14 sponsors',
      '5 Industry Mentors, 5 External Judges, and 5 Academic HoDs evaluating live prototypes',
    ],
    speakers: [
      { name: 'Aayush Pandey', role: 'President, HackWithIndia BVUDET-NM Chapter', company: 'BVUDET-NM' },
      { name: 'Yash Mohite', role: 'HWI Official, Mumbai Lead', company: 'HackWithIndia' },
      { name: 'Ansh Verma', role: 'Vice President, HackWithIndia BVUDET-NM Chapter', company: 'BVUDET-NM' },
      { name: 'Deepanshu Ghosalkar', role: 'Technical Lead, HackWithIndia BVUDET-NM Chapter', company: 'BVUDET-NM' },
    ],
    images: [
      {
        id: 'hwm2-img-1',
        title: 'MAIN ARENA // 30-HOUR CELEBRATION',
        caption: 'Full stage group photo with 70+ builders, faculty mentors, HoDs and chapter organizers',
        tag: 'MAIN STAGE / ARENA',
        cameraInfo: 'CAM-01 • 24mm F/1.8 • ISO 400 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
        src: '/images/events/hack_with_mumbai_2_image16.jpeg',
      },
      {
        id: 'hwm2-img-2',
        title: 'REGISTRATION DESK // CAMPUS GATES',
        caption: 'Participants queuing up for entry scanning, ID badges, and official hackathon goodies kit',
        tag: 'REGISTRATION / GATE',
        cameraInfo: 'CAM-02 • 28mm F/2.8 • ISO 320 • 1/320s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'nodes',
        src: '/images/events/hack_with_mumbai_2_image4.jpeg',
      },
      {
        id: 'hwm2-img-3',
        title: 'WAR ROOM // OVERNIGHT SPRINT',
        caption: 'Teams collaborating during the midnight sprint with live mentorship from industry leads',
        tag: 'LAB DECK / 03:00 AM',
        cameraInfo: 'CAM-03 • 50mm F/1.4 • ISO 800 • 1/160s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'terminal',
        src: '/images/events/hack_with_mumbai_2_image12.jpg',
      },
    ],
    featuredProjects: [
      { name: 'OmniFlow AI', creator: 'Student Cohort', description: 'Autonomous agent runtime for developer tooling.', tag: 'AI / AGENTS' },
      { name: 'Kavach Protocol', creator: 'Student Cohort', description: 'Zero-knowledge verification for student credentials.', tag: 'WEB3 / CRYPTO' },
    ],
  },

  // 5. Zero2WEB3 Workshop & Build-A-Thon — 5 March 2026
  {
    id: 'zero2web3-buildathon',
    title: 'ZERO2WEB3 WORKSHOP & BUILD-A-THON',
    shortTitle: 'ZERO2WEB3 BUILD-A-THON',
    year: '2026',
    edition: 'BUILD LAB 2026',
    date: '5 MARCH 2026',
    category: 'WORKSHOPS',
    theme: 'Web3 Concepts, Mini Challenge & Decentralized Systems',
    venue: 'CC Lab, Ground Floor, BVUDET NM',
    location: 'CC Lab, Ground Floor, BVUDET NM',
    duration: '10:15 AM – 3:30 PM (5.5 Hours)',
    participants: '120 Builders',
    projectsCount: '32 DApps Built',
    status: 'past',
    badge: 'WORKSHOP & BUILD-A-THON',
    desc: 'An intensive hands-on Web3 workshop and mini-challenge sprint in CC Lab where teams built decentralized solutions, competing for trophies, physical certificates, and exclusive goodies.',
    shortDescription: 'An intensive hands-on Web3 workshop and mini-challenge sprint in CC Lab where teams built decentralized solutions, competing for trophies, physical certificates, and exclusive goodies.',
    description: 'The Zero2WEB3 Workshop & Build-A-Thon was successfully organized by the HACK WITH INDIA BVUDET NM Chapter at the Department of Engineering & Technology, Navi Mumbai on 5th March 2026 in the CC Lab. The event aimed to provide students with hands-on exposure to modern web and emerging Web3 technologies through an engaging mini challenge format. The workshop segment introduced key concepts and guided students through practical applications, while the Build-A-Thon allowed teams to compete and deploy working decentralized solutions, rewarded with trophies, physical certificates, and exclusive chapter goodies.',
    fullDescription: 'The Zero2WEB3 Workshop & Build-A-Thon was successfully organized by the HACK WITH INDIA BVUDET NM Chapter at the Department of Engineering & Technology, Navi Mumbai on 5th March 2026 in the CC Lab. The event aimed to provide students with hands-on exposure to modern web and emerging Web3 technologies through an engaging mini challenge format. The workshop segment introduced key concepts and guided students through practical applications, while the Build-A-Thon allowed teams to compete and deploy working decentralized solutions, rewarded with trophies, physical certificates, and exclusive chapter goodies.',
    accentColor: '#06B6D4',
    hudGraphicType: 'nodes',
    cardImage: '/images/events/web3_report_image4.jpeg',
    heroImage: '/images/events/web3_report_image4.jpeg',
    ctaLabel: 'EXPLORE RECAP',
    ctaUrl: '#editorial-story',
    highlights: [
      'Hands-on Web3 introduction and practical mini-challenge build-based learning format',
      'Interactive lab sessions in CC Lab bridging theoretical concepts and decentralized development',
      'Award recognition featuring winner trophies, physical certificates, and exclusive chapter merchandise',
      'Collaborative peer coding environment introducing AI, automation, and smart contract architectures',
    ],
    images: [
      {
        id: 'z2w-img-1',
        title: 'CC LAB // ACTIVE SPRINT',
        caption: 'Full house of student developers coding Solidity smart contracts in CC Lab Ground Floor',
        tag: 'CC LAB / GROUND FLOOR',
        cameraInfo: 'CAM-01 • 24mm F/2.8 • ISO 500 • 1/160s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'nodes',
        src: '/images/events/web3_report_image5.jpeg',
      },
      {
        id: 'z2w-img-2',
        title: 'PAIR AUDIT // SMART CONTRACTS',
        caption: 'Students collaborating to debug gas consumption and test reentrancy vulnerabilities',
        tag: 'PAIR DEBUG / STATION 8',
        cameraInfo: 'CAM-02 • 50mm F/1.8 • ISO 800 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
        src: '/images/events/web3_report_image6.jpeg',
      },
      {
        id: 'z2w-img-3',
        title: 'PODIUM CEREMONY // TROPHIES & CERTIFICATES',
        caption: 'Felicitation of outstanding mini-challenge teams with trophies and physical certificates',
        tag: 'AWARD / CEREMONY',
        cameraInfo: 'CAM-03 • 35mm F/2.0 • ISO 640 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'waveform',
        src: '/images/events/web3_report_image7.jpeg',
      },
    ],
    featuredProjects: [
      { name: 'DeCertify', creator: 'Team DeCert', description: 'Decentralized verifiable achievement credential registry.', tag: 'SMART CONTRACTS' },
      { name: 'GasGauge', creator: 'Team GasGauge', description: 'Static analyzer visualizing EVM opcode gas hotspots.', tag: 'DEVELOPER TOOLING' },
    ],
  },

  // 6. HackWithMumbai 3.0 — 20 May 2026 (Confirmed from chapter's Instagram poster)
  {
    id: 'hackwithmumbai-3-0',
    title: 'HACKWITHMUMBAI 3.0',
    shortTitle: 'HACKWITHMUMBAI 3.0',
    year: '2026',
    edition: 'EDITION 03',
    date: '20 MAY 2026',
    category: 'HACKATHONS',
    theme: 'Next-Gen Systems & Intelligent Automation',
    venue: 'BVUDET Main Campus & Innovation Arena, Navi Mumbai',
    location: 'BVUDET Main Campus & Innovation Arena, Navi Mumbai',
    duration: '24 Hours Nonstop',
    participants: '400+ Builders',
    projectsCount: '85+ Submissions',
    status: 'past',
    badge: 'FLAGSHIP HACKATHON',
    desc: 'The third flagship edition of HackWithMumbai, scaling builder participation, high-throughput systems design, and AI integration across real-world problem statements.',
    shortDescription: 'The third flagship edition of HackWithMumbai, scaling builder participation, high-throughput systems design, and AI integration across real-world problem statements.',
    description: 'Confirmed for 20 May 2026 as announced across official chapter channels, HackWithMumbai 3.0 represents our most ambitious engineering sprint yet. Scaling up to 400+ participants with dedicated tracks in Intelligent Agents, Distributed Infrastructure, and Real-World Hardware Interfaces, it cements BVUDET-NM as a leading developer community hub.',
    fullDescription: 'Confirmed for 20 May 2026 as announced across official chapter channels, HackWithMumbai 3.0 represents our most ambitious engineering sprint yet. Scaling up to 400+ participants with dedicated tracks in Intelligent Agents, Distributed Infrastructure, and Real-World Hardware Interfaces, it cements BVUDET-NM as a leading developer community hub.',
    accentColor: '#EC4899',
    hudGraphicType: 'waveform',
    ctaLabel: 'EXPLORE RECAP',
    ctaUrl: '#editorial-story',
    highlights: [
      'Confirmed edition date: 20 May 2026 (announced on official chapter channels)',
      'Expanded multi-track competition focusing on real-world system architecture',
      'Inter-institutional collaboration bringing builders together across universities',
      'Industry-standard technical judging rubrics and architecture teardowns',
    ],
    images: [
      {
        id: 'hwm3-img-1',
        title: 'MAIN STAGE // ARCHITECTURE DECK',
        caption: 'HackWithMumbai 3.0 central presentation deck and developer arena',
        tag: 'MAIN STAGE / 3.0',
        cameraInfo: 'CAM-01 • 35mm F/1.4 • ISO 320 • 1/320s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'waveform',
      },
      {
        id: 'hwm3-img-2',
        title: 'PROTOTYPE LAB // LIVE EVALUATION',
        caption: 'Jury evaluating deployed AI automation and distributed system pipelines',
        tag: 'EVALUATION / PIT B',
        cameraInfo: 'CAM-02 • 85mm F/1.8 • ISO 640 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
      },
      {
        id: 'hwm3-img-3',
        title: 'DEVELOPER PIT // SYSTEM DESIGN',
        caption: 'High-throughput system architecture and distributed consensus demos',
        tag: 'DEVELOPER PIT / C',
        cameraInfo: 'CAM-03 • 50mm F/1.4 • ISO 500 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'radar',
      },
    ],
    featuredProjects: [
      { name: 'AetherDB', creator: 'Projected', description: 'High-concurrency time-series database engine for sensor telemetry.', tag: 'SYSTEMS' },
      { name: 'AutoDoc LLM', creator: 'Projected', description: 'Deterministic documentation generator from Git diff streams.', tag: 'AI AUTOMATION' },
    ],
  },

  // 7. RocketRide Buildathon — From Idea to Million Dollar App — 29 August 2026
  {
    id: 'rocketride-buildathon',
    title: 'ROCKETRIDE BUILDATHON — FROM IDEA TO MILLION DOLLAR APP',
    shortTitle: 'ROCKETRIDE BUILDATHON',
    year: '2026',
    edition: 'VENTURE SPRINT 2026',
    date: '29 AUGUST 2026',
    category: 'HACKATHONS',
    theme: 'From Idea to Scale, Product-Market Fit & Startup Engineering',
    venue: 'Auditorium & Innovation Deck, BVUDET-NM',
    location: 'Auditorium & Innovation Deck, BVUDET-NM',
    duration: '12 Hours Intensive Sprint',
    participants: '200+ Builders',
    projectsCount: '45 Prototypes',
    status: 'past',
    badge: 'VENTURE BUILDATHON',
    desc: 'An intensive entrepreneurial buildathon taking ideas from initial concept to viable products, featuring structured venture frameworks and product architecture sessions.',
    shortDescription: 'An intensive entrepreneurial buildathon taking ideas from initial concept to viable products, featuring structured venture frameworks and product architecture sessions.',
    description: 'RocketRide Buildathon challenged student engineers and aspiring founders to translate raw concepts into tangible, scalable software products. Emphasizing product-market validation, clean API design, and rapid prototyping, teams built throughout the day and presented functional demos.',
    fullDescription: 'RocketRide Buildathon challenged student engineers and aspiring founders to translate raw concepts into tangible, scalable software products. Emphasizing product-market validation, clean API design, and rapid prototyping, teams built throughout the day and presented functional demos.',
    accentColor: '#8B5CF6',
    hudGraphicType: 'terminal',
    ctaLabel: 'EXPLORE RECAP',
    ctaUrl: '#editorial-story',
    highlights: [
      'Rapid product-market validation framework and venture architecture sprint',
      'Reserved speaker sessions and product clinics on scaling software businesses',
      'Interactive prototype teardown sessions with detailed technical feedback',
      'Founder-led roadmap reviews helping student teams plan post-event execution',
    ],
    speakers: [
      { name: 'Guest Speaker 01', role: 'Venture Architect & Founder', placeholderLabel: 'SPEAKER PHOTOGRAPH RESERVED' },
      { name: 'Guest Speaker 02', role: 'Head of Product Engineering', placeholderLabel: 'SPEAKER PHOTOGRAPH RESERVED' },
      { name: 'Guest Speaker 03', role: 'Growth & Scaling Lead', placeholderLabel: 'SPEAKER PHOTOGRAPH RESERVED' },
    ],
    images: [
      {
        id: 'rr-img-1',
        title: 'VENTURE ARENA // PITCH DECK',
        caption: 'Founders presenting product-market fit teardowns on the main stage',
        tag: 'AUDITORIUM / VENTURE',
        cameraInfo: 'CAM-01 • 35mm F/1.8 • ISO 400 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'terminal',
      },
      {
        id: 'rr-img-2',
        title: 'PRODUCT CLINIC // MENTORSHIP',
        caption: 'One-on-one architectural guidance with seasoned software entrepreneurs',
        tag: 'CLINIC / DECK 2',
        cameraInfo: 'CAM-02 • 50mm F/1.4 • ISO 500 • 1/320s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'circuit',
      },
      {
        id: 'rr-img-3',
        title: 'WAR ROOM // SCALE ARCHITECTURE',
        caption: 'Teams architecting high-throughput SaaS monetization pipelines',
        tag: 'VENTURE / SCALE',
        cameraInfo: 'CAM-03 • 28mm F/2.0 • ISO 640 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'grid',
      },
    ],
    featuredProjects: [
      { name: 'VentureSync', creator: 'Team VentureSync', description: 'Automated investor update generator aggregating GitHub & Stripe metrics.', tag: 'VENTURE TECH' },
      { name: 'MicroFunnel', creator: 'Team Funnel', description: 'Frictionless customer onboarding workflow engine for micro-SaaS.', tag: 'PRODUCT TOOLING' },
    ],
  },

  // 8. Capture the Flag: Zero Internet — 12 October 2026
  {
    id: 'ctf-zero-internet',
    title: 'CAPTURE THE FLAG: ZERO INTERNET',
    shortTitle: 'CTF: ZERO INTERNET',
    year: '2026',
    edition: 'CYBER SPRINT 2026',
    date: '12 OCTOBER 2026',
    category: 'OTHER',
    theme: 'Air-Gapped Systems, Local Exploits & Offline Cryptography',
    venue: 'Cybersecurity Sandbox & Isolated Network Lab, BVUDET-NM',
    location: 'Cybersecurity Sandbox & Isolated Network Lab, BVUDET-NM',
    duration: '8 Hours Offline CTF',
    participants: '150 Security Researchers',
    projectsCount: '25 Flags Captured',
    status: 'past',
    badge: 'CYBERSECURITY CTF',
    desc: 'An air-gapped cybersecurity CTF challenge where teams compete in a zero-internet, isolated intranet environment to crack challenges in reverse engineering, binary exploitation, and offline cryptography.',
    shortDescription: 'An air-gapped cybersecurity CTF challenge where teams compete in a zero-internet, isolated intranet environment to crack challenges in reverse engineering, binary exploitation, and offline cryptography.',
    description: 'Held in an isolated, air-gapped laboratory environment with zero external internet access, Capture the Flag: Zero Internet tested raw security fundamentals. Participants navigated simulated enterprise intranets, discovered hidden local service vulnerabilities, solved offline cryptographic puzzles, and executed binary reverse engineering challenges.',
    fullDescription: 'Held in an isolated, air-gapped laboratory environment with zero external internet access, Capture the Flag: Zero Internet tested raw security fundamentals. Participants navigated simulated enterprise intranets, discovered hidden local service vulnerabilities, solved offline cryptographic puzzles, and executed binary reverse engineering challenges.',
    accentColor: '#10B981',
    hudGraphicType: 'circuit',
    ctaLabel: 'EXPLORE RECAP',
    ctaUrl: '#editorial-story',
    highlights: [
      'Completely offline air-gapped network setup with zero external connectivity',
      'Comprehensive challenge categories: Reverse Engineering, Pwn, Crypto, Forensics',
      'Live local intranet scoreboard with real-time flag capture telemetry',
      'Post-competition exploitation walkthroughs led by chapter security researchers',
    ],
    images: [
      {
        id: 'ctf-img-1',
        title: 'AIR-GAPPED LAB // INTENSE EXPLOITATION',
        caption: 'Security researchers working through local binary exploits on isolated workstations',
        tag: 'SANDBOX / AIR-GAP',
        cameraInfo: 'CAM-01 • 24mm F/2.0 • ISO 640 • 1/160s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'circuit',
      },
      {
        id: 'ctf-img-2',
        title: 'OFFLINE SCOREBOARD // LIVE TELEMETRY',
        caption: 'Real-time intranet scoreboard tracking first-blood flag submissions',
        tag: 'SCOREBOARD / LAN',
        cameraInfo: 'CAM-02 • 70mm F/2.8 • ISO 800 • 1/250s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'radar',
      },
      {
        id: 'ctf-img-3',
        title: 'DEFENSE TEAM // PACKET DECODE',
        caption: 'Engineers analyzing local packet telemetry and cryptographic cipher blocks',
        tag: 'CRYPTOGRAPHY / DECK',
        cameraInfo: 'CAM-03 • 50mm F/1.8 • ISO 500 • 1/200s',
        composition: 'wide',
        aspectRatio: '16 / 10',
        hudGraphicType: 'terminal',
      },
    ],
    winners: [
      { place: '1st Place (Root Master)', team: 'NullPointer', project: 'Clean sweep of all reverse engineering and air-gap crypto flags' },
      { place: '2nd Place', team: 'KernelPanic', project: 'Rapid binary exploitation and offline network service compromise' },
      { place: '3rd Place', team: 'ByteBandits', project: 'Advanced steganography and local privilege escalation flags' },
    ],
    featuredProjects: [
      { name: 'AirGap Audit Suite', creator: 'CTF Infrastructure Team', description: 'Automated scoring engine and packet monitor for isolated LAN competitions.', tag: 'INFRASTRUCTURE' },
      { name: 'VaultCrack', creator: 'Team NullPointer', description: 'Custom offline cryptanalysis script developed during the challenge.', tag: 'SECURITY TOOL' },
    ],
  },
];
