export type ParticleEnvironmentMode = 'normal' | 'grids' | 'connected' | 'groups' | 'geometric' | 'orbital';

type EnvironmentCallback = (mode: ParticleEnvironmentMode, categoryId: string | null) => void;

class WhatWeDoStore {
  private listeners: Set<EnvironmentCallback> = new Set();
  public activeMode: ParticleEnvironmentMode = 'normal';
  public activeCategoryId: string | null = null;

  public subscribe(cb: EnvironmentCallback): () => void {
    this.listeners.add(cb);
    cb(this.activeMode, this.activeCategoryId);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public setEnvironment(mode: ParticleEnvironmentMode, categoryId: string | null = null) {
    if (this.activeMode !== mode || this.activeCategoryId !== categoryId) {
      this.activeMode = mode;
      this.activeCategoryId = categoryId;
      this.listeners.forEach((cb) => cb(mode, categoryId));
    }
  }

  public reset() {
    this.setEnvironment('normal', null);
  }
}

export const whatWeDoStore = new WhatWeDoStore();
