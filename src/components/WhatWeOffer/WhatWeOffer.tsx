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

  // Smooth scroll progress (0 to 1) for indicators and rules
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const scrollProgressRef = useRef<number>(0);

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
        if (scrollProgressRef.current !== 1) {
          scrollProgressRef.current = 1;
          setScrollProgress(1);
        }
        return;
      }

      // Normalized scroll progress through the section runway: 0.0 to 1.0
      const rawProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      if (Math.abs(rawProgress - scrollProgressRef.current) > 0.01) {
        scrollProgressRef.current = rawProgress;
        setScrollProgress(rawProgress);
      }

      // Derive active points count strictly from scroll position:
      // 0.00 – 0.15: Clean entry, video playing on right, header activates
      // 0.15 – 0.35: POINT 01 appears
      // 0.35 – 0.55: POINT 02 appears (01 remains visible)
      // 0.55 – 0.75: POINT 03 appears (01, 02 remain visible)
      // 0.75 – 1.00: POINT 04 appears (all four points remain visible)
      let count = 0;
      if (rawProgress >= 0.75) {
        count = 4;
      } else if (rawProgress >= 0.55) {
        count = 3;
      } else if (rawProgress >= 0.35) {
        count = 2;
      } else if (rawProgress >= 0.15) {
        count = 1;
      } else {
        count = 0;
      }

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

  const handleItemMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const isSectionActive = scrollProgress > 0.05;

  return (
    <section className={`wwo ${isSectionActive ? 'wwo--active' : ''}`} ref={containerRef} id="offer">
      <div className="wwo__sticky-viewport">
        {/* 3D Rotating Background Element confined to Curriculum & Initiatives section */}
        <div className="wwo__bg-3d-wrap" aria-hidden="true">
          <div className="wwo__bg-3d-glow" />
          <div className="wwo__bg-3d-disc">
            <div className="wwo__bg-3d-face wwo__bg-3d-face--front">
              <img
                src="/hwi-bvudet-logo.png"
                alt=""
                className="wwo__bg-3d-img"
                draggable={false}
              />
            </div>
            <div className="wwo__bg-3d-face wwo__bg-3d-face--back">
              <img
                src="/hwi-bvudet-logo.png"
                alt=""
                className="wwo__bg-3d-img"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <div className="wwo__stage">
          <div className="wwo__grid">
            {/* LEFT COLUMN: Four Numbered Information Points with Obys Masked Reveals */}
            <div className="wwo__left-col">
              <div className="wwo__header">
                <div className="wwo__kicker-wrap">
                  <span className="wwo__dot" />
                  <span className="wwo__kicker">CHAPTER 03 // WHAT WE OFFER</span>
                </div>
                <div className="wwo__title-wrap">
                  <h2 className="wwo__title">CURRICULUM & INITIATIVES</h2>
                </div>
                <div className="wwo__header-rule" />
              </div>

              <div className="wwo__points-stack">
                {OFFER_ITEMS.map((item, idx) => {
                  const isVisible = activePoints >= idx + 1;
                  const isCurrent = activePoints === idx + 1;
                  return (
                    <div
                      key={item.number}
                      className={`wwo__point-item ${isVisible ? 'wwo__point-item--visible' : ''} ${isCurrent ? 'wwo__point-item--current' : ''}`}
                      onMouseMove={handleItemMouseMove}
                    >
                      {/* Obys Organic Liquid Hover Blob */}
                      <span className="wwo__point-blob" aria-hidden="true" />

                      <div className="wwo__point-number-wrap">
                        <span className="wwo__point-number">{item.number}</span>
                      </div>
                      <div className="wwo__point-body">
                        <div className="wwo__point-title-wrap">
                          <h3 className="wwo__point-title">{item.title}</h3>
                        </div>
                        <div className="wwo__point-desc-wrap">
                          <p className="wwo__point-desc">{item.desc}</p>
                        </div>
                      </div>

                      {/* Obys Progressively Drawing Divider Line */}
                      <span className="wwo__point-line" aria-hidden="true" />
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
                href="/about"
              />
            </div>
          </div>
        </div>

        {/* Obys Signature Circular Scroll & Direction Indicator */}
        <div className={`wwo__scroll-indicator ${scrollProgress > 0.05 && scrollProgress < 0.98 ? 'wwo__scroll-indicator--visible' : ''}`} aria-hidden="true">
          <svg className="wwo__indicator-svg" viewBox="0 0 100 100">
            <circle
              className="wwo__indicator-circle-bg"
              cx="50"
              cy="50"
              r="44"
            />
            <circle
              className="wwo__indicator-circle-bar"
              cx="50"
              cy="50"
              r="44"
              style={{
                strokeDasharray: 276.46,
                strokeDashoffset: 276.46 * (1 - scrollProgress),
              }}
            />
          </svg>
          <div
            className="wwo__indicator-arrow"
            style={{
              transform: `rotate(${scrollProgress > 0.85 ? 0 : 45}deg)`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4V20M12 20L18 14M12 20L6 14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="wwo__indicator-label">SCROLL</span>
        </div>
      </div>
    </section>
  );
}

