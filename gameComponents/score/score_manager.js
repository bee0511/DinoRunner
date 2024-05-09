import { FixedIntervalTimer } from "../utils/fixed_interval_timer.js";

import config from "../config.js";
export class ScoreManager {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.level = 1;
    this.interval = config.score.interval;
    this.scoreContainer = document.getElementById("score");
    this.levelContainer = document.getElementById("level");
    this.levelContainer.innerText = "Level: 1";
    this.timer = new FixedIntervalTimer(() => {
      this.updateScore();
    }, this.interval);
  }

  updateScore() {
    this.score++;
    if (this.score % config.scoreInterval === 0) {
      this.level++;
      this.levelContainer.innerText = "Level: " + this.level;
      this.game.obstacleManager.updateObstacleInterval();
    }
    this.scoreContainer.innerText = "Your Score: " + this.score;
  }

  getScore() {
    return this.score;
  }

  startTimer() {
    this.timer.start();
  }

  stopTimer() {
    this.timer.stop();
  }
}
