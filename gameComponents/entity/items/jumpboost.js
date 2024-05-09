import { Item } from "./item.js";

import config from "../../config.js";

export class JumpBoost extends Item {
  constructor(element, imageUrl, top) {
    super(element, imageUrl, top);
    this.jumpBoostEffect = config.item.jumpBoostEffect;
    this.jumpBoostExpiration = config.item.jumpBoostExpiration;
  }

  activate(game) {
    // If a JumpBoost is already active, clear the existing timeout
    if (game.dino.isJumpBoostActive) {
      clearTimeout(game.dino.jumpBoostTimeout);
    } else {
      // If no JumpBoost is active, activate it
      game.dino.gravity /= this.jumpBoostEffect;
      game.dino.isJumpBoostActive = true;
    }

    // Set a new timeout to deactivate the JumpBoost
    game.dino.jumpBoostTimeout = setTimeout(() => {
      game.dino.gravity *= this.jumpBoostEffect;
      game.dino.isJumpBoostActive = false;
    }, this.jumpBoostExpiration);
  }
}
