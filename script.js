class Obstacle {
  constructor(element, speed) {
    this.speed = speed;
    this.element = element;
    this.moveInterval = null;
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
class Dino {
  constructor() {
    this.element = document.querySelector(".dino");
    this.speed = window.innerWidth * 0.05; // Set speed as 5% of the screen width
    this.moveInterval = null;
    this.isJumping = false;
    this.maxJumpHeight = 200;
    this.jumpSpeed = 20;
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

  jump() {
    if (this.isJumping) {
      return;
    }
    this.isJumping = true;
    let start = this.getDimensions().top;
    let direction = -1;
    let originalStart = start;
    let jumpInterval = setInterval(() => {
      let currentTop = this.getDimensions().top;
      if (
        currentTop <= originalStart - this.maxJumpHeight &&
        direction === -1
      ) {
        direction = 1;
      } else if (currentTop >= originalStart && direction === 1) {
        direction = -1;
        clearInterval(jumpInterval);
        this.isJumping = false;
        this.element.style.top = originalStart + "px"; // ensure the dino returns to the original position
      } else {
        start += 10 * direction;
        this.element.style.top = start + "px";
      }
    }, this.jumpSpeed);
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

class Game {
  constructor() {
    this.score = 0;
    this.isGameOver = false;
    this.audiogo = new Audio("start.mp3");
    this.audioend = new Audio("end.mp3");
    this.dino = new Dino(); // Create a new Dino instance
    // this.obstacle = new Obstacle(5); // Create a new Obstacle instance
    this.background = new Background(document.getElementById("background"), 3);
    this.gameOver = document.querySelector(".gameOver");
    this.scoreCont = document.getElementById("scoreCont");
    this.lastRun = 0;
    this.delay = 5; // delay in milliseconds
    this.obstacles = []; // Create an array to hold the obstacles
  }

  start() {
    // Display the start screen
    document.getElementById("startScreen").style.display = "block";

    // Remove any existing event listener from the start button
    const startButton = document.getElementById("startButton");
    const oldStartButton = startButton;
    const newStartButton = oldStartButton.cloneNode(true);
    oldStartButton.parentNode.replaceChild(newStartButton, oldStartButton);

    // Add an event listener to the start button
    newStartButton.addEventListener("click", () => {
      // Hide the start screen
      document.getElementById("startScreen").style.display = "none";

      // Start the game
      this.handleKey();
      this.createObstacle();
      this.checkCollision();
      this.background.moveBackground();
      this.obstacles[0].startMoving();
    });
  }

  createObstacle() {
    const obstacleDiv = document.createElement("div");
    obstacleDiv.classList.add("obstacle");
    document.querySelector(".container").appendChild(obstacleDiv);
    const obstacle = new Obstacle(obstacleDiv, window.innerWidth * 0.005);
    this.obstacles.push(obstacle);
  }

  handleKey() {
    document.onkeydown = document.onkeyup = (e) => {
      this.processKeyEvent(e);
    };
  }

  processKeyEvent(e) {
    if (this.isGameOver) {
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
      now - this.lastRun < this.delay
    ) {
      return;
    }
    this.lastRun = now;

    if (key == "ArrowUp") {
      this.dino.jump();
    }
    if (key == "ArrowRight") {
      this.dino.moveRight();
    }
    if (key == "ArrowLeft") {
      this.dino.moveLeft();
    }
  }

  processKeyUpEvent(key) {
    if (key == "ArrowRight" || key == "ArrowLeft") {
      this.dino.stopMoving();
    }
  }

  endGame() {
    this.gameOver.innerText = "Game Over";
    for (let obstacle of this.obstacles) {
      obstacle.stopMoving();
    }
    this.dino.stopMoving();
    this.background.stopMoving();
    this.isGameOver = true;
    this.showGameOverWindow();
  }

  showGameOverWindow() {
    const gameOverWindow = document.getElementById("gameOverWindow");
    const finalScore = document.getElementById("finalScore");
    const restartButton = document.getElementById("restartButton");

    finalScore.innerText = this.score;
    gameOverWindow.style.display = "block";

    restartButton.onclick = () => {
      location.reload(); // Reload the page to restart the game
    };
  }

  checkCollision() {
    let lastScoreUpdate = Date.now();

    setInterval(() => {
      const dinoDimensions = this.dino.getDimensions();

      for (let obstacle of this.obstacles) {
        const obstacleDimensions = obstacle.getDimensions();

        if (this.isColliding(dinoDimensions, obstacleDimensions)) {
          this.endGame();
          return;
        }

        if (
          this.isScoring(dinoDimensions, obstacleDimensions) &&
          Date.now() - lastScoreUpdate >= 1000
        ) {
          this.updateScore();
          lastScoreUpdate = Date.now();
        }
      }
    }, this.delay);
  }

  isColliding(dinoDimensions, obstacleDimensions) {
    return (
      dinoDimensions.left <
        obstacleDimensions.left + obstacleDimensions.width &&
      dinoDimensions.left + dinoDimensions.width > obstacleDimensions.left &&
      dinoDimensions.top < obstacleDimensions.top + obstacleDimensions.height &&
      dinoDimensions.top + dinoDimensions.height > obstacleDimensions.top
    );
  }

  isScoring(dinoDimensions, obstacleDimensions) {
    const dinoBottom = dinoDimensions.top + dinoDimensions.height;
    const dinoRight = dinoDimensions.left + dinoDimensions.width;
    const obstacleTop = obstacleDimensions.top;
    const obstacleRight = obstacleDimensions.left + obstacleDimensions.width;
    const offset = 10;

    return (
      dinoBottom <= obstacleTop &&
      dinoDimensions.left > obstacleDimensions.left &&
      dinoRight < obstacleRight + offset
    );
  }

  updateScore() {
    this.score++;
    this.scoreCont.innerText = "Your Score: " + this.score;
  }
}

// Create a new Game instance
const game = new Game();

// Start the game
game.start();
