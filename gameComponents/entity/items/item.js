import { Entity } from "../entity.js";

import config from "../../config.js";

export class Item extends Entity {
  constructor(element, top) {
    super(element, top);
    this.speed = config.item.speed;
    this.startMoving();
  }
  
  startMoving() {
    this.move("left", this.speed, true);
  }
}
