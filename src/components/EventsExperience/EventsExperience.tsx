'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import anime from 'animejs';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Layers,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Code2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  X,
  Camera,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import { eventsParticleStore, EventsSection } from '@/lib/eventsParticleStore';
import { scrollBus } from '@/lib/scrollBus';
import { EVENTS_DATA, EventItem } from '@/data/events';
import './EventsExperience.css';

// =========================================================================
// REAL CURATED DOCUMENTARY PHOTOGRAPHS (Drawn strictly from EVENTS_DATA)
// =========================================================================
interface CuratedPhotoItem {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  year: string;
  tag: string;
  title: string;
  caption: string;
  cameraInfo?: string;
  src: string;
}

const CURATED_DOCUMENTARY_PHOTOS: CuratedPhotoItem[] = [
  {
    id: 'doc-rr-1',
    eventId: 'rocketride-buildathon',
    eventTitle: 'ROCKETRIDE BUILDATHON',
    category: 'ROCKETRIDE',
    year: '2026',
    tag: 'VALEDICTORY / 1ST PLACE',
    title: 'CHAMPIONS PODIUM // 1ST PLACE AWARDS',
    caption: 'Winning buildathon team presented with certificates and the 1st place cheque by RocketRide industry delegates and faculty.',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 5',
    src: '/images/events/rocketride_winner_1st.jpg',
  },
  {
    id: 'doc-hwm2-1',
    eventId: 'hackwithmumbai-2',
    eventTitle: 'HACKWITHMUMBAI 2.0',
    category: 'HACKWITHMUMBAI',
    year: '2026',
    tag: 'MAIN ARENA / 30H FINALE',
    title: '30-HOUR NONSTOP CELEBRATION',
    caption: 'Stage group photo with 70+ builders, faculty mentors, department HoDs and chapter organizers following 30 hours of continuous building.',
    cameraInfo: 'CAM-01 • 24mm F/1.8 • ISO 400 • 1/250s',
    src: '/images/events/hack_with_mumbai_2_image16.jpeg',
  },
  {
    id: 'doc-rr-2',
    eventId: 'rocketride-buildathon',
    eventTitle: 'ROCKETRIDE BUILDATHON',
    category: 'ROCKETRIDE',
    year: '2026',
    tag: 'AUDITORIUM / 183 BUILDERS',
    title: 'AUDITORIUM ASSEMBLY // 47 TEAMS',
    caption: '47 teams comprising 183 students from host and visiting engineering institutions gathered during opening orientation.',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 4',
    src: '/images/events/rocketride_auditorium.jpg',
  },
  {
    id: 'doc-z2w-1',
    eventId: 'zero2web3-buildathon',
    eventTitle: 'ZERO2WEB3 BUILD-A-THON',
    category: 'ZERO2WEB3',
    year: '2026',
    tag: 'CC LAB / GROUND FLOOR',
    title: 'CC LAB // ACTIVE SOLIDITY SPRINT',
    caption: 'Full house of student developers coding Solidity smart contracts in CC Lab Ground Floor during the mini challenge sprint.',
    cameraInfo: 'CAM-01 • 24mm F/2.8 • ISO 500 • 1/160s',
    src: '/images/events/web3_report_image5.jpeg',
  },
  {
    id: 'doc-rr-3',
    eventId: 'rocketride-buildathon',
    eventTitle: 'ROCKETRIDE BUILDATHON',
    category: 'ROCKETRIDE',
    year: '2026',
    tag: 'CC LAB / MENTORSHIP',
    title: 'LAB MENTORSHIP // 6-HOUR SPRINT',
    caption: 'Ryan Christensen reviewing codebases and providing hands-on architectural mentorship during the offline build sprint.',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 4',
    src: '/images/events/rocketride_mentorship_lab.jpg',
  },
  {
    id: 'doc-lit-1',
    eventId: 'learn-it-tour',
    eventTitle: 'LEARN IT TOUR',
    category: 'COMMUNITY',
    year: '2025',
    tag: 'AUDITORIUM / INAUGURATION',
    title: 'COMMUNITY TECH TOUR // 220 BUILDERS',
    caption: 'Over 220 students gathered in the central auditorium for the Learn IT Tour keynote organized with Devnovate.',
    cameraInfo: 'CAM-01 • 28mm F/2.8 • ISO 400 • 1/200s',
    src: '/images/events/learn_it_tour_image12.jpeg',
  },
  {
    id: 'doc-rr-4',
    eventId: 'rocketride-buildathon',
    eventTitle: 'ROCKETRIDE BUILDATHON',
    category: 'ROCKETRIDE',
    year: '2026',
    tag: 'VALEDICTORY / PODIUM',
    title: 'RUNNER-UP AWARDS // VALEDICTORY',
    caption: 'Runner-up teams recognized for high-impact prototype solutions during the valedictory award presentation.',
    cameraInfo: 'PHOTO ARCHIVE • REPORT PAGE 5',
    src: '/images/events/rocketride_winner_2nd.jpg',
  },
  {
    id: 'doc-hwm2-2',
    eventId: 'hackwithmumbai-2',
    eventTitle: 'HACKWITHMUMBAI 2.0',
    category: 'HACKWITHMUMBAI',
    year: '2026',
    tag: 'REGISTRATION / GATE',
    title: 'REGISTRATION DESK // CAMPUS GATES',
    caption: 'Participants queuing up for entry scanning, ID badges, and official hackathon goodies kit.',
    cameraInfo: 'CAM-02 • 28mm F/2.8 • ISO 320 • 1/320s',
    src: '/images/events/hack_with_mumbai_2_image4.jpeg',
  },
];

// =========================================================================
// VERIFIED REAL ACCREDITATIONS & AWARDS (Drawn from repository records)
// =========================================================================
interface VerifiedAwardItem {
  edition: string;
  eventTitle: string;
  date: string;
  place: string;
  team: string;
  project: string;
  prize: string;
  accreditation: string;
}

const VERIFIED_AWARDS: VerifiedAwardItem[] = [
  {
    edition: 'EDITION 02 // 2025',
    eventTitle: 'HACKWITHMUMBAI 1.0',
    date: '21 SEPTEMBER 2025',
    place: '1ST PLACE OVERALL',
    team: 'PulseMesh',
    project: 'Decentralized mesh networking for disaster relief communication',
    prize: '₹25,000 + Cloud Grants',
    accreditation: 'VERIFIED OVERALL CHAMPION',
  },
  {
    edition: 'EDITION 02 // 2025',
    eventTitle: 'HACKWITHMUMBAI 1.0',
    date: '21 SEPTEMBER 2025',
    place: '2ND PLACE',
    team: 'CivicSense',
    project: 'Computer-vision enabled municipal road defect tracker',
    prize: '₹15,000 Prize',
    accreditation: 'RUNNER-UP ACCREDITATION',
  },
  {
    edition: 'EDITION 02 // 2025',
    eventTitle: 'HACKWITHMUMBAI 1.0',
    date: '21 SEPTEMBER 2025',
    place: '3RD PLACE',
    team: 'ZeroAudit',
    project: 'Static security scanner for Ethereum smart contracts',
    prize: '₹10,000 Prize',
    accreditation: '3RD PLACE PODIUM',
  },
  {
    edition: 'EDITION 04 // 2026',
    eventTitle: 'HACKWITHMUMBAI 2.0 NATIONAL HACKATHON',
    date: '7–8 FEBRUARY 2026',
    place: 'NATIONAL PRIZE POOL',
    team: '80 Finalist Teams (280 Builders)',
    project: '5 Indian states and 40+ colleges competing across EdTech, HealthTech, CyberTech, AgriTech, and FinTech',
    prize: '₹64,000+ Prize Pool',
    accreditation: 'SP JAIN GLOBAL SPONSORED',
  },
  {
    edition: 'EDITION 05 // 2026',
    eventTitle: 'ZERO2WEB3 BUILD-A-THON',
    date: '5 MARCH 2026',
    place: 'CC LAB PODIUM',
    team: 'Outstanding DApp Teams',
    project: 'Gas-optimized Solidity architectures and decentralized token contracts evaluated in CC Lab',
    prize: 'Winner Trophies & Physical Certificates',
    accreditation: 'CHAPTER MERIT ACCREDITED',
  },
  {
    edition: 'EDITION 06 // 2026',
    eventTitle: 'ROCKETRIDE BUILDATHON MUMBAI EDITION',
    date: '29 AUGUST 2026',
    place: 'CHAMPIONS PODIUM',
    team: '1st Place Prototype Laureates',
    project: 'High-velocity 6-hour MVP evaluated on architectural ingenuity by San Francisco Chief Architect Rod Christensen',
    prize: '1st Place Cheque & Delegate Certifications',
    accreditation: 'SAN FRANCISCO DELEGATION RECOGNIZED',
  },
];

export function EventsExperience() {
  // Requirement: All panels begin collapsed by default (no panel expanded on initial load)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('ALL');

  // DOM Refs for animation coordination
  const heroKickerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroMetaRef = useRef<HTMLDivElement>(null);

  const gallerySectionRef = useRef<HTMLElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const photosSectionRef = useRef<HTMLElement>(null);
  const photosGridRef = useRef<HTMLDivElement>(null);
  const awardsSectionRef = useRef<HTMLElement>(null);
  const awardsGridRef = useRef<HTMLDivElement>(null);

  const heroAnimatedRef = useRef<boolean>(false);
  const panelsRevealedRef = useRef<boolean>(false);
  const photosRevealedRef = useRef<boolean>(false);
  const awardsRevealedRef = useRef<boolean>(false);
  const editorialStoryRef = useRef<HTMLElement>(null);

  // Selected event object & index
  const selectedEvent = useMemo(() => {
    if (!selectedId) return null;
    return EVENTS_DATA.find((e) => e.id === selectedId) || null;
  }, [selectedId]);

  const currentIndex = useMemo(() => {
    if (!selectedEvent) return -1;
    return EVENTS_DATA.findIndex((e) => e.id === selectedEvent.id);
  }, [selectedEvent]);

  // Click active panel toggles back to null (compact row), click another switches to it
  const handleSelectEvent = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handlePrevEvent = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (currentIndex <= 0) {
        setSelectedId(EVENTS_DATA[EVENTS_DATA.length - 1].id);
      } else {
        setSelectedId(EVENTS_DATA[currentIndex - 1].id);
      }
    },
    [currentIndex]
  );

  const handleNextEvent = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (currentIndex === -1 || currentIndex >= EVENTS_DATA.length - 1) {
        setSelectedId(EVENTS_DATA[0].id);
      } else {
        setSelectedId(EVENTS_DATA[currentIndex + 1].id);
      }
    },
    [currentIndex]
  );

  // Global keyboard shortcuts: Esc to collapse, ArrowLeft/Right to cycle editions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null);
      } else if (e.key === 'ArrowRight' && selectedId) {
        handleNextEvent();
      } else if (e.key === 'ArrowLeft' && selectedId) {
        handlePrevEvent();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleNextEvent, handlePrevEvent]);

  // Scroll active panel into view smoothly when selected
  useEffect(() => {
    if (selectedId && galleryTrackRef.current) {
      const activeEl = galleryTrackRef.current.querySelector<HTMLElement>('.hwi-panel--active');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedId]);

  // Staggered reveal of editorial dossier items when event changes
  useEffect(() => {
    if (!selectedEvent || !editorialStoryRef.current) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    anime({
      targets: editorialStoryRef.current.querySelectorAll('.editorial-reveal-item'),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 650,
      delay: anime.stagger(75, { start: 40 }),
      easing: 'cubicBezier(0.16, 1, 0.3, 1)',
    });
  }, [selectedEvent?.id]);

  // -----------------------------------------------------------------------
  // 1. HERO: IGNITION ENTRANCE (Anime.js + Controlled Particle Convergence)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (heroAnimatedRef.current) return;
    heroAnimatedRef.current = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      eventsParticleStore.setHeroConvergence(0);
      return;
    }

    // Initialize subtle controlled convergence during hero entrance
    eventsParticleStore.setHeroConvergence(1.0);

    const tl = anime.timeline({
      easing: 'cubicBezier(0.16, 1, 0.3, 1)',
      complete: () => {
        // Once entrance finishes, gracefully ease hero convergence to 0
        anime({
          targets: { val: 1.0 },
          val: 0,
          duration: 900,
          easing: 'easeOutQuad',
          update: (anim) => {
            const v = Number(anim.animations[0].currentValue);
            eventsParticleStore.setHeroConvergence(v);
          },
        });
      },
    });

    if (heroKickerRef.current) {
      tl.add({
        targets: heroKickerRef.current,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 650,
      });
    }

    if (heroTitleRef.current) {
      const words = heroTitleRef.current.querySelectorAll('.hero-word');
      tl.add(
        {
          targets: words,
          opacity: [0, 1],
          translateY: [32, 0],
          duration: 850,
          delay: anime.stagger(90),
        },
        '-=350'
      );
    }

    if (heroDescRef.current) {
      tl.add(
        {
          targets: heroDescRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 700,
        },
        '-=450'
      );
    }

    if (heroMetaRef.current) {
      tl.add(
        {
          targets: heroMetaRef.current,
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 600,
        },
        '-=400'
      );
    }
  }, []);

  // -----------------------------------------------------------------------
  // 2. SCROLL-DRIVEN PARTICLE JOURNEY (Continuous Scroll Tracking)
  // -----------------------------------------------------------------------
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const vh = window.innerHeight;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const totalHeight = Math.max(1, document.documentElement.scrollHeight - vh);
        const progress = Math.min(1, Math.max(0, scrollY / totalHeight));

        const panelsEl = gallerySectionRef.current;
        const photosEl = photosSectionRef.current;
        const awardsEl = awardsSectionRef.current;

        let currentSection: EventsSection = 'hero';
        if (awardsEl && scrollY >= awardsEl.offsetTop - vh * 0.45) {
          currentSection = 'awards';
        } else if (photosEl && scrollY >= photosEl.offsetTop - vh * 0.45) {
          currentSection = 'photos';
        } else if (panelsEl && scrollY >= panelsEl.offsetTop - vh * 0.45) {
          currentSection = 'panels';
        } else {
          currentSection = 'hero';
        }

        eventsParticleStore.updateSection(currentSection, progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const unsubscribeBus = scrollBus.subscribe(() => {
      handleScroll();
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeBus();
    };
  }, []);

  // -----------------------------------------------------------------------
  // 3. INTERSECTION OBSERVERS FOR CONTROLLED SECTION REVEALS
  // -----------------------------------------------------------------------
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // A. Panels Section Entrance Stagger
    const panelsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !panelsRevealedRef.current) {
            panelsRevealedRef.current = true;
            if (galleryTrackRef.current && !prefersReducedMotion) {
              anime({
                targets: galleryTrackRef.current.querySelectorAll('.hwi-panel'),
                opacity: [0, 1],
                translateY: [32, 0],
                duration: 700,
                delay: anime.stagger(60),
                easing: 'cubicBezier(0.16, 1, 0.3, 1)',
              });
            }
          }
        });
      },
      { threshold: 0.12 }
    );

    if (gallerySectionRef.current) {
      panelsObserver.observe(gallerySectionRef.current);
    }

    // B. Photos Section Reveal
    const photosObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !photosRevealedRef.current) {
            photosRevealedRef.current = true;
            if (photosGridRef.current && !prefersReducedMotion) {
              anime({
                targets: photosGridRef.current.querySelectorAll('.docu-photo-card'),
                opacity: [0, 1],
                translateY: [28, 0],
                duration: 750,
                delay: anime.stagger(80),
                easing: 'cubicBezier(0.16, 1, 0.3, 1)',
              });
            }
          }
        });
      },
      { threshold: 0.14 }
    );

    if (photosSectionRef.current) {
      photosObserver.observe(photosSectionRef.current);
    }

    // C. Awards Section Reveal + Single Particle Pulse Trigger
    const awardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !awardsRevealedRef.current) {
            awardsRevealedRef.current = true;

            // Trigger brief, elegant particle pulse in GlobalBackground
            eventsParticleStore.triggerPulse();

            if (awardsGridRef.current && !prefersReducedMotion) {
              anime({
                targets: awardsGridRef.current.querySelectorAll('.chronicles-award-card'),
                opacity: [0, 1],
                translateY: [28, 0],
                duration: 750,
                delay: anime.stagger(80),
                easing: 'cubicBezier(0.16, 1, 0.3, 1)',
              });
            }
          }
        });
      },
      { threshold: 0.14 }
    );

    if (awardsSectionRef.current) {
      awardsObserver.observe(awardsSectionRef.current);
    }

    return () => {
      panelsObserver.disconnect();
      photosObserver.disconnect();
      awardsObserver.disconnect();
    };
  }, []);

  // Filtered documentary photographs
  const filteredPhotos = useMemo(() => {
    if (activePhotoCategory === 'ALL') return CURATED_DOCUMENTARY_PHOTOS;
    return CURATED_DOCUMENTARY_PHOTOS.filter((p) => p.category === activePhotoCategory);
  }, [activePhotoCategory]);

  return (
    <div className="hwi-events-page chronicles-page">
      {/* ================================================================= */}
      {/* 1. HERO: IGNITION                                                 */}
      {/* Refined Anime.js entrance + particle convergence coordination     */}
      {/* ================================================================= */}
      <section id="hero-ignition" className="chronicles-hero-section">
        <div className="container">
          <div className="chronicles-hero__inner">
            {/* Kicker */}
            <div className="chronicles-hero__kicker" ref={heroKickerRef}>
              <span className="hwi-pulse-beacon" />
              <span className="type-eyebrow text-accent">PARTICLE CHRONICLES</span>
              <span className="kicker-sep">•</span>
              <span className="type-eyebrow text-tertiary">HACKWITHINDIA BVUDET-NM</span>
            </div>

            {/* Main Headline: "Ideas don't stay ideas." */}
            <h1 className="chronicles-hero__title" ref={heroTitleRef}>
              <span className="hero-word">Ideas</span>{' '}
              <span className="hero-word">don&apos;t</span>{' '}
              <span className="hero-word highlight-red">stay</span>{' '}
              <span className="hero-word">ideas.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="chronicles-hero__desc" ref={heroDescRef}>
              From first-line scripts to air-gapped security frameworks and cross-border buildathons.
              A chronological journey through our milestone hackathons, masterclasses, and builder assemblies.
            </p>

            {/* Metric Accents & KokonutBadges */}
            <div className="chronicles-hero__meta" ref={heroMetaRef}>
              <div className="meta-badges-cluster">
                <KokonutBadge variant="accent" dot>
                  07 MILESTONE EDITIONS
                </KokonutBadge>
                <KokonutBadge variant="outline">800+ BUILDERS ASSEMBLED</KokonutBadge>
                <KokonutBadge variant="outline">₹1,00,000+ COMMITTED PRIZES</KokonutBadge>
              </div>

              <div className="meta-scroll-prompt">
                <a
                  href="#edition-panels"
                  className="chronicles-hero-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('edition-panels')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>EXPLORE CHRONICLES</span>
                  <span className="cta-arrow-down">↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. EVENT PANELS: SCROLL REVEAL + FULL-WIDTH EXPANSION             */}
      {/* Compact horizontal row -> 100% full-width expansion interaction   */}
      {/* ================================================================= */}
      <section
        id="edition-panels"
        ref={gallerySectionRef}
        className="hwi-gallery-section chronicles-panels-section"
        aria-label="Year and Event Edition Gallery"
      >
        <div className="container">
          {/* Gallery Subheader bar with indicator, edition pills, and navigation */}
          <div className="hwi-gallery-bar">
            <div className="gallery-indicator">
              <span className="gallery-indicator-kicker">EDITION ARCHIVE //</span>
              <span className="gallery-indicator-value">
                {selectedEvent
                  ? `EDITION ${String(currentIndex + 1).padStart(2, '0')} // ${(selectedEvent.shortTitle || selectedEvent.title).toUpperCase()}`
                  : 'ALL 07 EDITIONS'}
              </span>
            </div>

            {/* Quick Edition Selector Pills */}
            <div className="gallery-edition-pills" role="tablist" aria-label="Select Edition">
              {EVENTS_DATA.map((ev, i) => {
                const isItemActive = selectedId === ev.id;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    role="tab"
                    aria-selected={isItemActive}
                    className={`gallery-pill-btn ${isItemActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectEvent(ev.id)}
                    title={`Edition ${String(i + 1).padStart(2, '0')}: ${ev.title}`}
                  >
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>

            <div className="gallery-nav-controls">
              {selectedId && (
                <button
                  type="button"
                  className="gallery-restore-btn"
                  onClick={() => setSelectedId(null)}
                  title="Restore compact row (or press Esc)"
                >
                  <span>RESTORE OVERVIEW</span>
                  <X size={14} />
                </button>
              )}

              <button
                type="button"
                className="gallery-nav-btn gallery-nav-btn--prev"
                onClick={handlePrevEvent}
                aria-label="Previous edition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="gallery-nav-btn gallery-nav-btn--next"
                onClick={handleNextEvent}
                aria-label="Next edition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Gallery Wrapper */}
          <div className="hwi-gallery-wrapper">
            <button
              type="button"
              className="hwi-palette-floating-arrow hwi-palette-floating-arrow--left"
              onClick={handlePrevEvent}
              aria-label="Previous edition"
              data-cursor="link"
              data-cursor-label="PREV"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Horizontal Flex Track: Compact row in default state, 100% full-width on click */}
            <div
              className={`hwi-gallery-track ${selectedId ? 'is-expanded' : ''}`}
              ref={galleryTrackRef}
            >
              {EVENTS_DATA.map((event, idx) => {
                const isActive = selectedId === event.id;
                const isIdle = selectedId !== null && !isActive;

                return (
                  <div
                    key={event.id}
                    className={`hwi-panel ${
                      isActive ? 'hwi-panel--active' : isIdle ? 'hwi-panel--idle' : 'hwi-panel--idle'
                    }`}
                    style={
                      {
                        '--panel-accent': event.accentColor || '#EF4444',
                      } as React.CSSProperties
                    }
                    onClick={() => handleSelectEvent(event.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    aria-label={`Edition ${String(idx + 1).padStart(2, '0')}: ${event.title}`}
                    data-cursor="link"
                    data-cursor-label={isActive ? 'CLOSE' : 'OPEN'}
                  >
                    {/* Visual Background: Event Photo or Vector Art */}
                    {event.cardImage ? (
                      <div
                        className="hwi-panel__bg-photo"
                        style={{ backgroundImage: `url(${event.cardImage})` }}
                      />
                    ) : (
                      <div className="hwi-panel__bg-art">
                        <PanelArtwork
                          graphicType={event.hudGraphicType || 'grid'}
                          accent={event.accentColor || '#EF4444'}
                        />
                      </div>
                    )}

                    {/* Gradient Overlay Scrim */}
                    <div className="hwi-panel__scrim" />

                    {/* ── COLLAPSED STATE ELEMENTS (Fades out when panel expands) ── */}
                    {/* Top-Left: TEDx Eyebrow + Bold Big Edition Number */}
                    <div className="hwi-panel__tedx-header">
                      <span className="hwi-panel__tedx-tag">EDITION</span>
                      <span className="hwi-panel__tedx-num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Right-Side: Vertical Rotated Theme / Title */}
                    <div className="hwi-panel__tedx-vertical" aria-hidden="true">
                      <span>{(event.shortTitle || event.title).toUpperCase()}</span>
                    </div>

                    {/* Bottom-Left: Event Date */}
                    <div className="hwi-panel__tedx-footer">
                      <span className="tedx-footer-date">{event.date}</span>
                    </div>

                    {/* ── EXPANDED STATE CONTENT (Revealed in the 100% full-width panel) ── */}
                    {isActive && (
                      <div className="hwi-panel__expanded-content" aria-hidden={false}>
                        {/* Top Strip: Edition badge, category, and collapse chip */}
                        <div className="expanded-top-strip">
                          <div className="expanded-tag-cluster">
                            <span className="expanded-edition-pill">
                              EDITION {String(idx + 1).padStart(2, '0')} // {event.year}
                            </span>
                            <span className="expanded-category-pill">{event.category}</span>
                            <span
                              className={`expanded-status-pill ${
                                event.status === 'upcoming' ? 'is-upcoming' : 'is-archived'
                              }`}
                            >
                              {event.status === 'upcoming' ? 'REGISTRATION OPEN' : 'ARCHIVED DOSSIER'}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="expanded-collapse-chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(null);
                            }}
                            aria-label="Restore all panels"
                            data-cursor="link"
                            data-cursor-label="RESTORE"
                          >
                            <span>RESTORE OVERVIEW</span>
                            <X size={14} />
                          </button>
                        </div>

                        {/* Main Middle Row: Heroic Typography & Asymmetric Editorial Context */}
                        <div className="expanded-main-hero">
                          <div className="expanded-main-left">
                            <div className="expanded-theme-line">
                              <span className="theme-line-rule" />
                              <span className="theme-line-text">THEME // {event.theme.toUpperCase()}</span>
                            </div>

                            <h2 className="expanded-headline">{event.title}</h2>

                            <p className="expanded-narrative">
                              {event.shortDescription || event.desc}
                            </p>

                            {/* Minimal Essential Context Strip */}
                            <div className="expanded-meta-strip">
                              <div className="meta-strip-item">
                                <Calendar size={14} />
                                <span>{event.date}</span>
                              </div>
                              <span className="meta-strip-sep">•</span>
                              <div className="meta-strip-item">
                                <MapPin size={14} />
                                <span>{event.venue}</span>
                              </div>
                              <span className="meta-strip-sep">•</span>
                              <div className="meta-strip-item">
                                <Clock size={14} />
                                <span>{event.duration}</span>
                              </div>
                              <span className="meta-strip-sep">•</span>
                              <div className="meta-strip-item">
                                <Users size={14} />
                                <span>
                                  {typeof event.participants === 'string' &&
                                  (event.participants.includes('Builders') ||
                                    event.participants.includes('Researchers'))
                                    ? event.participants
                                    : `${event.participants} Participants`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Monumental Vertical Rotated Title (Echoing Reference Video) */}
                          <div className="expanded-main-right" aria-hidden="true">
                            <span className="monumental-vertical-title">
                              {(event.shortTitle || event.title).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="expanded-bottom-actions">
                          {event.status === 'upcoming' ? (
                            <Link
                              href={event.ctaUrl || '/join'}
                              className="expanded-cta-btn expanded-cta-btn--primary"
                              onClick={(e) => e.stopPropagation()}
                              data-cursor="link"
                              data-cursor-label="APPLY"
                            >
                              <span>{event.ctaLabel || 'REGISTER FOR HACKATHON'}</span>
                              <ArrowUpRight size={16} />
                            </Link>
                          ) : (
                            <a
                              href="#editorial-story"
                              className="expanded-cta-btn expanded-cta-btn--primary"
                              onClick={(e) => e.stopPropagation()}
                              data-cursor="link"
                              data-cursor-label="EXPLORE"
                            >
                              <span>EXPLORE COMPLETE EVENT CHRONICLE</span>
                              <span className="action-arrow">↓</span>
                            </a>
                          )}

                          <button
                            type="button"
                            className="expanded-hint-text"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(null);
                            }}
                          >
                            <span>Click anywhere on panel or press Esc to restore overview</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="hwi-palette-floating-arrow hwi-palette-floating-arrow--right"
              onClick={handleNextEvent}
              aria-label="Next edition"
              data-cursor="link"
              data-cursor-label="NEXT"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2.5 PREMIUM EDITORIAL DOSSIER (Revealed when an edition expands)  */}
      {/* Art-directed, high-contrast, journal-style event chronicle         */}
      {/* ================================================================= */}
      {selectedEvent && (
        <section
          id="editorial-story"
          ref={editorialStoryRef}
          className="editorial-dossier-section"
          key={`story-${selectedEvent.id}`}
        >
          <div className="container">
            <div className="editorial-dossier-container">
              {/* ── 1. MASTHEAD & EVENT IDENTITY ── */}
              <header className="editorial-masthead editorial-reveal-item">
                <div className="editorial-masthead__topbar">
                  <div className="editorial-masthead__tags">
                    <span className="editorial-beacon" />
                    <span className="editorial-edition-tag">
                      EDITION {String(currentIndex + 1).padStart(2, '0')} // {selectedEvent.year}
                    </span>
                    <span className="editorial-sep">•</span>
                    <span className="editorial-category-tag">{selectedEvent.category}</span>
                    <span className="editorial-sep">•</span>
                    <span className="editorial-status-tag">
                      {selectedEvent.status === 'upcoming' ? 'ACTIVE DOSSIER' : 'ARCHIVED RECORD'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="editorial-close-chip"
                    onClick={() => setSelectedId(null)}
                    aria-label="Restore overview panels"
                    data-cursor="link"
                    data-cursor-label="RESTORE"
                  >
                    <span>RESTORE OVERVIEW</span>
                    <X size={13} />
                  </button>
                </div>

                <div className="editorial-masthead__content">
                  <div className="editorial-theme-kicker">
                    <span className="theme-kicker-dash" />
                    <span className="theme-kicker-text">THEME // {selectedEvent.theme.toUpperCase()}</span>
                  </div>

                  <h2 className="editorial-display-title">
                    {selectedEvent.title}
                  </h2>

                  <p className="editorial-lead-summary">
                    {selectedEvent.shortDescription || selectedEvent.desc}
                  </p>
                </div>
              </header>

              {/* ── 2. SOPHISTICATED HORIZONTAL INFORMATION RAIL ── */}
              {/* Replaces the 4 uniform dashboard cards with an asymmetric typographic metadata rail */}
              <div className="editorial-meta-rail editorial-reveal-item" role="region" aria-label="Event telemetry rail">
                <div className="meta-rail-col">
                  <div className="meta-rail-col__header">
                    <Calendar size={13} className="meta-rail-icon" />
                    <span className="meta-rail-label">01 // SCHEDULED DATE</span>
                  </div>
                  <div className="meta-rail-col__val">{selectedEvent.date}</div>
                  <div className="meta-rail-col__detail">{selectedEvent.year} Chapter Milestone</div>
                </div>

                <div className="meta-rail-col">
                  <div className="meta-rail-col__header">
                    <MapPin size={13} className="meta-rail-icon" />
                    <span className="meta-rail-label">02 // HOST VENUE</span>
                  </div>
                  <div className="meta-rail-col__val">{selectedEvent.venue}</div>
                  <div className="meta-rail-col__detail">BVUDET Navi Mumbai</div>
                </div>

                <div className="meta-rail-col">
                  <div className="meta-rail-col__header">
                    <Clock size={13} className="meta-rail-icon" />
                    <span className="meta-rail-label">03 // FORMAT & SPRINT</span>
                  </div>
                  <div className="meta-rail-col__val">{selectedEvent.duration}</div>
                  <div className="meta-rail-col__detail">Intensive Execution Window</div>
                </div>

                <div className="meta-rail-col">
                  <div className="meta-rail-col__header">
                    <Users size={13} className="meta-rail-icon" />
                    <span className="meta-rail-label">04 // BUILDER COHORT</span>
                  </div>
                  <div className="meta-rail-col__val">
                    {typeof selectedEvent.participants === 'string' &&
                    (selectedEvent.participants.includes('Builders') ||
                      selectedEvent.participants.includes('Researchers') ||
                      selectedEvent.participants.includes('Participants'))
                      ? selectedEvent.participants
                      : `${selectedEvent.participants} Participants`}
                  </div>
                  <div className="meta-rail-col__detail">
                    {selectedEvent.projectsCount ? `${selectedEvent.projectsCount}` : 'Verified Deployment'}
                  </div>
                </div>
              </div>

              {/* ── 3. CHRONICLE & MISSION: PURPOSEFUL "IDEAS IN MOTION" PARTICLE ART ── */}
              <div
                className="editorial-chronicle-wrapper editorial-reveal-item"
                role="region"
                aria-label="Chronicle narrative and mission"
              >
                {/* Purposeful "Ideas in Motion" particle art behind content */}
                <ChronicleParticleArt accentColor={selectedEvent.accentColor} />
                <div className="chronicle-particles-vignette" />

                <div className="editorial-chronicle-content">
                  <div className="chronicle-eyebrow">
                    <span className="chronicle-eyebrow__num">01</span>
                    <span className="chronicle-eyebrow__rule" />
                    <span className="chronicle-eyebrow__title">ARCHIVAL DISPATCH & MISSION</span>
                  </div>

                  <h3 className="chronicle-heading">
                    The Atmosphere, Architecture & Engineering Challenge
                  </h3>

                  <div className="chronicle-body">
                    <p className="chronicle-lead-p">
                      {selectedEvent.fullDescription}
                    </p>
                  </div>

                  <div className="chronicle-provenance">
                    <div className="provenance-indicator" />
                    <span className="provenance-text">
                      DOCUMENTED ARCHIVE // HACKWITHINDIA STUDENT CHAPTER • BVUDET NAVI MUMBAI
                    </span>
                  </div>
                </div>
              </div>

              {/* ── 4. EVENT PHOTOGRAPHY: CONTINUOUS EDITORIAL MARQUEE ── */}
              <EventPhotoMarquee event={selectedEvent} />

              {/* ── 5. KEY EVENT HIGHLIGHTS: SEQUENTIAL OPERATIONAL LEDGER ── */}
              {/* High-contrast sequential ledger of operational milestones */}
              {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                <div className="editorial-highlights-block editorial-reveal-item">
                  <div className="highlights-header">
                    <div className="chronicle-eyebrow">
                      <span className="chronicle-eyebrow__num">03</span>
                      <span className="chronicle-eyebrow__rule" />
                      <span className="chronicle-eyebrow__title">KEY EVENT HIGHLIGHTS</span>
                    </div>
                    <h3 className="highlights-main-title">
                      Operational Milestones & Architectural Takeaways
                    </h3>
                  </div>

                  <div className="editorial-milestones-ledger">
                    {selectedEvent.highlights.map((h, i) => {
                      const colonIdx = h.indexOf(': ');
                      const hasPrefix = colonIdx > 0 && colonIdx < 45;
                      const titlePart = hasPrefix ? h.substring(0, colonIdx).trim() : null;
                      const descPart = hasPrefix ? h.substring(colonIdx + 2).trim() : h;

                      return (
                        <div key={i} className="editorial-milestone-row">
                          <div className="milestone-index-col">
                            <span className="milestone-index">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="milestone-line" />
                          </div>

                          <div className="milestone-content-col">
                            {titlePart ? (
                              <>
                                <h4 className="milestone-title">{titlePart}</h4>
                                <p className="milestone-desc">{descPart}</p>
                              </>
                            ) : (
                              <p className="milestone-desc milestone-desc--standalone">
                                {descPart}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 6. DISTINGUISHED DELEGATES & FACULTY COORDINATORS ── */}
              {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                <div className="editorial-speakers-block editorial-reveal-item">
                  <div className="highlights-header">
                    <div className="chronicle-eyebrow">
                      <span className="chronicle-eyebrow__num">04</span>
                      <span className="chronicle-eyebrow__rule" />
                      <span className="chronicle-eyebrow__title">
                        {selectedEvent.id === 'rocketride-buildathon'
                          ? 'INDUSTRY DELEGATES & LEADERSHIP'
                          : selectedEvent.id === 'ctf-zero-internet'
                          ? 'FACULTY & CHAPTER COORDINATORS'
                          : 'DISTINGUISHED SPEAKERS & MENTORS'}
                      </span>
                    </div>
                    <h3 className="highlights-main-title">
                      Keynote Speakers, Jury & Academic Leadership
                    </h3>
                  </div>

                  <div className="editorial-speakers-grid">
                    {selectedEvent.speakers.map((sp, i) => (
                      <div key={i} className="editorial-speaker-card">
                        <div className="editorial-speaker-avatar">
                          {sp.image ? (
                            <img
                              src={sp.image}
                              alt={sp.name}
                              className="speaker-photo"
                              loading="lazy"
                            />
                          ) : (
                            <div className="speaker-placeholder-box">
                              <Users size={22} className="speaker-avatar-icon" />
                              <span className="speaker-avatar-tag">
                                {sp.placeholderLabel || 'FACULTY'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="editorial-speaker-meta">
                          <h4 className="speaker-name">{sp.name}</h4>
                          <span className="speaker-role">{sp.role}</span>
                          {sp.company && (
                            <span className="speaker-company">{sp.company}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 6. SEAMLESS ARCHIVE TRANSITION CALLOUT ── */}
              <div className="editorial-archive-callout editorial-reveal-item">
                <div className="archive-callout-inner">
                  <div className="archive-callout-copy">
                    <span className="callout-kicker">CONTINUE THE CHRONICLE</span>
                    <h4 className="callout-heading">Explore the Complete Documentary Archive</h4>
                    <p className="callout-desc">
                      Browse authentic event photography, builder sprints, and valedictory award podiums below.
                    </p>
                  </div>

                  <div className="archive-callout-actions">
                    <a href="#documentary-photography" className="archive-jump-btn">
                      <span>VIEW PHOTO ARCHIVE</span>
                      <ArrowUpRight size={15} />
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="archive-restore-btn"
                    >
                      <span>RESTORE OVERVIEW</span>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* 3. PHOTOGRAPHY: DOCUMENTARY REVEAL                                */}
      {/* Real event photographs as the visual centrepiece                  */}
      {/* ================================================================= */}
      <section
        id="documentary-photography"
        ref={photosSectionRef}
        className="chronicles-photography-section"
      >
        <div className="container">
          <div className="chronicles-section-header">
            <div className="section-header-kicker">
              <span className="hwi-pulse-beacon" />
              <span className="type-eyebrow text-accent">DOCUMENTARY ARCHIVE</span>
              <span className="kicker-sep">•</span>
              <span className="type-eyebrow text-tertiary">REAL EVENT PHOTOGRAPHS</span>
            </div>
            <h2 className="chronicles-section-title">
              AUTHENTIC <span className="title-dim">MOMENTS.</span>
            </h2>
            <p className="chronicles-section-desc">
              Real moments captured across hackathons, keynotes, lab mentorships, and student delegations.
              No stock photography or generic renders.
            </p>

            {/* Photo Category Filter Tabs */}
            <div className="docu-filter-tabs">
              {[
                { label: 'ALL DISPATCHES', key: 'ALL' },
                { label: 'ROCKETRIDE BUILDATHON', key: 'ROCKETRIDE' },
                { label: 'HACKWITHMUMBAI 2.0', key: 'HACKWITHMUMBAI' },
                { label: 'ZERO2WEB3', key: 'ZERO2WEB3' },
                { label: 'COMMUNITY TOURS', key: 'COMMUNITY' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`docu-filter-tab ${activePhotoCategory === tab.key ? 'is-active' : ''}`}
                  onClick={() => setActivePhotoCategory(tab.key)}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Documentary Photo Grid */}
          <div className="docu-photos-grid" ref={photosGridRef}>
            {filteredPhotos.map((photo, pIdx) => {
              const isHeroFeatured = pIdx === 0 && activePhotoCategory === 'ALL';

              return (
                <div
                  key={photo.id}
                  className={`docu-photo-card ${isHeroFeatured ? 'docu-photo-card--featured' : ''}`}
                >
                  <div className="docu-photo-frame">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="docu-photo-img"
                      loading="lazy"
                    />
                    <div className="docu-photo-overlay" />
                    <span className="docu-photo-badge">{photo.tag}</span>
                    <div className="docu-scanline" />
                  </div>

                  <div className="docu-photo-content">
                    <div className="docu-meta-top">
                      <span className="docu-event-tag">{photo.eventTitle}</span>
                      <span className="docu-year-tag">{photo.year}</span>
                    </div>

                    <h3 className="docu-photo-title">{photo.title}</h3>
                    <p className="docu-photo-caption">{photo.caption}</p>

                    {photo.cameraInfo && (
                      <div className="docu-photo-footer">
                        <Camera size={13} />
                        <span>{photo.cameraInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. AWARDS: THE IMPACT                                             */}
      {/* Verified winning projects, results, and accreditations            */}
      {/* ================================================================= */}
      <section
        id="verified-awards"
        ref={awardsSectionRef}
        className="chronicles-awards-section"
      >
        <div className="container">
          <div className="chronicles-section-header">
            <div className="section-header-kicker">
              <span className="hwi-pulse-beacon" />
              <span className="type-eyebrow text-accent">VERIFIED IMPACT</span>
              <span className="kicker-sep">•</span>
              <span className="type-eyebrow text-tertiary">PODIUM & ACCREDITATIONS</span>
            </div>
            <h2 className="chronicles-section-title">
              THE <span className="title-dim">IMPACT.</span>
            </h2>
            <p className="chronicles-section-desc">
              Proven results, winning prototypes, and recognized student cohorts across milestone editions.
              Authentic merit evaluated by industry delegates, faculty coordinators, and institutional sponsors.
            </p>
          </div>

          {/* Awards Editorial Stack */}
          <div className="chronicles-awards-grid" ref={awardsGridRef}>
            {VERIFIED_AWARDS.map((award, aIdx) => (
              <div key={aIdx} className="chronicles-award-card">
                <div className="award-card-header">
                  <div className="award-edition-meta">
                    <span className="award-edition-pill">{award.edition}</span>
                    <span className="award-date-text">{award.date}</span>
                  </div>
                  <span className="award-accreditation-badge">
                    <ShieldCheck size={14} />
                    <span>{award.accreditation}</span>
                  </span>
                </div>

                <div className="award-card-body">
                  <div className="award-place-badge">
                    <Trophy size={16} />
                    <span>{award.place}</span>
                  </div>

                  <div className="award-details">
                    <h3 className="award-team-name">{award.team}</h3>
                    <p className="award-project-desc">{award.project}</p>
                    <span className="award-event-ref">{award.eventTitle}</span>
                  </div>

                  <div className="award-prize-container">
                    <span className="prize-label">RECOGNITION</span>
                    <span className="prize-value">{award.prize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Banner */}
          <div className="chronicles-impact-banner">
            <div className="impact-banner-content">
              <span className="impact-banner-kicker">JOIN THE NEXT COHORT</span>
              <h3 className="impact-banner-title">Build with India&apos;s most active student chapter.</h3>
              <p className="impact-banner-desc">
                From pioneering air-gapped security competitions to shipping full-stack products,
                HackWithIndia BVUDET-NM provides the arena, mentors, and hardware.
              </p>
            </div>
            <Link href="/join" className="impact-banner-btn">
              <span>REGISTER FOR ENTRY</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// =========================================================================
// CHRONICLE PARTICLE ART — "IDEAS IN MOTION"
// Restrained, cinematic particle composition behind the Chronicle narrative.
// Flowing trajectories converging toward focal hubs, fine constellation lines,
// perimeter density with center text clearance, and subtle scroll response.
// =========================================================================
interface HubNode {
  x: number;
  y: number;
  aspect: number;
}

interface ChronicleParticle {
  hubIndex: number;
  baseRadius: number;
  angle: number;
  speed: number;
  radialWobble: number;
  wobbleSpeed: number;
  size: number;
  baseAlpha: number;
  phase: number;
  colorType: 'accent' | 'amber' | 'neutral';
  x: number;
  y: number;
  alpha: number;
}

function ChronicleParticleArt({ accentColor = '#EF4444' }: { accentColor?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let isVisible = true;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 400;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5);

    const resize = () => {
      if (!container || !canvas || !ctx) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Respect reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 4 Focal Knowledge Hubs ("Ideas in Motion") across perimeter corners
    const getHubs = (): HubNode[] => [
      { x: width * 0.86, y: height * 0.20, aspect: 0.72 }, // Top-Right: Industry & Mentorship Hub
      { x: width * 0.14, y: height * 0.20, aspect: 0.75 }, // Top-Left: Innovation Origin Hub
      { x: width * 0.12, y: height * 0.80, aspect: 0.8 },  // Bottom-Left: Student Builder Hub
      { x: width * 0.88, y: height * 0.78, aspect: 0.75 }, // Bottom-Right: Code & Deployment Hub
    ];

    // Seed 60 particles
    const PARTICLE_COUNT = 60;
    const particles: ChronicleParticle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const hubIndex = i % 4;
      const typeRoll = Math.random();
      const colorType: 'accent' | 'amber' | 'neutral' =
        typeRoll < 0.16 ? 'accent' : typeRoll < 0.28 ? 'amber' : 'neutral';

      particles.push({
        hubIndex,
        baseRadius: 40 + Math.random() * 140,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.0022 + 0.0016) * (i % 2 === 0 ? 1 : -1),
        radialWobble: 10 + Math.random() * 22,
        wobbleSpeed: 0.0012 + Math.random() * 0.0015,
        size: colorType === 'accent' ? 2.2 + Math.random() * 0.8 : 1.2 + Math.random() * 1.2,
        baseAlpha: colorType === 'accent' ? 0.65 : 0.22 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
        colorType,
        x: 0,
        y: 0,
        alpha: 0,
      });
    }

    // Scroll progress measurement for subtle convergence
    let scrollConvergence = 0;
    const handleScroll = () => {
      if (!container) return;
      const vh = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      scrollConvergence = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animId && !prefersReducedMotion) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onVisibility = () => {
      if (document.hidden) {
        isVisible = false;
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else {
        isVisible = true;
        if (!animId && !prefersReducedMotion) {
          animId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Render loop
    const render = (time: number) => {
      if (!isVisible && !prefersReducedMotion) {
        animId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const hubs = getHubs();

      // Center text exclusion zone (elliptical)
      const cx = width * 0.5;
      const cy = height * 0.48;
      const rx = width * 0.38;
      const ry = height * 0.36;

      // 1. Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const hub = hubs[p.hubIndex];

        p.angle += p.speed;

        // Subtle inward convergence as user scrolls
        const inwardPull = scrollConvergence * 18;
        const r = Math.max(
          20,
          p.baseRadius + Math.sin(time * p.wobbleSpeed + p.phase) * p.radialWobble - inwardPull
        );

        const targetX = hub.x + Math.cos(p.angle) * r;
        const targetY = hub.y + Math.sin(p.angle) * (r * hub.aspect);

        // Smooth position interpolation
        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Center clearance: attenuate alpha if drifting across text area
        const dx = (p.x - cx) / rx;
        const dy = (p.y - cy) / ry;
        const distSq = dx * dx + dy * dy;
        const textClearance = distSq < 1 ? Math.max(0.06, distSq * distSq) : 1;

        // Gentle breathing opacity
        const breath = 0.8 + 0.2 * Math.sin(time * 0.0016 + p.phase);
        p.alpha = p.baseAlpha * breath * textClearance;
      }

      // 2. Draw fine connecting constellation lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.alpha < 0.08) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.alpha < 0.08) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 88) {
            const lineAlpha = (1 - dist / 88) * Math.min(p1.alpha, p2.alpha) * 0.38;
            if (lineAlpha > 0.015) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);

              if (p1.colorType === 'accent' || p2.colorType === 'accent') {
                ctx.strokeStyle = `rgba(239, 68, 68, ${lineAlpha * 0.7})`;
              } else if (p1.colorType === 'amber' || p2.colorType === 'amber') {
                ctx.strokeStyle = `rgba(249, 115, 22, ${lineAlpha * 0.6})`;
              } else {
                ctx.strokeStyle = `rgba(215, 224, 240, ${lineAlpha * 0.45})`;
              }
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0.01) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.colorType === 'accent') {
          ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 6;
        } else if (p.colorType === 'amber') {
          ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(0);
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [accentColor]);

  return (
    <div className="chronicle-particles-canvas-wrap" ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="chronicle-particles-canvas" />
    </div>
  );
}

// =========================================================================
// EVENT PHOTO MARQUEE — CONTINUOUS EDITORIAL ARCHIVE STRIP
// Seamless horizontal marquee of genuine photographs belonging strictly
// to the selected event. Left/right edge fades, hover pause, responsive.
// For vector-only events (e.g. CTF), displays the architectural blueprint strip.
// =========================================================================
interface MarqueePhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  tag: string;
  cameraInfo?: string;
}

function EventPhotoMarquee({ event }: { event: EventItem }) {
  const photos = useMemo<MarqueePhoto[]>(() => {
    const list: MarqueePhoto[] = [];
    const seenSrcs = new Set<string>();

    if (event.images && event.images.length > 0) {
      for (const img of event.images) {
        if (img.src && !seenSrcs.has(img.src)) {
          seenSrcs.add(img.src);
          list.push({
            id: img.id,
            src: img.src,
            title: img.title || event.title,
            caption: img.caption || event.shortDescription || event.desc,
            tag: img.tag || 'DOCUMENTARY ARCHIVE',
            cameraInfo: img.cameraInfo,
          });
        }
      }
    }

    const hero = event.heroImage || event.cardImage;
    if (hero && !seenSrcs.has(hero)) {
      seenSrcs.add(hero);
      list.unshift({
        id: `${event.id}-hero`,
        src: hero,
        title: `${event.shortTitle || event.title} // CENTRAL ASSEMBLY`,
        caption: event.shortDescription || event.desc,
        tag: 'KEYNOTE & ASSEMBLY',
        cameraInfo: 'PHOTO ARCHIVE • BVUDET-NM',
      });
    }

    return list;
  }, [event]);

  // Double-buffer or quad-buffer for seamless looping
  const marqueeItems = useMemo(() => {
    if (photos.length === 0) return [];
    if (photos.length >= 4) return [...photos, ...photos];
    return [...photos, ...photos, ...photos, ...photos];
  }, [photos]);

  // Fallback for events with strictly no photographs (e.g. CTF air-gapped simulation)
  if (photos.length === 0) {
    return (
      <div className="editorial-blueprint-strip-wrap editorial-reveal-item" role="region" aria-label="Air-gapped topology specifications">
        <div className="marquee-header">
          <div className="chronicle-eyebrow">
            <span className="chronicle-eyebrow__num">02</span>
            <span className="chronicle-eyebrow__rule" />
            <span className="chronicle-eyebrow__title">SYSTEM TOPOLOGY & BLUEPRINT SPECIFICATIONS</span>
          </div>
          <div className="marquee-meta-badge">
            <span className="marquee-beacon marquee-beacon--emerald" />
            <span>AIR-GAPPED LAN • 4 ARCHITECTURAL SPECIFICATIONS</span>
          </div>
        </div>

        <div className="editorial-blueprint-grid">
          <div className="blueprint-card">
            <div className="blueprint-card__top">
              <span className="blueprint-code">SPEC-01 // AIR-GAPPED LAN</span>
              <span className="blueprint-tag">LOCAL PHYSICAL NET</span>
            </div>
            <h4 className="blueprint-title">Isolated CC Labs 4–6 Physical Topology</h4>
            <p className="blueprint-desc">
              Self-hosted challenge infrastructure running isolated CTFd services on dedicated hardware with strictly zero external uplink or internet gateway.
            </p>
            <div className="blueprint-specs">
              <span>ZERO UPLINK</span>
              <span>•</span>
              <span>WIRED GIGABIT</span>
              <span>•</span>
              <span>DEDICATED HOST</span>
            </div>
          </div>

          <div className="blueprint-card">
            <div className="blueprint-card__top">
              <span className="blueprint-code">SPEC-02 // SCORING ENGINE</span>
              <span className="blueprint-tag">DYNAMIC DECAY</span>
            </div>
            <h4 className="blueprint-title">Dynamic Point Decay & First Blood</h4>
            <p className="blueprint-desc">
              Algorithmic scoring decay where challenge point values diminish as solve count rises. +50 First Blood bonus for pioneering team unlocks.
            </p>
            <div className="blueprint-specs">
              <span>DYNAMIC DECAY</span>
              <span>•</span>
              <span>+50 FIRST BLOOD</span>
              <span>•</span>
              <span>HINT PENALTIES</span>
            </div>
          </div>

          <div className="blueprint-card">
            <div className="blueprint-card__top">
              <span className="blueprint-code">SPEC-03 // ENFORCEMENT</span>
              <span className="blueprint-tag">ANTI-AI PROTOCOL</span>
            </div>
            <h4 className="blueprint-title">Hardware-Enforced Anti-AI Integrity</h4>
            <p className="blueprint-desc">
              LLMs, GitHub Copilot, ChatGPT, and local Ollama runtimes strictly barred. Hardware and local network inspected to evaluate raw reverse-engineering skills.
            </p>
            <div className="blueprint-specs">
              <span>LLM PROHIBITED</span>
              <span>•</span>
              <span>NO ASSISTANTS</span>
              <span>•</span>
              <span>HUMAN REVERSE ENG</span>
            </div>
          </div>

          <div className="blueprint-card">
            <div className="blueprint-card__top">
              <span className="blueprint-code">SPEC-04 // DOMAINS</span>
              <span className="blueprint-tag">7 VULN CLASSES</span>
            </div>
            <h4 className="blueprint-title">Multi-Domain Security Matrix</h4>
            <p className="blueprint-desc">
              Web exploitation, RSA & elliptic curve cryptography, binary reversing, memory forensics, steganography, and air-gapped network traffic capture.
            </p>
            <div className="blueprint-specs">
              <span>WEB EXPLOIT</span>
              <span>•</span>
              <span>CRYPTO</span>
              <span>•</span>
              <span>REVERSING</span>
              <span>•</span>
              <span>FORENSICS</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Animation duration scaled by number of items for consistent stately velocity
  const animationDuration = `${Math.max(34, marqueeItems.length * 5)}s`;

  return (
    <div
      className="editorial-marquee-wrap editorial-reveal-item"
      role="region"
      aria-label="Event photographic archive strip"
      style={{ '--marquee-duration': animationDuration } as React.CSSProperties}
    >
      <div className="marquee-header">
        <div className="chronicle-eyebrow">
          <span className="chronicle-eyebrow__num">02</span>
          <span className="chronicle-eyebrow__rule" />
          <span className="chronicle-eyebrow__title">DOCUMENTARY PHOTOGRAPHY ARCHIVE</span>
        </div>
        <div className="marquee-meta-badge">
          <span className="marquee-beacon" />
          <span>{photos.length} AUTHENTIC DISPATCHES • CONTINUOUS EDITORIAL STRIP</span>
        </div>
      </div>

      <div className="marquee-viewport">
        <div className="marquee-track marquee-track--animated">
          {marqueeItems.map((photo, idx) => (
            <div key={`${photo.id}-${idx}`} className="marquee-photo-item">
              <div className="marquee-photo-frame">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="marquee-photo-img"
                  loading="lazy"
                  decoding="async"
                />
                <div className="marquee-photo-scrim" />
                <div className="marquee-photo-corner" />

                <div className="marquee-photo-caption">
                  <div className="caption-tag-row">
                    <Camera size={11} className="caption-camera-icon" />
                    <span className="caption-tag-text">{photo.tag}</span>
                  </div>
                  <h4 className="caption-photo-title">{photo.title}</h4>
                  {photo.cameraInfo && (
                    <span className="caption-camera-info">{photo.cameraInfo}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// VECTOR ARTWORK COMPONENT FOR PANELS
// Distinct cybernetic graphics per edition without external asset dependencies
// =========================================================================
function PanelArtwork({
  graphicType,
  accent,
}: {
  graphicType: string;
  accent: string;
}) {
  switch (graphicType) {
    case 'circuit':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" fill="none">
            <path d="M50 300 H180 L230 220 H380 L420 280 H550" />
            <path d="M80 500 H200 L250 420 H340 L370 460 H520" />
            <path d="M120 150 H260 L290 190 H440 L480 140 H560" />
            <circle cx="180" cy="300" r="5" fill={accent} />
            <circle cx="380" cy="220" r="5" fill={accent} />
            <circle cx="250" cy="420" r="5" fill={accent} />
          </g>
          <rect x="230" y="270" width="140" height="90" rx="8" fill="rgba(18, 16, 22, 0.85)" stroke={accent} strokeWidth="1.5" />
          <text x="300" y="320" fill={accent} fontSize="14" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
            IC // SYNAPSE
          </text>
        </svg>
      );

    case 'terminal':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <rect x="60" y="180" width="480" height="420" rx="10" fill="rgba(12, 10, 16, 0.8)" stroke={accent} strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="60" y1="225" x2="540" y2="225" stroke={accent} strokeOpacity="0.3" />
          <circle cx="85" cy="205" r="5" fill={accent} />
          <circle cx="102" cy="205" r="5" fill="rgba(255,255,255,0.3)" />
          <circle cx="119" cy="205" r="5" fill="rgba(255,255,255,0.3)" />
          <text x="85" y="275" fill={accent} fontSize="14" fontFamily="monospace">$ hwi agent run --autonomous</text>
          <text x="85" y="315" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="monospace">[+] Initializing distributed cluster...</text>
          <text x="85" y="355" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="monospace">[+] GPU tensor stream active: 8x H100</text>
          <text x="85" y="395" fill={accent} fontSize="13" fontFamily="monospace">[✔] 18 Agentic prototypes running</text>
        </svg>
      );

    case 'nodes':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g stroke={accent} strokeWidth="1.5" strokeOpacity="0.35">
            <line x1="120" y1="380" x2="220" y2="250" />
            <line x1="220" y1="250" x2="380" y2="300" />
            <line x1="380" y1="300" x2="480" y2="220" />
            <line x1="120" y1="380" x2="240" y2="520" />
            <line x1="240" y1="520" x2="380" y2="480" />
            <line x1="380" y1="480" x2="480" y2="220" />
          </g>
          {[[120, 380], [220, 250], [380, 300], [480, 220], [240, 520], [380, 480]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill="#070709" stroke={accent} strokeWidth="2.5" />
              <circle cx={x} cy={y} r="4" fill={accent} />
            </g>
          ))}
          <circle cx="300" cy="380" r="100" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        </svg>
      );

    case 'waveform':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g fill={accent} opacity="0.6">
            {Array.from({ length: 28 }).map((_, i) => {
              const x = 70 + i * 16;
              const h = Math.round(Math.abs(Math.sin((i / 28) * Math.PI * 3)) * 220 + 30);
              const y = Math.round(400 - h / 2);
              return <rect key={i} x={x} y={y} width="9" height={h} rx="4" />;
            })}
          </g>
          <line x1="40" y1="400" x2="560" y2="400" stroke={accent} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7" />
        </svg>
      );

    case 'radar':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <circle cx="300" cy="400" r="220" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="300" cy="400" r="150" fill="none" stroke={accent} strokeWidth="1.2" strokeOpacity="0.3" />
          <circle cx="300" cy="400" r="80" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
          <line x1="80" y1="400" x2="520" y2="400" stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" />
          <line x1="300" y1="180" x2="300" y2="620" stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" />
          <circle cx="300" cy="400" r="7" fill={accent} />
          <circle cx="380" cy="330" r="6" fill={accent} opacity="0.85" />
          <circle cx="210" cy="470" r="5" fill={accent} opacity="0.65" />
        </svg>
      );

    case 'grid':
    default:
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g stroke={accent} strokeWidth="1" strokeOpacity="0.35">
            {[-200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
              <line key={i} x1={300} y1={250} x2={x} y2={780} />
            ))}
            {[290, 340, 410, 500, 610, 740].map((y, i) => (
              <line key={i} x1={0} y1={y} x2={600} y2={y} strokeOpacity={Number((0.15 + i * 0.12).toFixed(2))} />
            ))}
          </g>
          <circle cx="300" cy="250" r="55" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
          <circle cx="300" cy="250" r="22" fill={accent} opacity="0.25" />
        </svg>
      );
  }
}
