import { Entity } from "./entity.js";
import config from "../config.js";

export class Dino extends Entity {
  constructor(element, imageUrl, top) {
    super(element, imageUrl, top);
    this.speed = config.speed;
    this.moveInterval = null;
    this.isJumping = false;
    this.jumpIntervalTime = config.jumpIntervalTime;
    this.gravity = config.gravity;
    this.velocity = 0;
  }
  static instance = null;

  static getInstance(element, speed, imageUrl, top) {
    if (!this.instance) {
      this.instance = new this(element, speed, imageUrl, top);
    }
    return this.instance;
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
