'use client';

import React, { useEffect, useRef } from 'react';
import './AboutExperience.css';

import { AboutHero } from './AboutHero';
import { AboutIntroVideo } from './AboutIntroVideo';
import { AboutIdentity } from './AboutIdentity';
import { AboutManifesto } from './AboutManifesto';
import { AboutCubeGrid } from './AboutCubeGrid';
import { AboutJourney } from './AboutJourney';
import { AboutScrollMorphHero } from './AboutScrollMorphHero';

export function AboutExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // IntersectionObserver for choreographed section reveals with fallback
    const revealElements = root.querySelectorAll('.about-reveal');
    
    // Immediate check for elements already near or above the viewport
    const checkVisible = () => {
      const winH = window.innerHeight;
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < winH + 200 && rect.bottom > -100) {
          el.classList.add('is-revealed');
        }
      });
    };

    checkVisible();
    const timer = setTimeout(checkVisible, 250);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '250px 0px 250px 0px',
      }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="about-page-root" ref={rootRef}>
      {/* Cinematic geometric cube-grid background & ambient lighting */}
      <AboutCubeGrid />
      <div className="about-ambient-glow" aria-hidden="true" />

      {/* 1. Cinematic Opening: Enter the HWI Lab */}
      <AboutHero />

      {/* 1.5. HWI Cinematic Introduction Video Reveal */}
      <AboutIntroVideo />

      {/* 2. Who We Are: Genesis & Charter */}
      <AboutIdentity />

      {/* 3. The HWI Manifesto: Architectural Principles */}
      <AboutManifesto />

      {/* 4. The HWI Journey: Interactive Milestone Timeline */}
      <AboutJourney />

      {/* 5 & 6. What HWI Does & Next Cohort: Cinematic Scroll Morph Hero */}
      <AboutScrollMorphHero />
    </div>
  );
}
