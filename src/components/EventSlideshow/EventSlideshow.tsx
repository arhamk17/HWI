'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Trophy,
  Code2,
  X,
} from 'lucide-react';
import { EVENTS_DATA, EventItem, EventImage } from '@/data/events';
import './EventSlideshow.css';

export function EventSlideshow() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState<0 | 1>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);

  // Dragging state strictly for the two photos
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const totalEvents = EVENTS_DATA.length;
  const currentEvent = EVENTS_DATA[currentEventIndex];

  // Reset active photo to 0 whenever the event changes
  const switchEvent = useCallback(
    (newIndex: number) => {
      if (newIndex === currentEventIndex) return;
      setIsTransitioning(true);
      setCurrentEventIndex(newIndex);
      setActivePhotoIndex(0);
      setDragOffset(0);

      // Lightweight transition timer
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 420);
      return () => clearTimeout(timer);
    },
    [currentEventIndex]
  );

  const handlePrevEvent = useCallback(() => {
    const nextIdx = currentEventIndex === 0 ? totalEvents - 1 : currentEventIndex - 1;
    switchEvent(nextIdx);
  }, [currentEventIndex, totalEvents, switchEvent]);

  const handleNextEvent = useCallback(() => {
    const nextIdx = currentEventIndex === totalEvents - 1 ? 0 : currentEventIndex + 1;
    switchEvent(nextIdx);
  }, [currentEventIndex, totalEvents, switchEvent]);

  // Keyboard navigation for accessible event browsing
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextEvent();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevEvent();
      }
    },
    [handleNextEvent, handlePrevEvent]
  );

  // Strictly Photo Drag & Swipe Logic
  // Clamped strictly to photo 0 <-> photo 1. NEVER changes event!
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only respond to primary button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    // Apply soft resistance clamp: +/- 90px
    const clampedDelta = Math.max(-90, Math.min(90, delta));
    setDragOffset(clampedDelta);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;

    // Threshold to switch between the two photos: 35px
    if (delta < -35 && activePhotoIndex === 0) {
      setActivePhotoIndex(1);
    } else if (delta > 35 && activePhotoIndex === 1) {
      setActivePhotoIndex(0);
    }

    setIsDragging(false);
    dragStartX.current = null;
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    dragStartX.current = null;
    setDragOffset(0);
  };

  // Close modal on Escape key
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEventModal(null);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  // Format index string "01 / 06"
  const formattedCurrentIndex = String(currentEventIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalEvents).padStart(2, '0');
  const progressPercent = ((currentEventIndex + 1) / totalEvents) * 100;

  return (
    <section
      className="event-slideshow-section"
      aria-roledescription="carousel"
      aria-label="HackWithIndia Event Slideshow"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Editorial Section Header */}
      <div className="event-slideshow__header-bar">
        <div className="event-slideshow__eyebrow-wrap">
          <span className="event-slideshow__pulse-dot" />
          <span className="type-eyebrow text-accent">CURATED EVENT SHOWCASE</span>
          <span className="event-slideshow__eyebrow-divider">•</span>
          <span className="type-eyebrow text-tertiary">IMMERSIVE DUAL-IMAGE CHRONICLE</span>
        </div>
        <div className="event-slideshow__header-hint">
          <span>DRAG GALLERY TO TOGGLE PHOTOS</span>
          <span className="event-slideshow__hint-arrow">↔</span>
        </div>
      </div>

      {/* Main Dual-Column Showcase Deck */}
      <div className="event-slideshow__stage">
        {/* ========================================================= */}
        {/* LEFT COLUMN: DUAL-IMAGE IMMERSIVE GALLERY                 */}
        {/* Strictly handles photo gestures (Photo 0 <-> Photo 1)     */}
        {/* ========================================================= */}
        <div className="event-slideshow__gallery-column">
          {/* Subtle Photo Navigation Bar */}
          <div className="event-gallery__nav-strip">
            <div className="event-gallery__tabs">
              <button
                type="button"
                className={`event-gallery__tab-btn ${activePhotoIndex === 0 ? 'event-gallery__tab-btn--active' : ''}`}
                onClick={() => setActivePhotoIndex(0)}
                aria-label="View first photo: Main Stage"
              >
                <span className="tab-pill-dot" />
                <span>01 // {currentEvent.images[0]?.title.split('//')[0]?.trim() || 'MAIN STAGE'}</span>
              </button>
              <button
                type="button"
                className={`event-gallery__tab-btn ${activePhotoIndex === 1 ? 'event-gallery__tab-btn--active' : ''}`}
                onClick={() => setActivePhotoIndex(1)}
                aria-label="View second photo: Action Deck"
              >
                <span className="tab-pill-dot" />
                <span>02 // {currentEvent.images[1]?.title.split('//')[0]?.trim() || 'WAR ROOM'}</span>
              </button>
            </div>

            <div className="event-gallery__mini-controls">
              <button
                type="button"
                className="event-gallery__mini-btn"
                onClick={() => setActivePhotoIndex(0)}
                disabled={activePhotoIndex === 0}
                aria-label="Previous photo"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="event-gallery__mini-indicator">
                {activePhotoIndex + 1} / 2
              </span>
              <button
                type="button"
                className="event-gallery__mini-btn"
                onClick={() => setActivePhotoIndex(1)}
                disabled={activePhotoIndex === 1}
                aria-label="Next photo"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Drag & Swipe Gallery Viewport */}
          <div
            ref={galleryRef}
            className={`event-gallery__viewport ${isDragging ? 'event-gallery__viewport--dragging' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            role="region"
            aria-label="Swipeable event images"
            data-cursor="event"
            data-cursor-label="DRAG"
          >
            {/* Gallery Track holding exactly two images with distinct compositions */}
            <div
              className={`event-gallery__track active-photo-${activePhotoIndex}`}
              style={
                {
                  '--drag-offset': `${dragOffset}px`,
                } as React.CSSProperties
              }
            >
              {/* IMAGE 01: Wide Composition */}
              <div
                className={`event-gallery__card event-gallery__card--wide ${activePhotoIndex === 0 ? 'event-gallery__card--active' : 'event-gallery__card--recessed'}`}
                onClick={() => activePhotoIndex !== 0 && setActivePhotoIndex(0)}
                role="button"
                tabIndex={0}
                aria-label={`Focus image 1: ${currentEvent.images[0]?.title}`}
                data-cursor="link"
                data-cursor-label="FOCUS 01"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePhotoIndex(0);
                  }
                }}
              >
                <EventImageFrame
                  image={currentEvent.images[0]}
                  isActive={activePhotoIndex === 0}
                  index={1}
                  total={2}
                  eventTitle={currentEvent.title}
                />
              </div>

              {/* IMAGE 02: Portrait / Focused Composition */}
              <div
                className={`event-gallery__card event-gallery__card--portrait ${activePhotoIndex === 1 ? 'event-gallery__card--active' : 'event-gallery__card--recessed'}`}
                onClick={() => activePhotoIndex !== 1 && setActivePhotoIndex(1)}
                role="button"
                tabIndex={0}
                aria-label={`Focus image 2: ${currentEvent.images[1]?.title}`}
                data-cursor="link"
                data-cursor-label="FOCUS 02"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePhotoIndex(1);
                  }
                }}
              >
                <EventImageFrame
                  image={currentEvent.images[1]}
                  isActive={activePhotoIndex === 1}
                  index={2}
                  total={2}
                  eventTitle={currentEvent.title}
                />
              </div>
            </div>

            {/* Subtle floating drag affordance badge */}
            <div className="event-gallery__drag-cue">
              <span className="drag-cue-icon">↔</span>
              <span>{isDragging ? 'DRAGGING...' : 'DRAG TO TOGGLE PHOTOS'}</span>
            </div>
          </div>

          {/* Mobile swipe indicator dots */}
          <div className="event-gallery__mobile-dots">
            <span
              className={`mobile-dot ${activePhotoIndex === 0 ? 'mobile-dot--active' : ''}`}
              onClick={() => setActivePhotoIndex(0)}
            />
            <span
              className={`mobile-dot ${activePhotoIndex === 1 ? 'mobile-dot--active' : ''}`}
              onClick={() => setActivePhotoIndex(1)}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: EVENT INFORMATION PANEL                     */}
        {/* Smooth GPU transition when active event switches           */}
        {/* ========================================================= */}
        <div
          className={`event-slideshow__info-column ${isTransitioning ? 'event-info--transitioning' : ''}`}
          key={currentEvent.id}
          aria-live="polite"
        >
          {/* Top Eyebrow Badges */}
          <div className="event-info__badges">
            <span className="event-badge event-badge--category">
              {currentEvent.category}
            </span>
            <span className="event-badge event-badge--year">
              {currentEvent.year}
            </span>
            <span
              className={`event-badge ${currentEvent.status === 'upcoming' ? 'event-badge--upcoming' : 'event-badge--past'}`}
            >
              {currentEvent.status === 'upcoming' ? 'REGISTRATION OPEN' : 'ARCHIVED DOSSIER'}
            </span>
            <span className="event-badge event-badge--flagship">
              {currentEvent.badge}
            </span>
          </div>

          {/* Event Title */}
          <h2 className="event-info__title">{currentEvent.title}</h2>

          {/* Event Theme Subtitle */}
          <p className="event-info__theme">
            <Sparkles size={14} className="theme-sparkle" />
            <span>THEME: {currentEvent.theme}</span>
          </p>

          {/* Metadata Telemetry Grid */}
          <div className="event-info__meta-grid">
            <div className="event-meta-card">
              <div className="event-meta-card__icon">
                <Calendar size={16} />
              </div>
              <div className="event-meta-card__text">
                <span className="event-meta-card__label">DATE / SCHEDULE</span>
                <span className="event-meta-card__value">{currentEvent.date}</span>
              </div>
            </div>

            <div className="event-meta-card">
              <div className="event-meta-card__icon">
                <MapPin size={16} />
              </div>
              <div className="event-meta-card__text">
                <span className="event-meta-card__label">CAMPUS VENUE</span>
                <span className="event-meta-card__value">{currentEvent.venue}</span>
              </div>
            </div>

            <div className="event-meta-card">
              <div className="event-meta-card__icon">
                <Clock size={16} />
              </div>
              <div className="event-meta-card__text">
                <span className="event-meta-card__label">FORMAT / DURATION</span>
                <span className="event-meta-card__value">{currentEvent.duration}</span>
              </div>
            </div>

            <div className="event-meta-card">
              <div className="event-meta-card__icon">
                <Users size={16} />
              </div>
              <div className="event-meta-card__text">
                <span className="event-meta-card__label">PARTICIPATION</span>
                <span className="event-meta-card__value">{currentEvent.participants} Builders</span>
              </div>
            </div>
          </div>

          {/* Concise Description */}
          <p className="event-info__description">{currentEvent.desc}</p>

          {/* Key Highlights Pill List */}
          <div className="event-info__highlights-box">
            <div className="event-info__highlights-header">
              <Layers size={14} className="highlights-icon" />
              <span>KEY TELEMETRY & HIGHLIGHTS</span>
            </div>
            <ul className="event-info__highlights-list">
              {currentEvent.highlights.map((item, idx) => (
                <li key={idx} className="event-info__highlight-item">
                  <span className="highlight-bullet">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="event-info__actions">
            <button
              type="button"
              className="event-cta-btn event-cta-btn--primary"
              onClick={() => setSelectedEventModal(currentEvent)}
              data-cursor="link"
              data-cursor-label="DOSSIER"
            >
              <span>VIEW FULL DOSSIER</span>
              <ArrowUpRight size={16} />
            </button>

            {currentEvent.status === 'upcoming' ? (
              <a
                href="/join"
                className="event-cta-btn event-cta-btn--secondary"
                data-cursor="link"
                data-cursor-label="APPLY"
              >
                <span>REGISTER NOW</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <button
                type="button"
                className="event-cta-btn event-cta-btn--ghost"
                onClick={() => setSelectedEventModal(currentEvent)}
              >
                <span>PODIUM & REPOS</span>
                <Trophy size={14} />
              </button>
            )}
          </div>

          {/* ========================================================= */}
          {/* EVENT NAVIGATION CONTROLS (SEPARATE FROM PHOTO SWIPING)   */}
          {/* ========================================================= */}
          <div className="event-slideshow__nav-bar">
            {/* Numeric Index & Progress Bar */}
            <div className="event-nav__counter-wrap">
              <div className="event-nav__digits">
                <span className="event-nav__digit-current">{formattedCurrentIndex}</span>
                <span className="event-nav__digit-slash">/</span>
                <span className="event-nav__digit-total">{formattedTotal}</span>
              </div>
              <div className="event-nav__progress-track" aria-hidden="true">
                <div
                  className="event-nav__progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Event Selector Pills */}
            <div className="event-nav__pills-strip" role="tablist">
              {EVENTS_DATA.map((ev, i) => (
                <button
                  key={ev.id}
                  type="button"
                  role="tab"
                  aria-selected={i === currentEventIndex}
                  className={`event-nav__pill ${i === currentEventIndex ? 'event-nav__pill--active' : ''}`}
                  onClick={() => switchEvent(i)}
                  title={ev.title}
                >
                  <span className="pill-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pill-active-glow" />
                </button>
              ))}
            </div>

            {/* Prev / Next Event Action Arrows */}
            <div className="event-nav__arrows">
              <button
                type="button"
                className="event-nav__arrow-btn"
                onClick={handlePrevEvent}
                aria-label="Previous event"
                data-cursor="link"
                data-cursor-label="PREV"
              >
                <ChevronLeft size={20} />
                <span className="arrow-btn-text">PREV</span>
              </button>
              <button
                type="button"
                className="event-nav__arrow-btn event-nav__arrow-btn--next"
                onClick={handleNextEvent}
                aria-label="Next event"
                data-cursor="link"
                data-cursor-label="NEXT"
              >
                <span className="arrow-btn-text">NEXT</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RICH EVENT DOSSIER MODAL                                  */}
      {/* ========================================================= */}
      {selectedEventModal && (
        <EventDossierModal
          event={selectedEventModal}
          onClose={() => setSelectedEventModal(null)}
        />
      )}
    </section>
  );
}

// =========================================================================
// HIGH-FIDELITY PROCEDURAL HUD IMAGE COMPONENT
// Cyberpunk viewfinder with camera telemetry, brackets & graphic wireframe
// =========================================================================
interface EventImageFrameProps {
  image: EventImage;
  isActive: boolean;
  index: number;
  total: number;
  eventTitle: string;
}

function EventImageFrame({
  image,
  isActive,
  index,
  total,
  eventTitle,
}: EventImageFrameProps) {
  return (
    <div className={`event-image-frame ${isActive ? 'frame--active' : 'frame--idle'}`}>
      {/* Corner Tech Brackets */}
      <span className="frame-bracket frame-bracket--tl" />
      <span className="frame-bracket frame-bracket--tr" />
      <span className="frame-bracket frame-bracket--bl" />
      <span className="frame-bracket frame-bracket--br" />

      {/* Cybernetic Scanline & Vignette */}
      <div className="frame-scanlines" />
      <div className="frame-vignette" />

      {/* Real Image or Procedural HUD Graphic Canvas */}
      {image.src ? (
        <div className="frame-real-image-wrap">
          <Image
            src={image.src}
            alt={image.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            loading="lazy"
            className="frame-real-image"
          />
        </div>
      ) : (
        <div className="frame-procedural-canvas">
          <ProceduralHudGraphic type={image.hudGraphicType} />
        </div>
      )}

      {/* Top HUD Telemetry Bar */}
      <div className="frame-top-bar">
        <div className="frame-rec-indicator">
          <span className="rec-dot" />
          <span className="rec-text">REC [4K RAW]</span>
        </div>
        <div className="frame-cam-data">
          <span>{image.cameraInfo}</span>
        </div>
        <div className="frame-index-pill">
          <span>FRAME 0{index} / 0{total}</span>
        </div>
      </div>

      {/* Center Reticle & Watermark Monogram */}
      <div className="frame-center-hud">
        <div className="frame-crosshair">
          <span className="ch-line ch-h" />
          <span className="ch-line ch-v" />
          <div className="ch-circle" />
        </div>
        <div className="frame-watermark">
          <span className="watermark-org">HACKWITHINDIA</span>
          <span className="watermark-sub">BVUDET-NM CHAPTER ARCHIVE</span>
        </div>
      </div>

      {/* Bottom Information Caption Bar */}
      <div className="frame-bottom-bar">
        <div className="frame-tag-pill">
          <span className="tag-pulse" />
          <span>{image.tag}</span>
        </div>
        <h4 className="frame-image-title">{image.title}</h4>
        <p className="frame-image-caption">{image.caption}</p>
      </div>

      {/* Idle click-to-focus callout */}
      {!isActive && (
        <div className="frame-idle-overlay">
          <span className="idle-pill">TAP TO FOCUS</span>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// VECTOR HUD BLUEPRINT GRAPHICS (FOR ZERO-DEPENDENCY RICH AESTHETICS)
// =========================================================================
function ProceduralHudGraphic({ type }: { type: EventImage['hudGraphicType'] }) {
  switch (type) {
    case 'grid':
      return (
        <svg className="hud-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#EF4444" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#070709" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <g stroke="rgba(239, 68, 68, 0.22)" strokeWidth="1">
            {/* Perspective grid lines */}
            {[-200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
              <line key={i} x1={300} y1={120} x2={x} y2={400} />
            ))}
            {[140, 170, 210, 260, 320, 390].map((y, i) => (
              <line key={i} x1={0} y1={y} x2={600} y2={y} strokeOpacity={0.15 + i * 0.12} />
            ))}
          </g>
          {/* Horizon sun glow */}
          <circle cx="300" cy="120" r="45" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="300" cy="120" r="20" fill="rgba(239, 68, 68, 0.2)" />
        </svg>
      );

    case 'circuit':
      return (
        <svg className="hud-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <g stroke="rgba(239, 68, 68, 0.28)" strokeWidth="1.5" fill="none">
            <path d="M50 200 H180 L230 140 H380 L420 180 H550" />
            <path d="M80 320 H200 L250 260 H340 L370 290 H520" />
            <path d="M120 80 H260 L290 110 H440 L480 70 H560" />
            <circle cx="180" cy="200" r="4" fill="#EF4444" />
            <circle cx="380" cy="140" r="4" fill="#EF4444" />
            <circle cx="250" cy="260" r="4" fill="#EF4444" />
            <circle cx="290" cy="110" r="4" fill="#EF4444" />
          </g>
          <rect x="250" y="170" width="100" height="60" rx="6" fill="rgba(24, 21, 29, 0.8)" stroke="#EF4444" strokeWidth="1.2" />
          <text x="300" y="205" fill="#EF4444" fontSize="11" fontFamily="var(--font-primary)" textAnchor="middle" letterSpacing="2">
            IC // SYNAPSE
          </text>
        </svg>
      );

    case 'terminal':
      return (
        <svg className="hud-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <rect x="60" y="50" width="480" height="300" rx="8" fill="rgba(12, 10, 16, 0.75)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
          <line x1="60" y1="85" x2="540" y2="85" stroke="rgba(239, 68, 68, 0.2)" />
          <circle cx="85" cy="68" r="4" fill="#EF4444" />
          <circle cx="100" cy="68" r="4" fill="rgba(255,255,255,0.3)" />
          <circle cx="115" cy="68" r="4" fill="rgba(255,255,255,0.3)" />
          <text x="85" y="125" fill="#EF4444" fontSize="13" fontFamily="var(--font-primary)">$ hwi agent run --autonomous</text>
          <text x="85" y="155" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="var(--font-primary)">[+] Initializing distributed cluster...</text>
          <text x="85" y="180" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="var(--font-primary)">[+] GPU tensor stream active: 8x H100</text>
          <text x="85" y="205" fill="rgba(239, 68, 68, 0.9)" fontSize="12" fontFamily="var(--font-primary)">[✔] 24h Hackathon HackWithMumbai online</text>
          <text x="85" y="235" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="var(--font-primary)">&gt; compiling prototypes 70/70</text>
          <rect x="85" y="255" width="12" height="18" fill="#EF4444" opacity="0.85" />
        </svg>
      );

    case 'nodes':
      return (
        <svg className="hud-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <g stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1.2">
            <line x1="120" y1="180" x2="220" y2="100" />
            <line x1="220" y1="100" x2="360" y2="140" />
            <line x1="360" y1="140" x2="480" y2="90" />
            <line x1="120" y1="180" x2="240" y2="280" />
            <line x1="240" y1="280" x2="380" y2="260" />
            <line x1="380" y1="260" x2="480" y2="90" />
            <line x1="220" y1="100" x2="240" y2="280" />
            <line x1="360" y1="140" x2="380" y2="260" />
          </g>
          {[[120, 180], [220, 100], [360, 140], [480, 90], [240, 280], [380, 260]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="rgba(7, 7, 9, 0.9)" stroke="#EF4444" strokeWidth="2" />
              <circle cx={x} cy={y} r="3" fill="#EF4444" />
            </g>
          ))}
          <circle cx="300" cy="190" r="70" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeDasharray="3 5" />
        </svg>
      );

    case 'waveform':
      return (
        <svg className="hud-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <g fill="url(#waveGrad)">
            {Array.from({ length: 32 }).map((_, i) => {
              const x = 50 + i * 16;
              const h = Math.abs(Math.sin((i / 32) * Math.PI * 3)) * 140 + 20;
              const y = 200 - h / 2;
              return <rect key={i} x={x} y={y} width="8" height={h} rx="3" />;
            })}
          </g>
          <line x1="30" y1="200" x2="570" y2="200" stroke="#EF4444" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
        </svg>
      );

    case 'radar':
    default:
      return (
        <svg className="hud-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <circle cx="300" cy="200" r="140" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" />
          <circle cx="300" cy="200" r="95" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" />
          <circle cx="300" cy="200" r="50" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.2" strokeDasharray="4 4" />
          <line x1="130" y1="200" x2="470" y2="200" stroke="rgba(239, 68, 68, 0.2)" />
          <line x1="300" y1="40" x2="300" y2="360" stroke="rgba(239, 68, 68, 0.2)" />
          <circle cx="300" cy="200" r="5" fill="#EF4444" />
          <circle cx="350" cy="150" r="4" fill="#EF4444" opacity="0.8" />
          <circle cx="230" cy="240" r="4" fill="#EF4444" opacity="0.6" />
        </svg>
      );
  }
}

// =========================================================================
// EXPANDED EVENT DOSSIER MODAL
// Full narrative, podium, and featured repositories
// =========================================================================
function EventDossierModal({
  event,
  onClose,
}: {
  event: EventItem;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="dossier-modal__backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
    >
      <div className="dossier-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="dossier-modal__close-btn"
          onClick={onClose}
          aria-label="Close event dossier"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="dossier-modal__header">
          <div className="dossier-modal__tags">
            <span className="event-badge event-badge--category">{event.category}</span>
            <span className="event-badge event-badge--year">{event.year}</span>
            <span className="event-badge event-badge--flagship">{event.badge}</span>
          </div>
          <h2 id="dossier-modal-title" className="dossier-modal__title">
            {event.title}
          </h2>
          <p className="dossier-modal__subtitle">THEME: {event.theme}</p>
        </div>

        {/* Dual Image Preview Reel inside Modal */}
        <div className="dossier-modal__images-reel">
          {event.images.map((img, i) => (
            <div key={img.id} className="dossier-image-thumb">
              <div className="dossier-image-thumb__canvas">
                <ProceduralHudGraphic type={img.hudGraphicType} />
              </div>
              <div className="dossier-image-thumb__meta">
                <span className="thumb-idx">FRAME 0{i + 1}</span>
                <span className="thumb-tag">{img.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Telemetry Stats Strip */}
        <div className="dossier-modal__stats-strip">
          <div className="dossier-stat-box">
            <span className="stat-label">DATE</span>
            <span className="stat-val">{event.date}</span>
          </div>
          <div className="dossier-stat-box">
            <span className="stat-label">VENUE</span>
            <span className="stat-val">{event.venue}</span>
          </div>
          <div className="dossier-stat-box">
            <span className="stat-label">DURATION</span>
            <span className="stat-val">{event.duration}</span>
          </div>
          <div className="dossier-stat-box">
            <span className="stat-label">BUILDERS</span>
            <span className="stat-val">{event.participants}</span>
          </div>
          <div className="dossier-stat-box">
            <span className="stat-label">PROJECTS</span>
            <span className="stat-val">{event.projectsCount}</span>
          </div>
        </div>

        {/* Full Narrative Breakdown */}
        <div className="dossier-modal__section">
          <h3 className="dossier-section-heading">OPERATIONAL NARRATIVE & OVERVIEW</h3>
          <p className="dossier-body-text">{event.fullDescription}</p>
        </div>

        {/* Key Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="dossier-modal__section">
            <h3 className="dossier-section-heading">EXECUTIVE HIGHLIGHTS</h3>
            <div className="dossier-highlights-grid">
              {event.highlights.map((h, i) => (
                <div key={i} className="dossier-highlight-card">
                  <CheckCircle2 size={16} className="highlight-check" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Podium & Winners */}
        {event.winners && event.winners.length > 0 && (
          <div className="dossier-modal__section">
            <h3 className="dossier-section-heading">PODIUM & WINNER ACCREDITATIONS</h3>
            <div className="dossier-winners-list">
              {event.winners.map((w, i) => (
                <div key={i} className="dossier-winner-card">
                  <div className="winner-place-badge">
                    <Trophy size={16} />
                    <span>{w.place}</span>
                  </div>
                  <div className="winner-details">
                    <h4 className="winner-team">{w.team}</h4>
                    <p className="winner-project">{w.project}</p>
                  </div>
                  {w.prize && <span className="winner-prize-tag">{w.prize}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {event.featuredProjects && event.featuredProjects.length > 0 && (
          <div className="dossier-modal__section">
            <h3 className="dossier-section-heading">FEATURED PROTOTYPES & REPOSITORIES</h3>
            <div className="dossier-projects-grid">
              {event.featuredProjects.map((p, i) => (
                <div key={i} className="dossier-project-card">
                  <div className="project-top">
                    <span className="project-tag">{p.tag}</span>
                    <Code2 size={16} className="project-icon" />
                  </div>
                  <h4 className="project-name">{p.name}</h4>
                  <p className="project-desc">{p.description}</p>
                  <span className="project-creator">CREATOR: {p.creator}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="dossier-modal__footer">
          <button type="button" className="event-cta-btn event-cta-btn--ghost" onClick={onClose}>
            CLOSE DOSSIER
          </button>
          {event.status === 'upcoming' && (
            <a href="/join" className="event-cta-btn event-cta-btn--primary">
              <span>REGISTER FOR EVENT</span>
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
