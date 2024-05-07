class Obstacle {
    constructor(speed) {
        this.speed = speed;
        this.element = document.querySelector('.obstacle');
        this.moveInterval = null;
    }

    startMoving() {
        this.moveInterval = setInterval(() => {
            const ox = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('left'));
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

    jump() {
        if (this.isJumping) {
            return;
        }
        this.isJumping = true;
        let start = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('top'));
        let direction = -1;
        let originalStart = start;
        let jumpInterval = setInterval(() => {
            let currentTop = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('top'));
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
            const dx = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('left'));
            this.element.style.left = dx + this.speed + "px";
        }, 10);
    }

    moveLeft() {
        clearInterval(this.moveInterval);
        this.moveInterval = setInterval(() => {
            const dx = parseInt(window.getComputedStyle(this.element, null).getPropertyValue('left'));
            this.element.style.left = dx - this.speed + "px";
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
    }

    start() {
        // setTimeout(() => {
        //     this.audiogo.play();
        // }, 500);
        this.handleKeydown();
        this.handleKeyup();
        this.checkCollision();
        this.obstacle.startMoving(); // Start moving the obstacle
    }

    handleKeydown() {
        document.onkeydown = (e) => {
            if(this.isGameOver) {
                return;
            }
            if (e.key == 'ArrowUp') {
                this.dino.jump();
            }
            if (e.key == 'ArrowRight') {
                this.dino.moveRight();
            }
            if (e.key == 'ArrowLeft') {
                this.dino.moveLeft();
            }
        }
    }

    handleKeyup() {
        document.onkeyup = (e) => {
            if (this.isGameOver) { 
                return;
            }
            if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
                this.dino.stopMoving();
            }
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
            const dinoStyle = window.getComputedStyle(this.dino.element, null);
            const obstacleStyle = window.getComputedStyle(this.obstacle.element, null);

            const dinoWidth = parseInt(dinoStyle.getPropertyValue('width'));
            const dinoHeight = parseInt(dinoStyle.getPropertyValue('height'));
            const obstacleWidth = parseInt(obstacleStyle.getPropertyValue('width'));
            const obstacleHeight = parseInt(obstacleStyle.getPropertyValue('height'));

            const dx = parseInt(dinoStyle.getPropertyValue('left'));
            const dy = parseInt(dinoStyle.getPropertyValue('top'));

            const ox = parseInt(obstacleStyle.getPropertyValue('left'));
            const oy = parseInt(obstacleStyle.getPropertyValue('top'));

            if (dx < ox + obstacleWidth &&
                dx + dinoWidth > ox &&
                dy < oy + obstacleHeight &&
                dy + dinoHeight > oy) {
                this.endGame();
                return; 
            }

            if (dx > ox && dy < oy && Date.now() - lastScoreUpdate >= 1000) {
                this.updateScore();
                lastScoreUpdate = Date.now();
            }
        }, 100);
    }

    updateScore() {
        this.score++;
        this.scoreCont.innerText = "Your Score: " + this.score;
    }
}

const game = new Game();
game.start();