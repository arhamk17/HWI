'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface StatItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
  desc: string;
  category: string;
}

const STATS: StatItem[] = [
  {
    id: 'editions',
    target: 7,
    suffix: '',
    label: 'MILESTONE EDITIONS',
    desc: 'Flagship hackathons, lab bootcamps, and developer tours hosted across 2025–2026.',
    category: 'EDITIONS',
  },
  {
    id: 'builders',
    target: 1400,
    suffix: '+',
    label: 'VERIFIED BUILDERS',
    desc: 'Active student participants representing engineering colleges throughout Maharashtra.',
    category: 'COMMUNITY',
  },
  {
    id: 'projects',
    target: 120,
    suffix: '+',
    label: 'PROTOTYPES SHIPPED',
    desc: 'Functional full-stack platforms, smart contracts, and machine learning models deployed.',
    category: 'PROJECTS',
  },
  {
    id: 'roster',
    target: 41,
    suffix: '',
    label: 'CORE TEAM MEMBERS',
    desc: 'Dedicated student leaders organized across 9 specialized operational departments.',
    category: 'ROSTER',
  },
  {
    id: 'sprint',
    target: 36,
    suffix: 'h',
    label: 'LONGEST SPRINT',
    desc: 'Chapter record set during the BuildTheFuture 36-hour nonstop engineering marathon.',
    category: 'DURATION',
  },
];

export function AboutImpact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;

            STATS.forEach((stat) => {
              const targetEl = document.getElementById(`stat-num-${stat.id}`);
              if (!targetEl) return;

              const obj = { value: 0 };
              anime({
                targets: obj,
                value: stat.target,
                round: 1,
                easing: 'easeOutExpo',
                duration: 1800,
                update: () => {
                  targetEl.innerHTML = `${obj.value}${stat.suffix}`;
                },
              });
            });

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="about-section" id="impact" ref={containerRef}>
      <div className="about-container">
        <div className="about-manifesto__header about-reveal">
          <div className="about-section-eyebrow">
            07 // CHAPTER IMPACT & REACH
          </div>
          <h2 className="about-manifesto__title">
            COMMUNITY & IMPACT
          </h2>
          <p className="type-body text-secondary" style={{ marginTop: '16px' }}>
            Verified metrics representing real students, deployed codebases, and hackathon hours at HackWithIndia BVUDET-NM.
          </p>
        </div>

        <div className="about-impact__grid">
          {STATS.map((stat, index) => (
            <div
              key={stat.id}
              className={`about-impact__card about-reveal about-delay-${index + 1}`}
            >
              <div>
                <div className="about-impact__card-code">
                  <span>{stat.category}</span>
                  <span style={{ color: '#00F0FF', opacity: 0.6 }}>0{index + 1}</span>
                </div>
                <div
                  className="about-impact__num"
                  id={`stat-num-${stat.id}`}
                >
                  0{stat.suffix}
                </div>
                <div className="about-impact__label">
                  {stat.label}
                </div>
              </div>

              <p className="about-impact__desc">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
