'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  RotateCcw,
} from 'lucide-react';
import './skiper67.css';

export interface VideoPlayerProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface VideoPlayerContentProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  slot?: string;
}

export interface VideoPlayerControlBarProps {
  children: React.ReactNode;
  className?: string;
}

export interface VideoPlayerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export interface CinematicVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title?: string;
  initialTime?: number;
  originRect?: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const m = mins < 10 ? `0${mins}` : `${mins}`;
  const s = secs < 10 ? `0${secs}` : `${secs}`;
  return `${m}:${s}`;
}

// ─── Primitive Sub-components for Skiper67 API Compatibility ───────────────────

export const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(
  function VideoPlayer({ children, className = '', style }, ref) {
    return (
      <div ref={ref} className={`skiper67-player ${className}`} style={style}>
        {children}
      </div>
    );
  }
);

export const VideoPlayerContent = forwardRef<HTMLVideoElement, VideoPlayerContentProps>(
  function VideoPlayerContent({ className = '', ...props }, ref) {
    return (
      <video
        ref={ref}
        className={`skiper67-video ${className}`}
        playsInline
        {...props}
      />
    );
  }
);

export function VideoPlayerControlBar({
  children,
  className = '',
}: VideoPlayerControlBarProps) {
  return (
    <div className={`skiper67-controls-bar ${className}`}>
      {children}
    </div>
  );
}

export function VideoPlayerPlayButton({
  isPlaying,
  onClick,
  className = '',
}: {
  isPlaying?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`skiper67-btn skiper67-btn--play ${className}`}
      onClick={onClick}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-current" />}
    </button>
  );
}

export function VideoPlayerMuteButton({
  isMuted,
  onClick,
  className = '',
}: {
  isMuted?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`skiper67-btn skiper67-btn--mute ${className}`}
      onClick={onClick}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}

export function VideoPlayerTimeRange({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
}: {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
}) {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const barRef = useRef<HTMLDivElement>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek?.(pos * duration);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(pos * duration);
    setHoverX(e.clientX - rect.left);
  };

  const handlePointerLeave = () => {
    setHoverTime(null);
  };

  return (
    <div
      ref={barRef}
      className={`skiper67-time-range ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="skiper67-time-range__track">
        <div
          className="skiper67-time-range__fill"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="skiper67-time-range__thumb"
          style={{ left: `${progressPercent}%` }}
        />
      </div>
      {hoverTime !== null && (
        <div
          className="skiper67-time-range__tooltip"
          style={{ left: `${hoverX}px` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
}

// ─── Cinematic Full-Screen Modal Player with Clip-Path Expansion ─────────────

export function CinematicVideoModal({
  isOpen,
  onClose,
  src,
  poster,
  title = 'HWI OFFICIAL SHOWREEL // ENGINEERING LAB',
  initialTime = 0,
  originRect,
}: CinematicVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [modalCoords, setModalCoords] = useState<{
    dx: number;
    dy: number;
    scale: number;
  }>({ dx: 0, dy: 20, scale: 0.86 });

  // Save active element for focus restoration & calculate origin deltas
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';

      if (originRect && typeof window !== 'undefined') {
        const vWidth = window.innerWidth;
        const vHeight = window.innerHeight;
        const targetWidth = Math.min(vWidth * 0.92, 1120);
        const vCenterX = vWidth / 2;
        const vCenterY = vHeight / 2;
        const prevCenterX = originRect.left + originRect.width / 2;
        const prevCenterY = originRect.top + originRect.height / 2;
        const rawDx = prevCenterX - vCenterX;
        const rawDy = prevCenterY - vCenterY;
        const dx = Math.max(-vWidth * 0.45, Math.min(vWidth * 0.45, rawDx));
        const dy = Math.max(-vHeight * 0.45, Math.min(vHeight * 0.45, rawDy));
        const scale = Math.max(0.35, Math.min(0.95, originRect.width / targetWidth));
        setModalCoords({ dx, dy, scale });
      }

      // Trigger clip-path expansion after mount
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, 20);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      setIsExpanded(false);
      setIsClosing(false);
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen, originRect]);

  // Handle Close with Reverse Transition
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsExpanded(false);

    // Pause video
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 380);
  }, [onClose]);

  // Keyboard shortcut listener (Escape to close, Space to toggle play, M to mute)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'm' && e.target === document.body) {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

    if (initialTime > 0) {
      video.currentTime = initialTime;
    }

    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Fallback if browser blocks unmuted autoplay
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
    }
  }, [isOpen, initialTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || !isMounted || typeof document === 'undefined') return null;

  const originStyle = {
    '--origin-dx': `${modalCoords.dx}px`,
    '--origin-dy': `${modalCoords.dy}px`,
    '--origin-scale': `${modalCoords.scale}`,
  } as React.CSSProperties;

  return createPortal(
    <div
      className={`skiper67-overlay ${isExpanded ? 'is-expanded' : ''} ${
        isClosing ? 'is-closing' : ''
      }`}
      style={originStyle}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded Cinematic Video Player"
    >
      {/* Blurred Cinematic Backdrop */}
      <div className="skiper67-backdrop" aria-hidden="true" />

      {/* Centered Expanded Player Window */}
      <div
        ref={containerRef}
        className="skiper67-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row with Title & Close Button */}
        <div className="skiper67-modal-header">
          <div className="skiper67-modal-badge">
            <span className="skiper67-modal-badge__dot" />
            <span className="skiper67-modal-badge__text">{title}</span>
          </div>

          <button
            type="button"
            className="skiper67-close-btn"
            onClick={handleClose}
            aria-label="Close video player"
            autoFocus
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Surface Container */}
        <div className="skiper67-modal-media-wrap" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            className="skiper67-modal-video"
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Big Center Play Icon toggle overlay on pause */}
          {!isPlaying && (
            <div className="skiper67-center-play-indicator" aria-hidden="true">
              <Play size={36} className="fill-current text-white translate-x-0.5" />
            </div>
          )}
        </div>

        {/* Floating Glassmorphic Control Bar */}
        <div className="skiper67-controls-bar">
          <button
            type="button"
            className="skiper67-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} className="fill-current" />}
          </button>

          <button
            type="button"
            className="skiper67-btn skiper67-btn--subtle"
            onClick={() => handleSeek(0)}
            aria-label="Replay"
          >
            <RotateCcw size={14} />
          </button>

          {/* Seekable Progress Bar */}
          <VideoPlayerTimeRange
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          {/* Digital Time Readout */}
          <div className="skiper67-time-display">
            <span>{formatTime(currentTime)}</span>
            <span className="opacity-40">/</span>
            <span className="opacity-70">{formatTime(duration)}</span>
          </div>

          {/* Mute Button */}
          <button
            type="button"
            className="skiper67-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            className="skiper67-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Pointer-Following Play Indicator for Preview Container ─────────────────

export function Skiper67PlayCursor() {
  return (
    <div className="skiper67-play-pill" aria-hidden="true">
      <div className="skiper67-play-pill__icon">
        <Play size={12} className="fill-current text-white translate-x-0.5" />
      </div>
      <span className="skiper67-play-pill__text">PLAY SHOWREEL</span>
    </div>
  );
}
