import { RandomIntervalTimer } from "../../utils/random_interval_timer.js";
import { CollisionDetector } from "../../utils/collision_detector.js";
import { Fireball } from "./fireball.js";
import { Dragon } from "./dragon.js";

import config from "../../config.js";

export class ObstacleManager {
  constructor(game) {
    this.game = game;
    this.obstacles = [];
    this.renderInterval = config.game.renderInterval;
    this.minObstacleInterval = config.obstacle.minGenerateInterval;
    this.maxObstacleInterval = config.obstacle.maxGenerateInterval;
    this.minObstacleSpeed = config.obstacle.minSpeed;
    this.maxObstacleSpeed = config.obstacle.maxSpeed;
    this.decreaseObstacleGenerateInterval =
      config.obstacle.decreaseGenerateInterval;
    this.obstacleGenerateLimit = config.obstacle.generateLimit;
    this.obstacleTimer = new RandomIntervalTimer(
      () => {
        this.createObstacle();
      },
      this.minObstacleInterval,
      this.maxObstacleInterval
    );
    this.collisionDetector = new CollisionDetector(this.game);
  }

  getRandomObstacleType() {
    const obstacleTypes = [
      { type: Fireball, imageUrl: "/docs/fireball.png", top: "40vh" },
      { type: Dragon, imageUrl: "/docs/dragon.gif", top: "70vh" },
    ];
    const randomIndex = Math.floor(Math.random() * obstacleTypes.length);
    return obstacleTypes[randomIndex];
  }

  getRandomSpeed() {
    return Math.floor(
      Math.random() * (this.maxObstacleSpeed - this.minObstacleSpeed + 1) +
        this.minObstacleSpeed
    );
  }

  createObstacle() {
    const obstacleDiv = document.createElement("div");
    obstacleDiv.classList.add("obstacle");
    document.querySelector(".container").appendChild(obstacleDiv);

    const obstacleType = this.getRandomObstacleType();
    const speed = this.getRandomSpeed(
      this.minObstacleSpeed,
      this.maxObstacleSpeed
    );

    const obstacle = new obstacleType.type(
      obstacleDiv,
      speed,
      obstacleType.imageUrl,
      obstacleType.top
    );
    this.obstacles.push(obstacle);
  }

  updateObstacleInterval() {
    this.minObstacleInterval -= this.decreaseObstacleGenerateInterval;
    if (this.minObstacleInterval < this.obstacleGenerateLimit) {
      this.minObstacleInterval = this.obstacleGenerateLimit;
    }
    this.maxObstacleInterval -= this.decreaseObstacleGenerateInterval;
    if (this.maxObstacleInterval < this.obstacleGenerateLimit) {
      this.maxObstacleInterval = this.obstacleGenerateLimit;
    }
    this.obstacleTimer.updateInterval(
      this.minObstacleInterval,
      this.maxObstacleInterval
    );
  }

  checkObstaclesCollision() {
    setInterval(() => {
      const dinoDimensions = this.game.dino.getDimensions();

      for (let obstacle of this.obstacles) {
        const obstacleDimensions = obstacle.getDimensions();

        if (
          this.collisionDetector.isColliding(dinoDimensions, obstacleDimensions)
        ) {
          this.game.endGame();
        }
      }
    }, this.renderInterval);
  }

  checkObstacles() {
    setInterval(() => {
      this.obstacles.forEach((obstacle) => {
        const obstaclePositionX = obstacle.getDimensions().left;
        const obstacleWidth = obstacle.getDimensions().width;
        if (obstaclePositionX + obstacleWidth <= 0) {
          this.removeObstacle(obstacle);
        }
      });
    }, this.renderInterval);
  }

  removeObstacle(obstacle) {
    obstacle.stopMoving();
    if (obstacle.element.parentNode) {
      obstacle.element.parentNode.removeChild(obstacle.element);
    }
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
      this.obstacles.splice(index, 1);
    }
  }

  removeObstacles() {
    while (this.obstacles.length > 0) {
      this.removeObstacle(this.obstacles[0]);
    }
  }

  start() {
    this.obstacleTimer.start();
    this.checkObstaclesCollision();
  }

  stop() {
    this.obstacleTimer.stop();
    this.removeObstacles();
  }
}
