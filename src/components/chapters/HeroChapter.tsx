'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import gsap from 'gsap';
import { introStore } from '@/lib/introStore';

export function HeroChapter() {
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const withWordRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const animateIn = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lineContents = headingRef.current?.querySelectorAll<HTMLElement>('.hero__title-line-content');
      const lineWrappers = headingRef.current?.querySelectorAll<HTMLElement>('.hero__title-line-wrap');
      const otherElements = el.querySelectorAll<HTMLElement>('p');

      // Reference text reveal animation: overflow-masked upward slide with expo.out easing & 0.175s stagger
      if (lineContents && lineContents.length > 0) {
        if (prefersReducedMotion) {
          gsap.fromTo(
            lineContents,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1.25,
              stagger: 0.175,
              ease: 'expo.out',
            }
          );
        } else {
          gsap.fromTo(
            lineContents,
            { yPercent: 100, opacity: 1 },
            {
              yPercent: 0,
              duration: 1.5,
              stagger: 0.175,
              ease: 'expo.out',
              onComplete: () => {
                lineWrappers?.forEach((wrap) => {
                  wrap.style.overflow = 'visible';
                });
              },
            }
          );
        }
      }

      // Smooth color animation for the "WITH" text to red with subtle crimson ambient glow
      if (withWordRef.current) {
        gsap.to(withWordRef.current, {
          color: '#EF4444',
          textShadow: '0 4px 28px rgba(239, 68, 68, 0.65), 0 2px 10px rgba(0, 0, 0, 0.85)',
          duration: 1.2,
          ease: 'power2.out',
          delay: prefersReducedMotion ? 0.2 : 0.6,
        });
      }

      // Preserve existing stagger entrance for the supporting eyebrow and description elements
      if (otherElements && otherElements.length > 0) {
        anime({
          targets: otherElements,
          opacity: [0, 1],
          translateY: [24, 0],
          delay: anime.stagger(120, { start: 400 }),
          duration: 750,
          easing: 'easeOutCubic',
        });
      }
    };

    if (introStore.isComplete || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateIn();
    } else {
      const unsubscribe = introStore.subscribe(animateIn);
      const fallbackTimer = setTimeout(animateIn, 1800);
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
        if (headingRef.current) {
          const lineContents = headingRef.current.querySelectorAll('.hero__title-line-content');
          gsap.killTweensOf(lineContents);
        }
        if (withWordRef.current) {
          gsap.killTweensOf(withWordRef.current);
        }
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
          ref={headingRef}
          className="type-intro"
          style={{
            marginBottom: 'var(--space-24)',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.85), 0 2px 8px rgba(0, 0, 0, 0.7)',
          }}
          data-cursor="text"
        >
          <span
            className="hero__title-line-wrap"
            style={{
              display: 'block',
              overflow: 'hidden',
              padding: '0.04em 0',
              margin: '-0.04em 0',
            }}
          >
            <span
              className="hero__title-line-content"
              style={{
                display: 'inline-block',
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              HACK{' '}
              <span
                ref={withWordRef}
                className="hero__title-word-with"
                style={{
                  display: 'inline-block',
                  color: 'inherit',
                  willChange: 'color, text-shadow',
                }}
              >
                WITH
              </span>
            </span>
          </span>
          <span
            className="hero__title-line-wrap"
            style={{
              display: 'block',
              overflow: 'hidden',
              padding: '0.04em 0',
              margin: '-0.04em 0',
            }}
          >
            <span
              className="hero__title-line-content"
              style={{
                display: 'inline-block',
                opacity: 0,
                willChange: 'transform, opacity',
              }}
            >
              INDIA
            </span>
          </span>
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


