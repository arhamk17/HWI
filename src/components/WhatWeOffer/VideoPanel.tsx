'use client';

import { forwardRef, useRef, useEffect } from 'react';
import './VideoPanel.css';

export const DEFAULT_OFFER_VIDEO_SRC = '/91562-629172467_medium.mp4';

export interface VideoPanelProps {
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
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

    return (
      <div className={`video-panel ${className}`}>
        <div className="video-panel__frame">
          {/* Header Bar */}
          <div className="video-panel__header">
            <div className="video-panel__dot-group">
              <span className="video-panel__dot video-panel__dot--red" />
              <span className="video-panel__dot video-panel__dot--gray" />
              <span className="video-panel__dot video-panel__dot--gray" />
            </div>
            <span className="video-panel__badge">HWI PREVIEW // CHAPTER 03</span>
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
  }
);
