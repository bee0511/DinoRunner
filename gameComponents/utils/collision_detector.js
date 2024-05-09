export class CollisionDetector {
  constructor(game) {
    this.game = game;
  }

  isColliding(dinoDimensions, obstacleDimensions) {
    const dinoRadius = dinoDimensions.width / 2;
    const obstacleRadius = obstacleDimensions.width / 2;

    const dinoCenter = {
      x: dinoDimensions.left + dinoRadius,
      y: dinoDimensions.top + dinoRadius,
    };

    const obstacleCenter = {
      x: obstacleDimensions.left + obstacleRadius,
      y: obstacleDimensions.top + obstacleRadius,
    };

    const distX = dinoCenter.x - obstacleCenter.x;
    const distY = dinoCenter.y - obstacleCenter.y;

    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance <= dinoRadius + obstacleRadius;
  }
}
