'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollBus } from '@/lib/scrollBus';
import { VideoPanel, DEFAULT_OFFER_VIDEO_SRC } from './VideoPanel';
import './WhatWeOffer.css';

// Configurable video source - easily replaceable with real video asset
export const WHAT_WE_OFFER_VIDEO_SRC = DEFAULT_OFFER_VIDEO_SRC;

const OFFER_ITEMS = [
  {
    number: '01',
    title: 'HANDS-ON LEARNING',
    desc: 'Workshops on AI, Blockchain, and modern Web Dev. Build real projects, not tutorials.',
  },
  {
    number: '02',
    title: 'HACKATHON CULTURE',
    desc: '24+ hour hackathons where you ship real solutions under real pressure.',
  },
  {
    number: '03',
    title: 'INDUSTRY EXPOSURE',
    desc: 'Expert sessions on career paths, emerging tech, and entrepreneurial thinking.',
  },
  {
    number: '04',
    title: 'COMMUNITY NETWORK',
    desc: 'Join a national network of student developers, mentors, and collaborators.',
  },
];

export function WhatWeOffer() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Active points count derived purely from normalized scroll position (0 to 4)
  const [activePoints, setActivePoints] = useState<number>(0);
  const activePointsRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = container.offsetHeight - viewportHeight;

      if (totalScrollable <= 0) {
        if (activePointsRef.current !== 4) {
          activePointsRef.current = 4;
          setActivePoints(4);
        }
        return;
      }

      // Normalized scroll progress through the section runway: 0.0 to 1.0
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));

      // Derive active points count strictly from scroll position:
      // 0.00 – 0.18: Negative space / clean entry, video playing on right
      // 0.18 – 0.38: POINT 01 appears
      // 0.38 – 0.58: POINT 02 appears (01 remains visible)
      // 0.58 – 0.78: POINT 03 appears (01, 02 remain visible)
      // 0.78 – 1.00: POINT 04 appears (all four points remain visible)
      let count = 0;
      if (progress >= 0.78) {
        count = 4;
      } else if (progress >= 0.58) {
        count = 3;
      } else if (progress >= 0.38) {
        count = 2;
      } else if (progress >= 0.18) {
        count = 1;
      } else {
        count = 0;
      }

      // Zero-waste updates: Only trigger React state change when crossing threshold boundaries
      if (count !== activePointsRef.current) {
        activePointsRef.current = count;
        setActivePoints(count);
      }
    };

    // Initial check
    handleScroll();

    // Subscribe to unified Lenis / browser scroll updates
    const unsubscribeScroll = scrollBus.subscribe(handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      unsubscribeScroll();
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section className="wwo" ref={containerRef} id="offer">
      <div className="wwo__sticky-viewport">
        <div className="wwo__stage">
          <div className="wwo__grid">
            {/* LEFT COLUMN: Four Numbered Information Points */}
            <div className="wwo__left-col">
              <div className="wwo__header">
                <div className="wwo__kicker-wrap">
                  <span className="wwo__dot" />
                  <span className="wwo__kicker">CHAPTER 03 // WHAT WE OFFER</span>
                </div>
                <h2 className="wwo__title">CURRICULUM & INITIATIVES</h2>
              </div>

              <div className="wwo__points-stack">
                {OFFER_ITEMS.map((item, idx) => {
                  const isVisible = activePoints >= idx + 1;
                  return (
                    <div
                      key={item.number}
                      className={`wwo__point-item ${isVisible ? 'wwo__point-item--visible' : ''}`}
                    >
                      <span className="wwo__point-number">{item.number}</span>
                      <div className="wwo__point-body">
                        <h3 className="wwo__point-title">{item.title}</h3>
                        <p className="wwo__point-desc">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Video Panel with Real-time Progress Bar & Digital Timer */}
            <div className="wwo__right-col">
              <VideoPanel
                ref={videoRef}
                src={WHAT_WE_OFFER_VIDEO_SRC}
                autoPlay
                loop
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

