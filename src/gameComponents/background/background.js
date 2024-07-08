import config from "../config.js";

export class Background {
  constructor(element) {
    this.speed = config.background.speed;
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

  getSpeed() {
    return this.speed;
  }

  stopMoving() {
    cancelAnimationFrame(this.animationId); // Cancel the animation using the stored ID
  }
}
