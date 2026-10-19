'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Layers,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Code2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { EVENTS_DATA } from '@/data/events';
import './EventsExperience.css';

export function EventsExperience() {
  // Requirement 1: All panels begin collapsed by default (no panel expanded on initial load)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  // Drive downstream content strictly from the selected event object if one is selected
  const selectedEvent = useMemo(() => {
    if (!selectedId) return null;
    return EVENTS_DATA.find((e) => e.id === selectedId) || null;
  }, [selectedId]);

  const currentIndex = useMemo(() => {
    if (!selectedEvent) return -1;
    return EVENTS_DATA.findIndex((e) => e.id === selectedEvent.id);
  }, [selectedEvent]);

  const handleSelectEvent = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handlePrevEvent = useCallback(() => {
    if (currentIndex <= 0) {
      setSelectedId(EVENTS_DATA[EVENTS_DATA.length - 1].id);
    } else {
      setSelectedId(EVENTS_DATA[currentIndex - 1].id);
    }
  }, [currentIndex]);

  const handleNextEvent = useCallback(() => {
    if (currentIndex === -1 || currentIndex >= EVENTS_DATA.length - 1) {
      setSelectedId(EVENTS_DATA[0].id);
    } else {
      setSelectedId(EVENTS_DATA[currentIndex + 1].id);
    }
  }, [currentIndex]);

  const scrollGallery = useCallback((direction: 'left' | 'right') => {
    if (galleryTrackRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      galleryTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Keyboard navigation for gallery: ArrowLeft / ArrowRight
  const handleGalleryKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (index + 1) % EVENTS_DATA.length;
        setSelectedId(EVENTS_DATA[nextIdx].id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (index - 1 + EVENTS_DATA.length) % EVENTS_DATA.length;
        setSelectedId(EVENTS_DATA[prevIdx].id);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedId(EVENTS_DATA[index].id);
      }
    },
    []
  );

  // Scroll active panel into view smoothly when selected
  useEffect(() => {
    if (selectedId && galleryTrackRef.current) {
      const activeEl = galleryTrackRef.current.querySelector<HTMLElement>(
        '.hwi-panel--active'
      );
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedId]);

  if (EVENTS_DATA.length === 0) {
    return (
      <div className="events-empty-state">
        <p>No chapter events currently published.</p>
      </div>
    );
  }

  return (
    <div className="hwi-events-page">
      {/* ================================================================= */}
      {/* B. EVENTS PAGE INTRO (Section 4.B)                                */}
      {/* Compact, restrained heading so the gallery takes immediate focus  */}
      {/* ================================================================= */}
      <section className="hwi-events-intro">
        <div className="container">
          <div className="hwi-events-intro__content">
            <div className="hwi-events-intro__kicker">
              <span className="hwi-pulse-beacon" />
              <span className="type-eyebrow text-accent">HACKWITHINDIA BVUDET-NM CHAPTER</span>
              <span className="kicker-sep">•</span>
              <span className="type-eyebrow text-tertiary">EXPERIENCE ARCHIVE</span>
            </div>
            <h1 className="hwi-events-intro__title">
              EVENTS. <span className="title-dim">IDEAS INTO ACTION.</span>
            </h1>
            <p className="hwi-events-intro__desc">
              Explore our flagship hackathons, developer masterclasses, and hands-on community initiatives across the years. Select any edition to reveal its dossier.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* C. EXPANDABLE HORIZONTAL EVENT / YEAR GALLERY (Section 4.C, 2, 5) */}
      {/* Tall narrow panels side-by-side matching reference video          */}
      {/* ================================================================= */}
      <section className="hwi-gallery-section" aria-label="Year and Event Edition Gallery">
        <div className="container">
          {/* Gallery Subheader bar with indicator and quick arrow controls */}
          <div className="hwi-gallery-bar">
            <div className="hwi-gallery-bar__left">
              <span className="bar-tag">EDITION ARCHIVE</span>
              <span className="bar-divider">//</span>
              <span className="bar-counter">
                {selectedEvent
                  ? `${String(currentIndex + 1).padStart(2, '0')} OF ${String(EVENTS_DATA.length).padStart(2, '0')} SELECTED`
                  : `ALL ${String(EVENTS_DATA.length).padStart(2, '0')} EDITIONS`}
              </span>
            </div>
            <div className="hwi-gallery-bar__controls">
              <button
                type="button"
                className="gallery-nav-btn"
                onClick={handlePrevEvent}
                aria-label="Previous edition"
                data-cursor="link"
                data-cursor-label="PREV"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="gallery-nav-btn"
                onClick={handleNextEvent}
                aria-label="Next edition"
                data-cursor="link"
                data-cursor-label="NEXT"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal Track with Floating Circular Arrows */}
          <div className="hwi-gallery-wrapper">
            <button
              type="button"
              className="hwi-palette-floating-arrow hwi-palette-floating-arrow--left"
              onClick={handlePrevEvent}
              aria-label="Previous edition"
              data-cursor="link"
              data-cursor-label="PREV"
            >
              <ChevronLeft size={22} />
            </button>

            <div
              ref={galleryTrackRef}
              className="hwi-gallery-track"
              role="tablist"
              aria-label="Event Editions"
            >
              {EVENTS_DATA.map((event, idx) => {
                const isActive = event.id === selectedId;
                const accentColor = event.accentColor || '#EF4444';

                return (
                  <div
                    key={event.id}
                    id={`panel-${event.id}`}
                    className={`hwi-panel ${isActive ? 'hwi-panel--active' : 'hwi-panel--idle'}`}
                    style={
                      {
                        '--panel-accent': accentColor,
                      } as React.CSSProperties
                    }
                    role="tab"
                    tabIndex={0}
                    aria-selected={isActive}
                    aria-controls={isActive ? 'editorial-story' : undefined}
                    onClick={() => handleSelectEvent(event.id)}
                    onKeyDown={(e) => handleGalleryKeyDown(e, idx)}
                    data-cursor="link"
                    data-cursor-label={isActive ? 'SELECTED' : 'EXPAND'}
                  >
                    {/* Expandable Palette Poster Background */}
                    <div className="hwi-panel__bg">
                      {event.cardImage ? (
                        <img
                          src={isActive && event.heroImage ? event.heroImage : event.cardImage}
                          alt={event.title}
                          className="hwi-panel__poster-img"
                          loading="lazy"
                        />
                      ) : (
                        <PanelArtwork graphicType={event.hudGraphicType || 'grid'} accent={accentColor} />
                      )}
                      <div className="hwi-panel__overlay" />
                      <div className="hwi-panel__vignette" />
                    </div>

                    {/* Corner Accent Brackets on Active Panel */}
                    {isActive && (
                      <div className="hwi-panel__brackets" aria-hidden="true">
                        <span className="p-bracket p-bracket--tl" />
                        <span className="p-bracket p-bracket--tr" />
                        <span className="p-bracket p-bracket--bl" />
                        <span className="p-bracket p-bracket--br" />
                      </div>
                    )}

                    {/* ── COLLAPSED STATE ELEMENTS (Fades out when panel expands) ── */}
                    {/* Top-Left: TEDx Eyebrow + Bold Big Edition Number */}
                    <div className="hwi-panel__tedx-header">
                      <span className="hwi-panel__tedx-tag">EDITION</span>
                      <span className="hwi-panel__tedx-num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Right-Side: Vertical Rotated Theme / Title */}
                    <div className="hwi-panel__tedx-vertical" aria-hidden="true">
                      <span>{(event.shortTitle || event.title).toUpperCase()}</span>
                    </div>

                    {/* Bottom-Left: Event Date */}
                    <div className="hwi-panel__tedx-footer">
                      <span className="tedx-footer-date">{event.date}</span>
                    </div>

                    {/* ── EXPANDED STATE CONTENT (Revealed inside the expanding panel) ── */}
                    {isActive && (
                      <div className="hwi-panel__expanded-content" aria-hidden={false}>
                        <div className="expanded-content__inner">
                          {/* Top Badges Strip */}
                          <div className="expanded-content__badges">
                            <span className="banner-badge banner-badge--edition">
                              EDITION {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="banner-badge banner-badge--year">{event.year}</span>
                            <span className="banner-badge banner-badge--category">{event.category}</span>
                            <span
                              className={`banner-badge ${event.status === 'upcoming' ? 'banner-badge--upcoming' : 'banner-badge--past'}`}
                            >
                              {event.status === 'upcoming' ? 'REGISTRATION OPEN' : 'ARCHIVED RECAP'}
                            </span>
                          </div>

                          {/* Header: Title & Theme */}
                          <div className="expanded-content__header">
                            <h2 className="expanded-content__title">{event.title}</h2>
                            <div className="expanded-content__theme">
                              <span className="theme-accent-bar" />
                              <span className="theme-text">THEME: {event.theme}</span>
                            </div>
                          </div>

                          {/* Summary Narrative */}
                          <p className="expanded-content__desc">
                            {event.shortDescription || event.desc}
                          </p>

                          {/* Footer: Metadata & Actions */}
                          <div className="expanded-content__footer">
                            <div className="expanded-content__meta">
                              <div className="expanded-meta-item">
                                <Calendar size={14} />
                                <span>{event.date}</span>
                              </div>
                              <div className="expanded-meta-item">
                                <MapPin size={14} />
                                <span>{event.venue}</span>
                              </div>
                              <div className="expanded-meta-item">
                                <Clock size={14} />
                                <span>{event.duration}</span>
                              </div>
                            </div>

                            <div className="expanded-content__actions">
                              {event.status === 'upcoming' ? (
                                <Link
                                  href={event.ctaUrl || '/join'}
                                  className="banner-cta-btn banner-cta-btn--primary"
                                  onClick={(e) => e.stopPropagation()}
                                  data-cursor="link"
                                  data-cursor-label="APPLY"
                                >
                                  <span>{event.ctaLabel || 'REGISTER FOR HACKATHON'}</span>
                                  <ArrowUpRight size={16} />
                                </Link>
                              ) : (
                                <a
                                  href="#editorial-story"
                                  className="banner-cta-btn banner-cta-btn--secondary"
                                  onClick={(e) => e.stopPropagation()}
                                  data-cursor="link"
                                  data-cursor-label="EXPLORE"
                                >
                                  <span>EXPLORE EVENT STORY</span>
                                  <span className="action-arrow">↓</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="hwi-palette-floating-arrow hwi-palette-floating-arrow--right"
              onClick={handleNextEvent}
              aria-label="Next edition"
              data-cursor="link"
              data-cursor-label="NEXT"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* INITIAL COLLAPSED PROMPT: Displayed when all panels are collapsed */}
      {/* ================================================================= */}
      {!selectedEvent && (
        <section className="hwi-dossier-prompt-section">
          <div className="container">
            <div className="hwi-dossier-prompt-card">
              <span className="prompt-kicker">CHRONICLE ARCHIVE</span>
              <h3 className="prompt-heading">SELECT AN EDITION ABOVE</h3>
              <p className="prompt-sub">
                Click any edition card in the timeline above to expand its interactive dossier, explore event telemetry, inspect podium winners, and browse official photographs.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* E. EDITORIAL EVENT STORY & DETAILS                                */}
      {/* Revealed only when an edition is expanded                         */}
      {/* ================================================================= */}
      {selectedEvent && (
        <section id="editorial-story" className="hwi-story-light-section" key={`story-${selectedEvent.id}`}>
        <div className="container">
          <div className="hwi-story-container">
            {/* Centered Editorial Section Header matching frame 24 */}
            <div className="hwi-story-header">
              <span className="hwi-story-kicker">EDITION {String(currentIndex + 1).padStart(2, '0')} DOSSIER // {selectedEvent.year}</span>
              <h2 className="hwi-editorial-theme-title">Theme: {selectedEvent.theme}</h2>
              <div className="hwi-story-rule" />
              <p className="hwi-story-summary">
                {selectedEvent.shortDescription || selectedEvent.desc}
              </p>
            </div>

            {/* Event Telemetry Cards */}
            <div className="hwi-story-stats-grid">
              <div className="hwi-stat-card">
                <span className="stat-card__label">SCHEDULED DATE</span>
                <span className="stat-card__val">{selectedEvent.date}</span>
              </div>
              <div className="hwi-stat-card">
                <span className="stat-card__label">CAMPUS VENUE</span>
                <span className="stat-card__val">{selectedEvent.venue}</span>
              </div>
              <div className="hwi-stat-card">
                <span className="stat-card__label">ENGAGEMENT FORMAT</span>
                <span className="stat-card__val">{selectedEvent.duration}</span>
              </div>
              <div className="hwi-stat-card">
                <span className="stat-card__label">BUILDER COHORT</span>
                <span className="stat-card__val">
                  {typeof selectedEvent.participants === 'string' && (selectedEvent.participants.includes('Builders') || selectedEvent.participants.includes('Researchers'))
                    ? selectedEvent.participants
                    : `${selectedEvent.participants} Participants`}
                </span>
              </div>
            </div>

            {/* Full Narrative Breakdown */}
            <div className="hwi-story-narrative">
              <h3 className="narrative-heading">CHRONICLE & MISSION</h3>
              <p className="narrative-p">{selectedEvent.fullDescription}</p>
            </div>

            {/* Executive Highlights */}
            {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
              <div className="hwi-story-highlights">
                <h3 className="narrative-heading">KEY EVENT HIGHLIGHTS</h3>
                <div className="highlights-grid">
                  {selectedEvent.highlights.map((h, i) => (
                    <div key={i} className="highlight-pill-card">
                      <CheckCircle2 size={18} className="pill-check-icon" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OFFICIAL EVENT PHOTOGRAPHS (3 Images Per Event) */}
            {selectedEvent.images && selectedEvent.images.length > 0 && (
              <div className="hwi-story-gallery">
                <div className="story-gallery-header">
                  <div>
                    <span className="type-eyebrow text-accent">EVENT MEDIA ARCHIVE</span>
                    <h3 className="narrative-heading" style={{ marginTop: '4px' }}>
                      OFFICIAL EVENT PHOTOGRAPHS
                    </h3>
                  </div>
                  <span className="story-gallery-badge">
                    {selectedEvent.images.length} CURATED {selectedEvent.images.length === 1 ? 'IMAGE' : 'IMAGES'}
                  </span>
                </div>

                <div className="story-photos-grid">
                  {selectedEvent.images.map((img, idx) => (
                    <div key={img.id || idx} className="story-photo-card">
                      <div className="story-photo-frame">
                        {img.src ? (
                          <img
                            src={img.src}
                            alt={img.title}
                            className="story-photo-img"
                          />
                        ) : (
                          <div className="story-photo-fallback">
                            <PanelArtwork
                              graphicType={img.hudGraphicType || selectedEvent.hudGraphicType || 'grid'}
                              accent={selectedEvent.accentColor || '#EF4444'}
                            />
                          </div>
                        )}
                        <span className="story-photo-tag">{img.tag}</span>
                        <div className="story-photo-scanline" />
                      </div>
                      <div className="story-photo-meta">
                        <h4 className="story-photo-title">{img.title}</h4>
                        <p className="story-photo-caption">{img.caption}</p>
                        {img.cameraInfo && (
                          <span className="story-photo-cam">{img.cameraInfo}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Podium & Winners (Only if verified data exists) */}
            {selectedEvent.winners && selectedEvent.winners.length > 0 && (
              <div className="hwi-story-winners">
                <h3 className="narrative-heading">PODIUM & ACCREDITATIONS</h3>
                <div className="winners-stack">
                  {selectedEvent.winners.map((w, i) => (
                    <div key={i} className="winner-row">
                      <div className="winner-badge-box">
                        <Trophy size={16} />
                        <span>{w.place}</span>
                      </div>
                      <div className="winner-content">
                        <strong className="winner-name">{w.team}</strong>
                        <span className="winner-sub">({w.project})</span>
                      </div>
                      {w.prize && <span className="winner-prize">{w.prize}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects (Only if verified data exists) */}
            {selectedEvent.featuredProjects && selectedEvent.featuredProjects.length > 0 && (
              <div className="hwi-story-projects">
                <h3 className="narrative-heading">FEATURED PROTOTYPES & REPOSITORIES</h3>
                <div className="projects-grid">
                  {selectedEvent.featuredProjects.map((p, i) => (
                    <div key={i} className="project-card">
                      <div className="project-card__top">
                        <span className="project-card__tag">{p.tag}</span>
                        <Code2 size={16} className="project-card__icon" />
                      </div>
                      <h4 className="project-card__name">{p.name}</h4>
                      <p className="project-card__desc">{p.description}</p>
                      <span className="project-card__creator">BUILDER: {p.creator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guest Speakers, Delegates & Faculty Coordinators */}
            {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
              <div className="hwi-story-speakers">
                <div className="speaker-header-row">
                  <h3 className="narrative-heading">
                    {selectedEvent.id === 'rocketride-buildathon'
                      ? 'INDUSTRY DELEGATES & FACULTY COORDINATORS'
                      : selectedEvent.id === 'ctf-zero-internet'
                      ? 'FACULTY COORDINATOR & CHAPTER LEADERSHIP'
                      : 'DISTINGUISHED SPEAKERS & MENTORS'}
                  </h3>
                  <span className="speaker-tag-reserved">
                    {selectedEvent.id === 'rocketride-buildathon'
                      ? '[ SAN FRANCISCO DELEGATION & BVUDET ]'
                      : selectedEvent.id === 'ctf-zero-internet'
                      ? '[ BVUDET FACULTY & HWI LEADERSHIP ]'
                      : '[ VERIFIED SESSIONS ]'}
                  </span>
                </div>
                <div className="speakers-grid">
                  {selectedEvent.speakers.map((sp, i) => (
                    <div key={i} className="speaker-card-placeholder">
                      <div className="speaker-avatar-frame">
                        {sp.image ? (
                          <img
                            src={sp.image}
                            alt={sp.name}
                            className="speaker-avatar-img"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <>
                            <Users size={28} className="speaker-placeholder-icon" />
                            <span className="speaker-frame-tag">{sp.placeholderLabel || 'FACULTY'}</span>
                          </>
                        )}
                      </div>
                      <div className="speaker-info">
                        <h4 className="speaker-name">{sp.name}</h4>
                        <span className="speaker-role">{sp.role}</span>
                        {sp.company && <span className="speaker-company">{sp.company}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Callout Section */}
            <div className="hwi-story-callout">
              {selectedEvent.status === 'upcoming' ? (
                <div className="callout-card callout-card--upcoming">
                  <div className="callout-text">
                    <h4 className="callout-heading">READY TO BUILD WITH US?</h4>
                    <p className="callout-desc">
                      Applications for {selectedEvent.title} are open to students and developers across institutions.
                    </p>
                  </div>
                  <Link href="/join" className="callout-btn callout-btn--primary">
                    <span>APPLY FOR ENTRY</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="callout-card callout-card--archive">
                  <div className="callout-text">
                    <h4 className="callout-heading">EXPLORE THE COMPLETE TIMELINE</h4>
                    <p className="callout-desc">
                      Browse all milestone editions from Learn IT Tour (2025) through Capture the Flag (2026).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const firstUpcoming = EVENTS_DATA.find((e) => e.status === 'upcoming');
                      if (firstUpcoming) setSelectedId(firstUpcoming.id);
                      else setSelectedId(EVENTS_DATA[EVENTS_DATA.length - 1].id);
                    }}
                    className="callout-btn callout-btn--secondary"
                  >
                    <span>VIEW FINAL EDITION</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}

// =========================================================================
// VECTOR ARTWORK COMPONENT FOR PANELS
// Distinct cybernetic graphics per edition without external asset dependencies
// =========================================================================
function PanelArtwork({
  graphicType,
  accent,
}: {
  graphicType: string;
  accent: string;
}) {
  switch (graphicType) {
    case 'circuit':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" fill="none">
            <path d="M50 300 H180 L230 220 H380 L420 280 H550" />
            <path d="M80 500 H200 L250 420 H340 L370 460 H520" />
            <path d="M120 150 H260 L290 190 H440 L480 140 H560" />
            <circle cx="180" cy="300" r="5" fill={accent} />
            <circle cx="380" cy="220" r="5" fill={accent} />
            <circle cx="250" cy="420" r="5" fill={accent} />
          </g>
          <rect x="230" y="270" width="140" height="90" rx="8" fill="rgba(18, 16, 22, 0.85)" stroke={accent} strokeWidth="1.5" />
          <text x="300" y="320" fill={accent} fontSize="14" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
            IC // SYNAPSE
          </text>
        </svg>
      );

    case 'terminal':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <rect x="60" y="180" width="480" height="420" rx="10" fill="rgba(12, 10, 16, 0.8)" stroke={accent} strokeWidth="1.2" strokeOpacity="0.5" />
          <line x1="60" y1="225" x2="540" y2="225" stroke={accent} strokeOpacity="0.3" />
          <circle cx="85" cy="205" r="5" fill={accent} />
          <circle cx="102" cy="205" r="5" fill="rgba(255,255,255,0.3)" />
          <circle cx="119" cy="205" r="5" fill="rgba(255,255,255,0.3)" />
          <text x="85" y="275" fill={accent} fontSize="14" fontFamily="monospace">$ hwi agent run --autonomous</text>
          <text x="85" y="315" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="monospace">[+] Initializing distributed cluster...</text>
          <text x="85" y="355" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="monospace">[+] GPU tensor stream active: 8x H100</text>
          <text x="85" y="395" fill={accent} fontSize="13" fontFamily="monospace">[✔] 18 Agentic prototypes running</text>
        </svg>
      );

    case 'nodes':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g stroke={accent} strokeWidth="1.5" strokeOpacity="0.35">
            <line x1="120" y1="380" x2="220" y2="250" />
            <line x1="220" y1="250" x2="380" y2="300" />
            <line x1="380" y1="300" x2="480" y2="220" />
            <line x1="120" y1="380" x2="240" y2="520" />
            <line x1="240" y1="520" x2="380" y2="480" />
            <line x1="380" y1="480" x2="480" y2="220" />
          </g>
          {[[120, 380], [220, 250], [380, 300], [480, 220], [240, 520], [380, 480]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill="#070709" stroke={accent} strokeWidth="2.5" />
              <circle cx={x} cy={y} r="4" fill={accent} />
            </g>
          ))}
          <circle cx="300" cy="380" r="100" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        </svg>
      );

    case 'waveform':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g fill={accent} opacity="0.6">
            {Array.from({ length: 28 }).map((_, i) => {
              const x = 70 + i * 16;
              const h = Math.round(Math.abs(Math.sin((i / 28) * Math.PI * 3)) * 220 + 30);
              const y = Math.round(400 - h / 2);
              return <rect key={i} x={x} y={y} width="9" height={h} rx="4" />;
            })}
          </g>
          <line x1="40" y1="400" x2="560" y2="400" stroke={accent} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7" />
        </svg>
      );

    case 'radar':
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <circle cx="300" cy="400" r="220" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="300" cy="400" r="150" fill="none" stroke={accent} strokeWidth="1.2" strokeOpacity="0.3" />
          <circle cx="300" cy="400" r="80" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />
          <line x1="80" y1="400" x2="520" y2="400" stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" />
          <line x1="300" y1="180" x2="300" y2="620" stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" />
          <circle cx="300" cy="400" r="7" fill={accent} />
          <circle cx="380" cy="330" r="6" fill={accent} opacity="0.85" />
          <circle cx="210" cy="470" r="5" fill={accent} opacity="0.65" />
        </svg>
      );

    case 'grid':
    default:
      return (
        <svg className="panel-svg" viewBox="0 0 600 800" preserveAspectRatio="none">
          <g stroke={accent} strokeWidth="1" strokeOpacity="0.35">
            {[-200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
              <line key={i} x1={300} y1={250} x2={x} y2={780} />
            ))}
            {[290, 340, 410, 500, 610, 740].map((y, i) => (
              <line key={i} x1={0} y1={y} x2={600} y2={y} strokeOpacity={Number((0.15 + i * 0.12).toFixed(2))} />
            ))}
          </g>
          <circle cx="300" cy="250" r="55" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
          <circle cx="300" cy="250" r="22" fill={accent} opacity="0.25" />
        </svg>
      );
  }
}

