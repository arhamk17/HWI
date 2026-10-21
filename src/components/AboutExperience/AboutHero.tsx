'use client';

import React from 'react';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';

export function AboutHero() {
  const scrollToNext = () => {
    const el = document.getElementById('who-we-are');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="about-hero" id="opening">
      <div className="about-container">
        {/* Telemetry and metadata tags */}
        <div className="about-hero__telemetry about-reveal is-revealed">
          <KokonutBadge variant="accent">
            OFFICIAL STUDENT CHAPTER
          </KokonutBadge>
          <span className="about-hero__tag">
            <span className="about-hero__tag-dot" />
            CHARTER: BVUDET-NM
          </span>
          <span className="about-hero__tag">
            COORDINATES: 19.0330° N, 73.0297° E
          </span>
          <span className="about-hero__tag">
            NETWORK: HACKWITHINDIA
          </span>
        </div>

        {/* Large Cinematic Editorial Headline */}
        <h1 className="about-hero__headline about-reveal is-revealed about-delay-1">
          MORE THAN CODE.
          <br />
          <span className="about-hero__headline-accent">
            A MOVEMENT OF BUILDERS.
          </span>
        </h1>

        {/* Concise Supporting Statement */}
        <p className="about-hero__subtext about-reveal is-revealed about-delay-2">
          Cultivating high-velocity engineering, open-source shipping, and competitive hackathon culture at Bharati Vidyapeeth Department of Engineering and Technology, Navi Mumbai. Bridging the chasm between textbook theory and real-world deployment.
        </p>

        {/* Actions */}
        <div className="about-hero__actions about-reveal is-revealed about-delay-3">
          <KokonutButton href="/join" variant="primary">
            Join Chapter Roster
          </KokonutButton>
          <KokonutButton href="/events" variant="outline">
            Explore 7-Edition Chronicle
          </KokonutButton>
        </div>

        {/* Scroll Cue */}
        <div className="about-reveal is-revealed about-delay-4">
          <button
            type="button"
            className="about-hero__scroll-cue"
            onClick={scrollToNext}
            aria-label="Scroll to learn who we are"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <div className="about-hero__laser-line" />
            <span>ENTER CHAPTER CHRONICLE</span>
          </button>
        </div>
      </div>
    </section>
  );
}
