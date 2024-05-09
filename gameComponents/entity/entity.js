import config from "../config.js";

export class Entity {
  constructor(element, imageUrl, top) {
    this.element = element;
    this.renderInterval = config.game.renderInterval;
    this.updateImage(imageUrl);
    this.updateTop(top);
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

  move(direction, speed, allowMoveOutside = false) {
    clearInterval(this.moveInterval);
    this.moveInterval = setInterval(() => {
      const entityPositionX = this.getDimensions().left;
      const entityWidth = this.getDimensions().width;
      if (
        direction === "right" &&
        (allowMoveOutside ||
          entityPositionX + entityWidth + speed < window.innerWidth)
      ) {
        this.element.style.left = entityPositionX + speed + "px";
      } else if (
        direction === "left" &&
        (allowMoveOutside || entityPositionX - speed > 0)
      ) {
        this.element.style.left = entityPositionX - speed + "px";
      } else {
        this.stopMoving();
      }
    }, this.renderInterval);
  }

  updateImage(imageUrl) {
    this.element.style.background = `url(${imageUrl}) no-repeat`;
    this.element.style.backgroundSize = "contain";
  }

  updateTop(top) {
    this.element.style.top = top;
  }

  stopMoving() {
    clearInterval(this.moveInterval);
  }
}
