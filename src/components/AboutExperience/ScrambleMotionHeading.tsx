'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Character set from the reference video (ASCII range 65-125 with symbols)
const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_\\/[]{}~-^?*+!@#$%&';

const PREFIX_TEXT = 'EXPERIENCE THE CHAPTER ';
const ACCENT_TEXT = 'IN MOTION';
const SUFFIX_TEXT = '.';
const FULL_TEXT = PREFIX_TEXT + ACCENT_TEXT + SUFFIX_TEXT;

const PREFIX_LEN = PREFIX_TEXT.length; // 23
const ACCENT_END = PREFIX_LEN + ACCENT_TEXT.length; // 32
const TOTAL_LEN = FULL_TEXT.length; // 33

function getRandomGlyph(): string {
  return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
}

interface ScrambleHeadingState {
  prefixResolved: string;
  prefixScramble: string;
  accentResolved: string;
  accentScramble: string;
  suffixResolved: string;
  suffixScramble: string;
}

export function ScrambleMotionHeading() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const animFrameRef = useRef<NodeJS.Timeout | null>(null);
  const hasAnimatedOnViewRef = useRef<boolean>(false);
  const isAnimatingRef = useRef<boolean>(false);

  const [textState, setTextState] = useState<ScrambleHeadingState>({
    prefixResolved: PREFIX_TEXT,
    prefixScramble: '',
    accentResolved: ACCENT_TEXT,
    accentScramble: '',
    suffixResolved: SUFFIX_TEXT,
    suffixScramble: '',
  });

  const runScrambleAnimation = useCallback(() => {
    // Cancel any ongoing animation
    if (animFrameRef.current) {
      clearInterval(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTextState({
        prefixResolved: PREFIX_TEXT,
        prefixScramble: '',
        accentResolved: ACCENT_TEXT,
        accentScramble: '',
        suffixResolved: SUFFIX_TEXT,
        suffixScramble: '',
      });
      return;
    }

    isAnimatingRef.current = true;
    let resolvedIndex = 0;
    let tickCount = 0;

    const interval = setInterval(() => {
      tickCount++;

      // Advance resolved letters: every 2 ticks (~48ms), with a slight pause on spaces (3 ticks ~72ms)
      const currentChar = FULL_TEXT[resolvedIndex];
      const stepDelay = currentChar === ' ' ? 3 : 2;

      if (tickCount % stepDelay === 0) {
        resolvedIndex++;
      }

      // Lookahead scramble buffer (2-3 characters)
      const bufferLen = resolvedIndex < TOTAL_LEN ? Math.min(3, TOTAL_LEN - resolvedIndex) : 0;
      const currentRevealLimit = Math.min(TOTAL_LEN, resolvedIndex + bufferLen);

      let pRes = '';
      let pScr = '';
      let aRes = '';
      let aScr = '';
      let sRes = '';
      let sScr = '';

      for (let i = 0; i < currentRevealLimit; i++) {
        const isResolved = i < resolvedIndex;
        const targetChar = FULL_TEXT[i];
        const displayChar = isResolved ? targetChar : (targetChar === ' ' ? ' ' : getRandomGlyph());

        if (i < PREFIX_LEN) {
          if (isResolved) pRes += displayChar;
          else pScr += displayChar;
        } else if (i < ACCENT_END) {
          if (isResolved) aRes += displayChar;
          else aScr += displayChar;
        } else {
          if (isResolved) sRes += displayChar;
          else sScr += displayChar;
        }
      }

      setTextState({
        prefixResolved: pRes,
        prefixScramble: pScr,
        accentResolved: aRes,
        accentScramble: aScr,
        suffixResolved: sRes,
        suffixScramble: sScr,
      });

      if (resolvedIndex >= TOTAL_LEN) {
        clearInterval(interval);
        animFrameRef.current = null;
        isAnimatingRef.current = false;
        setTextState({
          prefixResolved: PREFIX_TEXT,
          prefixScramble: '',
          accentResolved: ACCENT_TEXT,
          accentScramble: '',
          suffixResolved: SUFFIX_TEXT,
          suffixScramble: '',
        });
      }
    }, 24); // ~40fps tick rate for crisp, high-frequency kinetic scramble

    animFrameRef.current = interval;
  }, []);

  // Trigger on scroll into viewport
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedOnViewRef.current) {
            hasAnimatedOnViewRef.current = true;
            // Short delay after entering viewport for cinematic effect
            setTimeout(() => {
              runScrambleAnimation();
            }, 120);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animFrameRef.current) {
        clearInterval(animFrameRef.current);
      }
    };
  }, [runScrambleAnimation]);

  const handleMouseEnter = () => {
    runScrambleAnimation();
  };

  return (
    <h2
      ref={headingRef}
      className="about-video-heading"
      aria-label="EXPERIENCE THE CHAPTER IN MOTION."
      onMouseEnter={handleMouseEnter}
      data-cursor="text"
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <span aria-hidden="true">
        {textState.prefixResolved}
        {textState.prefixScramble && (
          <span className="about-heading-scramble-glyph">{textState.prefixScramble}</span>
        )}
        {(textState.accentResolved || textState.accentScramble) && (
          <span className="text-accent">
            {textState.accentResolved}
            {textState.accentScramble && (
              <span className="about-heading-scramble-glyph accent">{textState.accentScramble}</span>
            )}
          </span>
        )}
        {textState.suffixResolved}
        {textState.suffixScramble && (
          <span className="about-heading-scramble-glyph">{textState.suffixScramble}</span>
        )}
      </span>
    </h2>
  );
}
