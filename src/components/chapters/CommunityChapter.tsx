'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TEAM = [
  { name: 'Krishnakant Sharma', role: 'President' },
  { name: 'Vanshika Chandra', role: 'Vice President' },
  { name: 'Shardul Khaire', role: 'Technical Lead' },
  { name: 'Ananya Rao', role: 'Events Head' },
];

export function CommunityChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    membersRef.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="chapter" ref={sectionRef} id="team" style={{ alignItems: 'flex-start', paddingTop: 'var(--space-section)' }}>
      <div className="container">
        <p className="type-eyebrow text-accent" style={{ marginBottom: 'var(--space-16)' }}>COMMUNITY</p>
        <h2 className="type-display" style={{ marginBottom: 'var(--space-96)' }}>THE PEOPLE<br/>BEHIND HWI</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-48)' }}>
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              ref={el => { membersRef.current[i] = el; }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}
            >
              {/* Photo placeholder — aspect ratio box */}
              <div style={{
                width: '100%',
                aspectRatio: '3/4',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
              }} />
              <h3 className="type-heading-2 text-primary">{member.name}</h3>
              <span className="type-eyebrow text-accent">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
