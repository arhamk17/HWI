'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import { introStore } from '@/lib/introStore';
import { MULTILINGUAL_SCRIPTS, FINAL_BRAND_TITLE } from './multilingualData';
import './TypographicIntro.css';

/*
  TYPOGRAPHIC INTRO — Cinematic Multilingual Typography Sequence:
  Displays the phrase "HACK WITH INDIA" successively in 10 diverse writing systems
  (English, Devanagari, Bengali, Gujarati, Gurmukhi, Tamil, Telugu, Kannada,
   Malayalam, and Japanese Katakana) with rhythmic, deliberate typographic choreography,
  concluding in a grand English brand title before seamlessly dissolving into the Hero.
*/
export function TypographicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackerBarRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(() => introStore.isComplete);
  const hasFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    introStore.setComplete();
    setIsDone(true);
  }, []);

  useEffect(() => {
    // If intro has already completed (e.g. client route navigation), never replay
    if (introStore.isComplete) {
      setIsDone(true);
      return;
    }

    // Accessible reduced motion: skip rapid sequence, show clean brief branding then finish
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reducedTimer = setTimeout(() => {
        handleFinish();
      }, 350);
      return () => clearTimeout(reducedTimer);
    }

    if (!containerRef.current) return;
    const container = containerRef.current;
    const slideEls = Array.from(container.querySelectorAll<HTMLElement>('.intro__slide'));
    const finalEl = container.querySelector<HTMLElement>('.intro__final');
    const trackerBar = trackerBarRef.current;

    if (!slideEls.length || !finalEl) {
      handleFinish();
      return;
    }

    // Set initial animation states
    anime.set(slideEls, { opacity: 0, translateY: 22 });
    anime.set(finalEl, { opacity: 0, translateY: 24, scale: 0.96 });
    if (trackerBar) anime.set(trackerBar, { width: '0%' });

    const tl = anime.timeline({
      easing: 'easeOutExpo',
      complete: handleFinish,
    });

    const totalScripts = slideEls.length;

    // Sequence through each writing system with crisp, deliberate cadence (~240ms per script)
    slideEls.forEach((slide, idx) => {
      // Step A: Slide enters smoothly from beneath
      tl.add({
        targets: slide,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 130,
        easing: 'easeOutCubic',
        begin: () => {
          if (trackerBar) {
            const pct = Math.round(((idx + 1) / totalScripts) * 100);
            trackerBar.style.width = `${pct}%`;
          }
        },
      }, idx === 0 ? 0 : '-=40')
      // Step B: Slide exits upward, making space for the next script
      .add({
        targets: slide,
        opacity: [1, 0],
        translateY: [0, -20],
        duration: 100,
        easing: 'easeInCubic',
      }, '+=80');
    });

    // Step C: Grand Finale — Final bold English title
    tl.add({
      targets: finalEl,
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.96, 1.0],
      duration: 260,
      easing: 'easeOutExpo',
      begin: () => {
        if (trackerBar) {
          trackerBar.style.width = '100%';
        }
      },
    }, '+=30')
    // Step D: Seamless dissolve into the Hero section
    .add({
      targets: container,
      opacity: [1, 0],
      duration: 400,
      easing: 'easeOutQuad',
      begin: () => {
        // Release pointer events & signal Hero entrance
        container.style.pointerEvents = 'none';
        introStore.setComplete();
      },
    }, '+=550');

    // Robust safety fallback timer (never leave page stuck)
    const fallbackTimer = setTimeout(handleFinish, 4500);

    return () => {
      clearTimeout(fallbackTimer);
      tl.pause();
    };
  }, [handleFinish]);

  if (isDone) return null;

  return (
    <section className="intro" ref={containerRef} aria-label="Loading sequence">
      <h1 className="sr-only">Hack With India</h1>

      <div className="intro__stage" aria-hidden="true">
        {/* Multilingual typography slides */}
        <div className="intro__slides-container">
          {MULTILINGUAL_SCRIPTS.map((script, idx) => (
            <div key={script.id} className={`intro__slide intro__slide--${idx}`}>
              <div className="intro__badge">
                <span className="intro__badge-dot" />
                <span className="intro__badge-index">{String(idx + 1).padStart(2, '0')}</span>
                <span className="intro__badge-sep">//</span>
                <span className="intro__badge-name">{script.scriptName}</span>
              </div>
              <div
                className="intro__phrase"
                style={{
                  fontFamily: script.fontFamily || undefined,
                  letterSpacing: script.letterSpacing || undefined,
                }}
              >
                {script.text}
              </div>
            </div>
          ))}
        </div>

        {/* Final English Brand Title */}
        <div className="intro__final">
          <div className="intro__final-badge">
            <span className="intro__final-badge-dot" />
            <span className="intro__final-badge-text">{FINAL_BRAND_TITLE.chapterBadge}</span>
          </div>
          <div className="intro__final-title">
            {FINAL_BRAND_TITLE.text}
          </div>
          <div className="intro__final-glow" />
        </div>

        {/* Minimalist technical progress tracker */}
        <div className="intro__tracker">
          <div className="intro__tracker-bar" ref={trackerBarRef} />
        </div>
      </div>
    </section>
  );
}
