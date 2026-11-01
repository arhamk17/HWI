'use client';

import React, { useState } from 'react';
import './TextRoll.css';

export interface TextRollProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  style?: React.CSSProperties;
  duration?: number;
  stagger?: number;
  delay?: number;
  replayOnHover?: boolean;
}

export function TextRoll({
  text,
  className = '',
  as: Component = 'span',
  style,
  duration = 0.46,
  stagger = 0.024,
  delay = 0.04,
  replayOnHover = true,
}: TextRollProps) {
  const [rollKey, setRollKey] = useState(0);

  // Split text into words to preserve word-wrapping on smaller screens
  const words = text.split(' ').filter(Boolean);

  // Compute character offset per word so animation ripples continuously across the entire name
  let globalCharCount = 0;
  const wordsWithOffsets = words.map((word) => {
    const startIdx = globalCharCount;
    globalCharCount += word.length;
    return {
      word,
      letters: word.split(''),
      startIdx,
    };
  });

  return (
    <Component
      className={`text-roll ${className}`}
      style={style}
      aria-label={text}
      role="text"
      onMouseEnter={() => {
        if (replayOnHover) {
          setRollKey((k) => k + 1);
        }
      }}
    >
      <span key={rollKey} className="text-roll__inner">
        {wordsWithOffsets.map(({ word, letters, startIdx }, wordIdx) => (
          <React.Fragment key={`w-${wordIdx}`}>
            <span className="text-roll__word" aria-hidden="true">
              <span className="text-roll__ghost">{word}</span>
              <span className="text-roll__layer text-roll__layer--outgoing">
                {letters.map((char, lIdx) => (
                  <span
                    key={`out-${lIdx}`}
                    className="text-roll__char text-roll__char--outgoing"
                    style={{
                      animationDelay: `${delay + (startIdx + lIdx) * stagger}s`,
                      animationDuration: `${duration}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              <span className="text-roll__layer text-roll__layer--incoming">
                {letters.map((char, lIdx) => (
                  <span
                    key={`in-${lIdx}`}
                    className="text-roll__char text-roll__char--incoming"
                    style={{
                      animationDelay: `${delay + (startIdx + lIdx) * stagger}s`,
                      animationDuration: `${duration}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>

            {wordIdx < wordsWithOffsets.length - 1 && (
              <span className="text-roll__spacer" aria-hidden="true">
                &nbsp;
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    </Component>
  );
}
