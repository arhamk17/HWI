export interface GlobeLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  // Normalized 3D position on unit sphere:
  // x = cos(lat) * sin(lng)
  // y = -sin(lat) (canvas Y is down)
  // z = cos(lat) * cos(lng)
  x: number;
  y: number;
  z: number;
  eventsCount: string;
  participantsCount: string;
  projectsCount: string;
  description: string;
  isFlagship?: boolean;
}

function calcUnitSphere(latDeg: number, lngDeg: number): { x: number; y: number; z: number } {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lngDeg + 180) * (Math.PI / 180);
  return {
    x: -(Math.sin(phi) * Math.sin(theta)),
    y: Math.cos(phi), // y up in 3D (will invert for screen)
    z: Math.sin(phi) * Math.cos(theta),
  };
}

const rawLocations = [
  {
    id: 'mumbai',
    name: 'MUMBAI',
    region: 'BVUDET-NM CAMPUS • FLAGSHIP CHAPTER',
    lat: 19.076,
    lng: 72.8777,
    eventsCount: '04',
    participantsCount: '247',
    projectsCount: '18',
    description: 'Home of the BVUDET-NM student chapter and the flagship HackWithMumbai hackathon series.',
    isFlagship: true,
  },
  {
    id: 'pune',
    name: 'PUNE',
    region: 'WESTERN REGIONAL HUB',
    lat: 18.5204,
    lng: 73.8567,
    eventsCount: '02',
    participantsCount: '180',
    projectsCount: '12',
    description: 'Student engineering cohorts collaborating on cloud architecture and open source tooling.',
  },
  {
    id: 'bengaluru',
    name: 'BENGALURU',
    region: 'TECH CORRIDOR SUMMIT',
    lat: 12.9716,
    lng: 77.5946,
    eventsCount: '03',
    participantsCount: '310',
    projectsCount: '24',
    description: 'Annual developer tours connecting student builders directly with tech founders and venture mentors.',
  },
  {
    id: 'delhi',
    name: 'DELHI NCR',
    region: 'NORTHERN ALLIANCE',
    lat: 28.7041,
    lng: 77.1025,
    eventsCount: '02',
    participantsCount: '195',
    projectsCount: '14',
    description: 'Inter-collegiate hackathon sprints focused on civic tech, AI governance, and public infrastructure.',
  },
  {
    id: 'hyderabad',
    name: 'HYDERABAD',
    region: 'CYBER TECH CLUSTER',
    lat: 17.385,
    lng: 78.4867,
    eventsCount: '01',
    participantsCount: '160',
    projectsCount: '10',
    description: 'Specialized bootcamps on high-performance distributed databases and smart contract auditing.',
  },
];

export const GLOBE_LOCATIONS: GlobeLocation[] = rawLocations.map((loc) => {
  const coords = calcUnitSphere(loc.lat, loc.lng);
  return {
    ...loc,
    x: coords.x,
    y: coords.y,
    z: coords.z,
  };
});
