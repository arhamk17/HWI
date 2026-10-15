type EasterEggCallback = (isActive: boolean) => void;

class EasterEggStore {
  private listeners: Set<EasterEggCallback> = new Set();
  public isActive = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  public subscribe(cb: EasterEggCallback): () => void {
    this.listeners.add(cb);
    cb(this.isActive);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public trigger() {
    if (this.isActive) return;
    this.isActive = true;
    this.notify();

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.isActive = false;
      this.notify();
    }, 3400);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isActive));
  }
}

export const easterEggStore = new EasterEggStore();
