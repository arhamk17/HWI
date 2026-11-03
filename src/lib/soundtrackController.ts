/**
 * Global Soundtrack Controller
 * Centralizes the audio element, volume transitions, video ducking,
 * and seamless synchronization with the website intro sequence.
 */

type Listener = (isPlaying: boolean) => void;

class SoundtrackController {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isVideoPlaying = false;
  private userPaused = false;
  private targetVolume = 0.35;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<Listener> = new Set();
  private hasInitialized = false;

  public init(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (this.audio) return this.audio;

    try {
      this.audio = new Audio('/audio/specialz-instrumental.mp3');
      this.audio.loop = true;
      this.audio.preload = 'auto';

      const savedPaused = localStorage.getItem('hwi_bg_music_paused');
      if (savedPaused === 'true') {
        this.userPaused = true;
      }
      this.hasInitialized = true;
    } catch (e) {
      console.warn('Audio initialization warning:', e);
    }
    return this.audio;
  }

  public getAudio(): HTMLAudioElement | null {
    if (!this.audio) return this.init();
    return this.audio;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsVideoPlaying(): boolean {
    return this.isVideoPlaying;
  }

  public getUserPaused(): boolean {
    return this.userPaused;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isPlaying);
      } catch {
        // Ignore subscriber error
      }
    });
  }

  public fadeVolume(toVolume: number, durationMs = 400, onComplete?: () => void) {
    const audio = this.getAudio();
    if (!audio) return;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const steps = 16;
    const stepTime = durationMs / steps;
    const startVolume = audio.volume;
    const delta = (toVolume - startVolume) / steps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, Math.min(1, startVolume + delta * currentStep));
      if (audio) {
        audio.volume = nextVol;
      }

      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        if (audio) audio.volume = toVolume;
        onComplete?.();
      }
    }, stepTime);
  }

  /**
   * Start playback from the beginning (0:00) in sync with website intro sequence.
   * Returns a promise resolving to true if playback successfully started, or false if blocked.
   */
  public async startIntroSync(): Promise<boolean> {
    const audio = this.getAudio();
    if (!audio || this.isVideoPlaying) return false;

    // Reset userPaused flag for fresh intro sync unless explicitly muted during current session
    this.userPaused = false;
    localStorage.removeItem('hwi_bg_music_paused');

    audio.currentTime = 0;
    audio.volume = 0;

    try {
      await audio.play();
      this.fadeVolume(this.targetVolume, 500);
      this.isPlaying = true;
      this.notify();
      return true;
    } catch {
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  /**
   * Standard play
   */
  public async play(): Promise<boolean> {
    const audio = this.getAudio();
    if (!audio || this.userPaused || this.isVideoPlaying) return false;

    try {
      if (audio.paused) {
        audio.volume = 0;
        await audio.play();
        this.fadeVolume(this.targetVolume, 500);
      }
      this.isPlaying = true;
      this.notify();
      return true;
    } catch {
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  /**
   * User toggle between play and pause
   */
  public togglePlay(): void {
    const audio = this.getAudio();
    if (!audio) return;

    if (this.isPlaying) {
      this.userPaused = true;
      localStorage.setItem('hwi_bg_music_paused', 'true');
      this.fadeVolume(0, 250, () => {
        if (audio) audio.pause();
        this.isPlaying = false;
        this.notify();
      });
    } else {
      this.userPaused = false;
      localStorage.setItem('hwi_bg_music_paused', 'false');
      audio
        .play()
        .then(() => {
          this.fadeVolume(this.targetVolume, 500);
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {});
    }
  }

  public pauseForVideo(): void {
    const audio = this.getAudio();
    this.isVideoPlaying = true;
    if (!audio) return;

    if (this.isPlaying) {
      this.fadeVolume(0, 250, () => {
        if (audio) audio.pause();
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public resumeFromVideo(): void {
    const audio = this.getAudio();
    this.isVideoPlaying = false;
    if (!audio) return;

    if (!this.userPaused) {
      audio
        .play()
        .then(() => {
          this.fadeVolume(this.targetVolume, 500);
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {});
    }
  }
}

export const soundtrackController = new SoundtrackController();
