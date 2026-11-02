'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { KokonutBadge } from '@/components/KokonutUI/KokonutBadge';
import { ScrambleMotionHeading } from './ScrambleMotionHeading';
import './AboutIntroVideo.css';

const INTRO_VIDEO = {
  title: 'HWI OFFICIAL INTRODUCTION',
  src: '/videos/hwi-intro.mp4',
  hlsSrc: '/videos/intro-hls/master.m3u8',
  durationLabel: '01:02 • 1080P 60FPS',
  poster: '/images/hwi-introducing-thumbnail.jpeg',
};

export function AboutIntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const theaterHlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3500);
  }, []);

  const [mounted, setMounted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('0:00');
  const [durationStr, setDurationStr] = useState<string>('01:02');
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isNearViewport, setIsNearViewport] = useState<boolean>(false);
  const [qualityLabel, setQualityLabel] = useState<string>('1080P');
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Proximity observer: lazy-load video metadata only when within ~450px of viewport
  useEffect(() => {
    const el = sectionRef.current || stageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '450px 0px 450px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Smooth Scroll-Triggered Entrance & Scale-Up Reveal
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

  // 3. Auto-pause video when scrolled completely out of viewport to save CPU/GPU cycles
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const video = videoRef.current;
            if (video && !video.paused) {
              video.pause();
              setIsPlaying(false);
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
              }
            }
          }
        });
      },
      {
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 4. Auto-pause when tab/window is hidden to preserve battery and memory
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const video = videoRef.current;
        if (video && !video.paused) {
          video.pause();
          setIsPlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
          }
        }
        const theaterVideo = theaterVideoRef.current;
        if (theaterVideo && !theaterVideo.paused) {
          theaterVideo.pause();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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

  // Initialize Adaptive HLS Stream for a video element
  const initHlsPlayer = useCallback(
    (videoEl: HTMLVideoElement | null, isTheater: boolean = false): Hls | null => {
      if (!videoEl) return null;

      // 1. Native Safari HLS support
      if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        if (!videoEl.src || !videoEl.src.includes(INTRO_VIDEO.hlsSrc)) {
          videoEl.src = INTRO_VIDEO.hlsSrc;
          // Crucial for iOS Safari AVPlayer initialization
          videoEl.load();
        }
        return null;
      }

      // 2. Adaptive Hls.js engine
      if (Hls.isSupported()) {
        const activeRef = isTheater ? theaterHlsRef : hlsRef;
        if (activeRef.current) {
          return activeRef.current;
        }

        const hls = new Hls({
          autoStartLoad: true,
          startLevel: -1, // automatic ABR: prioritizes 1080p when bandwidth allows
          capLevelToPlayerSize: false, // Prevents capping resolution to CSS player dimensions
          maxBufferLength: 30, // 30s forward buffer prevents micro-stutters
          maxMaxBufferLength: 60,
          backBufferLength: 15, // Prune old chunks to keep memory light
          lowLatencyMode: false, // Standard VOD profile for highest bitrate stability
          enableWorker: true,
        });

        hls.loadSource(INTRO_VIDEO.hlsSrc);
        hls.attachMedia(videoEl);

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          const level = hls.levels[data.level];
          if (level && !isTheater) {
            setQualityLabel(`${level.height}P`);
          }
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                activeRef.current = null;
                // Fallback to high-definition progressive MP4
                videoEl.src = INTRO_VIDEO.src;
                break;
            }
          }
        });

        activeRef.current = hls;
        return hls;
      }

      // 3. Universal MP4 fallback
      if (!videoEl.src || !videoEl.src.includes(INTRO_VIDEO.src)) {
        videoEl.src = INTRO_VIDEO.src;
      }
      return null;
    },
    []
  );

  // Attach HLS stream when near viewport
  useEffect(() => {
    if (isNearViewport && videoRef.current) {
      initHlsPlayer(videoRef.current, false);
    }
  }, [isNearViewport, initHlsPlayer]);

  // Clean up HLS instances on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (theaterHlsRef.current) {
        theaterHlsRef.current.destroy();
        theaterHlsRef.current = null;
      }
    };
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setIsNearViewport(true);
      const video = videoRef.current;
      if (!video) return;

      initHlsPlayer(video, false);

      if (video.paused) {
        setHasPlayed(true);
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
    [isMuted, initHlsPlayer]
  );

  const handleStageClick = useCallback(
    (e: React.MouseEvent) => {
      // On mobile touch screens or when playing: if controls are not showing, show them first
      if (isPlaying && !showControls) {
        triggerControlsTimer();
        return;
      }
      togglePlay(e);
    },
    [isPlaying, showControls, triggerControlsTimer, togglePlay]
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
    setIsNearViewport(true);
    const video = videoRef.current;
    if (!video) return;
    initHlsPlayer(video, false);
    setHasPlayed(true);
    video.currentTime = 0;
    video.play().catch(() => {});
    setIsPlaying(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hwi:pause-bg-music'));
    }
  }, [initHlsPlayer]);

  // Timeline scrubber click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsNearViewport(true);
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (!timeline || !video) return;
    initHlsPlayer(video, false);

    setHasPlayed(true);
    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = pct * (video.duration || 0);
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
        initHlsPlayer(tv, true);
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
  }, [initHlsPlayer]);

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

    if (theaterHlsRef.current) {
      theaterHlsRef.current.destroy();
      theaterHlsRef.current = null;
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
            onClick={handleStageClick}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            role="region"
            aria-label={`${INTRO_VIDEO.title} Video Player`}
          >
            {/* The HTML5 Video Element with Adaptive HLS Engine */}
            <video
              ref={videoRef}
              poster={INTRO_VIDEO.poster}
              className="about-video-element"
              playsInline
              loop
              preload={isPlaying ? 'auto' : isNearViewport ? 'metadata' : 'none'}
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsPlaying(true);
              }}
              onCanPlay={() => setIsBuffering(false)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                setHasPlayed(false);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('hwi:resume-bg-music'));
                }
              }}
            />

            {/* High-Resolution Introducing Poster Overlay */}
            {INTRO_VIDEO.poster && (
              <img
                src={INTRO_VIDEO.poster}
                alt={`${INTRO_VIDEO.title} Poster Thumbnail`}
                className={`about-video-poster-overlay ${hasPlayed ? 'is-hidden' : ''}`}
                loading="eager"
                decoding="async"
              />
            )}

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

            {/* Adaptive Stream Buffering Indicator */}
            {isBuffering && isPlaying && (
              <div className="about-video-buffering-indicator">
                <div className="about-video-buffering-spinner" />
                <span className="about-video-buffering-text">OPTIMIZING STREAM</span>
              </div>
            )}

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
                  <span className="about-video-quality-tag" title="Adaptive HLS Stream Rendition">
                    <span className="about-video-quality-dot" />
                    {qualityLabel}
                  </span>

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
              poster={INTRO_VIDEO.poster}
              className="about-theater-video"
              controls
              autoPlay
              playsInline
              preload="metadata"
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
