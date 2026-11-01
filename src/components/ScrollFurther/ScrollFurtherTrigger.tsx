'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight, Sparkles, Compass } from 'lucide-react';
import './ScrollFurtherTrigger.css';

export interface ChapterDestination {
  href: string;
  title: string;
  sector: string;
  subtitle: string;
  kicker: string;
}

export const CHAPTER_JOURNEY: Record<string, ChapterDestination> = {
  '/': {
    href: '/about',
    title: 'ABOUT',
    sector: '02',
    subtitle: 'The Chapter DNA & Mission',
    kicker: 'CHAPTER 02 // SECTOR TWO',
  },
  '/about': {
    href: '/events',
    title: 'EVENTS',
    sector: '03',
    subtitle: 'Milestone Chronicles & Hackathons',
    kicker: 'CHAPTER 03 // SECTOR THREE',
  },
  '/events': {
    href: '/team',
    title: 'TEAMS',
    sector: '04',
    subtitle: 'Core Chapter Architects & Leads',
    kicker: 'CHAPTER 04 // SECTOR FOUR',
  },
  '/team': {
    href: '/join',
    title: 'REGISTER',
    sector: '05',
    subtitle: 'Pass Protocol & Chapter Access',
    kicker: 'CHAPTER 05 // SECTOR FIVE',
  },
  '/join': {
    href: '/',
    title: 'HOME',
    sector: '01',
    subtitle: 'Return to Chapter Ignition',
    kicker: 'CHAPTER 01 // SECTOR ONE',
  },
};

export function getNextChapter(pathname: string): ChapterDestination {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (CHAPTER_JOURNEY[normalized]) {
    return CHAPTER_JOURNEY[normalized];
  }
  // Subpage fallbacks
  if (normalized.startsWith('/tenure') || normalized.startsWith('/faculty-mentors')) {
    return CHAPTER_JOURNEY['/events'];
  }
  if (normalized.startsWith('/gallery')) {
    return CHAPTER_JOURNEY['/about'];
  }
  return CHAPTER_JOURNEY['/'];
}

const REQUIRED_DELTA = 260; // Delta needed to complete the gesture

export function ScrollFurtherTrigger() {
  const pathname = usePathname();
  const router = useRouter();
  const nextChapter = useMemo(() => getNextChapter(pathname), [pathname]);

  const [progress, setProgress] = useState<number>(0);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const accumulatedDeltaRef = useRef<number>(0);
  const isTriggeredRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const decayRafRef = useRef<number | null>(null);
  const lastInteractionTimeRef = useRef<number>(0);

  // Reset state on route change
  useEffect(() => {
    setIsTriggered(false);
    isTriggeredRef.current = false;
    setProgress(0);
    accumulatedDeltaRef.current = 0;
    setIsPulling(false);
  }, [pathname]);

  // Execute the navigation with transition click or router push
  const triggerTransition = useCallback(() => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    setIsTriggered(true);
    setProgress(100);

    // If invisible transition link exists, click it to invoke PageTransitionProvider
    if (linkRef.current) {
      linkRef.current.click();
    } else {
      router.push(nextChapter.href);
    }
  }, [nextChapter.href, router]);

  // Check if user is at the bottom of the page
  const checkIfAtBottom = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowH = window.innerHeight;
    const docH = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );
    // Allow a 40px buffer at the bottom
    return scrollY + windowH >= docH - 40;
  }, []);

  // Observe when footer scroll trigger enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous spring decay animation loop for when scrolling stops
  useEffect(() => {
    const decayLoop = () => {
      const now = performance.now();
      const timeSinceLastInteraction = now - lastInteractionTimeRef.current;

      if (!isTriggeredRef.current && timeSinceLastInteraction > 90) {
        if (accumulatedDeltaRef.current > 0.5) {
          // Smooth exponential spring return
          accumulatedDeltaRef.current = Math.max(0, accumulatedDeltaRef.current * 0.86 - 0.8);
          const currentPct = Math.min(100, (accumulatedDeltaRef.current / REQUIRED_DELTA) * 100);
          setProgress(currentPct);
          setIsPulling(currentPct > 3);
        } else if (accumulatedDeltaRef.current > 0) {
          accumulatedDeltaRef.current = 0;
          setProgress(0);
          setIsPulling(false);
        }
      }

      decayRafRef.current = requestAnimationFrame(decayLoop);
    };

    decayRafRef.current = requestAnimationFrame(decayLoop);
    return () => {
      if (decayRafRef.current) cancelAnimationFrame(decayRafRef.current);
    };
  }, []);

  // Handle Wheel Events (Desktop Mouse Wheel & Trackpad)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTriggeredRef.current) return;
      if (!isInView) return;

      const atBottom = checkIfAtBottom();
      if (!atBottom) return;

      // Scrolling downwards past the footer
      if (e.deltaY > 0) {
        lastInteractionTimeRef.current = performance.now();
        setIsPulling(true);

        // Normalize delta to prevent instant jumps on high-delta mice
        const normalizedDelta = Math.min(Math.abs(e.deltaY), 55);
        accumulatedDeltaRef.current = Math.min(
          REQUIRED_DELTA,
          accumulatedDeltaRef.current + normalizedDelta
        );

        const currentPct = Math.min(100, (accumulatedDeltaRef.current / REQUIRED_DELTA) * 100);
        setProgress(currentPct);

        if (currentPct >= 100) {
          triggerTransition();
        }
      } else if (e.deltaY < 0 && accumulatedDeltaRef.current > 0) {
        // Scrolling back up cancels gesture immediately
        accumulatedDeltaRef.current = Math.max(0, accumulatedDeltaRef.current - Math.abs(e.deltaY) * 1.5);
        const currentPct = Math.min(100, (accumulatedDeltaRef.current / REQUIRED_DELTA) * 100);
        setProgress(currentPct);
        setIsPulling(currentPct > 3);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isInView, checkIfAtBottom, triggerTransition]);

  // Handle Touch Events (Mobile Drag / Pull Up)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isTriggeredRef.current) return;
      if (!isInView) return;
      if (!checkIfAtBottom()) return;

      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTriggeredRef.current || touchStartYRef.current === null) return;
      if (!isInView || !checkIfAtBottom()) return;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartYRef.current - currentY; // Positive when pulling UP

      if (diffY > 0) {
        lastInteractionTimeRef.current = performance.now();
        setIsPulling(true);

        // Map 110px pull distance to 100% progress
        const touchPct = Math.min(100, (diffY / 110) * 100);
        accumulatedDeltaRef.current = (touchPct / 100) * REQUIRED_DELTA;
        setProgress(touchPct);

        if (touchPct >= 100) {
          triggerTransition();
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      if (!isTriggeredRef.current && progress < 100) {
        // Decay will spring it back
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isInView, checkIfAtBottom, progress, triggerTransition]);

  // Keyboard accessibility (down arrow or enter when focused)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      triggerTransition();
    }
  };

  // SVG Circle Meter parameters
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div
      ref={containerRef}
      className={`scroll-further-portal ${isPulling ? 'is-pulling' : ''} ${
        isTriggered ? 'is-triggered' : ''
      }`}
      onClick={triggerTransition}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Scroll further to advance to ${nextChapter.title}`}
    >
      {/* Hidden next page navigation link for PageTransitionProvider capture */}
      <Link
        ref={linkRef}
        href={nextChapter.href}
        tabIndex={-1}
        aria-hidden="true"
        className="scroll-further-hidden-link"
      >
        {nextChapter.title}
      </Link>

      {/* Top Laser Progress Gauge */}
      <div className="scroll-further-laser-gauge">
        <div
          className="scroll-further-laser-fill"
          style={{ width: `${progress}%` }}
        />
        <div
          className="scroll-further-laser-glow"
          style={{ left: `${progress}%`, opacity: progress > 3 ? 1 : 0 }}
        />
      </div>

      <div className="scroll-further-inner">
        {/* Left Side: Chapter Navigation Telemetry */}
        <div className="scroll-further-meta">
          <div className="scroll-further-kicker">
            <span className="scroll-further-beacon" />
            <span className="scroll-further-kicker-text">
              {isTriggered
                ? 'INITIALIZING DISPATCH...'
                : isPulling
                ? `ENGAGING SECTOR ${nextChapter.sector} [ ${Math.round(progress)}% ]`
                : nextChapter.kicker}
            </span>
          </div>

          <h3 className="scroll-further-heading">
            {isTriggered ? (
              <span className="scroll-heading-active">
                Entering {nextChapter.title}...
              </span>
            ) : (
              <>
                CONTINUE TO <span className="scroll-heading-highlight">{nextChapter.title}</span>
                <ArrowRight size={22} className="scroll-heading-arrow" />
              </>
            )}
          </h3>

          <p className="scroll-further-desc">
            {isTriggered
              ? 'Loading chapter assets and establishing continuum pipeline.'
              : `${nextChapter.subtitle} · Scroll further or pull up to advance.`}
          </p>
        </div>

        {/* Right Side: Interactive Radial Scroll-Gesture Dial */}
        <div className="scroll-further-dial-wrap">
          <div className="scroll-further-dial">
            <svg
              className="scroll-further-dial-svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
            >
              {/* Background Track Circle */}
              <circle
                className="scroll-dial-track"
                cx="32"
                cy="32"
                r={radius}
                strokeWidth="3.5"
              />
              {/* Animated Progress Stroke */}
              <circle
                className="scroll-dial-progress"
                cx="32"
                cy="32"
                r={radius}
                strokeWidth="3.5"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>

            {/* Dial Center Icon */}
            <div className="scroll-further-dial-center">
              {isTriggered ? (
                <Sparkles size={20} className="scroll-center-icon is-sparkle" />
              ) : (
                <ChevronDown
                  size={22}
                  className={`scroll-center-icon ${progress > 20 ? 'is-diving' : ''}`}
                />
              )}
            </div>
          </div>

          {/* Gesture Instruction Badge */}
          <div className="scroll-further-gesture-badge">
            <span className="gesture-instruction-text">
              {isTriggered
                ? 'RELEASE TO LOAD'
                : isPulling
                ? `PULL TO ADVANCE · ${Math.round(progress)}%`
                : 'SCROLL TO ADVANCE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

