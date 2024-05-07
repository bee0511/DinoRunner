class Obstacle {
    constructor(speed) {
        this.speed = speed;
        this.element = document.querySelector('.obstacle');
        this.moveInterval = null;
    }

    getDimensions() {
        const style = window.getComputedStyle(this.element, null);
        return {
            width: parseInt(style.getPropertyValue('width')),
            height: parseInt(style.getPropertyValue('height')),
            left: parseInt(style.getPropertyValue('left')),
            top: parseInt(style.getPropertyValue('top')),
        };
    }

    startMoving() {
        this.moveInterval = setInterval(() => {
            const ox = this.getDimensions().left;
            if (ox + this.speed < 0) {
                this.element.style.left = window.innerWidth + 'px';
            } else {
                this.element.style.left = ox - this.speed + 'px';
            }
        }, 10);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
    }
}
class Dino {
    constructor() {
        this.element = document.querySelector('.dino');
        this.speed = 50;
        this.moveInterval = null;
        this.isJumping = false;
        this.maxJumpHeight = 200;
        this.jumpSpeed = 20;
    }

    getDimensions() {
        const style = window.getComputedStyle(this.element, null);
        return {
            width: parseInt(style.getPropertyValue('width')),
            height: parseInt(style.getPropertyValue('height')),
            left: parseInt(style.getPropertyValue('left')),
            top: parseInt(style.getPropertyValue('top')),
        };
    }

    jump() {
        if (this.isJumping) {
            return;
        }
        this.isJumping = true;
        let start = this.getDimensions().top;
        let direction = -1;
        let originalStart = start;
        let jumpInterval = setInterval(() => {
            let currentTop = this.getDimensions().top;
            if (currentTop <= originalStart - this.maxJumpHeight && direction === -1) {
                direction = 1;
            } else if (currentTop >= originalStart && direction === 1) {
                direction = -1;
                clearInterval(jumpInterval);
                this.isJumping = false;
                this.element.style.top = originalStart + 'px'; // ensure the dino returns to the original position
            } else {
                start += 10 * direction;
                this.element.style.top = start + 'px';
            }
        }, this.jumpSpeed);
    }

    moveRight() {
        clearInterval(this.moveInterval);
        this.moveInterval = setInterval(() => {
            const dx = this.getDimensions().left;
            const dinoWidth = this.getDimensions().width;
            if (dx + dinoWidth < window.innerWidth) {
                this.element.style.left = dx + this.speed + "px";
            }
        }, 10);
    }

    moveLeft() {
        clearInterval(this.moveInterval);
        this.moveInterval = setInterval(() => {
            const dx = this.getDimensions().left;
            if (dx > 0) {
                this.element.style.left = dx - this.speed + "px";
            }
        }, 10);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
    }
}

class Game {
    constructor() {
        this.score = 0;
        this.isGameOver = false;
        this.audiogo = new Audio('start.mp3');
        this.audioend = new Audio('end.mp3');
        this.dino = new Dino(); // Create a new Dino instance
        this.obstacle = new Obstacle(5); // Create a new Obstacle instance
        this.gameOver = document.querySelector('.gameOver');
        this.scoreCont = document.getElementById('scoreCont');
        this.lastRun = 0;
        this.delay = 10; // delay in milliseconds
    }

    start() {
        // setTimeout(() => {
        //     this.audiogo.play();
        // }, 500);
        this.handleKey();
        this.checkCollision();
        this.obstacle.startMoving(); // Start moving the obstacle
    }

    handleKey() {
        document.onkeydown = document.onkeyup = (e) => {
            this.processKeyEvent(e);
        }
    }

    processKeyEvent(e) {
        if (this.isGameOver) {
            return;
        }
        if (e.type == 'keydown') {
            this.processKeyDownEvent(e.key);
        } else if (e.type == 'keyup') {
            this.processKeyUpEvent(e.key);
        }
    }

    processKeyDownEvent(key) {
        const now = Date.now();
        if ((key == 'ArrowRight' || key == 'ArrowLeft') && now - this.lastRun < this.delay) {
            return;
        }
        this.lastRun = now;

        if (key == 'ArrowUp') {
            this.dino.jump();
        }
        if (key == 'ArrowRight') {
            this.dino.moveRight();
        }
        if (key == 'ArrowLeft') {
            this.dino.moveLeft();
        }
    }

    processKeyUpEvent(key) {
        if (key == 'ArrowRight' || key == 'ArrowLeft') {
            this.dino.stopMoving();
        }
    }

    endGame() {
        this.gameOver.innerText = 'Game Over';
        this.obstacle.stopMoving();
        this.dino.stopMoving();
        this.isGameOver = true;
    }

    checkCollision() {
        let lastScoreUpdate = Date.now();

        setInterval(() => {
            const dinoDimensions = this.dino.getDimensions();
            const obstacleDimensions = this.obstacle.getDimensions();

            if (this.isColliding(dinoDimensions, obstacleDimensions)) {
                this.endGame();
                return; 
            }

            if (this.isScoring(dinoDimensions, obstacleDimensions) && Date.now() - lastScoreUpdate >= 1000) {
                this.updateScore();
                lastScoreUpdate = Date.now();
            }

        }, this.delay);
    }

    isColliding(dinoDimensions, obstacleDimensions) {
        return dinoDimensions.left < obstacleDimensions.left + obstacleDimensions.width &&
            dinoDimensions.left + dinoDimensions.width > obstacleDimensions.left &&
            dinoDimensions.top < obstacleDimensions.top + obstacleDimensions.height &&
            dinoDimensions.top + dinoDimensions.height > obstacleDimensions.top;
    }

    isScoring(dinoDimensions, obstacleDimensions) {
        const dinoBottom = dinoDimensions.top + dinoDimensions.height; 
        const dinoRight = dinoDimensions.left + dinoDimensions.width;
        const obstacleTop = obstacleDimensions.top;
        const obstacleRight = obstacleDimensions.left + obstacleDimensions.width;
        const offset = 10;

        return dinoBottom <= obstacleTop && 
            dinoDimensions.left > obstacleDimensions.left && 
            dinoRight < obstacleRight + offset;
    }

    updateScore() {
        this.score++;
        this.scoreCont.innerText = "Your Score: " + this.score;
    }
}

const game = new Game();
game.start();