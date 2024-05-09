import { CollisionDetector } from "../../utils/collision_detector.js";
import { Bomb } from "./bomb.js";
import { JumpBoost } from "./jumpboost.js";
import { RandomIntervalTimer } from "../../utils/random_interval_timer.js";

export class ItemManager {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.collisionDetector = new CollisionDetector(this.game);
    this.itemTimer = new RandomIntervalTimer(
      () => {
        this.createItem();
      },
      1000,
      3000
    );
  }

  createItem() {
    // Check if a Bomb or JumpBoost item already exists
    const specialItemExists = this.items.some(
      (item) => item instanceof Bomb || item instanceof JumpBoost
    );

    // If a Bomb or JumpBoost item already exists, do not create a new one
    if (specialItemExists) {
      return;
    }

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    document.querySelector(".container").appendChild(itemDiv);

    // Randomly choose between Bomb and JumpBoost
    const itemType = Math.random() < 0.5 ? Bomb : JumpBoost;
    const imageUrl = itemType === Bomb ? "../../../images/bomb.png" : "../../../images/jumpboost.png";

    const item = new itemType(
      itemDiv,
      this.game.background.getSpeed() / 2,
      imageUrl,
      "69vh"
    );
    this.items.push(item);
  }

  checkItemsCollision() {
    setInterval(() => {
      const dinoDimensions = this.game.dino.getDimensions();

      for (let item of this.items) {
        const itemDimensions = item.getDimensions();

        if (
          this.collisionDetector.isColliding(dinoDimensions, itemDimensions)
        ) {
          item.activate(this.game);
          this.removeItem(item);
        }
      }
    }, 10);
  }

  removeItem(item) {
    item.stopMoving();
    if (item.element.parentNode) {
      item.element.parentNode.removeChild(item.element);
    }
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  removeItems() {
    while (this.items.length > 0) {
      this.removeItem(this.items[0]);
    }
  }

  start() {
    this.itemTimer.start();
    this.checkItemsCollision();
  }

  stop() {
    this.itemTimer.stop();
    this.removeItems();
  }
}
