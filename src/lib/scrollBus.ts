// Centralized scroll dispatcher connected to Lenis
// Avoids multiple independent scroll listeners and layout thrashing

type ScrollCallback = (scrollY: number, progress: number, velocity: number) => void;

class ScrollBus {
  private listeners: Set<ScrollCallback> = new Set();
  private isNotifying = false;
  public scrollY = 0;
  public progress = 0;
  public velocity = 0;

  public subscribe(cb: ScrollCallback): () => void {
    this.listeners.add(cb);
    // Immediate callback with current value
    cb(this.scrollY, this.progress, this.velocity);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public notify(scrollY: number, progress: number, velocity: number) {
    this.scrollY = scrollY;
    this.progress = progress;
    this.velocity = velocity;
    if (this.isNotifying) return;
    this.isNotifying = true;
    try {
      this.listeners.forEach((cb) => cb(scrollY, progress, velocity));
    } finally {
      this.isNotifying = false;
    }
  }
}

export const scrollBus = new ScrollBus();
