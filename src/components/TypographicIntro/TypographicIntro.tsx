'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';
import { introStore } from '@/lib/introStore';
import './TypographicIntro.css';

/*
  TYPOGRAPHIC INTRO — Cinematic opening typography sequence:
  "HACK" → "WITH" → "INDIA" over the Sukuna anime video background,
  smoothly dissolving into the Hero section without interrupting video playback.
*/
export function TypographicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);
  const hasFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsDone(true);
    introStore.setComplete();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleFinish();
      return;
    }

    if (!containerRef.current) return;

    const el = containerRef.current;
    const word1 = el.querySelector('.intro__word--1');
    const word2 = el.querySelector('.intro__word--2');
    const word3 = el.querySelector('.intro__word--3');

    // Set initial states
    anime.set([word1, word2, word3], { opacity: 0, translateY: 25 });

    const tl = anime.timeline({
      easing: 'easeOutExpo',
      complete: handleFinish,
    });

    // Rapid, energetic kinetic flash sequence (~1.1s total)
    tl.add({
      targets: word1,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 220,
      easing: 'easeOutCubic',
    })
    .add({
      targets: word1,
      opacity: 0,
      duration: 120,
      easing: 'linear',
    }, '+=120')
    .add({
      targets: word2,
      opacity: [0, 1],
      translateY: [25, 0],
      color: ['#FFFFFF', '#EF4444'],
      duration: 260,
      easing: 'easeOutCubic',
    })
    .add({
      targets: word2,
      opacity: 0,
      duration: 120,
      easing: 'linear',
    }, '+=120')
    .add({
      targets: word3,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 220,
      easing: 'easeOutCubic',
    })
    .add({
      targets: word3,
      opacity: 0,
      duration: 140,
      easing: 'linear',
    }, '+=120')
    // Dissolve intro overlay smoothly over the continuous video to reveal Hero content
    .add({
      targets: el,
      opacity: 0,
      duration: 400,
      easing: 'easeOutQuad',
    }, '+=60');

    // Safety fallback timer matching timeline duration
    const fallbackTimer = setTimeout(handleFinish, 1800);

    return () => {
      clearTimeout(fallbackTimer);
      tl.pause();
    };
  }, [handleFinish]);

  if (isDone) return null;

  return (
    <section className="intro" ref={containerRef} style={{ pointerEvents: 'none' }}>
      {/* Rapid Kinetic Flash Words: HACK WITH INDIA over the Sukuna video */}
      <span className="intro__word intro__word--1 type-massive">HACK</span>
      <span className="intro__word intro__word--2 type-massive">WITH</span>
      <span className="intro__word intro__word--3 type-massive">INDIA</span>
    </section>
  );
}


