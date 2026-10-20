'use client';

import { useEffect, useRef } from 'react';
import { scrollBus } from '@/lib/scrollBus';
import './CharacterConvergence.css';

/*
  SKIPER UI Skiper31 / ScrollAnimation_002:
  CharacterV1 Convergence Animation for "HACK WITH INDIA".
  As the user scrolls through this section, individual characters horizontally
  converge toward the center and rotate in 3D perspective into crisp alignment.
*/

const PHRASE = 'HACK WITH INDIA';
const CHARS = PHRASE.split('');
const CENTER_INDEX = (CHARS.length - 1) / 2; // 7, corresponding to 'T'

export function CharacterConvergence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bracketTLRef = useRef<HTMLSpanElement>(null);
  const bracketTRRef = useRef<HTMLSpanElement>(null);
  const bracketBLRef = useRef<HTMLSpanElement>(null);
  const bracketBRRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      charRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = 'none';
          el.style.opacity = '1';
        }
      });
      return;
    }

    const unsub = scrollBus.subscribe(() => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;

      const rect = section.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      if (runway <= 0) return;

      // Section scroll progress from 0.0 (top entering viewport) to 1.0 (bottom leaving)
      const progress = Math.max(0, Math.min(1, -rect.top / runway));

      // Convergence phase: 0.0 -> 0.52
      const convProgress = Math.min(1, progress / 0.52);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - convProgress, 3);

      // Responsive spread factor
      const vw = window.innerWidth;
      const spreadFactor = vw < 768 ? 9 : vw < 1024 ? 22 : 36;
      const rotFactor = vw < 768 ? 10 : 18;

      // Update character transforms directly on the GPU layer without React re-renders
      charRefs.current.forEach((el, index) => {
        if (!el) return;
        const distanceFromCenter = index - CENTER_INDEX;

        // X displacement: travels from distanceFromCenter * spreadFactor -> 0
        const x = distanceFromCenter * spreadFactor * (1 - ease);
        // 3D rotation: rotates from distanceFromCenter * rotFactor -> 0deg
        const rotX = distanceFromCenter * rotFactor * (1 - ease);
        const rotY = distanceFromCenter * -8 * (1 - ease);
        const opacity = Math.min(1, 0.4 + 0.6 * ease);

        if (convProgress >= 1) {
          el.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)';
          el.style.opacity = '1';
        } else {
          el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
          el.style.opacity = opacity.toFixed(3);
        }
      });

      // Framing bracket contraction matching convergence
      const bracketExpand = (1 - ease) * (vw < 768 ? 8 : 16);
      if (bracketTLRef.current) {
        bracketTLRef.current.style.transform = `translate3d(${-bracketExpand}px, ${-bracketExpand}px, 0)`;
      }
      if (bracketTRRef.current) {
        bracketTRRef.current.style.transform = `translate3d(${bracketExpand}px, ${-bracketExpand}px, 0)`;
      }
      if (bracketBLRef.current) {
        bracketBLRef.current.style.transform = `translate3d(${-bracketExpand}px, ${bracketExpand}px, 0)`;
      }
      if (bracketBRRef.current) {
        bracketBRRef.current.style.transform = `translate3d(${bracketExpand}px, ${bracketExpand}px, 0)`;
      }

      // Exit dissolve: 0.84 -> 1.0 (smoothly fades & dissolves into Chapter 02)
      if (progress > 0.84) {
        const exit = (progress - 0.84) / 0.16;
        container.style.opacity = (1 - exit).toFixed(3);
        container.style.transform = `scale(${(1 - exit * 0.04).toFixed(3)}) translate3d(0, ${(-exit * 20).toFixed(1)}px, 0)`;
      } else {
        container.style.opacity = '1';
        container.style.transform = 'none';
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <section
      className="convergence-section"
      ref={sectionRef}
      id="convergence"
      aria-label="Hack With India Identity Convergence"
    >
      <div className="convergence-sticky">
        <div className="convergence-container" ref={containerRef}>
          {/* Technical Framing Frame with Brackets */}
          <div className="convergence-frame">
            <span
              className="convergence-bracket convergence-bracket--tl"
              ref={bracketTLRef}
              aria-hidden="true"
            />
            <span
              className="convergence-bracket convergence-bracket--tr"
              ref={bracketTRRef}
              aria-hidden="true"
            />
            <span
              className="convergence-bracket convergence-bracket--bl"
              ref={bracketBLRef}
              aria-hidden="true"
            />
            <span
              className="convergence-bracket convergence-bracket--br"
              ref={bracketBRRef}
              aria-hidden="true"
            />

            {/* Technical Eyebrow Badge */}
            <div className="convergence-badge" aria-hidden="true">
              <span className="convergence-badge-dot" />
              <span>01.5 // IDENTITY CONVERGENCE</span>
            </div>

            {/* CharacterV1 Convergence Typography */}
            <div className="convergence-row" aria-label={PHRASE}>
              {CHARS.map((char, idx) => {
                const isSpace = char === ' ';
                return (
                  <span
                    key={`char-${idx}`}
                    ref={(el) => {
                      charRefs.current[idx] = el;
                    }}
                    className={`convergence-char ${isSpace ? 'convergence-char--space' : ''}`}
                    aria-hidden="true"
                  >
                    {isSpace ? '\u00A0' : char}
                  </span>
                );
              })}
            </div>

            {/* Technical Subtext */}
            <div className="convergence-subtext" aria-hidden="true">
              <span>BHARATI VIDYAPEETH</span>
              <span className="convergence-subtext-sep">/</span>
              <span className="text-accent-red">NM CHAPTER</span>
              <span className="convergence-subtext-sep">/</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
