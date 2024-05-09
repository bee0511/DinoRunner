class Entity {
  constructor(element) {
    this.element = element;
  }

  getDimensions() {
    const style = window.getComputedStyle(this.element, null);
    return {
      width: parseInt(style.getPropertyValue("width")),
      height: parseInt(style.getPropertyValue("height")),
      left: parseInt(style.getPropertyValue("left")),
      top: parseInt(style.getPropertyValue("top")),
    };
  }

  move(direction, speed, allowMoveOutside = false) {
    clearInterval(this.moveInterval);
    this.moveInterval = setInterval(() => {
      const entityPositionX = this.getDimensions().left;
      const entityWidth = this.getDimensions().width;
      if (
        direction === "right" &&
        (allowMoveOutside ||
          entityPositionX + entityWidth + speed < window.innerWidth)
      ) {
        this.element.style.left = entityPositionX + speed + "px";
      } else if (
        direction === "left" &&
        (allowMoveOutside || entityPositionX - speed > 0)
      ) {
        this.element.style.left = entityPositionX - speed + "px";
      } else {
        this.stopMoving();
      }
    }, 10);
  }

  stopMoving() {
    clearInterval(this.moveInterval);
  }
}

class Obstacle extends Entity {
  constructor(element, speed, imageUrl, top) {
    super(element);
    this.speed = speed;
    this.moveInterval = null;
    this.updateAppearance(imageUrl, top);
    this.startMoving();
  }

  updateAppearance(imageUrl, top) {
    this.element.style.background = `url(${imageUrl}) no-repeat`;
    this.element.style.backgroundSize = "cover";
    this.element.style.top = top;
  }

  startMoving() {
    this.move("left", this.speed, true);
  }
}

class Dino extends Entity {
  constructor() {
    super(document.querySelector(".dino"));
    this.speed = window.innerWidth * 0.05; // Set speed as 5% of the screen width
    this.moveInterval = null;
    this.isJumping = false;
    this.jumpIntervalTime = 20; // Smaller value means faster jump
    this.gravity = 1;
    this.velocity = 0;
  }

  jump() {
    if (this.isJumping) {
      return;
    }
    this.isJumping = true;
    let currentPosition = this.getDimensions().top;
    let originalPosition = currentPosition;
    this.velocity = -20;
    let jumpInterval = setInterval(() => {
      this.velocity += this.gravity;
      currentPosition += this.velocity;
      this.element.style.top = currentPosition + "px";
      let currentTop = this.getDimensions().top;
      if (currentTop >= originalPosition) {
        clearInterval(jumpInterval);
        this.isJumping = false;
        this.element.style.top = originalPosition + "px";
      }
    }, this.jumpIntervalTime);
  }

  moveRight() {
    this.move("right", this.speed);
  }

  moveLeft() {
    this.move("left", this.speed);
  }
}

class Background {
  constructor(element, speed) {
    this.speed = speed;
    this.element = element;
    this.animationId = null;
  }

  moveBackground() {
    const bgPosition = window.getComputedStyle(
      this.element
    ).backgroundPositionX;
    const newBgPosition =
      (parseInt(bgPosition) - this.speed) % window.innerWidth;
    this.element.style.backgroundPositionX = `${newBgPosition}px`;
    this.animationId = requestAnimationFrame(() => this.moveBackground()); // Store the ID
  }

  stopMoving() {
    cancelAnimationFrame(this.animationId); // Cancel the animation using the stored ID
  }
}

class Timer {
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

class FixedIntervalTimer extends Timer {
  start() {
    this.timerId = setInterval(this.callback, this.interval);
  }
}

class RandomIntervalTimer extends Timer {
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

class KeyboardManager {
  constructor(game) {
    this.game = game;
  }

  handleKey() {
    document.onkeydown = document.onkeyup = (e) => {
      this.processKeyEvent(e);
    };
  }

  processKeyEvent(e) {
    if (this.game.isGameOver) {
      return;
    }
    if (e.type == "keydown") {
      this.processKeyDownEvent(e.key);
    } else if (e.type == "keyup") {
      this.processKeyUpEvent(e.key);
    }
  }

  processKeyDownEvent(key) {
    const now = Date.now();
    if (
      (key == "ArrowRight" || key == "ArrowLeft") &&
      now - this.game.lastRun < this.game.delay
    ) {
      return;
    }
    this.game.lastRun = now;

    if (key == "ArrowUp") {
      this.game.dino.jump();
    }
    if (key == "ArrowRight") {
      this.game.dino.moveRight();
    }
    if (key == "ArrowLeft") {
      this.game.dino.moveLeft();
    }
  }

  processKeyUpEvent(key) {
    if (key == "ArrowRight" || key == "ArrowLeft") {
      this.game.dino.stopMoving();
    }
  }
}

class CollisionDetector {
  constructor(game) {
    this.game = game;
  }

  checkCollision() {
    setInterval(() => {
      const dinoDimensions = this.game.dino.getDimensions();

      for (let obstacle of this.game.obstacleManager.obstacles) {
        const obstacleDimensions = obstacle.getDimensions();

        if (this.isColliding(dinoDimensions, obstacleDimensions)) {
          this.game.endGame();
          return;
        }
      }
    }, this.game.delay);
  }

  isColliding(dinoDimensions, obstacleDimensions) {
    const dinoRadius = dinoDimensions.width / 2;
    const obstacleRadius = obstacleDimensions.width / 2;

    const dinoCenter = {
      x: dinoDimensions.left + dinoRadius,
      y: dinoDimensions.top + dinoRadius,
    };

    const obstacleCenter = {
      x: obstacleDimensions.left + obstacleRadius,
      y: obstacleDimensions.top + obstacleRadius,
    };

    const distX = dinoCenter.x - obstacleCenter.x;
    const distY = dinoCenter.y - obstacleCenter.y;

    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance <= dinoRadius + obstacleRadius;
  }
}

class ScoreManager {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.level = 1;
    this.interval = 100;
    this.scoreContainer = document.getElementById("score");
    this.levelContainer = document.getElementById("level");
    this.levelContainer.innerText = "Level: 1";
    this.timer = new FixedIntervalTimer(() => {
      this.updateScore();
    }, this.interval);
  }

  updateScore() {
    this.score++;
    if (this.score % 50 === 0) {
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

class ObstacleManager {
  constructor(game) {
    this.game = game;
    this.obstacles = [];
    this.minObstacleInterval = 500;
    this.maxObstacleInterval = 1500;
    this.obstacleTimer = new RandomIntervalTimer(
      () => {
        this.createObstacle();
      },
      this.minObstacleInterval,
      this.maxObstacleInterval
    );
    this.collisionDetector = new CollisionDetector(this.game);
  }

  createObstacle() {
    const obstacleDiv = document.createElement("div");
    obstacleDiv.classList.add("obstacle");
    document.querySelector(".container").appendChild(obstacleDiv);

    const obstaclesInfo = [
      { imageUrl: "fireball.png", top: "40vh" },
      { imageUrl: "dino_obstacle_1.gif", top: "66vh" },
    ];

    const randomIndex = Math.floor(Math.random() * obstaclesInfo.length);
    const { imageUrl, top } = obstaclesInfo[randomIndex];

    const obstacle = new Obstacle(
      obstacleDiv,
      window.innerWidth * 0.005,
      imageUrl,
      top
    );
    this.obstacles.push(obstacle);
  }

  updateObstacleInterval() {
    this.minObstacleInterval -= 50;
    this.maxObstacleInterval -= 50;
    this.obstacleTimer.updateInterval(
      this.minObstacleInterval,
      this.maxObstacleInterval
    );
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
    }, 10);
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
    this.collisionDetector.checkCollision();
    this.checkObstacles();
  }

  stop() {
    this.obstacleTimer.stop();
    this.removeObstacles();
  }
}

class GameManager {
  constructor() {
    this.isGameOver = false;
    this.dino = new Dino(); // Create a new Dino instance
    this.background = new Background(document.getElementById("background"), 3);
    this.scoreManager = new ScoreManager(this);
    this.keyboardHandler = new KeyboardManager(this);
    this.obstacleManager = new ObstacleManager(this); // Create a new ObstacleManager instance
  }

  start() {
    // Display the start screen
    document.getElementById("startScreen").style.display = "block";

    const startButton = document.getElementById("startButton");

    // Add an event listener to the start button
    startButton.addEventListener("click", () => {
      // Hide the start screen
      document.getElementById("startScreen").style.display = "none";

      // Start the game
      this.keyboardHandler.handleKey();
      this.background.moveBackground();
      this.scoreManager.startTimer();
      this.obstacleManager.start();
    });
  }

  endGame() {
    this.isGameOver = true;
    this.dino.stopMoving();
    this.background.stopMoving();
    this.scoreManager.stopTimer();
    this.obstacleManager.stop();
    this.showGameOverWindow();
  }

  showGameOverWindow() {
    const gameOverWindow = document.getElementById("gameOverWindow");
    const finalScore = document.getElementById("finalScore");
    const restartButton = document.getElementById("restartButton");

    finalScore.innerText = this.scoreManager.getScore();
    gameOverWindow.style.display = "block";

    restartButton.onclick = () => {
      location.reload(); // Reload the page to restart the game
    };
  }
}

// Create a new Game instance
const game = new GameManager();

// Start the game
game.start();
