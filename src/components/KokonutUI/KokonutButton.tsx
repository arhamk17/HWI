'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import './KokonutUI.css';

interface KokonutButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'dark' | 'glow';
  className?: string;
  style?: React.CSSProperties;
}

export function KokonutButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  style,
}: KokonutButtonProps) {
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const combinedClass = `kokonut-btn kokonut-btn--${variant} magnetic-btn ${className}`;

  const inner = (
    <>
      <span className="kokonut-btn__glow" style={{ left: `${coords.x}%`, top: `${coords.y}%` }} />
      <span className="kokonut-btn__shimmer" />
      <span className="kokonut-btn__content">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={btnRef}
        className={combinedClass}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        data-cursor="link"
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={btnRef}
      className={combinedClass}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
