'use client';

import { forwardRef, useRef, useEffect } from 'react';
import Link from 'next/link';
import './VideoPanel.css';

export const DEFAULT_OFFER_VIDEO_SRC = '/91562-629172467_medium.mp4';

export interface VideoPanelProps {
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  href?: string;
  onTimeUpdate?: (currentTime: number, duration: number, progress: number) => void;
  onEnded?: () => void;
  onError?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '--:--';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const m = mins < 10 ? `0${mins}` : `${mins}`;
  const s = secs < 10 ? `0${secs}` : `${secs}`;
  if (hrs > 0) {
    const h = hrs < 10 ? `0${hrs}` : `${hrs}`;
    return `${h}:${m}:${s}`;
  }
  return `${m}:${s}`;
}

export const VideoPanel = forwardRef<HTMLVideoElement, VideoPanelProps>(
  function VideoPanel(
    {
      src = DEFAULT_OFFER_VIDEO_SRC,
      poster,
      className = '',
      autoPlay = true,
      loop = true,
      href,
      onTimeUpdate,
      onEnded,
      onError,
    },
    forwardedRef
  ) {
    const internalVideoRef = useRef<HTMLVideoElement | null>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const timerTextRef = useRef<HTMLSpanElement>(null);

    const setRefs = (el: HTMLVideoElement | null) => {
      internalVideoRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
      }
    };

    // Guarantee independent autoplay on mount
    useEffect(() => {
      const vid = internalVideoRef.current;
      if (!vid) return;
      vid.muted = true;
      vid.playsInline = true;
      if (autoPlay) {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const onFirstInteraction = () => {
              vid.play().catch(() => {});
              window.removeEventListener('click', onFirstInteraction);
              window.removeEventListener('touchstart', onFirstInteraction);
            };
            window.addEventListener('click', onFirstInteraction, { once: true });
            window.addEventListener('touchstart', onFirstInteraction, { once: true });
          });
        }
      }
    }, [autoPlay]);

    const handleTimeUpdate = () => {
      const vid = internalVideoRef.current;
      if (!vid) return;
      const cur = vid.currentTime || 0;
      const dur = vid.duration && !isNaN(vid.duration) && vid.duration > 0 ? vid.duration : 0;
      const p = dur > 0 ? Math.min(1, Math.max(0, cur / dur)) : 0;

      // Direct DOM updates: ZERO React re-renders per frame
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      }
      if (timerTextRef.current) {
        timerTextRef.current.textContent = dur > 0
          ? `${formatTime(cur)} / ${formatTime(dur)}`
          : '--:-- / --:--';
      }

      onTimeUpdate?.(cur, dur, p);
    };

    const handleLoadedMetadata = () => {
      const vid = internalVideoRef.current;
      if (!vid) return;
      const cur = vid.currentTime || 0;
      const dur = vid.duration && !isNaN(vid.duration) && vid.duration > 0 ? vid.duration : 0;
      if (timerTextRef.current) {
        timerTextRef.current.textContent = dur > 0
          ? `${formatTime(cur)} / ${formatTime(dur)}`
          : '--:-- / --:--';
      }
    };

    const content = (
      <div className={`video-panel ${href ? 'video-panel--interactive' : ''} ${className}`}>
        <div className="video-panel__frame">
          {/* Subtle light sweep shimmer */}
          <div className="video-panel__shimmer" aria-hidden="true" />

          {/* Header Bar */}
          <div className="video-panel__header">
            <div className="video-panel__dot-group">
              <span className="video-panel__dot video-panel__dot--red" />
              <span className="video-panel__dot video-panel__dot--gray" />
              <span className="video-panel__dot video-panel__dot--gray" />
            </div>
            <div className="video-panel__badge-group">
              <span className="video-panel__badge">HWI PREVIEW // CHAPTER 03</span>
              {href && (
                <span className="video-panel__cta-badge">
                  <span>ABOUT HWI</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              )}
            </div>
          </div>

          {/* Video Container */}
          <div className="video-panel__media-wrap">
            <video
              ref={setRefs}
              src={src}
              poster={poster}
              playsInline
              muted
              autoPlay={autoPlay}
              loop={loop}
              preload="auto"
              className="video-panel__video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onSeeked={handleTimeUpdate}
              onEnded={onEnded}
              onError={onError}
            />
            {/* Subtle cinematic overlay gradient */}
            <div className="video-panel__overlay" />

            {/* Hover Floating Pill Prompt */}
            {href && (
              <div className="video-panel__hover-pill" aria-hidden="true">
                <span className="video-panel__hover-pill-dot" />
                <span>EXPLORE ABOUT HWI</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            )}
          </div>

          {/* Real-time Video Progress Bar */}
          <div className="video-panel__progress-bar">
            <div
              className="video-panel__progress-fill"
              ref={progressFillRef}
              style={{ width: '0%' }}
            />
          </div>

          {/* Footer Bar */}
          <div className="video-panel__footer">
            <div className="video-panel__status-wrap">
              <span className="video-panel__status">
                PLAYING • 1.0X
              </span>
            </div>
            <div className="video-panel__timer-wrap">
              <span className="video-panel__timer" ref={timerTextRef}>
                --:-- / --:--
              </span>
            </div>
          </div>
        </div>
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="video-panel__link" title="Explore About HWI">
          {content}
        </Link>
      );
    }

    return content;
  }
);
