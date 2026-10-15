'use client';

import React from 'react';
import './KokonutUI.css';

interface KokonutBadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'secondary' | 'outline' | 'pulse';
  className?: string;
  dot?: boolean;
}

export function KokonutBadge({
  children,
  variant = 'accent',
  className = '',
  dot = false,
}: KokonutBadgeProps) {
  return (
    <span className={`kokonut-badge kokonut-badge--${variant} ${className}`}>
      {dot && <span className="kokonut-badge__dot" />}
      {children}
    </span>
  );
}
