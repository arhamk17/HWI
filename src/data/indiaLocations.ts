export interface IndiaLocation {
  id: string;
  name: string;
  subtitle: string;
  lng: number;
  lat: number;
  normX: number; // Normalized coordinate in India map (-1 to 1)
  normY: number; // Normalized coordinate in India map (-1 to 1, North is negative)
  eventsCount: string;
  participantsCount: string;
  latestEvent: string;
  description: string;
  isFlagship?: boolean;
}

// Coordinate normalization to [-1, 1] relative to center of India
const centerLng = 81.0;
const centerLat = 22.0;
const spanLng = 97.4 - 68.2; // 29.2
const spanLat = 36.0 - 8.0;  // 28.0

export function geoToIndiaNorm(lng: number, lat: number): { normX: number; normY: number } {
  const normX = ((lng - centerLng) / spanLng) * 1.85 - 0.10;
  const normY = -((lat - centerLat) / spanLat) * 2.0; // Inverted Y: North is UP (negative Y)
  return { normX, normY };
}

const rawLocations = [
  {
    id: 'mumbai',
    name: 'MUMBAI',
    subtitle: 'HWI EVENT HUB • BVUDET-NM',
    lng: 72.8777,
    lat: 19.0760,
    eventsCount: '04',
    participantsCount: '247',
    latestEvent: 'HACKWITHMUMBAI 2.0',
    description: 'Home of the BVUDET-NM student chapter and the flagship HackWithMumbai hackathon series.',
    isFlagship: true,
  },
  {
    id: 'pune',
    name: 'PUNE',
    subtitle: 'WESTERN REGIONAL HUB',
    lng: 73.8567,
    lat: 18.5204,
    eventsCount: '02',
    participantsCount: '180',
    latestEvent: 'BUILD IT TOUR 2.0',
    description: 'Student engineering cohorts collaborating on cloud architecture and open source tooling.',
  },
  {
    id: 'bengaluru',
    name: 'BENGALURU',
    subtitle: 'TECH CORRIDOR SUMMIT',
    lng: 77.5946,
    lat: 12.9716,
    eventsCount: '03',
    participantsCount: '310',
    latestEvent: 'DEVELOPER KEYNOTE SUMMIT',
    description: 'Annual developer tours connecting student builders directly with tech founders and venture mentors.',
  },
  {
    id: 'delhi',
    name: 'DELHI NCR',
    subtitle: 'NORTHERN ALLIANCE',
    lng: 77.1025,
    lat: 28.7041,
    eventsCount: '02',
    participantsCount: '195',
    latestEvent: 'CAMPUS CODE SPRINT',
    description: 'Inter-collegiate hackathon sprints focused on civic tech, AI governance, and public infrastructure.',
  },
  {
    id: 'hyderabad',
    name: 'HYDERABAD',
    subtitle: 'CYBER TECH CLUSTER',
    lng: 78.4867,
    lat: 17.3850,
    eventsCount: '01',
    participantsCount: '160',
    latestEvent: 'HIGH-PERFORMANCE DATA LAB',
    description: 'Specialized bootcamps on high-performance distributed databases and smart contract auditing.',
  },
];

export const HWI_INDIA_LOCATIONS: IndiaLocation[] = rawLocations.map((loc) => {
  const { normX, normY } = geoToIndiaNorm(loc.lng, loc.lat);
  return {
    ...loc,
    normX,
    normY,
  };
});

// Network connection pairs for subtle interconnect lines
export const HWI_NETWORK_LINKS: [string, string][] = [
  ['mumbai', 'pune'],
  ['pune', 'bengaluru'],
  ['mumbai', 'delhi'],
  ['bengaluru', 'hyderabad'],
  ['hyderabad', 'delhi'],
];
