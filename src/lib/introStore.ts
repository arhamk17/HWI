export type IntroPhase = 'multilingual-loader' | 'fluid-transition' | 'hero-revealed' | 'complete';

type IntroListener = (phase: IntroPhase) => void;

class IntroStore {
  private _phase: IntroPhase = 'multilingual-loader';
  private _listeners: Set<IntroListener> = new Set();

  get phase(): IntroPhase {
    return this._phase;
  }

  get isComplete(): boolean {
    return this._phase === 'complete';
  }

  setPhase(nextPhase: IntroPhase): void {
    if (this._phase !== nextPhase) {
      this._phase = nextPhase;
      this._listeners.forEach((listener) => {
        try {
          listener(this._phase);
        } catch {
          // ignore error
        }
      });
    }
  }

  setComplete(): void {
    this.setPhase('complete');
  }

  subscribe(listener: IntroListener): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }
}

export const introStore = new IntroStore();
