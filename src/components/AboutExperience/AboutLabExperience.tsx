'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LabMode {
  id: string;
  index: string;
  tabLabel: string;
  tag: string;
  title: string;
  desc: string;
  accent: string;
  glow: string;
  secondaryAccent: string;
  image: string;
  telemetry: {
    label: string;
    value: string;
  }[];
  geometricShape: 'circle-wipe' | 'wedge-slice' | 'reticle-diamond' | 'matrix-hex';
  actionLabel: string;
  actionHref: string;
}

const LAB_MODES: LabMode[] = [
  {
    id: 'sprint-engine',
    index: '01',
    tabLabel: 'HACKATHONS',
    tag: 'HIGH-VELOCITY SPRINTING',
    title: 'CONTINUOUS 24H–36H SPRINT MARATHONS',
    desc: 'Under continuous 24-to-36-hour hackathon constraints (HackWithMumbai, BuildTheFuture), student engineering squads architect, debug, and deploy production systems without pause.',
    accent: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.45)',
    secondaryAccent: '#00F0FF',
    image: '/images/events/rocketride_hackers.jpg',
    telemetry: [
      { label: 'ATTENDEES PER SPRINT', value: '340+ TO 480+' },
      { label: 'LONGEST SPRINT', value: '36 HOURS' },
      { label: 'SHIPPED PROJECTS', value: '45+ REPOSITORIES' },
      { label: 'EVALUATION', value: 'INDUSTRY JURY' },
    ],
    geometricShape: 'circle-wipe',
    actionLabel: 'EXPLORE HACKATHONS',
    actionHref: '/events',
  },
  {
    id: 'protocol-acceleration',
    index: '02',
    tabLabel: 'LAB BOOTCAMPS',
    tag: 'TECHNICAL LAB SESSIONS',
    title: 'PRACTICAL PROTOCOL & DEV WORKSHOPS',
    desc: 'Deep-dive cryptographic and decentralized protocol labs hosted in the BVUDET Central Computing facility, exploring Solidity contracts, gas efficiency, and distributed state machines.',
    accent: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.45)',
    secondaryAccent: '#EF4444',
    image: '/images/events/web3_report_image5.jpeg',
    telemetry: [
      { label: 'PROTOCOL BUILDERS', value: '160+ BUILDERS' },
      { label: 'SMART CONTRACTS', value: '22 VERIFIED' },
      { label: 'HOST FACILITY', value: 'CENTRAL COMPUTING LAB' },
      { label: 'FOCUS DOMAIN', value: 'BLOCKCHAIN & PROTOCOLS' },
    ],
    geometricShape: 'reticle-diamond',
    actionLabel: 'VIEW LAB WORKSHOPS',
    actionHref: '/events',
  },
  {
    id: 'global-delegation',
    index: '03',
    tabLabel: 'GLOBAL KEYNOTES',
    tag: 'INTERNATIONAL TECH SUMMITS',
    title: 'SILICON VALLEY SESSIONS & KEYNOTES',
    desc: 'Direct cross-continental engineering summits bringing global tech founders—including keynotes by Ryan Christensen and Rod Christensen from RocketRide, San Francisco—directly to our Navi Mumbai campus.',
    accent: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.45)',
    secondaryAccent: '#00F0FF',
    image: '/images/events/rocketride_keynote.jpg',
    telemetry: [
      { label: 'SPRINT PARTICIPATION', value: '47 TEAMS (183 BUILDERS)' },
      { label: 'KEYNOTE DELEGATION', value: 'ROCKETRIDE, SF' },
      { label: 'CAMPUS VENUE', value: 'MAIN AUDITORIUM' },
      { label: 'OPPORTUNITY', value: 'GLOBAL MENTORSHIP' },
    ],
    geometricShape: 'wedge-slice',
    actionLabel: 'DISCOVER DELEGATIONS',
    actionHref: '/events',
  },
  {
    id: 'builder-commons',
    index: '04',
    tabLabel: 'BUILDER NETWORK',
    tag: 'STUDENT COMMUNITY NETWORK',
    title: 'PAN-MAHARASHTRA STUDENT COMMONS',
    desc: 'An interconnected student builder collective spanning collegiate campuses throughout western India, united through open-source repos, collaborative buildathons, and hackathon delegations.',
    accent: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.45)',
    secondaryAccent: '#00F0FF',
    image: '/images/events/learn_it_tour_image4.png',
    telemetry: [
      { label: 'STUDENT NETWORK', value: '1,400+ BUILDERS' },
      { label: 'COMMUNITY TOURS', value: 'LEARN IT TOUR' },
      { label: 'ACTIVE ROSTER', value: '41 CHAPTER MEMBERS' },
      { label: 'COMMONS CODE', value: 'PUBLIC LIBRARIES' },
    ],
    geometricShape: 'matrix-hex',
    actionLabel: 'JOIN CHAPTER NETWORK',
    actionHref: '/join',
  },
];

export function AboutLabExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const current = LAB_MODES[activeIndex];

  const handleSelect = useCallback((idx: number) => {
    if (idx === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(idx);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  }, [activeIndex, isTransitioning]);

  const handlePrev = useCallback(() => {
    const nextIdx = (activeIndex - 1 + LAB_MODES.length) % LAB_MODES.length;
    handleSelect(nextIdx);
  }, [activeIndex, handleSelect]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % LAB_MODES.length;
    handleSelect(nextIdx);
  }, [activeIndex, handleSelect]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  return (
    <section 
      className="about-section about-lab-section" 
      id="inside-the-lab"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Inside the HWI Lab interactive vector console"
    >
      <div className="about-container">
        {/* Lab Header */}
        <div className="about-lab__header about-reveal">
          <div className="about-lab__eyebrow">
            <span className="about-lab__pulse-dot" style={{ backgroundColor: current.accent, boxShadow: `0 0 10px ${current.accent}` }} />
            <span>CHAPTER FOCUS AREAS • BVUDET NAVI MUMBAI</span>
          </div>
          
          <h2 className="about-lab__title">
            INSIDE THE HWI LAB
          </h2>
          <p className="type-body text-secondary" style={{ maxWidth: '720px', marginTop: '12px' }}>
            Interactive focus areas. Explore the core programs, hackathon sprints, and technical workshops powering the student engineering chapter at BVUDET-NM.
          </p>
        </div>

        {/* Console Container */}
        <div 
          className="about-lab__console about-reveal"
          style={
            {
              '--lab-accent': current.accent,
              '--lab-glow': current.glow,
              '--lab-secondary': current.secondaryAccent,
            } as React.CSSProperties
          }
        >
          {/* Top Interface Bar */}
          <div className="about-lab__toolbar">
            <div className="about-lab__toolbar-left">
              <span className="about-lab__system-label">
                PROGRAM FOCUS {current.index} OF 04
              </span>
              <span className="about-lab__slash">•</span>
              <span className="about-lab__toolbar-code" style={{ color: current.accent }}>
                {current.tabLabel}
              </span>
            </div>

            {/* Mode Selector Tabs */}
            <div className="about-lab__tabs" role="tablist">
              {LAB_MODES.map((mode, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`lab-panel-${mode.id}`}
                    id={`lab-tab-${mode.id}`}
                    className={`about-lab__tab-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelect(i)}
                  >
                    <span className="about-lab__tab-num">{mode.index}</span>
                    <span className="about-lab__tab-name">{mode.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Quick Controls */}
            <div className="about-lab__nav-controls">
              <button
                type="button"
                className="about-lab__nav-btn"
                onClick={handlePrev}
                aria-label="Previous lab mode"
              >
                ◀
              </button>
              <button
                type="button"
                className="about-lab__nav-btn"
                onClick={handleNext}
                aria-label="Next lab mode"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Main Stage Display */}
          <div 
            className={`about-lab__stage ${isTransitioning ? 'is-transitioning' : ''}`}
            id={`lab-panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`lab-tab-${current.id}`}
          >
            {/* Left Content Column */}
            <div className="about-lab__details">
              <div className="about-lab__badge" style={{ color: current.accent, borderColor: current.accent }}>
                {current.tag}
              </div>

              <h3 className="about-lab__stage-title">
                {current.title}
              </h3>

              <p className="about-lab__stage-desc">
                {current.desc}
              </p>

              {/* Verified Telemetry Grid */}
              <div className="about-lab__telemetry-grid">
                {current.telemetry.map((t) => (
                  <div key={t.label} className="about-lab__telemetry-cell">
                    <span className="about-lab__telemetry-value" style={{ color: current.accent }}>
                      {t.value}
                    </span>
                    <span className="about-lab__telemetry-label">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="about-lab__action-wrap">
                <Link
                  href={current.actionHref}
                  className="about-lab__action-btn"
                  style={{
                    backgroundColor: current.accent,
                    boxShadow: `0 0 20px ${current.glow}`,
                  }}
                >
                  <span>{current.actionLabel}</span>
                  <span className="about-lab__action-arrow">→</span>
                </Link>
              </div>
            </div>

            {/* Right Media / Geometric Visualizer Frame */}
            <div className="about-lab__visualizer">
              {/* Corner brackets */}
              <div className="about-lab__corner about-lab__corner--tl" />
              <div className="about-lab__corner about-lab__corner--tr" />
              <div className="about-lab__corner about-lab__corner--bl" />
              <div className="about-lab__corner about-lab__corner--br" />

              {/* Geometric Wipe Accent Overlay */}
              <div 
                className={`about-lab__geometric-mask about-lab__geometric-mask--${current.geometricShape}`} 
                aria-hidden="true"
                style={{ borderColor: current.accent }}
              >
                <div className="about-lab__geometric-core" style={{ backgroundColor: current.accent }} />
              </div>

              {/* Image Canvas */}
              <div className="about-lab__media-wrap">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 580px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Interactive Telemetry HUD Footer */}
              <div className="about-lab__hud-footer">
                <div className="about-lab__hud-meta">
                  <span className="about-lab__meta-dot" style={{ backgroundColor: current.accent }} />
                  <span>EVENT ARCHIVE & DOCUMENTATION</span>
                </div>
                <div className="about-lab__dial">
                  <span style={{ color: current.accent }}>0{activeIndex + 1}</span>
                  <span className="about-lab__dial-slash">/</span>
                  <span>04</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
