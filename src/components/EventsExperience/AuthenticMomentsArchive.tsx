'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Maximize2, Minimize2, Sun, Sparkles, RotateCcw, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { scrollBus } from '@/lib/scrollBus';
import './AuthenticMomentsArchive.css';

export interface AuthenticMomentItem {
  id: string;
  eventId: string;
  eventTitle: string;
  category: 'ROCKETRIDE' | 'HACKWITHMUMBAI' | 'ZERO2WEB3' | 'COMMUNITY' | 'CTF';
  categoryLabel: string;
  edition: string;
  year: string;
  date: string;
  tag: string;
  title: string;
  caption: string;
  stats: string;
  cameraInfo?: string;
  src: string;
  aspectRatio: string;
}

export const AUTHENTIC_MOMENTS: AuthenticMomentItem[] = [
  // 1. RocketRide — Champions Podium
  {
    id: 'mom-rr-1',
    eventId: 'rocketride-buildathon',
    eventTitle: 'RocketRide Buildathon',
    category: 'ROCKETRIDE',
    categoryLabel: 'ROCKETRIDE',
    edition: 'Edition 06 · Buildathon',
    year: '2026',
    date: '29 Aug 2026',
    tag: 'Valedictory · 1st Place',
    title: 'Champions Podium: 1st Place Awards',
    caption: 'Winning buildathon team presented with certificates and the 1st place cheque by RocketRide San Francisco industry delegates and faculty.',
    stats: '183 Builders · 47 Teams · ₹1,00,000+ Prizes',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 5',
    src: '/images/events/rocketride_winner_1st.jpg',
    aspectRatio: '16 / 10',
  },
  // 2. HackWithMumbai 2.0 — 30h Finale
  {
    id: 'mom-hwm2-1',
    eventId: 'hackwithmumbai-2-0',
    eventTitle: 'HackWithMumbai 2.0',
    category: 'HACKWITHMUMBAI',
    categoryLabel: 'HACKWITHMUMBAI',
    edition: 'Edition 04 · National Hackathon',
    year: '2026',
    date: '7–8 Feb 2026',
    tag: 'Main Arena · 30h Finale',
    title: '30-Hour Nonstop Celebration',
    caption: 'Stage group photo with 70+ builders, faculty mentors, department HoDs and chapter organizers following 30 hours of continuous building.',
    stats: '280 Builders · 80 Finalist Teams · 5 States',
    cameraInfo: 'CAM-01 • 24mm F/1.8 • ISO 400 • 1/250s',
    src: '/images/events/hack_with_mumbai_2_image16.jpeg',
    aspectRatio: '16 / 10',
  },
  // 3. Zero2Web3 — CC Lab Solidity Sprint
  {
    id: 'mom-z2w-1',
    eventId: 'zero2web3-buildathon',
    eventTitle: 'Zero2Web3 Build-a-thon',
    category: 'ZERO2WEB3',
    categoryLabel: 'ZERO2WEB3',
    edition: 'Edition 05 · EVM Lab',
    year: '2026',
    date: '5 Mar 2026',
    tag: 'CC Lab · Ground Floor',
    title: 'CC Lab: Active Solidity Sprint',
    caption: 'Full house of student developers coding Solidity smart contracts in CC Lab Ground Floor during the EVM challenge sprint.',
    stats: '110 Builders · Hands-On EVM Contracts',
    cameraInfo: 'CAM-01 • 24mm F/2.8 • ISO 500 • 1/160s',
    src: '/images/events/web3_report_image5.jpeg',
    aspectRatio: '16 / 10',
  },
  // 4. Learn IT Tour — Main Auditorium
  {
    id: 'mom-lit-1',
    eventId: 'learn-it-tour',
    eventTitle: 'Learn IT Tour',
    category: 'COMMUNITY',
    categoryLabel: 'TECH TOURS',
    edition: 'Edition 01 · Community Tour',
    year: '2025',
    date: '16 Jul 2025',
    tag: 'Auditorium · Inauguration',
    title: 'Main Auditorium: 220 Builders',
    caption: 'Over 220 students gathered in the central auditorium for the Learn IT Tour keynote organized in collaboration with Devnovate.',
    stats: '220 Students · Devnovate Keynote',
    cameraInfo: 'CAM-01 • 28mm F/2.8 • ISO 400 • 1/200s',
    src: '/images/events/learn_it_tour_image12.jpeg',
    aspectRatio: '16 / 10',
  },
  // 5. RocketRide — Auditorium Assembly
  {
    id: 'mom-rr-2',
    eventId: 'rocketride-buildathon',
    eventTitle: 'RocketRide Buildathon',
    category: 'ROCKETRIDE',
    categoryLabel: 'ROCKETRIDE',
    edition: 'Edition 06 · Buildathon',
    year: '2026',
    date: '29 Aug 2026',
    tag: 'Auditorium · 183 Builders',
    title: 'Auditorium Assembly: 47 Teams',
    caption: '47 teams comprising 183 students from host and visiting engineering institutions gathered during opening architecture orientation.',
    stats: '47 Teams · 183 Students · 6h Continuous',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 4',
    src: '/images/events/rocketride_auditorium.jpg',
    aspectRatio: '16 / 10',
  },
  // 6. HackWithMumbai 1.0 — Inaugural Hackathon
  {
    id: 'mom-hwm1-1',
    eventId: 'hackwithmumbai',
    eventTitle: 'HackWithMumbai 1.0',
    category: 'HACKWITHMUMBAI',
    categoryLabel: 'HACKWITHMUMBAI',
    edition: 'Edition 02 · Inaugural',
    year: '2025',
    date: '21 Sep 2025',
    tag: 'Inauguration · Chapter Launch',
    title: 'Inaugural Chapter Hackathon',
    caption: 'The foundational collegiate hackathon establishing HWI BVUDET-NM flagship build culture across civic tech and decentralization.',
    stats: '140 Builders · 35 Teams · ₹50,000 Prizes',
    cameraInfo: 'CAM-01 • 35mm F/2.0 • ISO 400 • 1/200s',
    src: '/images/events/hack_with_mumbai_1_image1.jpeg',
    aspectRatio: '16 / 10',
  },
  // 7. Build IT Tour 2.0 — Hands-On Dev Cohort
  {
    id: 'mom-bit-1',
    eventId: 'build-it-tour',
    eventTitle: 'Build IT Tour 2.0',
    category: 'COMMUNITY',
    categoryLabel: 'TECH TOURS',
    edition: 'Edition 03 · Tech Tour',
    year: '2025',
    date: '17 Dec 2025',
    tag: 'Hands-On · Lab Deck',
    title: 'Hands-On Builder Cohort',
    caption: 'Intensive architecture deep-dives, developer tooling, and modern deployment pipelines conducted with collegiate builders.',
    stats: '160 Builders · Developer Ecosystem',
    cameraInfo: 'CAM-02 • 28mm F/2.8 • ISO 500 • 1/160s',
    src: '/images/events/built_it_tour_image1.jpeg',
    aspectRatio: '16 / 10',
  },
  // 8. Capture The Flag — Zero Internet (Official Vertical Poster)
  {
    id: 'mom-ctf-1',
    eventId: 'ctf-zero-internet',
    eventTitle: 'Zero Internet CTF',
    category: 'CTF',
    categoryLabel: 'AIR-GAPPED CTF',
    edition: 'Edition 07 · Cyber Security',
    year: '2026',
    date: '12 Oct 2026',
    tag: 'CC Labs 4–6 · Air-Gapped',
    title: 'Capture The Flag — Zero Internet',
    caption: 'Official championship poster for the 10am to 4pm air-gapped security battle across Web Exploitation, Cryptography, Reverse Engineering, OSINT, and Forensics.',
    stats: '50–80 Teams · 7 Challenge Domains · Isolated LAN',
    cameraInfo: 'CAMPUS HEADQUARTERS • OFFICIAL POSTER',
    src: '/images/events/ctf_zero_internet_poster.jpg',
    aspectRatio: '3 / 4',
  },
  // 9. RocketRide — Mentorship Lab
  {
    id: 'mom-rr-3',
    eventId: 'rocketride-buildathon',
    eventTitle: 'RocketRide Buildathon',
    category: 'ROCKETRIDE',
    categoryLabel: 'ROCKETRIDE',
    edition: 'Edition 06 · Buildathon',
    year: '2026',
    date: '29 Aug 2026',
    tag: 'CC Lab · Mentorship',
    title: 'Lab Mentorship: 6-Hour Sprint',
    caption: 'Ryan Christensen reviewing codebases and providing hands-on architectural mentorship during the high-velocity offline sprint.',
    stats: '1-on-1 Code Reviews · Silicon Valley Mentors',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 4',
    src: '/images/events/rocketride_mentorship_lab.jpg',
    aspectRatio: '16 / 10',
  },
  // 10. HackWithMumbai 2.0 — Campus Gate Registration
  {
    id: 'mom-hwm2-2',
    eventId: 'hackwithmumbai-2-0',
    eventTitle: 'HackWithMumbai 2.0',
    category: 'HACKWITHMUMBAI',
    categoryLabel: 'HACKWITHMUMBAI',
    edition: 'Edition 04 · National Hackathon',
    year: '2026',
    date: '7 Feb 2026',
    tag: 'Registration · Campus Gate',
    title: 'Registration Desk: Campus Gates',
    caption: 'Participants queuing up for entry scanning, ID badges, and official hackathon goodies kits upon arrival at BVUDET.',
    stats: '40+ Colleges · Check-in Verification',
    cameraInfo: 'CAM-02 • 28mm F/2.8 • ISO 320 • 1/320s',
    src: '/images/events/hack_with_mumbai_2_image4.jpeg',
    aspectRatio: '16 / 10',
  },
  // 11. Zero2Web3 — Podium Trophies
  {
    id: 'mom-z2w-2',
    eventId: 'zero2web3-buildathon',
    eventTitle: 'Zero2Web3 Build-a-thon',
    category: 'ZERO2WEB3',
    categoryLabel: 'ZERO2WEB3',
    edition: 'Edition 05 · EVM Lab',
    year: '2026',
    date: '5 Mar 2026',
    tag: 'Ceremony · Trophies',
    title: 'Podium Ceremony: Trophies & Merit',
    caption: 'Felicitation of outstanding mini-challenge teams with trophies, merit awards, and physical certificates.',
    stats: 'Podium Laureates · Physical Certificates',
    cameraInfo: 'CAM-03 • 35mm F/2.0 • ISO 640 • 1/200s',
    src: '/images/events/web3_report_image7.jpeg',
    aspectRatio: '16 / 10',
  },
  // 12. HackWithMumbai 1.0 — Civic Tech Demos
  {
    id: 'mom-hwm1-2',
    eventId: 'hackwithmumbai',
    eventTitle: 'HackWithMumbai 1.0',
    category: 'HACKWITHMUMBAI',
    categoryLabel: 'HACKWITHMUMBAI',
    edition: 'Edition 02 · Inaugural',
    year: '2025',
    date: '21 Sep 2025',
    tag: 'Lab Station · Prototype Demo',
    title: 'Civic & Hardware Prototyping',
    caption: 'Student teams demoing decentralized mesh networks, computer-vision municipal tools, and security scanners.',
    stats: 'Top 3 Podium Projects · Civic Innovation',
    cameraInfo: 'CAM-02 • 50mm F/1.8 • ISO 640 • 1/200s',
    src: '/images/events/hack_with_mumbai_1_image6.jpeg',
    aspectRatio: '16 / 10',
  },
  // 13. Build IT Tour 2.0 — Technical Keynote
  {
    id: 'mom-bit-2',
    eventId: 'build-it-tour',
    eventTitle: 'Build IT Tour 2.0',
    category: 'COMMUNITY',
    categoryLabel: 'TECH TOURS',
    edition: 'Edition 03 · Tech Tour',
    year: '2025',
    date: '17 Dec 2025',
    tag: 'Main Hall · Technical Stage',
    title: 'Technical Workshop Stage',
    caption: 'Interactive code teardowns on smart contract security, scalable APIs, and building collegiate developer communities.',
    stats: 'Hands-on Technical Workshops',
    cameraInfo: 'CAM-03 • 35mm F/2.0 • ISO 500 • 1/200s',
    src: '/images/events/built_it_tour_image4.jpeg',
    aspectRatio: '16 / 10',
  },
  // 14. RocketRide — Runner-Up Laureates
  {
    id: 'mom-rr-4',
    eventId: 'rocketride-buildathon',
    eventTitle: 'RocketRide Buildathon',
    category: 'ROCKETRIDE',
    categoryLabel: 'ROCKETRIDE',
    edition: 'Edition 06 · Buildathon',
    year: '2026',
    date: '29 Aug 2026',
    tag: 'Valedictory · Podium Recognition',
    title: 'Runner-Up Awards: Valedictory',
    caption: 'Runner-up teams recognized for high-impact prototype solutions during the valedictory award presentation ceremony.',
    stats: 'International Delegate Recognition',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 5',
    src: '/images/events/rocketride_winner_2nd.jpg',
    aspectRatio: '16 / 10',
  },
];

// 14 Natural Organic Spatial Lanes in (vw, vh) around the center
const CARD_LAYOUTS = [
  { x: -24, y: -10, widthVw: 24, aspect: '16 / 10' },
  { x: 22, y: 12, widthVw: 25, aspect: '16 / 10' },
  { x: -5, y: -24, widthVw: 23, aspect: '16 / 10' },
  { x: -27, y: 18, widthVw: 23, aspect: '16 / 10' },
  { x: 25, y: -16, widthVw: 24, aspect: '16 / 10' },
  { x: -22, y: -22, widthVw: 22, aspect: '16 / 10' },
  { x: 27, y: 20, widthVw: 23, aspect: '16 / 10' },
  { x: -14, y: 6, widthVw: 18, aspect: '3 / 4' }, // CTF Poster Portrait
  { x: 12, y: -6, widthVw: 25, aspect: '16 / 10' },
  { x: 26, y: -6, widthVw: 22, aspect: '16 / 10' },
  { x: 5, y: 22, widthVw: 22, aspect: '16 / 10' },
  { x: -26, y: 4, widthVw: 24, aspect: '16 / 10' },
  { x: -18, y: 24, widthVw: 22, aspect: '16 / 10' },
  { x: 16, y: -22, widthVw: 24, aspect: '16 / 10' },
];

const CATEGORY_TABS = [
  { key: 'ALL', label: 'All Dispatches (14)' },
  { key: 'ROCKETRIDE', label: 'RocketRide' },
  { key: 'HACKWITHMUMBAI', label: 'HackWithMumbai' },
  { key: 'ZERO2WEB3', label: 'Zero2Web3' },
  { key: 'COMMUNITY', label: 'Tech Tours' },
  { key: 'CTF', label: 'Air-Gapped CTF' },
];

const TOTAL_DEPTH = 4200;

interface AuthenticMomentsArchiveProps {
  onOpenChronicle?: (eventId: string) => void;
}

export function AuthenticMomentsArchive({ onOpenChronicle }: AuthenticMomentsArchiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<AuthenticMomentItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [ambientMode, setAmbientMode] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<AuthenticMomentItem>(AUTHENTIC_MOMENTS[0]);

  // Motion physics refs for 120fps direct DOM animation
  const pTarget = useRef<number>(0);
  const pCurrent = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const isInteracting = useRef<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeIndexRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch & drag tracking
  const pointerStartRef = useRef<{ y: number; active: boolean }>({ y: 0, active: false });

  // Filter moments
  const filteredMoments = useMemo(() => {
    if (activeCategory === 'ALL') return AUTHENTIC_MOMENTS;
    return AUTHENTIC_MOMENTS.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  const count = filteredMoments.length;

  // Inactivity timeout handler (3 seconds to auto-play resume)
  const resetInactivityTimer = useCallback(() => {
    isInteracting.current = true;
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle failed', err);
    }
  }, []);

  const handleReset = useCallback(() => {
    pTarget.current = 0;
    pCurrent.current = 0;
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView && !document.fullscreenElement) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        pTarget.current += 240;
        resetInactivityTimer();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        pTarget.current -= 240;
        resetInactivityTimer();
      } else if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetInactivityTimer, selectedPhoto]);

  // Window scroll synchronization
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && Math.abs(delta) > 0.5) {
        pTarget.current += delta * 1.6;
        resetInactivityTimer();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const unsub = scrollBus.subscribe(onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, [resetInactivityTimer]);

  // Wheel listener on stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      if (document.fullscreenElement) {
        e.preventDefault();
        pTarget.current += e.deltaY * 0.95;
        resetInactivityTimer();
        return;
      }
      pTarget.current += e.deltaY * 0.5;
      resetInactivityTimer();
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [resetInactivityTimer]);

  // Mouse move for subtle perspective tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mousePosRef.current = {
        x: (e.clientX / innerWidth - 0.5) * 2,
        y: (e.clientY / innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pointer drag events on stage
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { y: e.clientY, active: true };
    resetInactivityTimer();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current.active) return;
    const deltaY = pointerStartRef.current.y - e.clientY;
    pointerStartRef.current.y = e.clientY;
    pTarget.current += deltaY * 2.2;
    resetInactivityTimer();
  };

  const handlePointerUp = () => {
    pointerStartRef.current.active = false;
  };

  // High performance RAF Animation Loop (0 React re-renders during motion)
  useEffect(() => {
    let rafId: number;
    lastTime.current = performance.now();

    const renderLoop = (time: number) => {
      const dt = Math.min((time - lastTime.current) / 1000, 0.1);
      lastTime.current = time;

      // Auto-play forward drift when idle
      if (!isInteracting.current && !selectedPhoto) {
        pTarget.current += 38 * dt; // 38px/second constant drift
      }

      // Smooth lerp camera translation
      pCurrent.current += (pTarget.current - pCurrent.current) * 0.08;

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const spacing = TOTAL_DEPTH / count;

      let minDistanceToFocal = Infinity;
      let focalIdx = 0;

      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const layout = CARD_LAYOUTS[i % CARD_LAYOUTS.length];
        const zBase = i * spacing;
        const relDist = ((zBase - pCurrent.current) % TOTAL_DEPTH + TOTAL_DEPTH) % TOTAL_DEPTH;

        // Z maps from +550px (exiting past camera) to -3650px (far background)
        const z = 550 - relDist;

        // Opacity smoothly fades in at far back and fades out as it exits past camera
        let opacity = 1;
        if (z < -3200) {
          opacity = Math.max(0, Math.min(1, (z - -3650) / 450));
        } else if (z > 200) {
          opacity = Math.max(0, Math.min(1, (550 - z) / 350));
        } else if (z < -3650 || z > 550) {
          opacity = 0;
        }

        // Depth of field blur at extreme distance
        const blurPx = z < -2800 ? Math.min(4, (-2800 - z) / 200) : 0;

        // Perspective coordinates (px relative to center)
        const xPx = (layout.x / 100) * winW;
        const yPx = (layout.y / 100) * winH;

        el.style.transform = `translate3d(${xPx.toFixed(1)}px, ${yPx.toFixed(1)}px, ${z.toFixed(1)}px) translate(-50%, -50%)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = blurPx > 0.4 ? `blur(${blurPx.toFixed(1)}px)` : 'none';
        el.style.zIndex = `${Math.round(z + 4000)}`;
        el.style.pointerEvents = opacity < 0.2 || z < -2400 ? 'none' : 'auto';

        // Check distance to focal plane (z = 0)
        const focalDist = Math.abs(z);
        if (focalDist < minDistanceToFocal) {
          minDistanceToFocal = focalDist;
          focalIdx = i;
        }
      }

      // Update active photo ticker when focal card shifts
      if (focalIdx !== activeIndexRef.current && filteredMoments[focalIdx]) {
        activeIndexRef.current = focalIdx;
        setActivePhoto(filteredMoments[focalIdx]);
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [count, filteredMoments, selectedPhoto]);

  return (
    <div
      id="documentary-photography"
      className={`authentic-moments-section ${ambientMode ? 'is-ambient' : ''}`}
      ref={containerRef}
    >
      {/* 100vh Sticky Interactive Viewport Stage */}
      <div
        className="authentic-moments-stage"
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Ambient Dark/Warm Glow */}
        <div className="moments-ambient-nebula" aria-hidden="true" />

        {/* TOP-LEFT 3 CONTROLS (Fullscreen, Ambient Light, Reset) */}
        <div className="moments-top-controls">
          <button
            type="button"
            className="moments-control-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            type="button"
            className={`moments-control-btn ${ambientMode ? 'is-active' : ''}`}
            onClick={() => setAmbientMode((prev) => !prev)}
            title="Toggle Ambient Contrast"
            aria-label="Toggle Ambient Contrast"
          >
            {ambientMode ? <Sparkles size={16} /> : <Sun size={16} />}
          </button>

          <button
            type="button"
            className="moments-control-btn"
            onClick={handleReset}
            title="Reset Position"
            aria-label="Reset Position"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* TOP-RIGHT CATEGORY FILTER PILLS */}
        <div className="moments-top-categories">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`moments-category-chip ${activeCategory === tab.key ? 'is-active' : ''}`}
              onClick={() => {
                setActiveCategory(tab.key);
                pTarget.current = 0;
                pCurrent.current = 0;
                resetInactivityTimer();
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DEAD CENTER IN MIDDLE OF SCREEN: "AUTHENTIC Moments." */}
        <div className="moments-center-hero">
          <div className="moments-title-eyebrow">
            <span>BHARATI VIDYAPEETH UNIVERSITY • NAVI MUMBAI</span>
          </div>

          <h2 className="moments-main-title">
            <span className="moments-title-sans">AUTHENTIC</span>
            <span className="moments-title-serif">Moments.</span>
          </h2>

          {activePhoto && (
            <div className="moments-active-ticker" key={activePhoto.id}>
              <span className="moments-ticker-pill">{activePhoto.categoryLabel}</span>
              <span className="moments-ticker-name">{activePhoto.title}</span>
            </div>
          )}
        </div>

        {/* 3D INFINITE DEPTH STREAM SCENE */}
        <div className="moments-3d-scene">
          {filteredMoments.map((item, idx) => {
            const layout = CARD_LAYOUTS[idx % CARD_LAYOUTS.length];
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="moments-stream-card"
                style={{
                  width: `clamp(220px, ${layout.widthVw}vw, 420px)`,
                  aspectRatio: item.aspectRatio || layout.aspect,
                }}
                onClick={() => setSelectedPhoto(item)}
                role="button"
                tabIndex={0}
                aria-label={`View photo: ${item.title}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="moments-stream-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="moments-stream-card-border" />

                {/* Subtle Hover Info Overlay */}
                <div className="moments-card-hover-info">
                  <div className="moments-hover-edition">{item.edition}</div>
                  <div className="moments-hover-title">{item.title}</div>
                  <div className="moments-hover-prompt">
                    <span>INSPECT</span>
                    <ArrowUpRight size={11} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM INSTRUCTION TEXT MATCHING REFERENCE VIDEO */}
        <div className="moments-bottom-instruction">
          <div className="moments-instruction-primary">
            USE MOUSE WHEEL, ARROW KEYS, OR TOUCH TO NAVIGATE
          </div>
          <div className="moments-instruction-secondary">
            AUTO-PLAY RESUMES AFTER 3 SECONDS OF INACTIVITY
          </div>
        </div>
      </div>

      {/* HIGH-RES LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          className="moments-modal-backdrop"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="moments-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="moments-modal-close-btn"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Image View */}
            <div className="moments-modal-media">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="moments-modal-img"
                loading="lazy"
                decoding="async"
              />
              <div className="moments-modal-img-vignette" />
              <div className="moments-modal-badge">
                <span className="moments-beacon" />
                <span>{selectedPhoto.tag}</span>
              </div>
            </div>

            {/* Modal Info Column */}
            <div className="moments-modal-info">
              <div className="moments-modal-eyebrow-row">
                <span className="moments-modal-pill">{selectedPhoto.edition}</span>
                <span className="moments-modal-date">{selectedPhoto.date}</span>
              </div>

              <h3 className="moments-modal-title">{selectedPhoto.title}</h3>

              <div className="moments-modal-event-link">
                <span>EVENT:</span>
                <strong>{selectedPhoto.eventTitle}</strong>
              </div>

              <p className="moments-modal-caption">{selectedPhoto.caption}</p>

              <div className="moments-modal-telemetry">
                <div className="moments-telemetry-row">
                  <span className="telemetry-lbl">METRICS:</span>
                  <span className="telemetry-val">{selectedPhoto.stats}</span>
                </div>
                {selectedPhoto.cameraInfo && (
                  <div className="moments-telemetry-row">
                    <span className="telemetry-lbl">RECORD:</span>
                    <span className="telemetry-val">{selectedPhoto.cameraInfo}</span>
                  </div>
                )}
              </div>

              {onOpenChronicle && (
                <button
                  type="button"
                  className="moments-modal-dossier-btn"
                  onClick={() => {
                    setSelectedPhoto(null);
                    onOpenChronicle(selectedPhoto.eventId);
                  }}
                >
                  <span>VIEW FULL EDITORIAL CHRONICLE</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
