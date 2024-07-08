export class KeyboardManager {
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

    if (key == "ArrowUp" || key == " " || key == "w" || key == "W") {
      this.game.dino.jump();
    }
    if (key == "ArrowRight" || key == "d" || key == "D") {
      this.game.dino.moveRight();
    }
    if (key == "ArrowLeft" || key == "a" || key == "A") {
      this.game.dino.moveLeft();
    }
    if (key == "ArrowDown" || key == "s" || key == "S") {
      this.game.dino.moveDown();
    }
    if (key == "1") {
      this.game.itemManager.activateItem("Bomb");
    }
    if (key == "2") {
      this.game.itemManager.activateItem("JumpBoost");
    }
  }

  processKeyUpEvent(key) {
    if (key == "ArrowRight" || key == "ArrowLeft") {
      this.game.dino.stopMoving();
    }
  }
}
