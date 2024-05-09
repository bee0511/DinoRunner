import { Item } from "./item.js";

export class JumpBoost extends Item {
  activate(game) {
    game.dino.gravity /= 2;
    setTimeout(() => {
      game.dino.gravity *= 2;
    }, 5000);
  }
}
