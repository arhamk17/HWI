'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { scrollBus } from '@/lib/scrollBus';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionPreference() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function LenisDispatcher() {
  useLenis((lenis) => {
    scrollBus.notify(lenis.scroll, lenis.progress, lenis.velocity);
  });
  return null;
}

function LenisRouteHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
    scrollBus.notify(0, 0, 0);
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false
  );

  return (
    <ReactLenis
      root
      options={{
        lerp: reducedMotion ? 1 : 0.075,
        smoothWheel: !reducedMotion,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      }}
    >
      <LenisDispatcher />
      <LenisRouteHandler />
      {children}
    </ReactLenis>
  );
}
