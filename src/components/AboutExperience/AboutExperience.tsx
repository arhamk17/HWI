'use client';

import React, { useEffect, useRef } from 'react';
import './AboutExperience.css';

import { AboutHero } from './AboutHero';
import { AboutIdentity } from './AboutIdentity';
import { AboutManifesto } from './AboutManifesto';
import { AboutJourney } from './AboutJourney';
import { AboutLabExperience } from './AboutLabExperience';
import { AboutWhatWeDo } from './AboutWhatWeDo';
import { AboutPeople } from './AboutPeople';
import { AboutImpact } from './AboutImpact';
import { AboutClosing } from './AboutClosing';
import { AboutCubeGrid } from './AboutCubeGrid';

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
      {/* Cinematic geometric cube-grid background & ambient lighting */}
      <AboutCubeGrid />
      <div className="about-ambient-glow" aria-hidden="true" />

      {/* 1. Cinematic Opening: Enter the HWI Lab */}
      <AboutHero />

      {/* 2. Who We Are: Genesis & Charter */}
      <AboutIdentity />

      {/* 3. The HWI Manifesto: Architectural Principles */}
      <AboutManifesto />

      {/* 4. The HWI Journey: Interactive Milestone Timeline */}
      <AboutJourney />

      {/* 5. STANDOUT FEATURE: Inside the HWI Lab Interactive Console */}
      <AboutLabExperience />

      {/* 6. What HWI Does: Operational Showcase Vectors */}
      <AboutWhatWeDo />

      {/* 7. The People Behind HWI: Leadership & Roster */}
      <AboutPeople />

      {/* 8. Community & Verified Impact: Telemetry */}
      <AboutImpact />

      {/* 9. Closing Statement & Call to Action */}
      <AboutClosing />
    </div>
  );
}
