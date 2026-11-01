'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Sparkles,
  Film,
  RotateCcw,
} from 'lucide-react';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { ScrambleMotionHeading } from './ScrambleMotionHeading';
import './AboutIntroVideo.css';

interface VideoOption {
  id: 'intro' | 'anthem';
  title: string;
  badge: string;
  src: string;
  durationLabel: string;
  poster?: string;
}

const VIDEO_OPTIONS: VideoOption[] = [
  {
    id: 'intro',
    title: 'HWI OFFICIAL INTRODUCTION',
    badge: 'CINEMATIC EXPERIENCE',
    src: '/videos/hwi-intro.mp4',
    durationLabel: '01:02 • 1080P FULL HD',
    poster: '/images/hwi-introducing-thumbnail.jpeg',
  },
  {
    id: 'anthem',
    title: 'SUKUNA CINEMATIC ANTHEM',
    badge: 'ORIGIN TEASER',
    src: '/videos/sukuna-hero.mp4',
    durationLabel: '13:20 • 4K ULTRA-HD',
  },
];

export function AboutIntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<'intro' | 'anthem'>('intro');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('0:00');
  const [durationStr, setDurationStr] = useState<string>('01:02');
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeOption = VIDEO_OPTIONS.find((v) => v.id === activeVideoId) || VIDEO_OPTIONS[0];

  // 1. Smooth Scroll-Triggered Entrance & Scale-Up Reveal
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Video metadata loaded listener (ensures accurate duration & buffering)
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      setDurationStr(formatTime(video.duration));
    }
  };

  // Video time update listener
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const cur = video.currentTime;
    const dur = video.duration || 1;
    setProgress((cur / dur) * 100);
    setCurrentTimeStr(formatTime(cur));
    setDurationStr(formatTime(dur));
  };

  // Toggle Play / Pause
  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        // First user interaction: unmute for auditory experience
        if (isMuted) {
          video.muted = false;
          setIsMuted(false);
        }
        video.play().catch(() => {});
        setIsPlaying(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hwi:pause-bg-music'));
        }
      } else {
        video.pause();
        setIsPlaying(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
        }
      }
    },
    [isMuted]
  );

  // Toggle Mute
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // Restart Video
  const restartVideo = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  // Timeline scrubber click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (!timeline || !video) return;

    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = pct * (video.duration || 0);
  };

  // Switch video source
  const handleSelectVideo = (optionId: 'intro' | 'anthem') => {
    if (activeVideoId === optionId) return;
    setActiveVideoId(optionId);
    setIsPlaying(false);
    setProgress(0);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const theaterModalRef = useRef<HTMLDivElement>(null);

  // Open Pop-up Cinematic Fullscreen Experience
  const openTheaterModal = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Sync playback time if user was watching inline
    let startTime = 0;
    if (videoRef.current) {
      startTime = videoRef.current.currentTime;
      videoRef.current.pause();
      setIsPlaying(false);
    }

    setIsTheaterOpen(true);
    document.body.style.overflow = 'hidden';
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hwi:pause-bg-music'));
    }

    // Request native OS/browser fullscreen for maximum cinematic immersion
    const modalEl = theaterModalRef.current;
    if (modalEl) {
      if (modalEl.requestFullscreen) {
        modalEl.requestFullscreen().catch(() => {});
      } else if ((modalEl as any).webkitRequestFullscreen) {
        (modalEl as any).webkitRequestFullscreen();
      } else if ((modalEl as any).msRequestFullscreen) {
        (modalEl as any).msRequestFullscreen();
      }
    }

    // Auto-play modal video with sound
    setTimeout(() => {
      const tv = theaterVideoRef.current;
      if (tv) {
        if (startTime > 0 && Math.abs(tv.currentTime - startTime) > 1) {
          tv.currentTime = startTime;
        }
        tv.muted = false;
        tv.play().catch(() => {
          // If browser requires muted first, play muted
          if (tv) {
            tv.muted = true;
            tv.play().catch(() => {});
          }
        });
      }
    }, 120);
  }, []);

  // Close Pop-up Cinematic Modal & Exit Fullscreen
  const closeTheaterModal = useCallback(() => {
    setIsTheaterOpen(false);
    document.body.style.overflow = '';
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
    }
    
    if (theaterVideoRef.current) {
      theaterVideoRef.current.pause();
      // Sync back to inline video if desired
      if (videoRef.current) {
        videoRef.current.currentTime = theaterVideoRef.current.currentTime;
      }
    }

    // Exit native fullscreen if active
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }, []);

  // Listen for native escape key and fullscreen exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterOpen) {
        closeTheaterModal();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        // Exited OS fullscreen via Esc, ensure modal stays responsive
      }
    };

    const handleCustomOpen = () => {
      openTheaterModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('hwi:open-cinematic-experience', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('hwi:open-cinematic-experience', handleCustomOpen);
    };
  }, [isTheaterOpen, closeTheaterModal, openTheaterModal]);

  return (
    <section className="about-video-section" ref={sectionRef} id="intro-video">
      {/* Ambient Pulsing Glow behind the video */}
      <div className="about-video-ambient-glow" aria-hidden="true" />

      <div className="about-container">
        {/* Section Header & Architectural Telemetry */}
        <div className="about-video-header about-reveal is-revealed">
          <ScrambleMotionHeading />

          <p className="about-video-subheading">
            From 30-hour overnight hackathon sprints to nationwide builder delegations,
            explore the authentic culture and technical energy defining the HackWithIndia
            student developer community at Bharati Vidyapeeth, Navi Mumbai.
          </p>

          {/* Video Selector Tabs */}
          <div className="about-video-tabs" role="tablist" aria-label="Select Video Reel">
            {VIDEO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                role="tab"
                aria-selected={activeVideoId === opt.id}
                className={`about-video-tab-btn ${activeVideoId === opt.id ? 'is-active' : ''}`}
                onClick={() => handleSelectVideo(opt.id)}
              >
                <Film size={13} />
                <span>{opt.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================================
            Main Cinematic Video Stage with Glowing Crimson Borders
            ========================================================== */}
        <div className="about-video-stage-wrap">
          <div
            ref={stageRef}
            className={`about-video-stage ${isRevealed ? 'is-revealed' : ''} ${
              isPlaying ? 'is-playing' : ''
            } ${showControls ? 'controls-visible' : ''}`}
            onClick={() => togglePlay()}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            role="region"
            aria-label={`${activeOption.title} Video Player`}
          >
            {/* The HTML5 Video Element */}
            <video
              ref={videoRef}
              src={activeOption.src}
              poster={activeOption.poster}
              className="about-video-element"
              playsInline
              loop
              preload="auto"
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setIsPlaying(false);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
                }
              }}
            />

            {/* Light Reflection Sheen on Hover */}
            <div className="about-video-sheen" aria-hidden="true" />

            {/* Darkened Vignette Overlay when paused */}
            <div className="about-video-vignette" aria-hidden="true" />

            {/* Four Technical HUD Corner Brackets in Glowing Crimson */}
            <span className="about-video-bracket about-video-bracket--tl" aria-hidden="true" />
            <span className="about-video-bracket about-video-bracket--tr" aria-hidden="true" />
            <span className="about-video-bracket about-video-bracket--bl" aria-hidden="true" />
            <span className="about-video-bracket about-video-bracket--br" aria-hidden="true" />

            {/* Centered Floating Play Button CTA */}
            <div className="about-video-center-cta" aria-hidden={isPlaying}>
              <div className="about-video-play-btn">
                <span className="about-video-play-ripple" />
                <span className="about-video-play-ripple" />
                <Play size={36} className="about-video-play-icon" fill="currentColor" />
              </div>
              <span className="about-video-cta-label">
                {isPlaying ? 'PAUSE STREAM' : 'PLAY CINEMATIC REEL'}
              </span>
            </div>

            {/* Custom Cinematic Playback Controls Overlay */}
            <div
              className="about-video-controls"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Timeline Scrubber */}
              <div
                className="about-video-timeline"
                ref={timelineRef}
                onClick={handleSeek}
                role="slider"
                aria-label="Seek Video Timeline"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="about-video-timeline-progress"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Bottom Controls Row */}
              <div className="about-video-controls-row">
                <div className="about-video-controls-left">
                  <button
                    className="about-video-ctrl-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                  </button>

                  <button
                    className="about-video-ctrl-btn"
                    onClick={restartVideo}
                    aria-label="Restart Video"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    className="about-video-ctrl-btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <span className="about-video-time-text">
                    {currentTimeStr} / {durationStr}
                  </span>
                </div>

                <div className="about-video-controls-right">
                  <button
                    className="about-video-theater-btn"
                    onClick={openTheaterModal}
                    aria-label="Open Fullscreen Cinematic Experience"
                    id="ctrl-cinematic-experience-btn"
                  >
                    <Maximize2 size={13} />
                    <span>CINEMATIC EXPERIENCE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          True Fullscreen Cinematic Experience (Portaled to document.body)
          ========================================================== */}
      {mounted && isTheaterOpen && createPortal(
        <div
          ref={theaterModalRef}
          className="about-theater-modal is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Full Cinematic Theater"
        >
          {/* Top Bar with Live Indicator and Exit Fullscreen Button */}
          <div className="about-theater-top-bar">
            <div className="about-theater-title-badge">
              <span className="about-theater-live-dot" />
              <span>HWI CINEMATIC BROADCAST • FULL SCREEN</span>
            </div>

            <button
              className="about-theater-exit-btn"
              onClick={closeTheaterModal}
              aria-label="Exit Fullscreen Cinematic Experience"
            >
              <span>EXIT FULLSCREEN</span>
              <X size={16} />
            </button>
          </div>

          <div
            className="about-theater-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={theaterVideoRef}
              src={activeOption.src}
              poster={activeOption.poster}
              className="about-theater-video"
              controls
              autoPlay
              playsInline
              preload="auto"
              data-presentation="true"
              onEnded={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
                }
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
