import { Entity } from "../entity.js";

export class Item extends Entity {
  constructor(element, speed, imageUrl, top) {
    super(element, imageUrl, top);
    this.speed = speed;
    this.moveInterval = null;
    this.startMoving();
  }
  startMoving() {
    this.move("left", this.speed, true);
  }
}
