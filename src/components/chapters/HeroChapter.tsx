'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';

export function HeroChapter() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Graceful, smooth stagger entrance on startup
    anime({
      targets: el.children,
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger(100, { start: 150 }),
      duration: 750,
      easing: 'easeOutCubic',
    });
  }, []);

  return (
    <section
      className="chapter"
      id="hero"
      style={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        className="container"
        ref={contentRef}
        style={{ textAlign: 'center', maxWidth: '900px' }}
      >
        <h1
          className="type-intro"
          style={{ marginBottom: 'var(--space-24)', opacity: 0 }}
          data-cursor="text"
        >
          HACK WITH<br />INDIA
        </h1>
        <p
          className="type-eyebrow text-accent"
          style={{ marginBottom: 'var(--space-48)', letterSpacing: '0.3em', opacity: 0 }}
          data-cursor="text"
        >
          BVUDET-NM CHAPTER
        </p>
        <p
          className="type-body text-secondary"
          style={{ maxWidth: '500px', margin: '0 auto var(--space-48)', opacity: 0 }}
          data-cursor="text"
        >
          Innovate. Create. Elevate. The student developer community at Bharati Vidyapeeth, Navi Mumbai.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-16)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
          }}
        >
          <KokonutButton href="/join" variant="primary">
            Join the Chapter
          </KokonutButton>
          <KokonutButton href="/events" variant="outline">
            Our Events
          </KokonutButton>
        </div>
      </div>
    </section>
  );
}

