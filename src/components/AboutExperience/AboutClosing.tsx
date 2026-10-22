'use client';

import React from 'react';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';

export function AboutClosing() {
  return (
    <section className="about-section about-closing" id="closing">
      <div className="about-container">
        <div className="about-closing__content about-reveal">
          <KokonutBadge variant="accent" dot>
            NEXT COHORT OPEN
          </KokonutBadge>

          <h2 className="about-closing__title">
            THE CRUCIBLE FOR AMBITIOUS DEVELOPERS.
            <br />
            <span style={{ color: '#EF4444' }}>
              DON&apos;T JUST OBSERVE THE FUTURE. SHIP IT.
            </span>
          </h2>

          <p className="about-closing__subtext">
            Whether you are writing your first line of production code, hunting for your first hackathon squad, or architecting distributed systems, HackWithIndia BVUDET-NM has a platform for you.
          </p>

          <div className="about-closing__actions">
            <KokonutButton href="/join" variant="primary">
              Join the Chapter
            </KokonutButton>
            <KokonutButton href="/events" variant="outline">
              Explore Chronicle
            </KokonutButton>
            <KokonutButton href="/team" variant="outline">
              Meet the Team
            </KokonutButton>
          </div>
        </div>
      </div>
    </section>
  );
}
