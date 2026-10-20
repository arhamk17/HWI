'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { indiaStore } from '@/lib/indiaStore';
import { scrollBus } from '@/lib/scrollBus';
import './StoryChapter.css';

const STATS = [
  { num: '200+', value: 200, suffix: '+', label: 'Active Members' },
  { num: '6+', value: 6, suffix: '+', label: 'Major Events' },
  { num: '24h', value: 24, suffix: 'h', label: 'Hackathons' },
];

export function StoryChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLHeadingElement>(null);
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const bodyTextRef = useRef<HTMLParagraphElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const statNumsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const statLabelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const hasTriggeredRef = useRef(false);

  // Phase 2 HWI narrative animation refs
  const hwiEyebrowRef = useRef<HTMLDivElement>(null);
  const hwiTitleRef = useRef<HTMLHeadingElement>(null);
  const hwiDescRef = useRef<HTMLParagraphElement>(null);
  const hwiTickerRef = useRef<HTMLDivElement>(null);
  const hwiTickerTrackRef = useRef<HTMLDivElement>(null);
  const hwiAnimTriggeredRef = useRef(false);

  const [morphP, setMorphP] = useState(0);

  useEffect(() => {
    const unsub = indiaStore.subscribe(() => {
      setMorphP(indiaStore.morphProgress);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const playRevealAnimation = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const titleLines = titleWrapRef.current?.querySelectorAll<HTMLElement>('.story-chapter__title-line-inner');
      const titleWraps = titleWrapRef.current?.querySelectorAll<HTMLElement>('.story-chapter__title-line-wrap');

      if (prefersReducedMotion) {
        if (titleLines) gsap.set(titleLines, { opacity: 1, yPercent: 0 });
        if (bodyWrapRef.current) gsap.set(bodyWrapRef.current, { opacity: 1, scaleY: 1 });
        if (bodyTextRef.current) gsap.set(bodyTextRef.current, { opacity: 1, y: 0 });
        statNumsRef.current.forEach((el, idx) => {
          if (el) {
            gsap.set(el, { yPercent: 0 });
            el.textContent = STATS[idx].num;
          }
        });
        statLabelsRef.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        if (statsRowRef.current) gsap.set(statsRowRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      // 1. Heading lines masked reveal (line-by-line upward slide, power4.out, 1.25s)
      if (titleLines && titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { yPercent: 100, opacity: 1 },
          {
            yPercent: 0,
            duration: 1.25,
            stagger: 0.1,
            ease: 'power4.out',
            onComplete: () => {
              titleWraps?.forEach((wrap) => {
                wrap.style.overflow = 'visible';
              });
            },
          }
        );
      }

      // 2. Body wrap border expansion + narrative description reveal
      if (bodyWrapRef.current) {
        tl.fromTo(
          bodyWrapRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.7'
        );
      }

      if (bodyTextRef.current) {
        tl.fromTo(
          bodyTextRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' },
          '<+0.1'
        );
      }

      // 3. Statistics row top border reveal
      if (statsRowRef.current) {
        tl.fromTo(
          statsRowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        );
      }

      // Numbers count-up + masked upward slide
      statNumsRef.current.forEach((numEl, idx) => {
        if (!numEl) return;
        const stat = STATS[idx];

        tl.fromTo(
          numEl,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: 'power4.out',
          },
          idx === 0 ? '-=0.5' : '<+0.1'
        );

        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.35 + idx * 0.1,
          onUpdate: () => {
            numEl.textContent = `${Math.round(counter.val)}${stat.suffix}`;
          },
        });
      });

      // Statistics labels fade & slide up
      const validLabels = statLabelsRef.current.filter(Boolean) as HTMLElement[];
      if (validLabels.length > 0) {
        tl.fromTo(
          validLabels,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
          '-=0.9'
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            playRevealAnimation();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Scroll-driven ticker — moves only when user scrolls, no ambient drift
  useEffect(() => {
    const track = hwiTickerTrackRef.current;
    if (!track) return;

    let currentX = 0;
    let smoothedX = 0;
    let rafId: number;
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const onScroll = () => {
      const sy = window.scrollY;
      const delta = sy - lastScrollY;
      lastScrollY = sy;
      // Direct 1:1 scroll-to-translate mapping (negative = leftward on scroll down)
      currentX -= delta * 1.8;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const unsubScroll = scrollBus.subscribe((_scrollY, _progress, velocity) => {
      // Also pick up Lenis velocity for smoother inertia
      currentX -= velocity * 0.06;
    });

    const tick = () => {
      // Smooth interpolation towards target position
      smoothedX += (currentX - smoothedX) * 0.18;

      const firstGroup = track.firstElementChild as HTMLElement | null;
      const groupWidth = firstGroup ? firstGroup.offsetWidth : 800;

      if (groupWidth > 0) {
        const wrappedX = ((smoothedX % groupWidth) - groupWidth) % groupWidth;
        track.style.transform = `translate3d(${wrappedX}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      unsubScroll();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const playHwiRevealAnimation = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = hwiTitleRef.current?.querySelectorAll<HTMLElement>('.story-chapter__hwi-word');

    if (prefersReducedMotion) {
      if (words) gsap.set(words, { opacity: 1, transform: 'none' });
      if (hwiEyebrowRef.current) gsap.set(hwiEyebrowRef.current, { opacity: 1, y: 0 });
      if (hwiDescRef.current) gsap.set(hwiDescRef.current, { opacity: 1, y: 0 });
      if (hwiTickerRef.current) gsap.set(hwiTickerRef.current, { opacity: 1, y: 0, scaleY: 1 });
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
    });

    if (hwiEyebrowRef.current) {
      tl.fromTo(
        hwiEyebrowRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }

    if (words && words.length > 0) {
      tl.fromTo(
        words,
        {
          opacity: 0,
          transform: 'translate3d(10px, 51px, -60px) rotateY(60deg) rotateX(-40deg)',
          transformOrigin: '50% 50% -150px',
        },
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)',
          transformOrigin: '50% 50% -150px',
          duration: 0.8,
          stagger: 0.03,
          ease: 'power2.inOut',
        },
        hwiEyebrowRef.current ? '-=0.3' : 0
      );
    }

    if (hwiDescRef.current) {
      tl.fromTo(
        hwiDescRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.35'
      );
    }

    if (hwiTickerRef.current) {
      tl.fromTo(
        hwiTickerRef.current,
        { opacity: 0, y: 26, scaleY: 0.85 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.45'
      );
    }
  };

  const resetHwiAnimation = () => {
    const words = hwiTitleRef.current?.querySelectorAll<HTMLElement>('.story-chapter__hwi-word');
    if (words) {
      gsap.set(words, {
        opacity: 0,
        transform: 'translate3d(10px, 51px, -60px) rotateY(60deg) rotateX(-40deg)',
        transformOrigin: '50% 50% -150px',
      });
    }
    if (hwiEyebrowRef.current) {
      gsap.set(hwiEyebrowRef.current, { opacity: 0, y: 16 });
    }
    if (hwiDescRef.current) {
      gsap.set(hwiDescRef.current, { opacity: 0, y: 22 });
    }
    if (hwiTickerRef.current) {
      gsap.set(hwiTickerRef.current, { opacity: 0, y: 26, scaleY: 0.85 });
    }
  };

  useEffect(() => {
    if (morphP >= 0.35) {
      if (!hwiAnimTriggeredRef.current) {
        hwiAnimTriggeredRef.current = true;
        playHwiRevealAnimation();
      }
    } else if (morphP < 0.28) {
      if (hwiAnimTriggeredRef.current) {
        hwiAnimTriggeredRef.current = false;
        resetHwiAnimation();
      }
    }
  }, [morphP]);

  // Opacity calculations for smooth narrative crossfade during scroll
  // Phase 1 (Global vision): 100% visible at start, fades out between 0.18 and 0.42
  const globalOpacity = morphP <= 0.18 ? 1.0 : Math.max(0, 1.0 - (morphP - 0.18) / 0.24);

  return (
    <section className="story-chapter" ref={sectionRef} id="about">
      <div className="story-chapter__sticky">
        <div className="story-chapter__viewport">
          {/* Phase 1: Global Vision Narrative (Visible when globe is rotating in 3D) */}
          <div
            className="story-chapter__narrative-global"
            style={{
              opacity: globalOpacity,
              transform: `translateY(${(1 - globalOpacity) * -20}px)`,
              pointerEvents: globalOpacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <h2 className="story-chapter__title" ref={titleWrapRef}>
              <span className="story-chapter__title-line-wrap" style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  className="story-chapter__title-line-inner"
                  style={{ display: 'block', opacity: 0, willChange: 'transform' }}
                >
                  Connecting talents, unlocking skills,
                </span>
              </span>
              <span className="story-chapter__title-line-wrap" style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  className="story-chapter__title-line-inner"
                  style={{ display: 'block', opacity: 0, willChange: 'transform' }}
                >
                  and giving a platform to those
                </span>
              </span>
              <span className="story-chapter__title-line-wrap" style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  className="story-chapter__title-line-inner"
                  style={{ display: 'block', opacity: 0, willChange: 'transform' }}
                >
                  who are able but lack the chance.
                </span>
              </span>
            </h2>

            <div
              ref={bodyWrapRef}
              className="story-chapter__body-wrap"
              style={{ opacity: 0, transformOrigin: 'top', willChange: 'transform' }}
            >
              <div style={{ overflow: 'hidden' }}>
                <p
                  ref={bodyTextRef}
                  className="story-chapter__body-text"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  We are a premier student developer community at Bharati Vidyapeeth, Navi Mumbai. As an official chapter of HackWithIndia, we foster a culture of innovation, hands-on building, and continuous learning. We don&apos;t just write code — we solve problems, build ecosystems, and empower the next generation of technologists.
                </p>
              </div>
            </div>

            <div
              ref={statsRowRef}
              className="story-chapter__stats-row"
              style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
              {STATS.map((stat, idx) => (
                <div key={stat.label} className="story-chapter__stat-item">
                  <div style={{ overflow: 'hidden' }}>
                    <span
                      ref={(el) => {
                        statNumsRef.current[idx] = el;
                      }}
                      className="story-chapter__stat-num"
                      style={{ display: 'inline-block', willChange: 'transform' }}
                    >
                      {stat.num}
                    </span>
                  </div>
                  <span
                    ref={(el) => {
                      statLabelsRef.current[idx] = el;
                    }}
                    className="story-chapter__stat-label"
                    style={{ opacity: 0, willChange: 'opacity, transform' }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: HWI Particle Formation Header (Clean framing leaving center completely open) */}
          <div
            className="story-chapter__narrative-hwi"
            style={{
              opacity: morphP <= 0.34 ? 0 : 1,
              pointerEvents: morphP > 0.34 ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            <div className="story-chapter__eyebrow" ref={hwiEyebrowRef}>
              <span className="story-chapter__pulse-dot" />
              <span>CHAPTER 02 // HACKWITHINDIA</span>
            </div>
            <h2 className="story-chapter__hwi-title" ref={hwiTitleRef}>
              <span className="story-chapter__hwi-title-line">
                <span className="story-chapter__hwi-word animated-word">Empowering</span>{' '}
                <span className="story-chapter__hwi-word animated-word">India&apos;s</span>
              </span>
              <span className="story-chapter__hwi-title-line">
                <span className="story-chapter__hwi-word animated-word">Builders</span>{' '}
                <span className="story-chapter__hwi-word animated-word">&amp;</span>{' '}
                <span className="story-chapter__hwi-word animated-word">Innovators</span>
              </span>
            </h2>
            <p className="story-chapter__hwi-desc" ref={hwiDescRef}>
              Uniting student engineers and builders under one banner to push the frontiers of technology and open innovation.
            </p>

            {/* Scroll-triggered reveal ticker from reference video */}
            <div className="story-chapter__ticker-banner" ref={hwiTickerRef}>
              <div className="story-chapter__ticker-track" ref={hwiTickerTrackRef}>
                {[0, 1, 2, 3, 4, 5].map((group) => (
                  <div key={group} className="story-chapter__ticker-group" aria-hidden={group > 0}>
                    <span className="story-chapter__ticker-text story-chapter__ticker-text--solid">
                      hack.it.with.us
                    </span>
                    <svg className="story-chapter__ticker-star-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                    </svg>
                    <span className="story-chapter__ticker-text story-chapter__ticker-text--outline">
                      hack.it.with.us
                    </span>
                    <svg className="story-chapter__ticker-star-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
