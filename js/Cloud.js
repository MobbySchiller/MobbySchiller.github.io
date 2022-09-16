import { CONTAINER_WIDTH, CONTAINER_HEIGHT, DEFAULT_POSITION_Y, game } from './Game.js';

const CLOUD_WIDTH = 70;
const CLOUD_HEIGHT = 35;

export class Cloud {
    constructor(container) {
        this.container = container;
        this.cloud = null;
        this.width = CLOUD_WIDTH;
        this.height = CLOUD_HEIGHT;
        this.img = "url('./assets/cloud.png')";
        this.positionX = CONTAINER_WIDTH + this.width;
        this.positionY = DEFAULT_POSITION_Y;
        this.interval = null;
        this.init();
    }

    init() {
        this.positionYGenerator();
        this.createCloud();
        this.cloudMovement();
    }

    positionYGenerator() {
        let verticalPosition = 0;
        while (verticalPosition < DEFAULT_POSITION_Y + 20) {
            verticalPosition = Math.floor(Math.random() * (100 - CLOUD_HEIGHT / 2));
        }
        this.positionY = verticalPosition;
    }

    createCloud() {
        this.cloud = document.createElement('div');
        this.cloud.style.width = `${this.width}px`;
        this.cloud.style.height = `${this.height}px`;
        this.cloud.style.backgroundImage = this.img;
        this.cloud.style.backgroundSize = 'cover';
        this.cloud.style.position = 'absolute';
        this.cloud.style.bottom = `${this.positionY}%`;
        this.setPosition();
        this.container.appendChild(this.cloud);
    }

    setPosition() {
        this.cloud.style.left = `${this.positionX}px`
    }

    cloudMovement() {
        this.interval = setInterval(() => {
            if (this.positionX + this.width > 0) {
                this.positionX -= 1;
                this.setPosition();
            } else {
                this.stopMovement();
            }
        }, 1)
    }

    stopMovement() {
        game.removeCloud();
        this.container.removeChild(this.cloud);
        clearInterval(this.interval);
    }

}