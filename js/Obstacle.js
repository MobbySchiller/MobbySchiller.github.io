import { CONTAINER_WIDTH, DEFAULT_POSITION_Y, game } from './Game.js';

export class Obstacle {
    constructor(container) {
        this.container = container;
        this.obstacle = null;
        this.width = 50;
        this.height = 32;
        this.img = "url('./assets/obstacle.png')";
        this.positionX = CONTAINER_WIDTH + this.width;
        this.positionY = DEFAULT_POSITION_Y;
        this.interval = null;
        this.init();
    }

    init() {
        this.createObstacle();
        this.obstacleMovement();
    }

    createObstacle() {
        this.obstacle = document.createElement('div');
        this.obstacle.style.width = `${this.width}px`;
        this.obstacle.style.height = `${this.height}px`;
        this.obstacle.style.backgroundImage = this.img;
        this.obstacle.style.position = 'absolute';
        this.obstacle.style.bottom = `${this.positionY}%`;
        this.setPosition();
        this.container.appendChild(this.obstacle);
    }

    setPosition() {
        this.obstacle.style.left = `${this.positionX}px`
    }

    obstacleMovement() {
        this.interval = setInterval(() => {
            if (this.positionX > 0) {
                this.positionX -= 2;
                this.setPosition();
            } else {
                this.stopMovement();
            }
        }, 1)
    }

    stopMovement() {
        game.removeObstacle();
        this.removeObstacle();
        clearInterval(this.interval);
    }

    removeObstacle() {
        this.container.removeChild(this.obstacle);
    }

}