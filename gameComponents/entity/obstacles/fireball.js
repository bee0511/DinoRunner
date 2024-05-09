import { Entity } from "../entity.js";

export class Fireball extends Entity {
  constructor(element, speed, imageUrl, top) {
    super(element, imageUrl, top);
    this.speed = speed;
    this.startMoving();
  }

  startMoving() {
    this.move("left", this.speed, true);
  }
}
