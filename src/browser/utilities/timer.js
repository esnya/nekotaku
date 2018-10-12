export class TimeoutTimer {
  constructor(callback, delay, ...args) {
    this.id = setTimeout(callback, delay, ...args);
  }

  stop() {
    clearTimeout(this.id);
  }
}

export class IntervalTimer {
  constructor(callback, delay, ...args) {
    this.id = setInterval(callback, delay, ...args);
  }

  stop() {
    clearInterval(this.id);
  }
}
