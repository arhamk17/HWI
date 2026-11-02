'use client';

import { startTransition, useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './PageTransition.css';

type TransitionStage = 'idle' | 'departure' | 'covered' | 'arrival';

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [stage, setStage] = useState<TransitionStage>('idle');
  const [destTitle, setDestTitle] = useState<string>('CONVERGENCE');
  const [destSector, setDestSector] = useState<string>('01');
  const [dispScale, setDispScale] = useState<number>(0);

  const isTransitioningRef = useRef<boolean>(false);
  const routeReadyRef = useRef<boolean>(false);
  const arrivalStartedRef = useRef<boolean>(false);
  const prevPathRef = useRef<string>(pathname);
  const animFrameRef = useRef<number | null>(null);

  const departureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coveredSafetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrivalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (departureTimerRef.current) clearTimeout(departureTimerRef.current);
    if (coveredSafetyTimerRef.current) clearTimeout(coveredSafetyTimerRef.current);
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Compute destination metadata for the liquid distortion typography
  const getDestinationMeta = useCallback((href: string) => {
    if (href === '/') {
      return { title: 'HACK WITH INDIA', sector: '01' };
    } else if (href.startsWith('/about')) {
      return { title: 'ABOUT // THE CHAPTER', sector: '02' };
    } else if (href.startsWith('/events')) {
      return { title: 'EVENTS // ARCHIVE & DISPATCH', sector: '03' };
    } else if (href.startsWith('/team')) {
      return { title: 'TEAMS // CHAPTER ROSTER', sector: '04' };
    } else if (href.startsWith('/join')) {
      return { title: 'JOIN // PASS PROTOCOL', sector: '05' };
    } else if (href.startsWith('/tenure')) {
      return { title: 'TENURE 2025–26 // ARCHIVE', sector: '04.B' };
    }
    const clean = href.replace(/^\//, '').split('/')[0].toUpperCase();
    return { title: clean, sector: '00' };
  }, []);

  // Smoothly animate the SVG filter feDisplacementMap scale
  const animateDisplacement = useCallback((startVal: number, endVal: number, durationMs: number, onDone?: () => void) => {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Quad ease out
      const eased = 1 - Math.pow(1 - progress, 2);
      const currentScale = startVal + (endVal - startVal) * eased;
      setDispScale(Math.round(currentScale * 10) / 10);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        if (onDone) onDone();
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  const startArrival = useCallback(() => {
    if (arrivalStartedRef.current) return;

    arrivalStartedRef.current = true;
    if (coveredSafetyTimerRef.current) {
      clearTimeout(coveredSafetyTimerRef.current);
      coveredSafetyTimerRef.current = null;
    }

    setStage('arrival');
    animateDisplacement(45, 0, 210);
    arrivalTimerRef.current = setTimeout(() => {
      setStage('idle');
      isTransitioningRef.current = false;
      arrivalStartedRef.current = false;
    }, 230);
  }, [animateDisplacement]);

  // Coordinated 3-stage fluid distortion navigation
  const triggerTransition = useCallback((href: string) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      router.push(href);
      return;
    }

    clearTimers();
    isTransitioningRef.current = true;
    routeReadyRef.current = false;
    arrivalStartedRef.current = false;

    const { title, sector } = getDestinationMeta(href);
    setDestTitle(title);
    setDestSector(sector);

    // Start loading the destination while the departure animation plays.
    setStage('departure');
    animateDisplacement(0, 52, 210);
    router.push(href);

    departureTimerRef.current = setTimeout(() => {
      departureTimerRef.current = null;
      setStage('covered');

      if (routeReadyRef.current) {
        startArrival();
      } else {
        coveredSafetyTimerRef.current = setTimeout(startArrival, 550);
      }
    }, 230);
  }, [router, clearTimers, getDestinationMeta, animateDisplacement, startArrival]);

  // Global capture click listener for internal navigation links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      if (
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('#')
      ) {
        return;
      }

      const targetUrl = new URL(rawHref, window.location.href);

      // Don't re-trigger if already on identical page
      if (
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search
      ) {
        if (targetUrl.hash) return;
        e.preventDefault();
        return;
      }

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      triggerTransition(targetUrl.pathname + targetUrl.search);
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [triggerTransition]);

  // Route change completion listener (handles both router.push and browser back/forward popstate)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      // Reset scroll position to top
      window.scrollTo(0, 0);

      if (isTransitioningRef.current) {
        routeReadyRef.current = true;
        if (departureTimerRef.current === null) {
          startArrival();
        }
      } else {
        // Back/forward navigation (popstate)
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced) {
          const { title, sector } = getDestinationMeta(pathname);
          startTransition(() => {
            setDestTitle(title);
            setDestSector(sector);
            setStage('arrival');
          });
          animateDisplacement(35, 0, 210);

          const popTimer = setTimeout(() => {
            setStage('idle');
          }, 230);
          return () => clearTimeout(popTimer);
        }
      }
    }
  }, [pathname, getDestinationMeta, animateDisplacement, startArrival]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <>
      {/* ─── Global SVG Displacement Filter Definition ─── */}
      <svg className="fluid-filter-svg" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="hwi-fluid-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.042"
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="1.4s"
                values="0.012 0.035; 0.024 0.065; 0.015 0.042"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={dispScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* ─── Fluid Distortion Page Transition Overlay ─── */}
      <div
        className={`fluid-transition-overlay stage-${stage}`}
        aria-hidden={stage === 'idle'}
      >
        {/* Organic Flowing Liquid Waves */}
        <svg
          className="fluid-waves-svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Layer 1: Translucent Leading Fluid Crest with HWI Red Meniscus & Outer Glow */}
          <path
            className="fluid-wave fluid-wave--accent"
            d="M 0 520 Q 250 320 500 540 Q 750 760 1000 420 L 1000 1000 L 0 1000 Z"
          />
          {/* Layer 2: Deep Charcoal Viscous Wave Body */}
          <path
            className="fluid-wave fluid-wave--body"
            d="M 0 580 Q 250 400 500 600 Q 750 800 1000 500 L 1000 1000 L 0 1000 Z"
          />
          {/* Layer 3: Obsidian Core Liquid Mass (Fully Conceals Screen) */}
          <path
            className="fluid-wave fluid-wave--main"
            d="M 0 650 Q 250 480 500 680 Q 750 880 1000 580 L 1000 1000 L 0 1000 Z"
          />
        </svg>

        {/* ─── Liquified Typography & HUD Accent ─── */}
        <div className="fluid-hud-container">
          {/* Distorted Bold Typography Wordmark */}
          <div
            className="fluid-hud-typography"
            style={{
              filter: stage !== 'idle' ? 'url(#hwi-fluid-filter)' : 'none',
            }}
          >
            <div className="fluid-hud-watermark" aria-hidden="true">
              HACK WITH INDIA
            </div>

            <div className="fluid-hud-content">
              <div className="fluid-hud-badge">
                <span className="fluid-hud-pulse-dot" />
                <span className="fluid-hud-protocol">PROTOCOL // SECTOR {destSector}</span>
              </div>

              <div className="fluid-hud-destination">{destTitle}</div>

              <div className="fluid-hud-bar">
                <div className="fluid-hud-bar-fill" />
              </div>

              <div className="fluid-hud-subtext">HACKWITHINDIA BVUDET-NM</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Outgoing / Incoming Page Content ─── */}
      <div
        key={pathname}
        className={`page-transition-content stage-${stage}`}
      >
        {children}
      </div>
    </>
  );
}
