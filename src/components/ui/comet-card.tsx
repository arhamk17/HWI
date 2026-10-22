'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import './comet-card.css';

export interface DeptColorTheme {
  start: string;
  end: string;
  glow?: string;
  gradient?: string;
}

export interface CometCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number; // Maximum tilt angle in degrees (default: 4.5)
  elevation?: number; // Hover lift in px (default: 8)
  deptTheme?: DeptColorTheme;
  deptId?: string;
  isActive?: boolean;
  disabled?: boolean;
  prefersReducedMotion?: boolean;
  showSheen?: boolean;
  showViewIndicator?: boolean;
  viewIndicatorText?: string;
  onSelect?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
  role?: string;
  tabIndex?: number;
}

/**
 * Floating Circular VIEW Indicator
 * Recreates the translucent circular indicator from HWI reference design.
 */
export function CometCardViewIndicator({
  text = 'VIEW',
  className = '',
  style,
  onClick,
}: {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={`comet-card__view-indicator ${className}`}
      style={style}
      onClick={onClick}
      aria-hidden="true"
    >
      <span className="comet-card__view-text">{text}</span>
    </div>
  );
}

/**
 * CometCard Component
 * Tactile, dimensional 3D card interaction with pointer-responsive tilt,
 * localized dynamic spotlight sheen, and floating circular VIEW indicator.
 *
 * Implements high-performance zero-re-render pointer tracking using CSS variables.
 */
export function CometCard({
  children,
  className = '',
  style,
  maxTilt = 4.5,
  elevation = 8,
  deptTheme,
  deptId,
  isActive = true,
  disabled = false,
  prefersReducedMotion = false,
  showSheen = true,
  showViewIndicator = false,
  viewIndicatorText = 'VIEW',
  onSelect,
  onClick,
  ariaLabel,
  role = 'article',
  tabIndex,
}: CometCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check system prefers-reduced-motion
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const shouldDisableMotion = disabled || prefersReducedMotion || systemReducedMotion;

  const handlePointerEnter = useCallback(() => {
    if (shouldDisableMotion) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsLeaving(false);
    setIsHovered(true);
  }, [shouldDisableMotion]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldDisableMotion) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates: -1 to +1
      const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

      // Calculate subtle restrained 3D rotations
      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      // Update CSS variables directly on DOM node for 120fps smoothness without React re-renders
      card.style.setProperty('--comet-x', `${x.toFixed(1)}px`);
      card.style.setProperty('--comet-y', `${y.toFixed(1)}px`);
      card.style.setProperty('--comet-rx', `${rotX.toFixed(2)}deg`);
      card.style.setProperty('--comet-ry', `${rotY.toFixed(2)}deg`);
      card.style.setProperty('--comet-tz', `${elevation}px`);
      card.style.setProperty('--comet-opacity', '1');

      // Clamped parallax offset for floating VIEW indicator (±8px)
      card.style.setProperty('--comet-view-ox', `${(normX * 8).toFixed(1)}px`);
      card.style.setProperty('--comet-view-oy', `${(normY * 8).toFixed(1)}px`);
    },
    [maxTilt, elevation, shouldDisableMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (shouldDisableMotion) return;
    const card = cardRef.current;
    if (!card) return;

    setIsHovered(false);
    setIsLeaving(true);

    // Reset smoothly to neutral resting position
    card.style.setProperty('--comet-rx', '0deg');
    card.style.setProperty('--comet-ry', '0deg');
    card.style.setProperty('--comet-tz', '0px');
    card.style.setProperty('--comet-opacity', '0');
    card.style.setProperty('--comet-view-ox', '0px');
    card.style.setProperty('--comet-view-oy', '0px');

    leaveTimerRef.current = setTimeout(() => {
      setIsLeaving(false);
    }, 450);
  }, [shouldDisableMotion]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(e);
    if (onSelect) onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      if (onSelect) onSelect();
    }
  };

  const dynamicStyles: React.CSSProperties = {
    ...style,
    ...(deptTheme
      ? {
          '--dept-accent-start': deptTheme.start,
          '--dept-accent-end': deptTheme.end,
          '--dept-glow': deptTheme.glow,
          '--dept-gradient': deptTheme.gradient,
        }
      : {}),
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      className={`comet-card-root ${isHovered ? 'is-hovered' : ''} ${
        isLeaving ? 'is-leaving' : ''
      } ${isActive ? 'is-active' : 'is-stacked'} ${className}`}
      data-dept={deptId}
      data-cursor="default"
      style={dynamicStyles}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={role}
      aria-label={ariaLabel}
      tabIndex={tabIndex ?? (onSelect || onClick ? 0 : undefined)}
    >
      {/* Dynamic Localized Comet Spotlight / Glare Layer */}
      {showSheen && <div className="comet-card__sheen" aria-hidden="true" />}

      {/* Floating Circular VIEW Indicator (optional when placed at root level) */}
      {showViewIndicator && (
        <CometCardViewIndicator
          text={viewIndicatorText}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect();
            else if (onClick) onClick(e);
          }}
        />
      )}

      {children}
    </div>
  );
}
