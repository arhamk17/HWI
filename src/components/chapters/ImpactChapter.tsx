'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HWI_STATS } from '@/data/stats';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import '../Statistics/AnimatedStatistics.css';

export function ImpactChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    // Fast reveal animation using gsap
    const t = gsap.fromTo(
      sectionRef.current.querySelector('.impact-header'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      }
    ).scrollTrigger;

    // High performance IntersectionObserver for the count-up
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            startCountUp();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (t) t.kill();
    };
  }, []);

  const startCountUp = () => {
    const duration = 1500; // 1.5s
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
        <div className="impact-header" style={{ marginBottom: 'var(--space-64)' }}>
          <p className="type-eyebrow text-accent" style={{ marginBottom: 'var(--space-16)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            COMMUNITY METRICS
          </p>
          <h2 className="type-display" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}>
            NUMBERS<br />THAT MATTER
          </h2>
        </div>

        <div className="stats-grid">
          {HWI_STATS.map((stat, i) => (
            <div
              key={stat.id}
              className="stat-card"
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
