'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { scrollBus } from '@/lib/scrollBus';
import { introStore } from '@/lib/introStore';

function LenisDispatcher() {
  useLenis((lenis) => {
    scrollBus.notify(lenis.scroll, lenis.progress, lenis.velocity);
  });
  return null;
}

function LenisController() {
  const pathname = usePathname();
  const lenis = useLenis();

  // 1. Immediate document scroll reset & manual scroll restoration configuration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const resetScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      scrollBus.notify(0, 0, 0);
    };

    // Reset immediately on mount
    resetScrollToTop();

    // Ensure bfcache & browser reload events initialize from top
    window.addEventListener('pageshow', resetScrollToTop);
    return () => {
      window.removeEventListener('pageshow', resetScrollToTop);
    };
  }, []);

  // 2. Synchronize Lenis instance with scroll position & route changes
  useEffect(() => {
    if (!lenis) return;

    // Reset scroll position to top immediately
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    scrollBus.notify(0, 0, 0);

    // If on homepage and the multilingual intro is actively playing, lock scroll until finished
    if (pathname === '/' && !introStore.isComplete) {
      lenis.stop();

      const unsubscribe = introStore.subscribe(() => {
        lenis.start();
        lenis.scrollTo(0, { immediate: true });
        scrollBus.notify(0, 0, 0);
      });

      // Safety timeout: never leave scrolling locked if intro is interrupted
      const safety = setTimeout(() => {
        lenis.start();
      }, 8500);

      return () => {
        unsubscribe();
        clearTimeout(safety);
        lenis.start();
      };
    } else {
      // On any other page or when intro is already complete, ensure Lenis is active
      lenis.start();
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: reducedMotion ? 0.1 : 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !reducedMotion,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      }}
    >
      <LenisDispatcher />
      <LenisController />
      {children}
    </ReactLenis>
  );
}
