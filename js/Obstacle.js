import { DEFAULT_POSITION_Y, game } from './Game.js';

export class Obstacle {
    constructor(container) {
        this.container = container;
        this.obstacle = null;
        this.width = 50;
        this.height = 32;
        this.img = "url('./assets/obstacle.png')";
        this.right = 100;
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
        this.obstacle.style.bottom = `${DEFAULT_POSITION_Y}%`;
        this.setPosition();
        this.container.appendChild(this.obstacle);
    }

    setPosition() {
        this.obstacle.style.right = `${this.right}px`
    }

    obstacleMovement() {
        this.interval = setInterval(() => {
            if (this.right < 800) {
                this.right += 2;
                this.setPosition();
            } else {
                this.stopMovement();
            }
        }, 1)
    }

    stopMovement() {
        game.removeObstacle();
        this.container.removeChild(this.obstacle);
        clearInterval(this.interval);
    }

}