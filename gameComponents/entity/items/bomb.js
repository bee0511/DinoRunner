import { Item } from "./item.js";

export class Bomb extends Item {
  activate(game) {
    game.obstacleManager.removeObstacles();
  }
}
