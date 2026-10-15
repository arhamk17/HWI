'use client';

import { EventsExperience } from '@/components/EventsExperience/EventsExperience';
import { EventArchive } from '@/components/EventArchive/EventArchive';
import { FooterChapter } from '@/components/chapters/FooterChapter';

export default function EventsPage() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      {/* Flagship Expandable Gallery, Hero Banner & Editorial Story */}
      <EventsExperience />

      {/* Comprehensive Categorized Directory & Filter Explorer */}
      <section style={{ padding: 'var(--space-64) 0 var(--space-section)', background: 'var(--color-bg-primary, #050407)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-32)' }}>
            <span className="type-eyebrow text-accent" style={{ letterSpacing: '0.2em' }}>HISTORICAL RECORDS</span>
            <h2 className="type-heading-1" style={{ marginTop: 'var(--space-8)' }}>EVENT ARCHIVES & FILTERS</h2>
            <p className="type-body text-secondary" style={{ maxWidth: '540px', marginTop: 'var(--space-8)' }}>
              Browse all past and scheduled chapter initiatives by category or year.
            </p>
          </div>
          <EventArchive />
        </div>
      </section>

      <FooterChapter />
    </main>
  );
}

