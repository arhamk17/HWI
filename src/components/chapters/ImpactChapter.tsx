'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HWI_STATS } from '@/data/stats';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import '../Statistics/AnimatedStatistics.css';

const TILT_ANGLES = [-3.5, 3, -3, 3.5];

export function ImpactChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        startCountUp();
      }
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.stat-card');
      const eyebrow = sectionRef.current?.querySelector<HTMLElement>('.impact-eyebrow');
      const titleLines = gsap.utils.toArray<HTMLElement>('.impact-title-line');

      // Initial state matching Spylt entrance
      if (eyebrow) {
        gsap.set(eyebrow, { yPercent: 100, opacity: 0 });
      }
      if (titleLines.length) {
        gsap.set(titleLines, {
          yPercent: 120,
          opacity: 0,
          rotateZ: (i) => (i === 0 ? -3 : 2),
        });
      }
      if (cards.length) {
        cards.forEach((card, idx) => {
          const baseTilt = TILT_ANGLES[idx % 4];
          gsap.set(card, {
            opacity: 0,
            x: 60,
            y: 40,
            rotateZ: baseTilt * 2.2,
            scale: 0.92,
            transformOrigin: 'center center',
          });
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
        onStart: () => {
          if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            startCountUp();
          }
        },
      });

      // 1. Eyebrow slide & fade
      if (eyebrow) {
        tl.to(eyebrow, {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      // 2. Heading lines punch up with spring overshoot (Spylt style)
      if (titleLines.length) {
        tl.to(
          titleLines,
          {
            yPercent: 0,
            opacity: 1,
            rotateZ: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'back.out(1.4)',
          },
          '-=0.4'
        );
      }

      // 3. Staggered card entrance: glides in with dynamic tilt and springs into place
      if (cards.length) {
        cards.forEach((card, idx) => {
          const baseTilt = TILT_ANGLES[idx % 4];
          tl.to(
            card,
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotateZ: baseTilt,
              scale: 1,
              duration: 0.9,
              ease: 'back.out(1.5)',
              onComplete: () => {
                // Clear inline style so the CSS tilt rule holds and hover works smoothly
                card.style.transform = '';
              },
            },
            idx === 0 ? '-=0.5' : `-=${0.9 - 0.14}`
          );
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const startCountUp = () => {
    const duration = 1600; // 1.6s
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      HWI_STATS.forEach((stat, idx) => {
        const el = numberRefs.current[idx];
        if (!el) return;

        const currentVal = Math.round(stat.targetValue * easeProgress);
        // Format with commas: 2400 -> 2,400
        el.textContent = `${currentVal.toLocaleString()}${stat.suffix}`;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final targets are exact
        HWI_STATS.forEach((stat, idx) => {
          const el = numberRefs.current[idx];
          if (!el) return;
          el.textContent = `${stat.targetValue.toLocaleString()}${stat.suffix}`;
        });
      }
    };

    requestAnimationFrame(animate);
  };

  const handleStatHover = (statId: string) => {
    // Subtle background particle resonance
    whatWeDoStore.setEnvironment('connected', statId);
  };

  const handleStatLeave = () => {
    whatWeDoStore.reset();
  };

  return (
    <section
      className="chapter"
      ref={sectionRef}
      id="impact"
      style={{ alignItems: 'flex-start', paddingTop: 'var(--space-section)' }}
    >
      <div className="container">
        <div className="impact-header">
          <div className="impact-eyebrow-mask">
            <p className="type-eyebrow text-accent impact-eyebrow" style={{ marginBottom: 'var(--space-16)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              COMMUNITY METRICS
            </p>
          </div>
          <h2 className="type-display impact-title" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}>
            <span className="impact-title-line-mask" style={{ paddingBottom: '4px' }}>
              <span className="impact-title-line">NUMBERS</span>
            </span>
            <span className="impact-title-line-mask" style={{ paddingBottom: '4px' }}>
              <span className="impact-title-line">THAT MATTER</span>
            </span>
          </h2>
        </div>

        <div className="stats-grid">
          {HWI_STATS.map((stat, i) => (
            <div
              key={stat.id}
              className={`stat-card stat-card--tilt-${i}`}
              onMouseEnter={() => handleStatHover(stat.id)}
              onMouseLeave={handleStatLeave}
              data-cursor="text"
              data-cursor-label={stat.label}
            >
              <div className="stat-card__glow" />

              <div className="stat-card__number-wrap">
                <span
                  className="stat-card__number"
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                >
                  0{stat.suffix}
                </span>
              </div>

              <div className="stat-card__label-wrap">
                <span className="stat-card__label">{stat.label}</span>
                <span className="stat-card__sublabel">{stat.sublabel}</span>
              </div>

              <p className="stat-card__desc">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
