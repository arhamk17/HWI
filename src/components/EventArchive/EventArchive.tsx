'use client';

import { useState, useMemo } from 'react';
import { EVENTS_DATA, EventItem } from '@/data/events';
import { whatWeDoStore } from '@/lib/whatWeDoStore';
import './EventArchive.css';

type EventFilter = 'ALL' | 'HACKATHONS' | 'WORKSHOPS' | 'COMMUNITY' | 'OTHER';

const FILTERS: EventFilter[] = ['ALL', 'HACKATHONS', 'WORKSHOPS', 'COMMUNITY', 'OTHER'];

export function EventArchive() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'ALL') return EVENTS_DATA;
    return EVENTS_DATA.filter((e) => e.category === activeFilter);
  }, [activeFilter]);

  // Group by year
  const groupedEvents = useMemo(() => {
    const years: Record<string, EventItem[]> = {};
    filteredEvents.forEach((item) => {
      if (!years[item.year]) years[item.year] = [];
      years[item.year].push(item);
    });
    // Return sorted years descending
    return Object.keys(years)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({
        year,
        events: years[year],
      }));
  }, [filteredEvents]);

  const handleCardHover = (event: EventItem) => {
    // Subtly stimulate particle environment
    whatWeDoStore.setEnvironment('grids', event.id);
  };

  const handleCardLeave = () => {
    whatWeDoStore.reset();
  };

  return (
    <div className="event-archive" id="archive">
      {/* Interactive Category Filter Bar */}
      <div className="event-filter-bar" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`event-filter-btn ${activeFilter === f ? 'event-filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(f)}
            role="tab"
            aria-selected={activeFilter === f}
            data-cursor="link"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Year-grouped Archive List */}
      {groupedEvents.map(({ year, events }) => (
        <div key={year} className="event-year-block">
          <div className="event-year-header">
            <h3 className="event-year-title">{year}</h3>
            <div className="event-year-line" />
          </div>

          <div className="event-list">
            {events.map((event) => (
              <div
                key={event.id}
                className="event-row-card event-card-interactive"
                onClick={() => setSelectedEvent(event)}
                onMouseEnter={() => handleCardHover(event)}
                onMouseLeave={handleCardLeave}
                data-cursor="event"
                data-cursor-label="EXPLORE"
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedEvent(event);
                  }
                }}
              >
                <div className="event-row-date-badge">
                  <span className="event-row-date">{event.date}</span>
                  <span className="event-row-category">{event.category}</span>
                </div>

                <div className="event-row-info">
                  <div className="event-row-title-wrap">
                    <h4 className="event-row-title">{event.title}</h4>
                    <span
                      className={`event-row-status ${event.status === 'upcoming' ? 'event-row-status--upcoming' : 'event-row-status--past'}`}
                    >
                      {event.status === 'upcoming' ? 'REGISTRATION OPEN' : 'ARCHIVED'}
                    </span>
                  </div>

                  <div className="event-row-meta">
                    <div className="event-row-meta-item">
                      <span>DURATION:</span> {event.duration}
                    </div>
                    <div className="event-row-meta-item">
                      <span>VENUE:</span> {event.location}
                    </div>
                    <div className="event-row-meta-item">
                      <span>BUILDERS:</span> {event.participants}
                    </div>
                  </div>

                  <p className="event-row-desc">{event.desc}</p>
                </div>

                <div className="event-row-cta">
                  <span>DETAILS →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Cinematic Detail Modal Overlay */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

export function EventDetailModal({
  event,
  onClose,
}: {
  event: EventItem | null;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <div className="event-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="event-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {event.cardImage && (
          <div className="event-modal-poster-wrap">
            <img src={event.cardImage} alt={event.title} className="event-modal-poster-img" />
            <div className="event-modal-poster-overlay" />
          </div>
        )}

        <div className="event-modal-header">
          <div className="event-modal-eyebrow">
            <span className="type-eyebrow text-accent">{event.category}</span>
            <span className="type-eyebrow text-tertiary">• {event.badge}</span>
          </div>
          <h2 className="event-modal-title">{event.title}</h2>
        </div>

        <div className="event-modal-meta-grid">
          <div className="event-modal-meta-box">
            <span className="event-modal-meta-label">DATE</span>
            <span className="event-modal-meta-val">{event.date}</span>
          </div>
          <div className="event-modal-meta-box">
            <span className="event-modal-meta-label">DURATION</span>
            <span className="event-modal-meta-val">{event.duration}</span>
          </div>
          <div className="event-modal-meta-box">
            <span className="event-modal-meta-label">PARTICIPANTS</span>
            <span className="event-modal-meta-val">{event.participants}</span>
          </div>
          <div className="event-modal-meta-box">
            <span className="event-modal-meta-label">PROJECTS</span>
            <span className="event-modal-meta-val">{event.projectsCount}</span>
          </div>
        </div>

        <p className="event-modal-body">{event.fullDescription}</p>

        {event.highlights && event.highlights.length > 0 && (
          <div>
            <div className="event-modal-section-title">KEY HIGHLIGHTS</div>
            <div className="event-modal-highlights">
              {event.highlights.map((h, idx) => (
                <div key={idx} className="event-modal-highlight-item">
                  <span className="event-modal-highlight-bullet">▸</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 Images Per Event in Modal */}
        {event.images && event.images.length > 0 && (
          <div>
            <div className="event-modal-section-title">OFFICIAL EVENT PHOTOGRAPHS (3)</div>
            <div className="event-modal-photos-grid">
              {event.images.slice(0, 3).map((img, idx) => (
                <div key={img.id || idx} className="event-modal-photo-card">
                  {img.src ? (
                    <div className="event-modal-photo-img-wrap">
                      <img src={img.src} alt={img.title} className="event-modal-photo-img" />
                      <span className="event-modal-photo-tag">{img.tag}</span>
                    </div>
                  ) : null}
                  <div className="event-modal-photo-info">
                    <strong className="event-modal-photo-title">{img.title}</strong>
                    <p className="event-modal-photo-caption">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.winners && event.winners.length > 0 && (
          <div>
            <div className="event-modal-section-title">PODIUM & WINNERS</div>
            <div className="event-modal-winners">
              {event.winners.map((w, idx) => (
                <div key={idx} className="event-modal-winner-card">
                  <div className="event-modal-winner-left">
                    <span className="event-modal-winner-place">{w.place}</span>
                    <span className="event-modal-winner-team">{w.team}</span>
                    <span className="event-modal-winner-project">({w.project})</span>
                  </div>
                  {w.prize && <span className="event-modal-winner-prize">{w.prize}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {event.featuredProjects && event.featuredProjects.length > 0 && (
          <div>
            <div className="event-modal-section-title">FEATURED REPOSITORIES & PROJECTS</div>
            <div className="event-modal-winners">
              {event.featuredProjects.map((p, idx) => (
                <div key={idx} className="event-modal-winner-card">
                  <div className="event-modal-winner-left">
                    <span className="event-modal-winner-team">{p.name}</span>
                    <span className="event-modal-winner-project">{p.description}</span>
                  </div>
                  <span className="event-modal-winner-place">{p.tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
