'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './PageTransition.css';

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If path changed and not initial render
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return;
      }

      setIsTransitioning(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 550);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return (
    <>
      {/* Cinematic Transition Veil */}
      <div
        className={`page-transition-veil ${isTransitioning ? 'page-transition-veil--active' : ''}`}
        aria-hidden="true"
      >
        <div className="page-transition-veil__glyph">
          <span className="page-transition-veil__logo">HWI</span>
          <div className="page-transition-veil__bar" />
        </div>
      </div>

      {/* Page Content with key to re-trigger enter animation on path change */}
      <div key={pathname} className="page-transition-content">
        {children}
      </div>
    </>
  );
}
