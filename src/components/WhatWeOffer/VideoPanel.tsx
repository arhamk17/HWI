'use client';

import { forwardRef, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CinematicVideoModal,
  Skiper67PlayCursor,
} from '@/components/ui/skiper67';
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
    const mediaWrapRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const timerTextRef = useRef<HTMLSpanElement>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialTime, setModalInitialTime] = useState(0);
    const [originRect, setOriginRect] = useState<{
      top: number;
      left: number;
      width: number;
      height: number;
    } | null>(null);

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

    // Pointer-following Play indicator handlers (Zero React state updates)
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      e.currentTarget.style.setProperty('--play-x', `${x}px`);
      e.currentTarget.style.setProperty('--play-y', `${y}px`);
      e.currentTarget.style.setProperty('--play-opacity', '1');
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.style.setProperty('--play-opacity', '0');
    };

    // Open Cinematic Modal
    const handleOpenModal = (e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const rect = mediaWrapRef.current?.getBoundingClientRect();
      if (rect) {
        setOriginRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
      const curTime = internalVideoRef.current?.currentTime || 0;
      setModalInitialTime(curTime);

      // Pause preview video while modal is active
      if (internalVideoRef.current) {
        internalVideoRef.current.pause();
      }

      setIsModalOpen(true);
    };

    // Close Cinematic Modal
    const handleCloseModal = () => {
      setIsModalOpen(false);

      // Resume preview video
      if (autoPlay && internalVideoRef.current) {
        internalVideoRef.current.play().catch(() => {});
      }
    };

    return (
      <>
        <div className={`video-panel video-panel--interactive ${className}`}>
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
                  <Link
                    href={href}
                    className="video-panel__cta-badge"
                    onClick={(e) => e.stopPropagation()}
                    title="Explore About HWI"
                  >
                    <span>ABOUT HWI</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Video Container (Target preview with Skiper67 interaction) */}
            <div
              ref={mediaWrapRef}
              className="video-panel__media-wrap"
              onClick={handleOpenModal}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenModal();
                }
              }}
              aria-label="Play cinematic showreel video"
            >
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

              {/* Skiper67 Pointer-Following Custom PLAY Cursor */}
              <Skiper67PlayCursor />
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
            <div className="video-panel__footer" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
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

        {/* Cinematic Expandable Video Player Modal */}
        <CinematicVideoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          src={src}
          poster={poster}
          initialTime={modalInitialTime}
          originRect={originRect}
          title="HWI SHOWREEL // CURRICULUM & INITIATIVES"
        />
      </>
    );
  }
);

