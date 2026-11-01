'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import './BackgroundSoundtrack.css';

const SOUNDTRACK_SRC = '/audio/specialz-instrumental.mp3';
const DEFAULT_VOLUME = 0.35;

export function BackgroundSoundtrack() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const targetVolumeRef = useRef<number>(DEFAULT_VOLUME);
  const pausedByVideoRef = useRef<boolean>(false);
  const userPausedRef = useRef<boolean>(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth Volume Fade Utility
  const fadeVolume = useCallback((toVolume: number, durationMs = 400, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const steps = 16;
    const stepTime = durationMs / steps;
    const startVolume = audio.volume;
    const delta = (toVolume - startVolume) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, Math.min(1, startVolume + delta * currentStep));
      if (audio) {
        audio.volume = nextVol;
      }

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        if (audio) audio.volume = toVolume;
        onComplete?.();
      }
    }, stepTime);
  }, []);

  // Start Playback in Sync with Website Intro
  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || userPausedRef.current || pausedByVideoRef.current) return;

    try {
      audio.volume = 0;
      await audio.play();
      fadeVolume(targetVolumeRef.current, 600);
      setIsPlaying(true);
    } catch {
      // Browser autoplay restriction: unlock on first gesture
      const unlock = () => {
        if (audio && !userPausedRef.current && !pausedByVideoRef.current) {
          audio.volume = 0;
          audio.play().then(() => {
            fadeVolume(targetVolumeRef.current, 600);
            setIsPlaying(true);
          }).catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('scroll', unlock);
      };

      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
      window.addEventListener('scroll', unlock, { once: true });
    }
  }, [fadeVolume]);

  // Pause for Video Playback
  const pauseForVideo = useCallback(() => {
    const audio = audioRef.current;
    setIsVideoPlaying(true);
    if (!audio) return;

    if (!audio.paused && !userPausedRef.current) {
      pausedByVideoRef.current = true;
      fadeVolume(0, 250, () => {
        if (audio) {
          audio.pause();
          setIsPlaying(false);
        }
      });
    }
  }, [fadeVolume]);

  // Resume after Video Completes / Pauses
  const resumeFromVideo = useCallback(() => {
    const audio = audioRef.current;
    setIsVideoPlaying(false);
    if (!audio) return;

    if (pausedByVideoRef.current && !userPausedRef.current) {
      pausedByVideoRef.current = false;
      audio.play().then(() => {
        fadeVolume(targetVolumeRef.current, 600);
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, [fadeVolume]);

  // Initialize and Sync with Intro
  useEffect(() => {
    const audio = new Audio(SOUNDTRACK_SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const savedPaused = localStorage.getItem('hwi_bg_music_paused');
    if (savedPaused === 'true') {
      userPausedRef.current = true;
      setIsPlaying(false);
    }

    // Intro sync event: starts playback in exact sync with website intro
    const onIntroStart = () => {
      if (!userPausedRef.current) {
        audio.currentTime = 0;
        playAudio();
      }
    };

    window.addEventListener('hwi:start-bg-music', onIntroStart);

    // If user already visited previously or navigating subpages directly
    if (savedPaused !== 'true') {
      playAudio();
    }

    return () => {
      window.removeEventListener('hwi:start-bg-music', onIntroStart);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = '';
    };
  }, [playAudio]);

  // Global Video Playback Watcher
  useEffect(() => {
    const onCustomPause = () => pauseForVideo();
    const onCustomResume = () => resumeFromVideo();

    window.addEventListener('hwi:pause-bg-music', onCustomPause);
    window.addEventListener('hwi:resume-bg-music', onCustomResume);

    const handleVideoPlay = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) {
        const vid = e.target;
        if (!vid.muted || vid.dataset.presentation === 'true') {
          pauseForVideo();
        }
      }
    };

    const handleVideoPauseOrEnded = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) {
        const allVideos = Array.from(document.querySelectorAll('video'));
        const hasAudibleActive = allVideos.some(
          (v) => !v.paused && !v.ended && (!v.muted || v.dataset.presentation === 'true')
        );
        if (!hasAudibleActive) {
          resumeFromVideo();
        }
      }
    };

    const handleVideoVolumeChange = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) {
        const vid = e.target;
        if (!vid.paused && !vid.muted && vid.volume > 0) {
          pauseForVideo();
        } else if (vid.muted || vid.volume === 0) {
          const allVideos = Array.from(document.querySelectorAll('video'));
          const hasAudibleActive = allVideos.some((v) => !v.paused && !v.ended && !v.muted);
          if (!hasAudibleActive) {
            resumeFromVideo();
          }
        }
      }
    };

    document.addEventListener('play', handleVideoPlay, true);
    document.addEventListener('pause', handleVideoPauseOrEnded, true);
    document.addEventListener('ended', handleVideoPauseOrEnded, true);
    document.addEventListener('volumechange', handleVideoVolumeChange, true);

    return () => {
      window.removeEventListener('hwi:pause-bg-music', onCustomPause);
      window.removeEventListener('hwi:resume-bg-music', onCustomResume);
      document.removeEventListener('play', handleVideoPlay, true);
      document.removeEventListener('pause', handleVideoPauseOrEnded, true);
      document.removeEventListener('ended', handleVideoPauseOrEnded, true);
      document.removeEventListener('volumechange', handleVideoVolumeChange, true);
    };
  }, [pauseForVideo, resumeFromVideo]);

  // User Toggle Pause / Resume
  const togglePlayState = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userPausedRef.current = true;
      localStorage.setItem('hwi_bg_music_paused', 'true');
      fadeVolume(0, 250, () => {
        audio.pause();
        setIsPlaying(false);
      });
    } else {
      userPausedRef.current = false;
      pausedByVideoRef.current = false;
      localStorage.setItem('hwi_bg_music_paused', 'false');
      audio.play().then(() => {
        fadeVolume(targetVolumeRef.current, 500);
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, [isPlaying, fadeVolume]);

  return (
    <div className="hwi-soundtrack-container">
      <button
        type="button"
        className={`hwi-soundtrack-toggle ${isPlaying ? 'is-playing' : 'is-paused'} ${
          isVideoPlaying ? 'is-video-playing' : ''
        }`}
        onClick={togglePlayState}
        aria-label={isPlaying ? 'Pause Background Music' : 'Resume Background Music'}
        title={isPlaying ? 'Pause music' : 'Resume music'}
      >
        {isPlaying ? (
          <Pause size={17} className="hwi-audio-icon" />
        ) : (
          <Play size={17} className="hwi-audio-icon hwi-play-icon" />
        )}

        {/* Subtle breathing red ring when playing */}
        {isPlaying && <span className="hwi-soundtrack-pulse" aria-hidden="true" />}
      </button>
    </div>
  );
}
