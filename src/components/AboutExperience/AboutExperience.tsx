'use client';

import React, { useEffect, useRef } from 'react';
import './AboutExperience.css';

import { AboutHero } from './AboutHero';
import { AboutIdentity } from './AboutIdentity';
import { AboutManifesto } from './AboutManifesto';
import { AboutJourney } from './AboutJourney';
import { AboutWhatWeDo } from './AboutWhatWeDo';
import { AboutPeople } from './AboutPeople';
import { AboutImpact } from './AboutImpact';
import { AboutClosing } from './AboutClosing';

export function AboutExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // IntersectionObserver for choreographed section reveals
    const revealElements = root.querySelectorAll('.about-reveal');
    
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
        threshold: 0.05,
        rootMargin: '0px 0px 60px 0px',
      }
    );

    revealElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="about-page-root" ref={rootRef}>
      {/* Cinematic subtle background grid & ambient lighting */}
      <div className="about-ambient-glow" aria-hidden="true" />
      <div className="about-grid-overlay" aria-hidden="true" />

      {/* 1. Cinematic Opening */}
      <AboutHero />

      {/* 2. Who We Are */}
      <AboutIdentity />

      {/* 3. The HWI Manifesto */}
      <AboutManifesto />

      {/* 4. The HWI Journey (Interactive Milestone Timeline) */}
      <AboutJourney />

      {/* 5. What HWI Does (Curated Activities Showcase) */}
      <AboutWhatWeDo />

      {/* 6. The People Behind HWI (Leadership & Departments) */}
      <AboutPeople />

      {/* 7. Community & Verified Impact */}
      <AboutImpact />

      {/* 8. Closing Statement & Call to Action */}
      <AboutClosing />
    </div>
  );
}
