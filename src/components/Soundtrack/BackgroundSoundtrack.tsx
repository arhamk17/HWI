'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { soundtrackController } from '@/lib/soundtrackController';
import './BackgroundSoundtrack.css';

export function BackgroundSoundtrack() {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => soundtrackController.getIsPlaying());
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(() => soundtrackController.getIsVideoPlaying());

  useEffect(() => {
    // Initialize audio instance
    soundtrackController.init();

    // Subscribe to playback state changes
    const unsubscribe = soundtrackController.subscribe((playing) => {
      setIsPlaying(playing);
      setIsVideoPlaying(soundtrackController.getIsVideoPlaying());
    });

    // Check current state after hydration
    setIsPlaying(soundtrackController.getIsPlaying());

    return () => {
      unsubscribe();
    };
  }, []);

  // Global Video Playback Watcher
  useEffect(() => {
    const onCustomPause = () => {
      soundtrackController.pauseForVideo();
      setIsVideoPlaying(true);
    };
    const onCustomResume = () => {
      soundtrackController.resumeFromVideo();
      setIsVideoPlaying(false);
    };

    window.addEventListener('hwi:pause-bg-music', onCustomPause);
    window.addEventListener('hwi:resume-bg-music', onCustomResume);

    const handleVideoPlay = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) {
        const vid = e.target;
        if (!vid.muted || vid.dataset.presentation === 'true') {
          soundtrackController.pauseForVideo();
          setIsVideoPlaying(true);
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
          soundtrackController.resumeFromVideo();
          setIsVideoPlaying(false);
        }
      }
    };

    const handleVideoVolumeChange = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) {
        const vid = e.target;
        if (!vid.paused && !vid.muted && vid.volume > 0) {
          soundtrackController.pauseForVideo();
          setIsVideoPlaying(true);
        } else if (vid.muted || vid.volume === 0) {
          const allVideos = Array.from(document.querySelectorAll('video'));
          const hasAudibleActive = allVideos.some((v) => !v.paused && !v.ended && !v.muted);
          if (!hasAudibleActive) {
            soundtrackController.resumeFromVideo();
            setIsVideoPlaying(false);
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
  }, []);

  // User Toggle Pause / Resume
  const togglePlayState = useCallback(() => {
    soundtrackController.togglePlay();
  }, []);

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
