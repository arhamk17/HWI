'use client';

import React, { useRef, useState } from 'react';
import './KokonutUI.css';

interface KokonutCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}

export function KokonutCard({
  children,
  className = '',
  style,
  glow = true,
}: KokonutCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !glow) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`kokonut-card ${isHovered ? 'kokonut-card--hovered' : ''} ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {glow && (
        <div
          className="kokonut-card__spotlight"
          style={{
            transform: `translate(${mousePos.x - 150}px, ${mousePos.y - 150}px)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
      <div className="kokonut-card__border" />
      <div className="kokonut-card__content">{children}</div>
    </div>
  );
}
