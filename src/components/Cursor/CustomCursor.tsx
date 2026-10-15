'use client';

import { useEffect, useRef, useState } from 'react';
import { cursorStore, CursorVariant } from '@/lib/cursorStore';
import './CustomCursor.css';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Disable on touch devices or coarse pointer
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) return;

    setMounted(true);
    document.documentElement.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Dynamic element hover detector
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if over input/textarea/editable
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        setIsOverInput(true);
        return;
      } else {
        setIsOverInput(false);
      }

      // 1. Explicit data-cursor
      const cursorAttr = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorAttr) {
        const val = cursorAttr.getAttribute('data-cursor') as CursorVariant;
        const customText = cursorAttr.getAttribute('data-cursor-label');
        if (val) {
          cursorStore.setVariant(val, customText || undefined);
          return;
        }
      }

      // 2. Team member face or card
      if (target.closest('.team-member-face') || target.closest('[data-team-face]')) {
        cursorStore.setVariant('team', 'VIEW');
        return;
      }

      // 3. Event card
      if (target.closest('.event-card-interactive') || target.closest('[data-event-card]')) {
        cursorStore.setVariant('event', 'EXPLORE');
        return;
      }

      // 4. External links
      const link = target.closest('a') as HTMLAnchorElement | null;
      if (link) {
        if (link.target === '_blank' || link.rel?.includes('noopener')) {
          cursorStore.setVariant('external');
        } else {
          cursorStore.setVariant('link');
        }
        return;
      }

      // 5. Buttons
      if (target.closest('button') || target.closest('.btn') || target.closest('[role="button"]')) {
        cursorStore.setVariant('link');
        return;
      }

      // 6. Interactive images
      if (target.closest('img') || target.closest('.interactive-image')) {
        cursorStore.setVariant('image');
        return;
      }

      // 7. Large headings & titles
      if (
        target.closest('.type-display') ||
        target.closest('.type-intro') ||
        target.closest('.type-heading-1') ||
        target.closest('h1') ||
        target.closest('h2')
      ) {
        cursorStore.setVariant('text');
        return;
      }

      cursorStore.reset();
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Store subscription
    const unsubscribe = cursorStore.subscribe((newVariant, customLabel) => {
      setVariant(newVariant);
      setLabel(customLabel || '');
    });

    // 60FPS fluid physics loop with subtle lag/inertia
    const loop = () => {
      const pos = posRef.current;
      pos.x += (pos.targetX - pos.x) * 0.22;
      pos.y += (pos.targetY - pos.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafRef.current);
      unsubscribe();
    };
  }, [isVisible]);

  if (!mounted) return null;

  let displayContent: React.ReactNode = null;
  if (label) {
    displayContent = <span className="hwi-cursor__label">{label}</span>;
  } else if (variant === 'link') {
    displayContent = <span className="hwi-cursor__label">↗</span>;
  } else if (variant === 'image') {
    displayContent = <span className="hwi-cursor__label">VIEW</span>;
  } else if (variant === 'team') {
    displayContent = <span className="hwi-cursor__label">VIEW</span>;
  } else if (variant === 'event') {
    displayContent = <span className="hwi-cursor__label">EXPLORE</span>;
  } else if (variant === 'external') {
    displayContent = <span className="hwi-cursor__label">↗ OPEN</span>;
  }

  const shouldBeVisible = isVisible && !isOverInput;

  return (
    <div
      className={`hwi-cursor hwi-cursor--${variant}`}
      ref={cursorRef}
      style={{ opacity: shouldBeVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="hwi-cursor__follower">
        <span className="hwi-cursor__dot" />
        {displayContent}
      </div>
    </div>
  );
}
