interface TimerBase {
  stop(): void;
}

export class TimeoutTimer implements TimerBase {
  private id: number;
  constructor(callback: () => void, delay?: number) {
    this.id = setTimeout(callback, delay);
  }

  stop(): void {
    clearTimeout(this.id);
  }
}

export class IntervalTimer implements TimerBase {
  private id: number;
  constructor(callback: () => void, delay?: number) {
    this.id = setInterval(callback, delay);
  }

  stop(): void {
    clearInterval(this.id);
  }
}
