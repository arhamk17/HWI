'use client';

import { useEffect } from 'react';
import { easterEggStore } from '@/lib/easterEggStore';

export function InteractiveEffects() {
  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) {
      // Setup mobile easter egg: tap logo 5 times in 2s
      let tapCount = 0;
      let tapTimer: ReturnType<typeof setTimeout> | null = null;

      const handleLogoTap = (e: MouseEvent) => {
        const logo = (e.target as HTMLElement).closest('.navbar__logo');
        if (logo) {
          tapCount++;
          if (tapTimer) clearTimeout(tapTimer);
          tapTimer = setTimeout(() => {
            tapCount = 0;
          }, 2000);

          if (tapCount >= 5) {
            tapCount = 0;
            easterEggStore.trigger();
          }
        }
      };

      window.addEventListener('click', handleLogoTap);
      return () => {
        window.removeEventListener('click', handleLogoTap);
        if (tapTimer) clearTimeout(tapTimer);
      };
    }

    // DESKTOP: Magnetic buttons & Card tilt
    // 1. Magnetic Buttons
    const handleMagneticMove = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest(
        '.btn--primary, .navbar__cta-btn, .magnetic-btn'
      ) as HTMLElement | null;

      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Limit magnetic movement to max 6px
      const maxMove = 6;
      const moveX = Math.max(-maxMove, Math.min(maxMove, dx * 0.22));
      const moveY = Math.max(-maxMove, Math.min(maxMove, dy * 0.22));

      btn.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
      btn.style.transition = 'transform 0.1s ease-out';
    };

    const handleMagneticLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.classList?.contains('btn--primary') ||
        target.classList?.contains('navbar__cta-btn') ||
        target.classList?.contains('magnetic-btn')
      ) {
        target.style.transform = 'translate3d(0, 0, 0)';
        target.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    };

    // 2. Card 3D Tilt (Selective: stat cards and event row cards only)
    const handleCardTilt = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.stat-card, .event-row-card') as HTMLElement | null;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Max 3.5 degrees
      const rotX = -relY * 5;
      const rotY = relX * 5;

      card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`;
      card.style.transition = 'transform 0.1s ease-out';
    };

    const handleCardLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.stat-card, .event-row-card') as HTMLElement | null;
      if (target) {
        target.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        target.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    };

    // 3. Desktop easter egg tap support on logo
    let logoClickCount = 0;
    let logoTimer: ReturnType<typeof setTimeout> | null = null;
    const handleLogoClick = (e: MouseEvent) => {
      const logo = (e.target as HTMLElement).closest('.navbar__logo');
      if (logo) {
        logoClickCount++;
        if (logoTimer) clearTimeout(logoTimer);
        logoTimer = setTimeout(() => {
          logoClickCount = 0;
        }, 2000);

        if (logoClickCount >= 5) {
          logoClickCount = 0;
          easterEggStore.trigger();
        }
      }
    };

    window.addEventListener('mousemove', handleMagneticMove, { passive: true });
    window.addEventListener('mouseout', handleMagneticLeave, { passive: true });
    window.addEventListener('mousemove', handleCardTilt, { passive: true });
    window.addEventListener('mouseout', handleCardLeave, { passive: true });
    window.addEventListener('click', handleLogoClick);

    return () => {
      window.removeEventListener('mousemove', handleMagneticMove);
      window.removeEventListener('mouseout', handleMagneticLeave);
      window.removeEventListener('mousemove', handleCardTilt);
      window.removeEventListener('mouseout', handleCardLeave);
      window.removeEventListener('click', handleLogoClick);
      if (logoTimer) clearTimeout(logoTimer);
    };
  }, []);

  return null;
}
