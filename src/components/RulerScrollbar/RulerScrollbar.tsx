'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { scrollBus } from '@/lib/scrollBus';
import { introStore } from '@/lib/introStore';
import { useState } from 'react';
import './RulerScrollbar.css';

const THUMB_HEIGHT = 28; // Height of the vertical red thumb capsule in px
const PADDING_Y = 3;     // Vertical padding inside each pill track in px

export function RulerScrollbar() {
  const [isVisible, setIsVisible] = useState(() => introStore.isComplete);
  const leftTrackRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const leftThumbRef = useRef<HTMLDivElement>(null);
  const rightThumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const activeIslandRef = useRef<'left' | 'right' | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (introStore.isComplete) {
      setIsVisible(true);
      return;
    }
    const unsub = introStore.subscribe((phase) => {
      if (phase === 'complete') {
        setIsVisible(true);
      }
    });
    return () => {
      unsub();
    };
  }, []);

  // Position thumbs along both vertical tracks in lockstep using translate3d for 60/120fps
  const setThumbPosition = useCallback((progress: number) => {
    const p = Math.min(1, Math.max(0, progress));
    const ariaValue = Math.round(p * 100).toString();

    // Left island thumb
    if (leftTrackRef.current && leftThumbRef.current) {
      const trackHeight = leftTrackRef.current.clientHeight;
      const usableHeight = Math.max(0, trackHeight - THUMB_HEIGHT - 2 * PADDING_Y);
      const y = PADDING_Y + p * usableHeight;
      leftThumbRef.current.style.transform = `translate3d(-50%, ${y}px, 0)`;
      leftThumbRef.current.setAttribute('aria-valuenow', ariaValue);
    }

    // Right island thumb
    if (rightTrackRef.current && rightThumbRef.current) {
      const trackHeight = rightTrackRef.current.clientHeight;
      const usableHeight = Math.max(0, trackHeight - THUMB_HEIGHT - 2 * PADDING_Y);
      const y = PADDING_Y + p * usableHeight;
      rightThumbRef.current.style.transform = `translate3d(-50%, ${y}px, 0)`;
      rightThumbRef.current.setAttribute('aria-valuenow', ariaValue);
    }
  }, []);

  // Subscribe to centralized Lenis scrollBus
  useEffect(() => {
    const unsubscribe = scrollBus.subscribe((_scrollY, progress) => {
      if (!isDraggingRef.current) {
        setThumbPosition(progress);
      }
    });

    return () => unsubscribe();
  }, [setThumbPosition]);

  // Window resize & layout shift listener to keep indicators accurate
  useEffect(() => {
    const handleResize = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
      setThumbPosition(progress);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Also observe document.body for dynamic content height changes
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    if (document.body) {
      ro.observe(document.body);
    }

    // Initial positioning
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
    };
  }, [setThumbPosition]);

  // Native scroll listener fallback in case Lenis is not yet active
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (isDraggingRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
          setThumbPosition(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setThumbPosition]);

  // Global pointer release safety
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        leftTrackRef.current?.classList.remove('is-dragging');
        rightTrackRef.current?.classList.remove('is-dragging');
        isDraggingRef.current = false;
        activeIslandRef.current = null;
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  // Calculate target scroll from clientY coordinate on the target island track
  const scrollToClientY = useCallback((clientY: number, track: HTMLDivElement | null, immediate: boolean) => {
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickY = clientY - rect.top;
    const usableHeight = Math.max(1, rect.height - THUMB_HEIGHT - 2 * PADDING_Y);
    const progress = Math.min(1, Math.max(0, (clickY - PADDING_Y - THUMB_HEIGHT / 2) / usableHeight));

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetScroll = progress * maxScroll;

    setThumbPosition(progress);

    if (lenis) {
      lenis.scrollTo(targetScroll, { immediate });
    } else {
      if (immediate) {
        window.scrollTo(0, targetScroll);
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }, [lenis, setThumbPosition]);

  // Pointer interactions (drag and click on either island)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, side: 'left' | 'right') => {
    if (e.button !== 0) return; // Only primary mouse button
    e.preventDefault();

    const track = side === 'left' ? leftTrackRef.current : rightTrackRef.current;
    if (!track) return;

    try {
      track.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    activeIslandRef.current = side;

    // Both islands show active/dragging indicator
    leftTrackRef.current?.classList.add('is-dragging');
    rightTrackRef.current?.classList.add('is-dragging');

    scrollToClientY(e.clientY, track, true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, side: 'left' | 'right') => {
    if (!isDraggingRef.current || activeIslandRef.current !== side) return;
    e.preventDefault();
    const track = side === 'left' ? leftTrackRef.current : rightTrackRef.current;
    scrollToClientY(e.clientY, track, true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, side: 'left' | 'right') => {
    if (!isDraggingRef.current) return;
    const track = side === 'left' ? leftTrackRef.current : rightTrackRef.current;
    if (track) {
      try {
        track.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    leftTrackRef.current?.classList.remove('is-dragging');
    rightTrackRef.current?.classList.remove('is-dragging');
    isDraggingRef.current = false;
    activeIslandRef.current = null;
  };

  // Keyboard navigation when thumb has focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (maxScroll <= 0) return;

    let targetScroll = window.scrollY || document.documentElement.scrollTop;
    const step = maxScroll * 0.05; // 5% jump
    const pageStep = window.innerHeight * 0.8;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        targetScroll = Math.max(0, targetScroll - step);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        targetScroll = Math.min(maxScroll, targetScroll + step);
        break;
      case 'PageUp':
        targetScroll = Math.max(0, targetScroll - pageStep);
        break;
      case 'PageDown':
        targetScroll = Math.min(maxScroll, targetScroll + pageStep);
        break;
      case 'Home':
        targetScroll = 0;
        break;
      case 'End':
        targetScroll = maxScroll;
        break;
      default:
        return;
    }

    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.5 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* ─── Left Ruler Scroll Island ─── */}
      <div
        ref={leftTrackRef}
        className="ruler-island ruler-island--left"
        onPointerDown={(e) => handlePointerDown(e, 'left')}
        onPointerMove={(e) => handlePointerMove(e, 'left')}
        onPointerUp={(e) => handlePointerUp(e, 'left')}
        onPointerCancel={(e) => handlePointerUp(e, 'left')}
        title="Scroll Ruler — Left Island (Click or drag to navigate)"
        aria-hidden="true"
      >
        <svg
          className="ruler-island__ticks"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hwi-ruler-tick-left"
              width="14"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              {/* Major tick (every 32px) */}
              <line
                x1="2"
                y1="0"
                x2="12"
                y2="0"
                stroke="rgba(255, 255, 255, 0.42)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              {/* Minor tick at 8px */}
              <line
                x1="5"
                y1="8"
                x2="9"
                y2="8"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              {/* Medium tick at 16px */}
              <line
                x1="3.5"
                y1="16"
                x2="10.5"
                y2="16"
                stroke="rgba(255, 255, 255, 0.28)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              {/* Minor tick at 24px */}
              <line
                x1="5"
                y1="24"
                x2="9"
                y2="24"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hwi-ruler-tick-left)" />
        </svg>

        <div
          ref={leftThumbRef}
          className="ruler-island__thumb"
          role="scrollbar"
          aria-controls="__next"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-label="Website Scroll Ruler (Left)"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <span className="ruler-island__thumb-pip" aria-hidden="true" />
        </div>
      </div>

      {/* ─── Right Ruler Scroll Island ─── */}
      <div
        ref={rightTrackRef}
        className="ruler-island ruler-island--right"
        onPointerDown={(e) => handlePointerDown(e, 'right')}
        onPointerMove={(e) => handlePointerMove(e, 'right')}
        onPointerUp={(e) => handlePointerUp(e, 'right')}
        onPointerCancel={(e) => handlePointerUp(e, 'right')}
        title="Scroll Ruler — Right Island (Click or drag to navigate)"
        aria-hidden="true"
      >
        <svg
          className="ruler-island__ticks"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hwi-ruler-tick-right"
              width="14"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              {/* Major tick (every 32px) */}
              <line
                x1="2"
                y1="0"
                x2="12"
                y2="0"
                stroke="rgba(255, 255, 255, 0.42)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              {/* Minor tick at 8px */}
              <line
                x1="5"
                y1="8"
                x2="9"
                y2="8"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              {/* Medium tick at 16px */}
              <line
                x1="3.5"
                y1="16"
                x2="10.5"
                y2="16"
                stroke="rgba(255, 255, 255, 0.28)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              {/* Minor tick at 24px */}
              <line
                x1="5"
                y1="24"
                x2="9"
                y2="24"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hwi-ruler-tick-right)" />
        </svg>

        <div
          ref={rightThumbRef}
          className="ruler-island__thumb"
          role="scrollbar"
          aria-controls="__next"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-label="Website Scroll Ruler (Right)"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <span className="ruler-island__thumb-pip" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
