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
}

class Obstacle extends Entity {
  constructor(element, speed) {
    super(element);
    this.speed = speed;
    this.moveInterval = null;
  }

  startMoving() {
    this.moveInterval = setInterval(() => {
      const ox = this.getDimensions().left;
      if (ox + this.speed < 0) {
        this.element.style.left = window.innerWidth + "px";
      } else {
        this.element.style.left = ox - this.speed + "px";
      }
    }, 10);
  }

  stopMoving() {
    clearInterval(this.moveInterval);
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
    clearInterval(this.moveInterval);
    this.moveInterval = setInterval(() => {
      const dx = this.getDimensions().left;
      const dinoWidth = this.getDimensions().width;
      if (dx + dinoWidth < window.innerWidth) {
        this.element.style.left = dx + this.speed + "px";
      }
    }, 10);
  }

  moveLeft() {
    clearInterval(this.moveInterval);
    this.moveInterval = setInterval(() => {
      const dx = this.getDimensions().left;
      if (dx > 0) {
        this.element.style.left = dx - this.speed + "px";
      }
    }, 10);
  }

  stopMoving() {
    clearInterval(this.moveInterval);
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
  constructor(callback, interval) {
    this.callback = callback;
    this.interval = interval;
    this.timerId = null;
  }

  start() {
    this.timerId = setInterval(this.callback, this.interval);
  }

  stop() {
    clearInterval(this.timerId);
    this.timerId = null;
  }
}

class KeyboardHandler {
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

      for (let obstacle of this.game.obstacles) {
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
  constructor() {
    this.score = 0;
    this.scoreCont = document.getElementById("scoreCont");
  }

  updateScore() {
    this.score++;
    this.scoreCont.innerText = "Your Score: " + this.score;
  }

  getScore() {
    return this.score;
  }
}

class GameManager {
  constructor() {
    this.isGameOver = false;
    this.audiogo = new Audio("start.mp3");
    this.audioend = new Audio("end.mp3");
    this.dino = new Dino(); // Create a new Dino instance
    this.background = new Background(document.getElementById("background"), 3);
    this.gameOver = document.querySelector(".gameOver");
    this.obstacles = []; // Create an array to hold the obstacles
    this.scoreManager = new ScoreManager();
    this.timer = new Timer(() => {
      this.timeCounter++;
      this.scoreManager.updateScore();
    }, 100);
    this.keyboardHandler = new KeyboardHandler(this);
    this.collisionDetector = new CollisionDetector(this);
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
      this.createObstacle();
      this.collisionDetector.checkCollision();
      this.background.moveBackground();
      this.obstacles[0].startMoving();
      this.timer.start();
    });
  }

  createObstacle() {
    const obstacleDiv = document.createElement("div");
    obstacleDiv.classList.add("obstacle");
    document.querySelector(".container").appendChild(obstacleDiv);
    const obstacle = new Obstacle(obstacleDiv, window.innerWidth * 0.005);
    this.obstacles.push(obstacle);
  }

  endGame() {
    this.gameOver.innerText = "Game Over";
    for (let obstacle of this.obstacles) {
      obstacle.stopMoving();
    }
    this.dino.stopMoving();
    this.background.stopMoving();
    this.timer.stop();
    this.isGameOver = true;
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
