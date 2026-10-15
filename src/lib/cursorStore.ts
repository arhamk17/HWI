export type CursorVariant =
  | 'default'
  | 'text'
  | 'link'
  | 'image'
  | 'team'
  | 'event'
  | 'external'
  | 'drag';

type CursorCallback = (variant: CursorVariant, customLabel?: string) => void;

class CursorStore {
  private listeners: Set<CursorCallback> = new Set();
  public variant: CursorVariant = 'default';
  public customLabel: string | undefined = undefined;

  public subscribe(cb: CursorCallback): () => void {
    this.listeners.add(cb);
    cb(this.variant, this.customLabel);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public setVariant(variant: CursorVariant, customLabel?: string) {
    if (this.variant !== variant || this.customLabel !== customLabel) {
      this.variant = variant;
      this.customLabel = customLabel;
      this.listeners.forEach((cb) => cb(variant, customLabel));
    }
  }

  public reset() {
    this.setVariant('default');
  }
}

export const cursorStore = new CursorStore();
