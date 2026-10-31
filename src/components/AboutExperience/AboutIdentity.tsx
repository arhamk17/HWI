'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { scrollBus } from '@/lib/scrollBus';

const HEADING_WORDS = [
  'BRIDGING', 'THE', 'CHASM', 'BETWEEN', 'ACADEMIC', 'THEORY', 'AND', 'PRODUCTION', 'CODE.'
];

const PARAGRAPH_1_WORDS = [
  'At', 'Bharati', 'Vidyapeeth', 'Department', 'of', 'Engineering', 'and', 'Technology,',
  'Navi', 'Mumbai,', 'we', 'recognized', 'that', 'engineering', 'curricula', 'frequently',
  'stop', 'at', 'textbook', 'simulations.', 'As', 'an', 'official', 'chapter', 'of',
  'HackWithIndia,', 'our', 'mandate', 'is', 'to', 'cultivate', 'an', 'uncompromising',
  'building', 'culture', 'where', 'raw', 'student', 'ideas', 'transform', 'into',
  'production', 'software.'
];

const PARAGRAPH_2_WORDS = [
  'We', 'believe', 'that', 'technical', 'talent', 'is', 'ubiquitous', 'across',
  'Maharashtra,', 'but', 'access', 'to', 'high-stakes', 'hackathons,', 'elite',
  'mentorship,', 'and', 'computing', 'infrastructure', 'is', 'not.', 'We', 'provide',
  'students', 'with', 'computing', 'resources,', 'technical', 'bootcamps,', 'and',
  'the', 'arena', 'to', 'test', 'their', 'engineering', 'velocity.'
];

export function AboutIdentity() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealWrapperRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const railPipRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Precompute word timing ranges across normalized section scroll (0.00 to 1.00)
  const { wordRanges, totalWords } = useMemo(() => {
    const ranges: { start: number; end: number }[] = [];

    // 1. Heading: 9 words span 0.06 to 0.34
    const hCount = HEADING_WORDS.length;
    for (let i = 0; i < hCount; i++) {
      const s = 0.06 + (i / hCount) * 0.25;
      ranges.push({ start: s, end: s + 0.045 });
    }

    // 2. Paragraph 1: 43 words span 0.36 to 0.68
    const p1Count = PARAGRAPH_1_WORDS.length;
    for (let i = 0; i < p1Count; i++) {
      const s = 0.36 + (i / p1Count) * 0.30;
      ranges.push({ start: s, end: s + 0.028 });
    }

    // 3. Paragraph 2: 37 words span 0.70 to 0.95
    const p2Count = PARAGRAPH_2_WORDS.length;
    for (let i = 0; i < p2Count; i++) {
      const s = 0.70 + (i / p2Count) * 0.23;
      ranges.push({ start: s, end: s + 0.028 });
    }

    return { wordRanges: ranges, totalWords: ranges.length };
  }, []);

  useEffect(() => {
    let ticking = false;
    let animFrameId: number | null = null;
    const states: number[] = new Array(totalWords).fill(0); // 0 = dim, 1 = transitioning, 2 = bright

    const updateScroll = () => {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;

      // Skip computation if completely off-screen
      const winH = window.innerHeight;
      if (rect.bottom < -100 || rect.top > winH + 100) return;

      let p = 0;
      if (totalScrollable > 50) {
        // Pinned sticky scroll runway: progress 0.0 to 1.0 while section is pinned in viewport
        const scrolled = -rect.top;
        p = Math.max(0, Math.min(1, scrolled / totalScrollable));
      } else {
        // Fallback for compact viewports where sticky runway is disabled
        const entryY = winH * 0.82;
        const scrollRunway = Math.max(winH * 0.55, rect.height * 0.68);
        const scrolled = entryY - rect.top;
        p = Math.max(0, Math.min(1, scrolled / scrollRunway));
      }

      // 1. Vertical Progress Indicator Rail (Direct GPU-composited scaleY)
      if (railFillRef.current) {
        railFillRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      }
      if (railPipRef.current) {
        railPipRef.current.style.top = `${(p * 100).toFixed(1)}%`;
        railPipRef.current.style.opacity = p > 0.02 ? '1' : '0';
      }

      // 2. Eyebrow illumination
      if (eyebrowRef.current) {
        const eyeP = Math.min(1, p / 0.08);
        eyebrowRef.current.style.opacity = (0.35 + 0.65 * eyeP).toFixed(2);
      }

      // 3. Progressive Line-by-Line / Word-by-Word Text Reveal
      for (let i = 0; i < totalWords; i++) {
        const el = wordRefs.current[i];
        if (!el) continue;

        const { start, end } = wordRanges[i];

        if (p >= end) {
          if (states[i] !== 2) {
            states[i] = 2;
            el.classList.add('is-revealed');
            el.style.color = '#FFFFFF';
          }
        } else if (p <= start) {
          if (states[i] !== 0) {
            states[i] = 0;
            el.classList.remove('is-revealed');
            el.style.color = 'rgba(255, 255, 255, 0.16)';
          }
        } else {
          states[i] = 1;
          const t = (p - start) / (end - start);
          const alpha = (0.16 + 0.84 * t).toFixed(3);
          el.style.color = `rgba(255, 255, 255, ${alpha})`;
          if (t > 0.5) {
            el.classList.add('is-revealed');
          } else {
            el.classList.remove('is-revealed');
          }
        }
      }

      // 4. Badges illumination
      if (badgesRef.current) {
        const badgeP = p >= 0.94 ? Math.min(1, (p - 0.94) / 0.06) : 0.35;
        badgesRef.current.style.opacity = badgeP.toFixed(2);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        animFrameId = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    const unsubscribeScroll = scrollBus.subscribe(handleScroll);
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      unsubscribeScroll();
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [totalWords, wordRanges]);

  // Keep running index for wordRefs
  let wordIndexCounter = 0;

  return (
    <section
      ref={sectionRef}
      className="about-section about-panel-section about-identity-section"
      id="who-we-are"
      aria-label="Chapter Genesis & Mandate"
    >
      <div className="about-identity-sticky">
        <div className="about-container">
          {/* Framed Interface Panel */}
          <div className="about-panel-frame">
            <div className="about-panel-header">
            <div className="about-panel-header__left">
              <span className="about-panel-indicator" />
              <span className="about-panel-tag">BHARATI VIDYAPEETH UNIVERSITY</span>
              <span className="about-panel-slash">•</span>
              <span className="about-panel-coord">DEPARTMENT OF ENGINEERING & TECHNOLOGY, NAVI MUMBAI</span>
            </div>
            <div className="about-panel-header__right">
              <span className="about-panel-status">CHAPTER GENESIS & PURPOSE</span>
            </div>
          </div>

          <div className="about-identity__grid">
            {/* Left Scroll-Driven Reveal Text Block with Subtle Vertical Rail */}
            <div className="about-reveal is-revealed" ref={revealWrapperRef}>
              <div className="about-identity__reveal-wrapper">
                {/* Subtle Vertical Progress Indicator on the Left */}
                <div className="about-identity__rail" aria-hidden="true">
                  <div className="about-identity__rail-fill" ref={railFillRef} />
                  <div className="about-identity__rail-pip" ref={railPipRef} />
                </div>

                {/* Content Block indented beside the rail */}
                <div className="about-identity__content">
                  <div className="about-section-eyebrow" ref={eyebrowRef}>
                    <span>01 // GENESIS & MANDATE</span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span className="about-eyebrow-scroll-hint">SCROLL TO REVEAL</span>
                  </div>

                  {/* Main Heading — Line by Line Scroll Reveal */}
                  <h2 className="about-identity__heading" aria-label="BRIDGING THE CHASM BETWEEN ACADEMIC THEORY AND PRODUCTION CODE.">
                    {HEADING_WORDS.map((word, idx) => {
                      const curIdx = wordIndexCounter++;
                      return (
                        <React.Fragment key={`h-${idx}`}>
                          <span
                            ref={(el) => {
                              wordRefs.current[curIdx] = el;
                            }}
                            className="about-reveal-word"
                          >
                            {word}
                          </span>{' '}
                        </React.Fragment>
                      );
                    })}
                  </h2>

                  {/* Paragraphs — Line by Line Scroll Reveal */}
                  <div className="about-identity__prose">
                    <p>
                      {PARAGRAPH_1_WORDS.map((word, idx) => {
                        const curIdx = wordIndexCounter++;
                        const isAccent = word.includes('HackWithIndia');
                        return (
                          <React.Fragment key={`p1-${idx}`}>
                            <span
                              ref={(el) => {
                                wordRefs.current[curIdx] = el;
                              }}
                              className={`about-reveal-word ${isAccent ? 'is-accent' : ''}`}
                            >
                              {word}
                            </span>{' '}
                          </React.Fragment>
                        );
                      })}
                    </p>

                    <p>
                      {PARAGRAPH_2_WORDS.map((word, idx) => {
                        const curIdx = wordIndexCounter++;
                        return (
                          <React.Fragment key={`p2-${idx}`}>
                            <span
                              ref={(el) => {
                                wordRefs.current[curIdx] = el;
                              }}
                              className="about-reveal-word"
                            >
                              {word}
                            </span>{' '}
                          </React.Fragment>
                        );
                      })}
                    </p>
                  </div>

                  {/* Badges footer */}
                  <div className="about-identity__badges" ref={badgesRef}>
                    <span className="about-identity__badge-pill">BVUDET-NM CHAPTER</span>
                    <span className="about-identity__badge-pill" style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00F0FF' }}>
                      STUDENT-LED INITIATIVE
                    </span>
                    <span className="about-identity__badge-pill">STATEWIDE COMMUNITY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Real Photographic Composition */}
            <div className="about-reveal about-delay-1 is-revealed">
              <CardContainer
                maxTilt={3.5}
                lift={4}
                glowColor="rgba(239, 68, 68, 0.2)"
              >
                <CardBody className="about-identity__frame">
                  {/* Corner HUD accents */}
                  <div className="about-hud-corner about-hud-corner--tl" />
                  <div className="about-hud-corner about-hud-corner--tr" />
                  <div className="about-hud-corner about-hud-corner--bl" />
                  <div className="about-hud-corner about-hud-corner--br" />

                  <CardItem translateZ={16} className="about-identity__img-wrapper">
                    <Image
                      src="/images/hwMUM1.jpeg"
                      alt="HackWithMumbai 1.0 auditorium packed with student builders at BVUDET Navi Mumbai"
                      fill
                      sizes="(max-width: 1024px) 100vw, 550px"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                      quality={80}
                    />
                  </CardItem>

                  <CardItem translateZ={24} className="about-identity__hud-bar">
                    <span>HACKWITHMUMBAI 1.0 • AUDITORIUM</span>
                    <span style={{ color: '#EF4444' }}>340+ BUILDERS IN SPRINT</span>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
