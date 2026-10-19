'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { introStore } from '@/lib/introStore';

export function HeroChapter() {
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const animateIn = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      // Graceful, smooth stagger entrance on startup
      anime({
        targets: el.children,
        opacity: [0, 1],
        translateY: [24, 0],
        delay: anime.stagger(120),
        duration: 750,
        easing: 'easeOutCubic',
      });
    };

    if (introStore.isComplete || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateIn();
    } else {
      const unsubscribe = introStore.subscribe(animateIn);
      const fallbackTimer = setTimeout(animateIn, 1800);
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    }
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
          style={{
            marginBottom: 'var(--space-24)',
            opacity: 0,
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.85), 0 2px 8px rgba(0, 0, 0, 0.7)',
          }}
          data-cursor="text"
        >
          HACK WITH<br />INDIA
        </h1>
        <p
          className="type-eyebrow text-accent"
          style={{
            marginBottom: 'var(--space-24)',
            letterSpacing: '0.3em',
            opacity: 0,
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
          }}
          data-cursor="text"
        >
          BVUDET-NM CHAPTER
        </p>
        <p
          className="type-body text-secondary"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            opacity: 0,
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
          }}
          data-cursor="text"
        >
          Innovate. Create. Elevate. The student developer community at Bharati Vidyapeeth, Navi Mumbai.
        </p>
      </div>
    </section>
  );
}


