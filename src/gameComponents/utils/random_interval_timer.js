import { Timer } from "./timer.js";

export class RandomIntervalTimer extends Timer {
  constructor(callback, minInterval = 1000, maxInterval = 2000) {
    super(callback);
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
  }

  start() {
    const interval = this.getRandomInterval(this.minInterval, this.maxInterval);
    this.timerId = setTimeout(() => {
      this.callback();
      this.start();
    }, interval);
  }

  updateInterval(minInterval, maxInterval) {
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
  }

  getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
