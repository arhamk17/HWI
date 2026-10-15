'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { scrollBus } from '@/lib/scrollBus';

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
      <LenisRouteHandler />
      {children}
    </ReactLenis>
  );
}
