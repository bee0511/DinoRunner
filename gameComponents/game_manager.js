import { Dino } from "./entity/dino.js";
import { ItemManager } from "./entity/items/item_manager.js";
import { Background } from "./background/background.js";
import { KeyboardManager } from "./keyboard/keyboard_manager.js";
import { ScoreManager } from "./score/score_manager.js";
import { ObstacleManager } from "./entity/obstacles/obstacle_manager.js";

export class GameManager {
  constructor() {
    this.isGameOver = false;
    this.background = new Background(document.getElementById("background"));
    this.scoreManager = new ScoreManager(this);
    this.keyboardHandler = new KeyboardManager(this);
    this.obstacleManager = new ObstacleManager(this);
    this.itemManager = new ItemManager(this);
  }

  createDino() {
    const dinoElement = document.createElement("div");
    dinoElement.classList.add("dino");
    document.querySelector(".container").appendChild(dinoElement);
    const dinoImageUrl = "/docs/dino.gif";
    const dinoTop = "70vh";
    this.dino = Dino.getInstance(dinoElement, dinoImageUrl, dinoTop);
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
      this.createDino();
      this.keyboardHandler.handleKey();
      this.background.moveBackground();
      this.scoreManager.startTimer();
      this.obstacleManager.start();
      this.itemManager.start();
    });
  }

  endGame() {
    this.isGameOver = true;
    this.dino.stopMoving();
    this.background.stopMoving();
    this.scoreManager.stopTimer();
    this.obstacleManager.stop();
    this.itemManager.stop();
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
