'use client';

import { useEffect, useState, useRef } from 'react';
import { easterEggStore } from '@/lib/easterEggStore';
import './EasterEgg.css';

export function EasterEgg() {
  const [isActive, setIsActive] = useState(false);
  const keySequenceRef = useRef<string[]>([]);
  const keyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = easterEggStore.subscribe((active) => {
      setIsActive(active);
    });

    // Keyboard sequence listener: H -> W -> I
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea or form
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key.toUpperCase();
      const validKeys = ['H', 'W', 'I'];
      if (!validKeys.includes(key)) {
        keySequenceRef.current = [];
        return;
      }

      if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);
      keyTimeoutRef.current = setTimeout(() => {
        keySequenceRef.current = [];
      }, 1500);

      keySequenceRef.current.push(key);
      const seq = keySequenceRef.current.join('');

      if (seq === 'HWI') {
        keySequenceRef.current = [];
        easterEggStore.trigger();
      } else if (!'HWI'.startsWith(seq)) {
        keySequenceRef.current = [key];
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyTimeoutRef.current) clearTimeout(keyTimeoutRef.current);
      unsub();
    };
  }, []);

  return (
    <div
      className={`hwi-easter-egg ${isActive ? 'hwi-easter-egg--active' : ''}`}
      aria-hidden={!isActive}
    >
      <div className="hwi-easter-egg__content">
        <div className="hwi-easter-egg__monogram">HWI</div>
        <div className="hwi-easter-egg__title">HACK WITH INDIA</div>
        <div className="hwi-easter-egg__line" />
        <div className="hwi-easter-egg__tag">INNOVATE • CREATE • ELEVATE</div>
      </div>
    </div>
  );
}
