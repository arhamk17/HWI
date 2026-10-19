'use client';

import { useEffect, useState, useRef } from 'react';
import { indiaStore } from '@/lib/indiaStore';
import './StoryChapter.css';

export function StoryChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [morphP, setMorphP] = useState(0);

  useEffect(() => {
    const unsub = indiaStore.subscribe(() => {
      setMorphP(indiaStore.morphProgress);
    });
    return () => unsub();
  }, []);

  // Opacity calculations for smooth narrative crossfade during scroll
  // Phase 1 (Global vision): 100% visible at start, fades out between 0.18 and 0.42
  const globalOpacity = morphP <= 0.18 ? 1.0 : Math.max(0, 1.0 - (morphP - 0.18) / 0.24);
  // Phase 2 (HWI Chapter Formation): Fades in as globe morphs into HWI lettering
  const hwiOpacity = morphP <= 0.35 ? 0.0 : Math.min(1.0, (morphP - 0.35) / 0.25);

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
            <div className="story-chapter__eyebrow">
              <span className="story-chapter__pulse-dot" />
              <span>CHAPTER 02 // GLOBAL VISION</span>
            </div>

            <h2 className="story-chapter__title">
              Connecting talents, unlocking skills, and giving a platform to those who are able but lack the chance.
            </h2>

            <div className="story-chapter__body-wrap">
              <p className="story-chapter__body-text">
                We are a premier student developer community at Bharati Vidyapeeth, Navi Mumbai. As an official chapter of HackWithIndia, we foster a culture of innovation, hands-on building, and continuous learning. We don&apos;t just write code — we solve problems, build ecosystems, and empower the next generation of technologists.
              </p>
            </div>

            <div className="story-chapter__stats-row">
              {[
                { num: '200+', label: 'Active Members' },
                { num: '6+', label: 'Major Events' },
                { num: '24h', label: 'Hackathons' },
              ].map((stat) => (
                <div key={stat.label} className="story-chapter__stat-item">
                  <span className="story-chapter__stat-num">{stat.num}</span>
                  <span className="story-chapter__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: HWI Particle Formation Header (Clean framing leaving center completely open) */}
          <div
            className="story-chapter__narrative-hwi"
            style={{
              opacity: hwiOpacity,
              transform: `translateY(${(1 - hwiOpacity) * 20}px)`,
              pointerEvents: hwiOpacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="story-chapter__eyebrow">
              <span className="story-chapter__pulse-dot" />
              <span>CHAPTER 02 // HACKWITHINDIA</span>
            </div>
            <h2 className="story-chapter__hwi-title">
              Empowering India&apos;s Builders &amp; Innovators
            </h2>
            <p className="story-chapter__hwi-desc">
              Uniting student engineers and builders under one banner to push the frontiers of technology and open innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
