'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const EVENTS = [
  { title: 'HACKWITHMUMBAI 2.0', date: 'FEB 2026', desc: 'A massive 24+ hour hackathon experience. Push your limits, innovate without boundaries, and compete with the best.', status: 'upcoming' },
  { title: 'BUILD IT TOUR 2.0', date: '27 SEP 2025', desc: 'Offered students exposure to industry practices, emerging technologies, and entrepreneurial journeys.', status: 'past' },
  { title: 'HACKWITHMUMBAI', date: '21 SEP 2025', desc: 'A collaborative platform for students to ideate and build solutions for real-world problems.', status: 'past' },
];

export function EventsChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    itemsRef.current.forEach((item) => {
      if (!item) return;
      gsap.fromTo(item,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%', once: true }
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="chapter" ref={sectionRef} id="events" style={{ alignItems: 'flex-start', paddingTop: 'var(--space-section)' }}>
      <div className="container">
        <p className="type-eyebrow text-accent" style={{ marginBottom: 'var(--space-16)' }}>EVENTS</p>
        <h2 className="type-display" style={{ marginBottom: 'var(--space-96)' }}>LATEST<br/>EVENTS</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EVENTS.map((event, i) => (
            <div
              key={event.title}
              ref={el => { itemsRef.current[i] = el; }}
              style={{ 
                padding: 'var(--space-48) 0',
                borderTop: '1px solid var(--border-default)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-16)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-24)', flexWrap: 'wrap' }}>
                <h3 className="type-heading-1 text-primary">{event.title}</h3>
                <span 
                  className="type-eyebrow"
                  style={{ 
                    padding: '4px 14px',
                    borderRadius: 'var(--radius-pill)',
                    marginTop: '6px',
                    background: event.status === 'upcoming' ? 'var(--accent)' : 'var(--accent-muted)',
                    color: event.status === 'upcoming' ? '#fff' : 'var(--accent)'
                  }}
                >
                  {event.status === 'upcoming' ? 'UPCOMING' : 'PAST'}
                </span>
              </div>
              <span className="type-eyebrow text-tertiary">{event.date}</span>
              <p className="type-body text-secondary" style={{ maxWidth: '600px' }}>{event.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
