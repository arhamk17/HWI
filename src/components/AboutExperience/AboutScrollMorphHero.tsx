'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { Sparkles, ArrowDown, ExternalLink } from 'lucide-react';
import { scrollBus } from '@/lib/scrollBus';
import './AboutScrollMorphHero.css';

interface MorphCardData {
  id: string;
  title: string;
  category: 'HACKATHONS' | 'BOOTCAMPS' | 'DELEGATIONS' | 'COMMUNITY';
  tag: string;
  image: string;
  desc: string;
  href: string;
  color: string;
}

// 18 Authentic HWI Event & Community Images from public/images/events/
const HWI_MORPH_CARDS: MorphCardData[] = [
  {
    id: 'card-1',
    title: 'RocketRide 36H Sprint',
    category: 'HACKATHONS',
    tag: '36H SPRINT',
    image: '/images/events/rocketride_hackers.jpg',
    desc: 'High-velocity engineering marathon where student teams architect, debug, and ship production prototypes.',
    href: '/events',
    color: '#EF4444',
  },
  {
    id: 'card-2',
    title: 'Silicon Valley Keynote',
    category: 'DELEGATIONS',
    tag: 'GLOBAL TECH',
    image: '/images/events/rocketride_keynote.jpg',
    desc: 'International tech leaders and Silicon Valley founders delivering architectural sessions to campus developers.',
    href: '/events',
    color: '#00F0FF',
  },
  {
    id: 'card-3',
    title: 'Zero2Web3 EVM Lab',
    category: 'BOOTCAMPS',
    tag: 'EVM ARCHITECTURE',
    image: '/images/events/rocketride_mentorship_lab.jpg',
    desc: 'Hands-on architectural masterclasses held in computing labs covering smart contracts and distributed systems.',
    href: '/events',
    color: '#A855F7',
  },
  {
    id: 'card-4',
    title: 'HackWithMumbai 2.0',
    category: 'HACKATHONS',
    tag: 'REGIONAL SPRINT',
    image: '/images/events/hack_with_mumbai_2_image13.jpeg',
    desc: 'Pan-Maharashtra student squads competing in continuous 24-hour rapid prototyping sprints.',
    href: '/events',
    color: '#EF4444',
  },
  {
    id: 'card-5',
    title: 'Venture Pitch Stage',
    category: 'HACKATHONS',
    tag: 'DEMO CRUCIBLE',
    image: '/images/events/rocketride_pitch.jpg',
    desc: 'Student teams demonstrating working software to venture capitalists and industry founders.',
    href: '/events',
    color: '#22C55E',
  },
  {
    id: 'card-6',
    title: 'Grand Champions Showcase',
    category: 'HACKATHONS',
    tag: '1ST PLACE AWARD',
    image: '/images/events/rocketride_winner_1st.jpg',
    desc: 'Celebrating collegiate breakthroughs, engineering excellence, and production deployment awards.',
    href: '/events',
    color: '#EF4444',
  },
  {
    id: 'card-7',
    title: 'International Delegation',
    category: 'DELEGATIONS',
    tag: 'GLOBAL ACCESS',
    image: '/images/events/rocketride_delegates.jpg',
    desc: 'Direct career pathways and partnerships connecting our Navi Mumbai campus with global ecosystems.',
    href: '/events',
    color: '#00F0FF',
  },
  {
    id: 'card-8',
    title: 'Auditorium Tech Summit',
    category: 'DELEGATIONS',
    tag: 'CAMPUS SUMMIT',
    image: '/images/events/rocketride_auditorium.jpg',
    desc: 'Over 500 collegiate developers gathered for premier technical deep-dives and live code demonstrations.',
    href: '/events',
    color: '#A855F7',
  },
  {
    id: 'card-9',
    title: 'Learn It Tour Workshop',
    category: 'BOOTCAMPS',
    tag: 'DEVNOVATE TOUR',
    image: '/images/events/learn_it_tour_image1.jpeg',
    desc: 'Hands-on campus workshops training engineers in modern cloud infrastructure and developer tooling.',
    href: '/events',
    color: '#22C55E',
  },
  {
    id: 'card-10',
    title: 'Engineering Crucible',
    category: 'HACKATHONS',
    tag: 'LATE NIGHT BUILD',
    image: '/images/events/hack_with_mumbai_2_image15.jpeg',
    desc: 'Focused pressure and dedicated effort forging developers who know how to ship without excuses.',
    href: '/events',
    color: '#EF4444',
  },
  {
    id: 'card-11',
    title: '1-on-1 Code Audits',
    category: 'BOOTCAMPS',
    tag: 'CODE AUDITS',
    image: '/images/events/hack_with_mumbai_2_image17.jpeg',
    desc: 'Senior systems architects conducting line-by-line pull request and architecture reviews.',
    href: '/events',
    color: '#00F0FF',
  },
  {
    id: 'card-12',
    title: 'Systems & ML Bootcamp',
    category: 'BOOTCAMPS',
    tag: 'SYSTEMS LAB',
    image: '/images/events/learn_it_tour_image10.jpeg',
    desc: 'Rigorous masterclasses in distributed databases, AI agents, and production machine learning pipelines.',
    href: '/events',
    color: '#A855F7',
  },
  {
    id: 'card-13',
    title: 'Web3 Technical Report',
    category: 'COMMUNITY',
    tag: 'OPEN RESEARCH',
    image: '/images/events/web3_report_image1.jpeg',
    desc: 'Student-authored technical publications and ecosystem reports contributed to the open commons.',
    href: '/join',
    color: '#22C55E',
  },
  {
    id: 'card-14',
    title: 'Flagship Inauguration',
    category: 'DELEGATIONS',
    tag: 'OPENING STAGE',
    image: '/images/events/rocketride_inauguration.jpg',
    desc: 'Campus leadership and international guests launching premier engineering challenges.',
    href: '/events',
    color: '#EF4444',
  },
  {
    id: 'card-15',
    title: '1,400+ Builder Mesh',
    category: 'COMMUNITY',
    tag: '1,400+ BUILDERS',
    image: '/images/events/hack_with_mumbai_2_image14.jpg',
    desc: 'An interconnected network of student builders and campus leads across western India collaborating daily.',
    href: '/join',
    color: '#00F0FF',
  },
  {
    id: 'card-16',
    title: 'Open Source Tooling',
    category: 'COMMUNITY',
    tag: 'PUBLIC REPOS',
    image: '/images/events/web3_report_image4.jpeg',
    desc: 'Curriculum, starter kits, and internal tooling contributed directly back to the student developer community.',
    href: '/join',
    color: '#A855F7',
  },
  {
    id: 'card-17',
    title: 'Devnovate Architecture',
    category: 'BOOTCAMPS',
    tag: 'TECH DEMO',
    image: '/images/events/learn_it_tour_image5.jpeg',
    desc: 'Masterclasses on microservices, caching layers, and high-concurrency systems design.',
    href: '/events',
    color: '#22C55E',
  },
  {
    id: 'card-18',
    title: 'Western India Mesh',
    category: 'COMMUNITY',
    tag: 'CAMPUS MESH',
    image: '/images/events/web3_report_image6.jpeg',
    desc: 'A thriving ecosystem of curious minds building impactful products that redefine student development.',
    href: '/join',
    color: '#EF4444',
  },
];

// Scatter Presets across Normalized Viewport
const SCATTER_PRESETS = [
  { x: -0.38, y: -0.34, rot: -18, scale: 0.95 },
  { x: -0.22, y: -0.42, rot: 12, scale: 0.9 },
  { x: 0.05, y: -0.43, rot: -8, scale: 1.0 },
  { x: 0.28, y: -0.38, rot: 20, scale: 0.92 },
  { x: 0.42, y: -0.24, rot: -15, scale: 0.88 },
  { x: -0.43, y: -0.12, rot: 14, scale: 0.96 },
  { x: -0.35, y: 0.12, rot: -20, scale: 0.9 },
  { x: -0.42, y: 0.35, rot: 8, scale: 0.94 },
  { x: -0.23, y: 0.42, rot: -14, scale: 1.0 },
  { x: 0.02, y: 0.44, rot: 16, scale: 0.88 },
  { x: 0.26, y: 0.40, rot: -10, scale: 0.92 },
  { x: 0.40, y: 0.30, rot: 22, scale: 0.95 },
  { x: 0.44, y: 0.06, rot: -12, scale: 0.9 },
  { x: 0.37, y: -0.06, rot: 18, scale: 0.88 },
  { x: -0.18, y: -0.24, rot: -6, scale: 1.02 },
  { x: 0.18, y: -0.22, rot: 10, scale: 0.96 },
  { x: -0.16, y: 0.25, rot: 12, scale: 0.98 },
  { x: 0.16, y: 0.26, rot: -16, scale: 1.0 },
];

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function lerpAngle(a: number, b: number, t: number): number {
  let diff = (b - a) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return a + diff * t;
}

export function AboutScrollMorphHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // Throttled high-performance scroll & resize tracking (zero jank, 120 FPS target)
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!containerRef.current) {
        ticking = false;
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const totalScrollable = rect.height - winH;
      if (totalScrollable <= 0) {
        ticking = false;
        return;
      }

      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setProgress(p);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    let lastHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      // Filter mobile browser address bar collapse/expand
      if (Math.abs(newHeight - lastHeight) < 140 && newWidth === lastWidth) {
        return;
      }
      lastWidth = newWidth;
      lastHeight = newHeight;
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    const unsubscribeScroll = scrollBus.subscribe(handleScroll);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      unsubscribeScroll();
    };
  }, []);

  // Throttled Mouse Parallax tracking
  const mouseRafRef = useRef<number | null>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const relX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
    const relY = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
    
    if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    mouseRafRef.current = requestAnimationFrame(() => {
      setMousePos({ x: relX, y: relY });
    });
  }, []);

  const handleCardClick = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isMobile = dimensions.width < 768;
  const cardsToRender = useMemo(() => {
    return isMobile ? HWI_MORPH_CARDS.slice(0, 12) : HWI_MORPH_CARDS;
  }, [isMobile]);

  const N = cardsToRender.length;

  // Compute card transforms based on current scroll progress p
  const computedCards = useMemo(() => {
    const { width: vw, height: vh } = dimensions;

    return cardsToRender.map((card, i) => {
      // 1. SCATTER POSITION
      const scatterPreset = SCATTER_PRESETS[i % SCATTER_PRESETS.length];
      const scatterX = scatterPreset.x * (vw * (isMobile ? 0.95 : 0.88));
      const scatterY = scatterPreset.y * (vh * (isMobile ? 0.88 : 0.82));
      const scatterRot = scatterPreset.rot;
      const scatterScale = scatterPreset.scale;

      // 2. LINE POSITION
      const maxSpacing = isMobile ? Math.min(65, (vw * 0.9) / N) : Math.min(115, (vw * 0.92) / N);
      const lineX = (i - (N - 1) / 2) * maxSpacing;
      const lineY = Math.sin((i / (N - 1)) * Math.PI) * (isMobile ? -18 : -32);
      const lineRot = ((i - (N - 1) / 2) / (N - 1)) * (isMobile ? 10 : 16);
      const lineScale = isMobile ? 0.88 : 0.92;

      // 3. CIRCLE POSITION
      const circleAngle = (i / N) * 2 * Math.PI - Math.PI / 2;
      const circleRadius = isMobile
        ? Math.min(vw * 0.44, vh * 0.28, 175)
        : Math.min(vw * 0.33, vh * 0.38, 350);
      const circleX = Math.cos(circleAngle) * circleRadius;
      const circleY = Math.sin(circleAngle) * circleRadius;
      const circleRot = (circleAngle * 180) / Math.PI + 90;
      const circleScale = 1.0;

      // 4. ARC POSITION (Panoramic Bottom Arc)
      const arcSpan = isMobile ? Math.PI * 0.65 : Math.PI * 0.74;
      const arcAngle = ((i - (N - 1) / 2) / (N - 1)) * arcSpan;
      const arcRadius = isMobile
        ? Math.min(vw * 0.82, 380)
        : Math.min(vw * 0.68, 720);
      const arcX = Math.sin(arcAngle) * arcRadius;
      const arcCenterY = vh * 0.52 + arcRadius * 0.68;
      const arcY = arcCenterY - Math.cos(arcAngle) * arcRadius;
      const arcRot = (arcAngle * 180) / Math.PI;
      const arcScale = isMobile ? 0.9 : 0.95;

      // MULTI-PHASE INTERPOLATION
      let curX = scatterX;
      let curY = scatterY;
      let curRot = scatterRot;
      let curScale = scatterScale;

      // Phase 1 -> Phase 2 (Scatter to Line: 0.00 to 0.28)
      if (progress <= 0.28) {
        const t = easeInOutCubic(Math.min(1, progress / 0.28));
        curX = lerp(scatterX, lineX, t);
        curY = lerp(scatterY, lineY, t);
        curRot = lerpAngle(scatterRot, lineRot, t);
        curScale = lerp(scatterScale, lineScale, t);
      }
      // Phase 2 -> Phase 3 (Line to Circle: 0.28 to 0.58)
      else if (progress <= 0.58) {
        const t = easeInOutCubic((progress - 0.28) / 0.30);
        curX = lerp(lineX, circleX, t);
        curY = lerp(lineY, circleY, t);
        curRot = lerpAngle(lineRot, circleRot, t);
        curScale = lerp(lineScale, circleScale, t);
      }
      // Phase 3 -> Phase 4 (Circle to Arc: 0.58 to 1.00)
      else {
        const t = easeInOutCubic((progress - 0.58) / 0.42);
        curX = lerp(circleX, arcX, t);
        curY = lerp(circleY, arcY, t);
        curRot = lerpAngle(circleRot, arcRot, t);
        curScale = lerp(circleScale, arcScale, t);
      }

      // Mouse Parallax factor
      const parallaxFactorX = ((i % 4) * 0.35 + 0.6) * 16;
      const parallaxFactorY = (((i + 1) % 4) * 0.35 + 0.6) * 12;
      const finalX = curX + mousePos.x * parallaxFactorX;
      const finalY = curY + mousePos.y * parallaxFactorY;

      // Filter highlight
      const isFiltered = activeCategory ? card.category === activeCategory : true;

      return {
        ...card,
        x: finalX,
        y: finalY,
        rot: curRot,
        scale: curScale,
        opacity: isFiltered ? 1 : 0.35,
        zIndex: i + 1,
      };
    });
  }, [cardsToRender, dimensions, progress, mousePos, activeCategory, isMobile, N]);

  // Content layers opacity & visibility
  // What HWI Does: Visible in phases 1-3, fades out as arc opens (0.55 -> 0.70)
  const whatOpacity = Math.max(0, Math.min(1, 1 - (progress - 0.52) / 0.16));
  const whatTransform = `translate(-50%, calc(-50% - ${(progress * 40).toFixed(1)}px))`;

  // Next Cohort: Fades in during arc phase (0.68 -> 0.88)
  const cohortOpacity = Math.max(0, Math.min(1, (progress - 0.65) / 0.20));
  const cohortTransform = `translate(-50%, calc(-50% + ${((1 - Math.min(1, (progress - 0.65) / 0.20)) * 40).toFixed(1)}px))`;

  // HUD Phase label
  const phaseLabel = progress < 0.28
    ? '01 // SCATTER'
    : progress < 0.58
    ? '02 // LINE'
    : progress < 0.78
    ? '03 // CIRCLE'
    : '04 // ARC';

  return (
    <section
      ref={containerRef}
      className="about-scroll-morph"
      id="what-we-do"
      onMouseMove={handleMouseMove}
      aria-label="What HWI Does & Next Cohort Interactive Morph"
    >
      <div className="about-scroll-morph__sticky">
        {/* Cyber grid and ambient glow */}
        <div className="about-scroll-morph__grid-overlay" aria-hidden="true" />
        <div
          className="about-scroll-morph__ambient-glow"
          style={{
            opacity: progress > 0.6 ? 0.9 : 0.5,
          }}
          aria-hidden="true"
        />

        {/* 3D Stage with subtle mouse tilt */}
        <div
          className="about-scroll-morph__stage"
          style={{
            transform: `perspective(1000px) rotateX(${(-mousePos.y * 3.5).toFixed(2)}deg) rotateY(${(mousePos.x * 3.5).toFixed(2)}deg)`,
          }}
        >
          {/* ==================================================================
              CENTER CONTENT 1: WHAT HWI DOES (Phases 1-3)
              ================================================================== */}
          <div
            className="about-scroll-morph__content-layer"
            style={{
              opacity: whatOpacity,
              transform: whatTransform,
              visibility: whatOpacity > 0.01 ? 'visible' : 'hidden',
              pointerEvents: whatOpacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="about-scroll-morph__what-block">
              <div className="about-scroll-morph__eyebrow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>04 // CORE INITIATIVES</span>
              </div>

              <h2 className="about-scroll-morph__title">
                WHAT HWI DOES
              </h2>

              <p className="about-scroll-morph__desc">
                Four core programs delivering real engineering opportunities, high-stakes events, and global industry access.
              </p>

              {/* Initiative Filter Pills */}
              <div className="about-scroll-morph__pills">
                {(['HACKATHONS', 'BOOTCAMPS', 'DELEGATIONS', 'COMMUNITY'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`about-scroll-morph__pill ${activeCategory === cat ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="about-scroll-morph__hint">
                <ArrowDown className="w-3 h-3" />
                <span>SCROLL TO EXPLORE & MORPH</span>
              </div>
            </div>
          </div>

          {/* ==================================================================
              CENTER CONTENT 2: NEXT COHORT OPEN (Phase 4: Arc Climax)
              ================================================================== */}
          <div
            className="about-scroll-morph__content-layer"
            id="closing"
            style={{
              opacity: cohortOpacity,
              transform: cohortTransform,
              visibility: cohortOpacity > 0.01 ? 'visible' : 'hidden',
              pointerEvents: cohortOpacity > 0.4 ? 'auto' : 'none',
            }}
          >
            <div className="about-scroll-morph__cohort-block">
              <h2 className="about-scroll-morph__cohort-title">
                THE CRUCIBLE FOR AMBITIOUS DEVELOPERS.
                <br />
                <span>DON&apos;T JUST OBSERVE THE FUTURE. SHIP IT.</span>
              </h2>

              <p className="about-scroll-morph__cohort-subtext">
                Whether you are writing your first line of production code, hunting for your first hackathon squad, or architecting distributed systems, HackWithIndia BVUDET-NM has a platform for you.
              </p>
            </div>
          </div>

          {/* ==================================================================
              18 MORPHING 3D CARDS (SCATTER -> LINE -> CIRCLE -> ARC)
              ================================================================== */}
          <div className="about-scroll-morph__cards-container">
            {computedCards.map((card) => {
              const isFlipped = Boolean(flippedCards[card.id]);

              return (
                <div
                  key={card.id}
                  className="about-scroll-morph__card-wrapper"
                  style={{
                    transform: `translate3d(calc(-50% + ${card.x.toFixed(1)}px), calc(-50% + ${card.y.toFixed(1)}px), 0px) rotate(${card.rot.toFixed(1)}deg) scale(${card.scale.toFixed(2)})`,
                    opacity: card.opacity,
                    zIndex: card.zIndex,
                  }}
                  onClick={() => handleCardClick(card.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card.id);
                    }
                  }}
                  aria-label={`${card.title} - Click to flip 3D card`}
                >
                  <div className={`about-scroll-morph__card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* Front Face: Real HWI Photo */}
                    <div className="about-scroll-morph__card-front">
                      <div className="about-scroll-morph__card-accent" />
                      <div className="about-scroll-morph__card-image">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          sizes="150px"
                          style={{ objectFit: 'cover' }}
                          loading="lazy"
                          quality={75}
                        />
                      </div>
                      <div className="about-scroll-morph__card-vignette" />
                      <div className="about-scroll-morph__card-tag">
                        {card.tag}
                      </div>
                    </div>

                    {/* Back Face: 3D Flip Terminal Information */}
                    <div className="about-scroll-morph__card-back">
                      <div>
                        <div className="about-scroll-morph__back-header">
                          <span className="about-scroll-morph__back-category">{card.category}</span>
                        </div>
                        <h4 className="about-scroll-morph__back-title">{card.title}</h4>
                        <p className="about-scroll-morph__back-desc">{card.desc}</p>
                      </div>

                      <div className="about-scroll-morph__back-footer">
                        <span>FLIP ↺</span>
                        <Link
                          href={card.href}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: '#FFFFFF',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                          }}
                        >
                          <span>VIEW</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HUD Navigation Indicator */}
        <div className="about-scroll-morph__hud">
          <span className="about-scroll-morph__phase-label">{phaseLabel}</span>
          <div className="about-scroll-morph__progress-bar">
            <div
              className="about-scroll-morph__progress-fill"
              style={{ width: `${(progress * 100).toFixed(0)}%` }}
            />
          </div>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </section>
  );
}
