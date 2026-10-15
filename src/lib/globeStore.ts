import { GlobeLocation, GLOBE_LOCATIONS } from '@/data/globeLocations';

type GlobeCallback = () => void;

class GlobeStore {
  private listeners: Set<GlobeCallback> = new Set();

  public rotX = 0.15; // pitch
  public rotY = 0;    // yaw
  public targetRotX = 0.15;
  public targetRotY = 0;
  public isDragging = false;
  public activeLocation: GlobeLocation | null = null;
  public hoveredLocation: GlobeLocation | null = null;

  public subscribe(cb: GlobeCallback): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  public setRotation(x: number, y: number) {
    this.rotX = x;
    this.rotY = y;
    this.targetRotX = x;
    this.targetRotY = y;
    this.notify();
  }

  public addDelta(dx: number, dy: number) {
    this.targetRotY += dx;
    this.targetRotX = Math.max(-0.8, Math.min(0.8, this.targetRotX + dy));
    this.notify();
  }

  public selectLocation(loc: GlobeLocation | null) {
    this.activeLocation = loc;
    if (loc) {
      // Calculate rotation required to bring (loc.x, loc.y, loc.z) to front (0, 0, 1)
      // On unit sphere:
      // Rotated position:
      // z' = x * sin(rotY) + z * cos(rotY)
      // To bring it to face the viewer (positive z), target yaw = atan2(-loc.x, loc.z)
      const targetYaw = Math.atan2(-loc.x, loc.z);
      // And pitch:
      const targetPitch = Math.asin(Math.max(-0.8, Math.min(0.8, -loc.y)));
      
      this.targetRotY = targetYaw;
      this.targetRotX = targetPitch;
    }
    this.notify();
  }

  public hoverLocation(loc: GlobeLocation | null) {
    if (this.hoveredLocation?.id !== loc?.id) {
      this.hoveredLocation = loc;
      if (loc && !this.activeLocation) {
        // Subtly nudge globe toward hovered location
        const targetYaw = Math.atan2(-loc.x, loc.z);
        this.targetRotY += (targetYaw - this.targetRotY) * 0.25;
      }
      this.notify();
    }
  }

  public stepInertia() {
    // Smooth lerp toward target rotation
    const lerpSpeed = 0.08;
    this.rotX += (this.targetRotX - this.rotX) * lerpSpeed;
    this.rotY += (this.targetRotY - this.rotY) * lerpSpeed;
  }
}

export const globeStore = new GlobeStore();
