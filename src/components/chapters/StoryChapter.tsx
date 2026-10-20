'use client';

import { useEffect, useState, useRef } from 'react';
import { scrollBus } from '@/lib/scrollBus';
import './StoryChapter.css';

export function StoryChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const unsub = scrollBus.subscribe(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollRunway = rect.height - window.innerHeight;
      if (scrollRunway <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRunway));
      setScrollProgress(progress);
    });

    return () => {
      unsub();
    };
  }, []);

  // Narrative copy gently fades out between 0.10 and 0.24, leaving center stage exclusively to HWI
  const narrativeOpacity = scrollProgress < 0.10 ? 1.0 : Math.max(0, 1.0 - (scrollProgress - 0.10) / 0.14);

  return (
    <section className="story-chapter" ref={sectionRef} id="about">
      <div className="story-chapter__sticky">
        <div className="story-chapter__viewport">
          {/* Chapter Narrative (Clean Editorial presentation) */}
          <div
            className="story-chapter__narrative-global"
            style={{
              opacity: narrativeOpacity,
              transform: `translateY(${(1 - narrativeOpacity) * -16}px)`,
              pointerEvents: narrativeOpacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="story-chapter__eyebrow">
              <span className="story-chapter__pulse-dot" />
              <span>CHAPTER 02 // ABOUT THE CHAPTER</span>
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
                { num: '8', label: 'Event Editions' },
                { num: '41', label: 'Core Contributors' },
                { num: '100%', label: 'Student Led' },
              ].map((stat) => (
                <div key={stat.label} className="story-chapter__stat-item">
                  <span className="story-chapter__stat-num">{stat.num}</span>
                  <span className="story-chapter__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
