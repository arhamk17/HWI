'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { scrollBus } from '@/lib/scrollBus';
import { introStore } from '@/lib/introStore';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';

export function HeroChapter() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isIntroComplete, setIsIntroComplete] = useState(() => introStore.isComplete);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to reveal and animate the hero content
    const revealHero = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      setIsIntroComplete(true);

      if (!el) return;
      el.style.visibility = 'visible';
      el.style.pointerEvents = 'auto';

      if (prefersReducedMotion) {
        anime.set(el.children, { opacity: 1, translateY: 0 });
        return;
      }

      // Graceful, smooth stagger entrance when loader finishes
      anime({
        targets: el.children,
        opacity: [0, 1],
        translateY: [24, 0],
        delay: anime.stagger(100, { start: 60 }),
        duration: 750,
        easing: 'easeOutCubic',
      });
    };

    let unsubscribeIntro = () => {};
    let safetyTimeout: NodeJS.Timeout | undefined;

    // If intro is already complete or reduced motion is active, reveal immediately
    if (introStore.isComplete || prefersReducedMotion) {
      revealHero();
    } else {
      // Keep hero hidden & non-interactive while loader runs
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';

      // Subscribe to introStore completion event
      unsubscribeIntro = introStore.subscribe(() => {
        revealHero();
      });

      // Safety timeout: Ensure hero is NEVER permanently stuck even if loader is interrupted
      safetyTimeout = setTimeout(() => {
        if (!hasAnimatedRef.current) {
          introStore.setComplete();
          revealHero();
        }
      }, 5000);
    }

    // Fade out hero headline and copy smoothly as user scrolls down
    // Guarantees zero collision/overlap with HWI particle reveal in Chapter 02
    const unsubscribeScroll = scrollBus.subscribe((scrollY) => {
      if (!el || !hasAnimatedRef.current) return;
      const fadeDist = window.innerHeight * 0.35;
      if (scrollY <= 0) {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0, 0, 0)';
        el.style.pointerEvents = 'auto';
      } else if (scrollY < fadeDist) {
        const factor = Math.max(0, 1 - scrollY / fadeDist);
        el.style.opacity = factor.toFixed(3);
        el.style.transform = 'translate3d(0, ' + (-(scrollY * 0.2).toFixed(1)) + 'px, 0)';
        el.style.pointerEvents = factor > 0.1 ? 'auto' : 'none';
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translate3d(0, ' + (-(fadeDist * 0.2).toFixed(1)) + 'px, 0)';
        el.style.pointerEvents = 'none';
      }
    });

    return () => {
      unsubscribeScroll();
      unsubscribeIntro();
      if (safetyTimeout) clearTimeout(safetyTimeout);
    };
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
        style={{
          textAlign: 'center',
          maxWidth: '900px',
          visibility: isIntroComplete ? 'visible' : 'hidden',
          pointerEvents: isIntroComplete ? 'auto' : 'none',
        }}
      >
        <h1
          className="type-intro"
          style={{
            marginBottom: 'var(--space-24)',
            opacity: 0,
            textShadow: '0 4px 28px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.95)',
          }}
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
