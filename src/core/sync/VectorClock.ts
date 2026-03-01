export class VectorClock {
  private clock: Record<string, number> = {};

  constructor(deviceId: string) {
    this.clock[deviceId] = 0;
  }

  increment(deviceId: string): void {
    this.clock[deviceId] = (this.clock[deviceId] || 0) + 1;
  }

  merge(other: Record<string, number>): void {
    for (const [deviceId, timestamp] of Object.entries(other)) {
      this.clock[deviceId] = Math.max(this.clock[deviceId] || 0, timestamp);
    }
  }

  getClock(): Record<string, number> {
    return { ...this.clock };
  }

  // Returns: -1 if this < other, 0 if concurrent, 1 if this > other
  compare(other: Record<string, number>): number {
    let thisGreater = false;
    let otherGreater = false;

    const allKeys = new Set([...Object.keys(this.clock), ...Object.keys(other)]);

    for (const key of allKeys) {
      const thisVal = this.clock[key] || 0;
      const otherVal = other[key] || 0;

      if (thisVal > otherVal) thisGreater = true;
      if (otherVal > thisVal) otherGreater = true;
    }

    if (thisGreater && !otherGreater) return 1;
    if (otherGreater && !thisGreater) return -1;
    return 0; // concurrent
  }
}
