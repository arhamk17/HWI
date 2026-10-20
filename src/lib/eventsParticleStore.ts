// ==========================================================================
// EVENTS PARTICLE STORE — PARTICLE CHRONICLES
// Coordinates section-driven particle states, hero convergence, and awards pulse
// Zero-allocation, lightweight subscription model shared with GlobalBackground
// ==========================================================================

export type EventsSection = 'hero' | 'panels' | 'photos' | 'awards';

export interface EventsParticleState {
  section: EventsSection;
  scrollProgress: number; // 0 to 1 across the events page
  heroConvergence: number; // 1 -> 0 during hero ignition entrance
  pulseIntensity: number; // 0 -> 1 -> 0 during awards entry pulse
}

type EventsParticleCallback = (state: EventsParticleState) => void;

class EventsParticleStore {
  private listeners: Set<EventsParticleCallback> = new Set();
  public state: EventsParticleState = {
    section: 'hero',
    scrollProgress: 0,
    heroConvergence: 0,
    pulseIntensity: 0,
  };

  public subscribe(cb: EventsParticleCallback): () => void {
    this.listeners.add(cb);
    cb(this.state);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getState(): EventsParticleState {
    return this.state;
  }

  public updateSection(section: EventsSection, scrollProgress: number) {
    if (this.state.section !== section || Math.abs(this.state.scrollProgress - scrollProgress) > 0.01) {
      this.state.section = section;
      this.state.scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      this.notify();
    }
  }

  public setHeroConvergence(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    if (Math.abs(this.state.heroConvergence - clamped) > 0.005) {
      this.state.heroConvergence = clamped;
      this.notify();
    }
  }

  public triggerPulse() {
    // 800ms smooth bell-curve pulse for awards reveal
    let start: number | null = null;
    const duration = 800;

    const animatePulse = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      // Sine bell curve: 0 at start, 1 at mid (0.5), 0 at end (1.0)
      const intensity = Math.sin(progress * Math.PI);
      this.state.pulseIntensity = intensity;
      this.notify();

      if (progress < 1) {
        requestAnimationFrame(animatePulse);
      } else {
        this.state.pulseIntensity = 0;
        this.notify();
      }
    };

    requestAnimationFrame(animatePulse);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.state));
  }
}

export const eventsParticleStore = new EventsParticleStore();
