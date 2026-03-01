// Bully Algorithm for leader election
export class LeaderElection {
  private deviceId: string;
  private knownDevices: Set<string> = new Set();
  private currentLeader: string | null = null;
  private electionInProgress: boolean = false;
  private onLeaderChange: (leaderId: string) => void;

  constructor(deviceId: string, onLeaderChange: (leaderId: string) => void) {
    this.deviceId = deviceId;
    this.onLeaderChange = onLeaderChange;
  }

  addDevice(deviceId: string): void {
    this.knownDevices.add(deviceId);
  }

  removeDevice(deviceId: string): void {
    this.knownDevices.delete(deviceId);
    if (this.currentLeader === deviceId) {
      this.startElection();
    }
  }

  startElection(): void {
    if (this.electionInProgress) return;
    this.electionInProgress = true;

    // Find devices with higher IDs
    const higherDevices = Array.from(this.knownDevices).filter(id => id > this.deviceId);

    if (higherDevices.length === 0) {
      // I'm the leader
      this.becomeLeader();
    } else {
      // Send election message to higher devices
      // In real implementation, this would be network calls
      // For now, simulate timeout
      setTimeout(() => {
        // If no response, become leader
        this.becomeLeader();
      }, 2000);
    }
  }

  private becomeLeader(): void {
    this.currentLeader = this.deviceId;
    this.electionInProgress = false;
    this.onLeaderChange(this.deviceId);
    this.announceVictory();
  }

  private announceVictory(): void {
    // Broadcast coordinator message to all lower ID devices
    console.log(`Device ${this.deviceId} is now the leader`);
  }

  handleElectionMessage(fromDevice: string): void {
    if (fromDevice < this.deviceId) {
      // Respond with OK and start own election
      this.startElection();
    }
  }

  handleCoordinatorMessage(leaderId: string): void {
    this.currentLeader = leaderId;
    this.electionInProgress = false;
    this.onLeaderChange(leaderId);
  }

  isLeader(): boolean {
    return this.currentLeader === this.deviceId;
  }

  getLeader(): string | null {
    return this.currentLeader;
  }
}
