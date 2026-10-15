'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import './TypographicIntro.css';

/*
  AUTOMATIC INTRO — Fast, sleek opening flash sequence:
  HACK → INDIA → CHAPTER → seamless dissolve into Hero.
  Optimized for immediate first-viewport interactivity without stutter or duplicate text.
*/
export function TypographicIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsDone(true);
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
      complete: () => {
        setIsDone(true);
      }
    });

    // Rapid, energetic kinetic flash sequence (~1.1s total)
    tl.add({
      targets: word1,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 220,
      easing: 'easeOutCubic'
    })
    .add({
      targets: word1,
      opacity: 0,
      duration: 120,
      easing: 'linear'
    }, '+=120')
    .add({
      targets: word2,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 220,
      easing: 'easeOutCubic'
    })
    .add({
      targets: word2,
      opacity: 0,
      duration: 120,
      easing: 'linear'
    }, '+=120')
    .add({
      targets: word3,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 220,
      easing: 'easeOutCubic'
    })
    .add({
      targets: word3,
      opacity: 0,
      duration: 140,
      easing: 'linear'
    }, '+=120')
    // Dissolve overlay smoothly to reveal the already-rendered Hero
    .add({
      targets: el,
      opacity: 0,
      duration: 400,
      easing: 'easeOutQuad'
    }, '+=60');

    return () => {
      tl.pause();
    };
  }, []);

  if (isDone) return null;

  return (
    <section className="intro" ref={containerRef} style={{ pointerEvents: 'none' }}>
      {/* Rapid Flash Words: HACK WITH INDIA */}
      <span className="intro__word intro__word--1 type-massive">HACK</span>
      <span className="intro__word intro__word--2 type-massive">WITH</span>
      <span className="intro__word intro__word--3 type-massive">INDIA</span>
    </section>
  );
}

