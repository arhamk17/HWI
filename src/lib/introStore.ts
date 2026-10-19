type IntroListener = () => void;

class IntroStore {
  private _isComplete = false;
  private _listeners: Set<IntroListener> = new Set();

  get isComplete(): boolean {
    return this._isComplete;
  }

  setComplete(): void {
    if (!this._isComplete) {
      this._isComplete = true;
      this._listeners.forEach((listener) => {
        try {
          listener();
        } catch {
          // ignore error
        }
      });
    }
  }

  subscribe(listener: IntroListener): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }
}

export const introStore = new IntroStore();
