'use client';

import React, { useEffect, useState } from 'react';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';
import { scrollBus } from '@/lib/scrollBus';

export function AboutHero() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollBus.subscribe((scrollY) => {
      // Scale geometric portal over the first 600px of scrolling
      const progress = Math.min(Math.max(scrollY / 500, 0), 1);
      setScrollProgress(progress);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById('who-we-are');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Geometric scale and opacity calculations
  const portalScale = 1 + scrollProgress * 1.8;
  const portalOpacity = Math.max(0.2, 1 - scrollProgress * 0.7);

  return (
    <section className="about-hero" id="opening">
      {/* Background Geometric Aperture / Reticle that expands on scroll */}
      <div 
        className="about-hero__geometric-container" 
        aria-hidden="true"
        style={{
          transform: `translate3d(0, ${scrollProgress * 60}px, 0) scale(${portalScale})`,
          opacity: portalOpacity,
        }}
      >
        <div className="about-hero__reticle-outer" />
        <div className="about-hero__reticle-inner" />
        <div className="about-hero__reticle-crosshair" />
        <div className="about-hero__reticle-core" />
      </div>

      <div className="about-container">
        {/* Authentic Chapter Attribution Header */}
        <div className="about-hero__telemetry about-reveal is-revealed">
          <KokonutBadge variant="accent">
            OFFICIAL STUDENT CHAPTER
          </KokonutBadge>
          <span className="about-hero__tag">
            <span className="about-hero__tag-dot" />
            BHARATI VIDYAPEETH UNIVERSITY
          </span>
          <span className="about-hero__tag">
            NAVI MUMBAI
          </span>
          <span className="about-hero__tag" style={{ color: '#00F0FF' }}>
            41 ACTIVE MEMBERS
          </span>
        </div>

        {/* Kinetic Clipping Typography */}
        <div className="about-hero__headline-wrapper">
          <h1 className="about-hero__headline about-reveal is-revealed about-delay-1">
            <span className="about-hero__kinetic-line">
              MORE THAN CODE.
            </span>
            <br />
            <span className="about-hero__kinetic-line about-hero__headline-accent">
              A MOVEMENT OF BUILDERS.
            </span>
          </h1>
        </div>

        {/* Concise Supporting Statement */}
        <p className="about-hero__subtext about-reveal is-revealed about-delay-2">
          An ambitious student engineering chapter at Bharati Vidyapeeth Department of Engineering and Technology, Navi Mumbai. Cultivating high-velocity hackathons, open-source shipping, and practical engineering.
        </p>

        {/* Primary Chapter Actions */}
        <div className="about-hero__actions about-reveal is-revealed about-delay-3">
          <KokonutButton href="/join" variant="primary">
            Join Chapter Roster
          </KokonutButton>
          <KokonutButton href="#who-we-are" variant="outline">
            Our Mission
          </KokonutButton>
          <KokonutButton href="/events" variant="outline">
            Explore 7-Edition Chronicle
          </KokonutButton>
        </div>

        {/* Scroll Cue & Laser Indicator */}
        <div className="about-reveal is-revealed about-delay-4">
          <button
            type="button"
            className="about-hero__scroll-cue"
            onClick={scrollToNext}
            aria-label="Scroll to explore our story"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <div className="about-hero__laser-line" />
            <span style={{ color: '#00F0FF' }}>SCROLL TO EXPLORE</span>
            <span>OUR STORY</span>
          </button>
        </div>
      </div>

      {/* Geometric Section Transition Wipe: Angled Red Aperture */}
      <div className="about-hero__bottom-wipe" aria-hidden="true" />
    </section>
  );
}
