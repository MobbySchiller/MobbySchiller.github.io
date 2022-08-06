import { Character, CHARACTER_WIDTH } from './Character.js';
import { Obstacle } from './Obstacle.js';
import { Cloud } from './Cloud.js';

export const DEFAULT_POSITION_Y = 33;
export const CONTAINER_WIDTH = 800;
export const CONTAINER_HEIGHT = 400;

class Game {

    constructor() {
        this.htmlElements = {
            character: document.getElementById('character'),
            container: document.getElementById('game-container'),
        }
        this.obstacles = [];
        this.obstacleGenerator = null;
        this.clouds = [];
        this.cloudsGenerator = null;
        this.generateTime = 2000;
        this.colisionInt = null;

        this.character = new Character(this.htmlElements.character, this.htmlElements.container);
    }

    init() {
        this.character.init();
        this.generateObstacle();
        this.generateClouds();
        this.collisionInterval();
    }

    generateObstacle() {
        this.obstacleGenerator = setInterval(() => {
            const obstacle = new Obstacle(this.htmlElements.container);
            this.obstacles.push(obstacle);
        }, this.generateTime * 3 / 2)
    }
    generateClouds() {
        this.cloudsGenerator = setInterval(() => {
            const cloud = new Cloud(this.htmlElements.container);
            this.clouds.push(cloud);
        }, this.generateTime)
    }

    removeObstacle() {
        this.obstacles.shift();
    }

    removeCloud() {
        this.clouds.shift();
    }

    collisionInterval() {
        this.colisionInt = setInterval(() => this.checkCollision(), 1);
    }

    checkCollision() {

        this.obstacles.forEach(obstacle => {
            if ((this.character.positionX + CHARACTER_WIDTH - 6 >= obstacle.positionX) && (this.character.positionX + 6 <= obstacle.positionX + obstacle.width) && (this.character.positionY + 2 <= obstacle.positionY + obstacle.height * 100 / CONTAINER_HEIGHT)) {
                clearInterval(obstacle.interval);
                clearInterval(this.obstacleGenerator);
                clearInterval(this.character.jumpInterval);
                this.character.stopEventListeners();
                this.character.stopAnimation();
                this.obstacleGenerator = null;
                this.cloudsGenerator = null;
                this.character.stopAnimation();
            }
        })
    }
}

export const game = new Game();
game.init();