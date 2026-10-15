import { IndiaLocation, HWI_INDIA_LOCATIONS } from '@/data/indiaLocations';

type IndiaCallback = () => void;

class IndiaStore {
  private listeners: Set<IndiaCallback> = new Set();

  public morphProgress = 0; // 0.0 (Globe) -> 1.0 (India fully formed)
  public activeLocation: IndiaLocation | null = null;
  public hoveredLocation: IndiaLocation | null = null;

  public subscribe(cb: IndiaCallback): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public setMorphProgress(p: number) {
    const clamped = Math.max(0, Math.min(1, p));
    if (Math.abs(this.morphProgress - clamped) > 0.005) {
      this.morphProgress = clamped;
      this.notify();
    }
  }

  public selectLocation(loc: IndiaLocation | null) {
    this.activeLocation = loc;
    this.notify();
  }

  public hoverLocation(loc: IndiaLocation | null) {
    if (this.hoveredLocation?.id !== loc?.id) {
      this.hoveredLocation = loc;
      this.notify();
    }
  }
}

export const indiaStore = new IndiaStore();
