'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronUp, ArrowLeft, Sparkles } from 'lucide-react';
import './ScrollPreviousTrigger.css';

export interface PreviousChapterDestination {
  href: string;
  title: string;
  sector: string;
  subtitle: string;
  kicker: string;
}

export const PREVIOUS_CHAPTER_JOURNEY: Record<string, PreviousChapterDestination> = {
  '/about': {
    href: '/',
    title: 'HOME',
    sector: '01',
    subtitle: 'Return to Chapter Ignition & Root',
    kicker: 'PREVIOUS CHAPTER // 01 · HOME',
  },
  '/events': {
    href: '/about',
    title: 'ABOUT',
    sector: '02',
    subtitle: 'Return to Chapter DNA & Mission',
    kicker: 'PREVIOUS CHAPTER // 02 · ABOUT',
  },
  '/team': {
    href: '/events',
    title: 'EVENTS',
    sector: '03',
    subtitle: 'Return to Milestone Chronicles & Hackathons',
    kicker: 'PREVIOUS CHAPTER // 03 · EVENTS',
  },
  '/join': {
    href: '/team',
    title: 'TEAMS',
    sector: '04',
    subtitle: 'Return to Core Architects & Leads',
    kicker: 'PREVIOUS CHAPTER // 04 · TEAMS',
  },
  '/': {
    href: '/join',
    title: 'REGISTER',
    sector: '05',
    subtitle: 'Cycle to Pass Protocol & Registration',
    kicker: 'PREVIOUS CHAPTER // 05 · REGISTER',
  },
};

export function getPreviousChapter(pathname: string): PreviousChapterDestination {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (PREVIOUS_CHAPTER_JOURNEY[normalized]) {
    return PREVIOUS_CHAPTER_JOURNEY[normalized];
  }
  // Subpage fallbacks
  if (normalized.startsWith('/faculty-mentors') || normalized.startsWith('/tenure')) {
    return PREVIOUS_CHAPTER_JOURNEY['/team'];
  }
  if (normalized.startsWith('/gallery')) {
    return PREVIOUS_CHAPTER_JOURNEY['/about'];
  }
  return PREVIOUS_CHAPTER_JOURNEY['/about'];
}

const REQUIRED_DELTA = 250; // Delta needed to complete top pull gesture

export function ScrollPreviousTrigger() {
  const pathname = usePathname();
  const router = useRouter();
  const prevChapter = useMemo(() => getPreviousChapter(pathname), [pathname]);

  const [progress, setProgress] = useState<number>(0);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
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

  // Execute backward navigation with PageTransition capture or router push
  const triggerTransition = useCallback(() => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    setIsTriggered(true);
    setProgress(100);

    if (linkRef.current) {
      linkRef.current.click();
    } else {
      router.push(prevChapter.href);
    }
  }, [prevChapter.href, router]);

  // Check if user is at the very top of the page
  const checkIfAtTop = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    return scrollY <= 15;
  }, []);

  // Track scroll position to know when at the very top
  useEffect(() => {
    const handleScroll = () => {
      const atTop = checkIfAtTop();
      setIsAtTop(atTop);

      // If user scrolls down into the page, immediately reset any partial pull
      if (!atTop && accumulatedDeltaRef.current > 0) {
        accumulatedDeltaRef.current = 0;
        setProgress(0);
        setIsPulling(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkIfAtTop]);

  // Exponential spring decay animation loop
  useEffect(() => {
    const decayLoop = () => {
      const now = performance.now();
      const timeSinceLastInteraction = now - lastInteractionTimeRef.current;

      if (!isTriggeredRef.current && timeSinceLastInteraction > 90) {
        if (accumulatedDeltaRef.current > 0.5) {
          accumulatedDeltaRef.current = Math.max(0, accumulatedDeltaRef.current * 0.85 - 0.8);
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

  // Handle Wheel Events (Upward Wheel at Top of Page)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTriggeredRef.current) return;
      if (!checkIfAtTop()) return;

      // Scrolling upward while at the top (pulling downwards above the page)
      if (e.deltaY < 0) {
        lastInteractionTimeRef.current = performance.now();
        setIsPulling(true);

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
      } else if (e.deltaY > 0 && accumulatedDeltaRef.current > 0) {
        // Scrolling down cancels the top pull immediately
        accumulatedDeltaRef.current = 0;
        setProgress(0);
        setIsPulling(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [checkIfAtTop, triggerTransition]);

  // Handle Touch Events (Dragging Downwards from Top of Page)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (isTriggeredRef.current) return;
      if (!checkIfAtTop()) return;

      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTriggeredRef.current || touchStartYRef.current === null) return;
      if (!checkIfAtTop()) return;

      const currentY = e.touches[0].clientY;
      const diffY = currentY - touchStartYRef.current; // Positive when pulling DOWN

      if (diffY > 0) {
        lastInteractionTimeRef.current = performance.now();
        setIsPulling(true);

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
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [checkIfAtTop, triggerTransition]);

  // Keyboard accessibility (Up Arrow / Enter when focused)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault();
      triggerTransition();
    }
  };

  // SVG Circle Meter parameters
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <>
      {/* Hidden Navigation Link for PageTransitionProvider Interception */}
      <Link
        ref={linkRef}
        href={prevChapter.href}
        tabIndex={-1}
        aria-hidden="true"
        className="scroll-previous-hidden-link"
      >
        {prevChapter.title}
      </Link>

      {/* Top Pull-Down Canopy Portal */}
      <aside
        ref={containerRef}
        className={`scroll-previous-portal ${isPulling ? 'is-pulling' : ''} ${
          isTriggered ? 'is-triggered' : ''
        } ${isAtTop ? 'is-at-top' : ''}`}
        style={{
          transform: isPulling || isTriggered
            ? `translateY(${Math.min(115, progress * 1.15)}px)`
            : undefined,
        }}
        onClick={triggerTransition}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Scroll up to return to previous chapter: ${prevChapter.title}`}
      >
        <div className="scroll-previous-inner">
          {/* Left Side: Chapter Navigation Telemetry */}
          <div className="scroll-previous-meta">
            <div className="scroll-previous-kicker">
              <span className="scroll-previous-beacon" />
              <span className="scroll-previous-kicker-text">
                {isTriggered
                  ? 'RETURNING TO PREVIOUS SECTOR...'
                  : isPulling
                  ? `REVERSING TO SECTOR ${prevChapter.sector} [ ${Math.round(progress)}% ]`
                  : prevChapter.kicker}
              </span>
            </div>

            <h3 className="scroll-previous-heading">
              {isTriggered ? (
                <span className="scroll-heading-active">
                  Returning to {prevChapter.title}...
                </span>
              ) : (
                <>
                  <ArrowLeft size={22} className="scroll-previous-arrow" />
                  RETURN TO <span className="scroll-heading-highlight">{prevChapter.title}</span>
                </>
              )}
            </h3>

            <p className="scroll-previous-desc">
              {isTriggered
                ? 'Re-establishing continuum sector coordinates.'
                : `${prevChapter.subtitle} · Scroll up or pull down to return.`}
            </p>
          </div>

          {/* Right Side: Radial Scroll-Gesture Dial */}
          <div className="scroll-previous-dial-wrap">
            <div className="scroll-previous-dial">
              <svg
                className="scroll-previous-dial-svg"
                width="64"
                height="64"
                viewBox="0 0 64 64"
              >
                <circle
                  className="scroll-dial-track"
                  cx="32"
                  cy="32"
                  r={radius}
                  strokeWidth="3.5"
                />
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

              <div className="scroll-previous-dial-center">
                {isTriggered ? (
                  <Sparkles size={20} className="scroll-center-icon is-sparkle" />
                ) : (
                  <ChevronUp
                    size={22}
                    className={`scroll-center-icon ${progress > 20 ? 'is-ascending' : ''}`}
                  />
                )}
              </div>
            </div>

            <div className="scroll-previous-gesture-badge">
              <span className="gesture-instruction-text">
                {isTriggered
                  ? 'RELEASE TO LOAD'
                  : isPulling
                  ? `PULL TO RETURN · ${Math.round(progress)}%`
                  : 'SCROLL UP TO RETURN'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Laser Progress Gauge */}
        <div className="scroll-previous-laser-gauge">
          <div
            className="scroll-previous-laser-fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="scroll-previous-laser-glow"
            style={{ left: `${progress}%`, opacity: progress > 3 ? 1 : 0 }}
          />
        </div>
      </aside>

      {/* Subtle Resting Top Cue Strip (Visible when at top of page) */}
      <div
        className={`scroll-previous-top-strip ${isAtTop ? 'is-visible' : ''} ${
          isPulling ? 'is-hidden' : ''
        }`}
        onClick={triggerTransition}
        aria-hidden="true"
      >
        <div className="scroll-previous-strip-content">
          <ChevronUp size={14} className="strip-chevron" />
          <span>SCROLL UP TO RETURN TO {prevChapter.title}</span>
          <span className="strip-sector">[{prevChapter.sector}]</span>
        </div>
      </div>
    </>
  );
}
