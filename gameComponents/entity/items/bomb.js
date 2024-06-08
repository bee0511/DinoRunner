import { Item } from "./item.js";

export class Bomb extends Item {
  activate(game) {
    console.log("Bomb activated");
    game.obstacleManager.removeObstacles();
  }
}
