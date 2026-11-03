'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import { Volume2 } from 'lucide-react';
import { introStore } from '@/lib/introStore';
import { soundtrackController } from '@/lib/soundtrackController';
import { MULTILINGUAL_SCRIPTS, FINAL_BRAND_TITLE } from './multilingualData';
import './TypographicIntro.css';

/*
  TYPOGRAPHIC INTRO — Cinematic Multilingual Typography Sequence:
  Displays the phrase "HACK WITH INDIA" successively in 10 diverse writing systems
  (English, Devanagari, Bengali, Gujarati, Gurmukhi, Tamil, Telugu, Kannada,
   Malayalam, and Japanese Katakana) with rhythmic, deliberate typographic choreography,
  concluding in a grand English brand title before seamlessly dissolving into the Hero.
  Preserves "WITH" in signature red (#EF4444) for brand fidelity.
  Starts and stays in exact beat-for-beat sync with the soundtrack audio.
*/
export function TypographicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackerBarRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(() => introStore.isComplete);
  const [needsGesture, setNeedsGesture] = useState(false);
  const hasFinishedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const animTimelineRef = useRef<anime.AnimeTimelineInstance | null>(null);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    introStore.setComplete();
    setIsDone(true);
  }, []);

  const runTimeline = useCallback(() => {
    if (hasStartedRef.current || !containerRef.current) return;
    hasStartedRef.current = true;
    setNeedsGesture(false);

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
    animTimelineRef.current = tl;

    const totalScripts = slideEls.length;

    // Sequence through each writing system with crisp cadence in sync with the audio beat
    slideEls.forEach((slide, idx) => {
      // Step A: Slide enters smoothly from beneath
      tl.add(
        {
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
        },
        idx === 0 ? 0 : '-=40'
      )
      // Step B: Slide exits upward, making space for the next script
      .add(
        {
          targets: slide,
          opacity: [1, 0],
          translateY: [0, -20],
          duration: 100,
          easing: 'easeInCubic',
        },
        '+=80'
      );
    });

    // Step C: Grand Finale — Final bold English title with prominent red "WITH"
    tl.add(
      {
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
      },
      '+=30'
    )
    // Step D: Seamless dissolve into the Hero section
    .add(
      {
        targets: container,
        opacity: [1, 0],
        duration: 400,
        easing: 'easeOutQuad',
        begin: () => {
          container.style.pointerEvents = 'none';
          introStore.setComplete();
        },
      },
      '+=550'
    );
  }, [handleFinish]);

  // Synchronized Start Trigger
  const triggerSyncStart = useCallback(() => {
    if (hasStartedRef.current) return;
    setNeedsGesture(false);
    // Start audio from 0:00 and begin the animation timeline simultaneously
    soundtrackController.startIntroSync().catch(() => {});
    runTimeline();
  }, [runTimeline]);

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

    let isSubscribed = true;

    // Attempt automatic playback in sync with intro
    soundtrackController.startIntroSync().then((success) => {
      if (!isSubscribed) return;

      if (success) {
        // Autoplay succeeded! Start timeline simultaneously in 100% sync
        runTimeline();
      } else {
        // Autoplay blocked by browser policy: prepare interactive unlock
        setNeedsGesture(true);

        const onFirstGesture = () => {
          if (!isSubscribed || hasStartedRef.current) return;
          cleanup();
          triggerSyncStart();
        };

        const cleanup = () => {
          window.removeEventListener('pointerdown', onFirstGesture);
          window.removeEventListener('touchstart', onFirstGesture);
          window.removeEventListener('click', onFirstGesture);
          window.removeEventListener('keydown', onFirstGesture);
        };

        window.addEventListener('pointerdown', onFirstGesture, { once: true });
        window.addEventListener('touchstart', onFirstGesture, { once: true });
        window.addEventListener('click', onFirstGesture, { once: true });
        window.addEventListener('keydown', onFirstGesture, { once: true });

        // Fallback: If user doesn't interact within 2.4s, don't leave screen hanging
        const fallbackTimer = setTimeout(() => {
          if (!isSubscribed || hasStartedRef.current) return;
          cleanup();
          runTimeline();
        }, 2400);

        return () => {
          cleanup();
          clearTimeout(fallbackTimer);
        };
      }
    });

    // Hard ceiling safety fallback timer
    const safetyTimer = setTimeout(handleFinish, 5000);

    return () => {
      isSubscribed = false;
      clearTimeout(safetyTimer);
      if (animTimelineRef.current) {
        animTimelineRef.current.pause();
      }
    };
  }, [handleFinish, runTimeline, triggerSyncStart]);

  if (isDone) return null;

  return (
    <section
      className="intro"
      ref={containerRef}
      aria-label="Loading sequence"
      onClick={needsGesture ? triggerSyncStart : undefined}
    >
      <h1 className="sr-only">Hack With India</h1>

      <div className="intro__stage" aria-hidden="true">
        {/* Subtle prompt only shown if browser blocks autoplay with sound */}
        {needsGesture && (
          <div className="intro__gesture-prompt" role="button" aria-label="Enter with sound">
            <Volume2 size={16} className="intro__gesture-icon" />
            <span className="intro__gesture-text">TAP OR CLICK ANYWHERE TO ENTER</span>
            <span className="intro__gesture-sub">START WITH SOUND</span>
          </div>
        )}

        {/* Multilingual typography slides */}
        <div className={`intro__slides-container ${needsGesture ? 'is-waiting-gesture' : ''}`}>
          {MULTILINGUAL_SCRIPTS.map((script, idx) => (
            <div key={script.id} className={`intro__slide intro__slide--${idx}`}>
              <div className="intro__badge">
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
                {script.id === 'en' ? (
                  <>
                    HACK{' '}
                    <span className="intro__with">
                      WITH
                    </span>{' '}
                    INDIA
                  </>
                ) : (
                  script.text
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Final English Brand Title */}
        <div className={`intro__final ${needsGesture ? 'is-waiting-gesture' : ''}`}>
          <div className="intro__final-badge">
            <span className="intro__final-badge-text">{FINAL_BRAND_TITLE.chapterBadge}</span>
          </div>
          <div className="intro__final-title">
            HACK{' '}
            <span className="intro__with">
              WITH
            </span>{' '}
            INDIA
          </div>
          <div className="intro__final-glow" />
        </div>

        {/* Minimalist technical progress tracker at bottom */}
        <div className="intro__tracker">
          <div className="intro__tracker-bar" ref={trackerBarRef} />
        </div>
      </div>
    </section>
  );
}
