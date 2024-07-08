export class Timer {
    constructor(callback, interval = 1000) {
      this.callback = callback;
      this.interval = interval;
      this.timerId = null;
    }
  
    start() {
      throw new Error("Method 'start()' must be implemented.");
    }
  
    stop() {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  