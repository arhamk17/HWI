'use client';

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { KokonutButton } from '@/components/KokonutUI/KokonutButton';

const HEADLINE_LINE_ONE = 'MORE THAN CODE.';
const HEADLINE_LINE_TWO = 'A MOVEMENT OF BUILDERS.';
const HEADLINE_LENGTH = HEADLINE_LINE_ONE.length + HEADLINE_LINE_TWO.length;

export function AboutHero() {
  const [visibleHeadlineChars, setVisibleHeadlineChars] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const revealTimer = setTimeout(() => setVisibleHeadlineChars(HEADLINE_LENGTH), 0);
      return () => clearTimeout(revealTimer);
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        setVisibleHeadlineChars((visibleChars) => {
          const nextVisibleChars = Math.min(visibleChars + 1, HEADLINE_LENGTH);
          if (nextVisibleChars === HEADLINE_LENGTH && interval) {
            clearInterval(interval);
          }
          return nextVisibleChars;
        });
      }, 36);
    }, 250);

    return () => {
      clearTimeout(startTimer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById('who-we-are');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCinematic = () => {
    const videoSec = document.getElementById('intro-video');
    if (videoSec) {
      videoSec.scrollIntoView({ behavior: 'smooth' });
    }
    window.dispatchEvent(new CustomEvent('hwi:open-cinematic-experience'));
  };

  const firstLineChars = Math.min(visibleHeadlineChars, HEADLINE_LINE_ONE.length);
  const secondLineChars = Math.max(0, visibleHeadlineChars - HEADLINE_LINE_ONE.length);
  const isTypingFirstLine = visibleHeadlineChars <= HEADLINE_LINE_ONE.length;
  const isStillTyping = visibleHeadlineChars < HEADLINE_LENGTH;

  return (
    <section className="about-hero" id="opening">
      <div className="about-container">

        {/* Kinetic Clipping Typography */}
        <div className="about-hero__headline-wrapper">
          <h1
            className="about-hero__headline about-reveal is-revealed about-delay-1"
            aria-label={`${HEADLINE_LINE_ONE} ${HEADLINE_LINE_TWO}`}
          >
            <span className="about-hero__kinetic-line about-hero__kinetic-line--active">
              <span aria-hidden="true">{HEADLINE_LINE_ONE.slice(0, firstLineChars)}</span>
              {isStillTyping && isTypingFirstLine && <span className="about-hero__typewriter-cursor" aria-hidden="true">|</span>}
            </span>
            <br />
            <span className={`about-hero__kinetic-line about-hero__headline-accent ${secondLineChars > 0 ? 'about-hero__kinetic-line--active' : ''}`}>
              <span aria-hidden="true">{HEADLINE_LINE_TWO.slice(0, secondLineChars)}</span>
              {isStillTyping && !isTypingFirstLine && <span className="about-hero__typewriter-cursor" aria-hidden="true">|</span>}
            </span>
          </h1>
        </div>

        {/* Concise Supporting Statement */}
        <p className="about-hero__subtext about-reveal is-revealed about-delay-2">
          An ambitious student engineering chapter at Bharati Vidyapeeth Department of Engineering and Technology, Navi Mumbai. Cultivating high-velocity hackathons, open-source shipping, and practical engineering.
        </p>

        {/* Primary Chapter Actions */}
        <div className="about-hero__actions about-reveal is-revealed about-delay-3">
          <button
            type="button"
            className="about-hero__cinematic-btn"
            onClick={openCinematic}
            id="hero-cinematic-experience-btn"
            title="Open HWI Cinematic Experience in full screen"
          >
            <span className="about-hero__cinematic-icon-wrap">
              <Play size={12} fill="currentColor" />
            </span>
            <span>Cinematic Experience</span>
          </button>
          <KokonutButton href="#who-we-are" variant="outline">
            Our Mission
          </KokonutButton>
          <KokonutButton href="/events" variant="outline">
            Explore 7-Edition Chronicle
          </KokonutButton>
        </div>

        {/* Scroll Cue & Laser Indicator */}
        <div className="about-reveal is-revealed about-delay-4">
          <button
            type="button"
            className="about-hero__scroll-cue"
            onClick={scrollToNext}
            aria-label="Scroll to explore our story"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <span style={{ color: '#00F0FF' }}>SCROLL TO EXPLORE</span>
            <span>OUR STORY</span>
          </button>
        </div>
      </div>

      {/* Geometric Section Transition Wipe: Angled Red Aperture */}
      <div className="about-hero__bottom-wipe" aria-hidden="true" />
    </section>
  );
}
