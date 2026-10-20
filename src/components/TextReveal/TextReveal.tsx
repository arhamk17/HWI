'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollBus } from '@/lib/scrollBus';
import './TextReveal.css';

const INTRO_TEXT = 'BUILD WHAT MATTERS';
const ROW_COPY = [
  'HACKATHONS WORKSHOPS COMMUNITY',
  'BUILD SHIP LEARN',
  'INNOVATE CREATE ELEVATE',
];
const PIN_LENGTH_DESKTOP = 280;
const PIN_LENGTH_MOBILE = 180;
const INTRO_DRIFT_SECONDS = 48;
const VELOCITY_BOOST_MAX = 1.25;
const ACCENT_WORD_INDEX = 0;

export function TextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const introTrackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    let media: ReturnType<typeof gsap.matchMedia> | null = null;

    const context = gsap.context(() => {
      media = gsap.matchMedia();
      media.add(
        {
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          if (conditions?.reduceMotion) return;

          const stage = stageRef.current;
          const panel = panelRef.current;
          const introTrack = introTrackRef.current;
          if (!stage || !panel || !introTrack) return;

          const isMobile = Boolean(conditions?.isMobile);
          const rows = Array.from(
            section.querySelectorAll<HTMLElement>('.text-reveal__row-track'),
          ).slice(0, isMobile ? 2 : ROW_COPY.length);
          const drifts = Array.from(
            section.querySelectorAll<HTMLElement>('.text-reveal__row-drift'),
          ).slice(0, rows.length);

          gsap.set(panel, { clipPath: 'inset(100% 0 0 0)' });

          const introTween = gsap.to(introTrack, {
            xPercent: -50,
            duration: INTRO_DRIFT_SECONDS,
            ease: 'none',
            repeat: -1,
          });
          const speed = { value: 1 };
          const speedTo = gsap.quickTo(speed, 'value', {
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => introTween.timeScale(speed.value),
          });
          const unsubscribe = scrollBus.subscribe((_scroll, _progress, velocity) => {
            ScrollTrigger.update();
            const boost = Math.min(Math.abs(velocity) / 1600, VELOCITY_BOOST_MAX);
            speedTo(1 + boost);
          });

          const removeHoverListeners: Array<() => void> = [];
          drifts.forEach((drift, index) => {
            const driftTween = gsap.to(drift, {
              x: index % 2 === 0 ? -12 : 12,
              duration: 5 + index,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
            const row = rows[index];
            const slowDown = () => {
              if (!isMobile) gsap.to(driftTween, { timeScale: 0.4, duration: 0.3 });
            };
            const resume = () => {
              if (!isMobile) gsap.to(driftTween, { timeScale: 1, duration: 0.3 });
            };
            row.addEventListener('pointerenter', slowDown);
            row.addEventListener('pointerleave', resume);
            removeHoverListeners.push(() => {
              row.removeEventListener('pointerenter', slowDown);
              row.removeEventListener('pointerleave', resume);
            });
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () =>
                `+=${window.innerHeight * (isMobile ? PIN_LENGTH_MOBILE : PIN_LENGTH_DESKTOP) / 100}`,
              pin: stage,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          timeline.to(
            panel,
            { clipPath: 'inset(0% 0 0 0)', duration: 0.3, ease: 'none' },
            0,
          );
          rows.forEach((row, index) => {
            const startsLeft = index % 2 === 0;
            gsap.set(row, { xPercent: startsLeft ? 0 : -50 });
            timeline.to(
              row,
              { xPercent: startsLeft ? -50 : 0, duration: 0.7, ease: 'none' },
              0.3,
            );
          });

          let active = true;
          const refresh = () => {
            if (active) ScrollTrigger.refresh();
          };
          window.addEventListener('load', refresh);
          void document.fonts.ready.then(refresh);

          return () => {
            active = false;
            unsubscribe();
            window.removeEventListener('load', refresh);
            removeHoverListeners.forEach((remove) => remove());
          };
        },
      );
    }, section);

    return () => {
      media?.revert();
      context.revert();
    };
  }, []);

  return (
    <section className="text-reveal" ref={sectionRef}>
      <h2 className="text-reveal__sr-only">
        HWI: Build what matters through hackathons, workshops, and community.
      </h2>

      <div className="text-reveal__intro" aria-hidden="true">
        <div className="text-reveal__intro-track" ref={introTrackRef}>
          {[0, 1].map((copy) => (
            <span className="text-reveal__intro-copy" key={copy}>
              {INTRO_TEXT} <span className="text-reveal__separator">✱</span>
            </span>
          ))}
        </div>
      </div>

      <div className="text-reveal__stage" ref={stageRef}>
        <div className="text-reveal__panel" ref={panelRef}>
          <div className="text-reveal__image" />
          <div className="text-reveal__rows" aria-hidden="true">
            {ROW_COPY.map((copy) => (
              <div className="text-reveal__row" key={copy}>
                <div className="text-reveal__row-track">
                  <div className="text-reveal__row-drift">
                    {[0, 1].map((repeat) => (
                      <span className="text-reveal__row-copy" key={repeat}>
                        {copy.split(' ').map((word, wordIndex) => (
                          <span
                            className={
                              wordIndex === ACCENT_WORD_INDEX
                                ? 'text-reveal__word text-reveal__word--accent'
                                : 'text-reveal__word'
                            }
                            key={`${repeat}-${wordIndex}`}
                          >
                            {word}
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
