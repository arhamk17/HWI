// Shared state for team section scroll progress and active team background
type TeamChangeCallback = (activeTeam: number, transitionProgress: number) => void;

class TeamStore {
  private listeners: Set<TeamChangeCallback> = new Set();
  public activeTeam = 0; // 0 to 4
  public progress = 0; // 0 to 1 continuous through entire team section

  public subscribe(cb: TeamChangeCallback): () => void {
    this.listeners.add(cb);
    cb(this.activeTeam, this.progress);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public update(activeTeam: number, progress: number) {
    this.activeTeam = activeTeam;
    this.progress = progress;
    this.listeners.forEach((cb) => cb(activeTeam, progress));
  }
}

export const teamStore = new TeamStore();
