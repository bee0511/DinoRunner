import { Timer } from "./timer.js";

export class FixedIntervalTimer extends Timer {
  start() {
    this.timerId = setInterval(this.callback, this.interval);
  }
}
