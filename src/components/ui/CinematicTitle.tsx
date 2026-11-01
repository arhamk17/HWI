'use client';

import React from 'react';
import './CinematicTitle.css';

interface CinematicTitleProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  style?: React.CSSProperties;
}

export function CinematicTitle({
  text,
  className = '',
  as: Component = 'h1',
  style,
}: CinematicTitleProps) {
  const words = text.split(' ').filter(Boolean);

  return (
    <Component className={`cinematic-title ${className}`} style={style} aria-label={text}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="cinematic-title__mask" aria-hidden="true">
          <span
            className="cinematic-title__word"
            style={{
              animationDelay: `${idx * 0.06}s`,
            }}
          >
            {word}
          </span>
          {idx < words.length - 1 && <span className="cinematic-title__spacer">&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
}
