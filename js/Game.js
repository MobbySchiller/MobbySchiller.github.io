import { Character, CHARACTER_WIDTH } from './Character.js';
import { Obstacle } from './Obstacle.js';

export const DEFAULT_POSITION_Y = 33;
export const CONTAINER_WIDTH = 800;
const CONTAINER_HEIGHT = 400;

class Game {

    constructor() {
        this.htmlElements = {
            character: document.getElementById('character'),
            container: document.getElementById('game-container'),
        }
        this.obstacles = [];
        this.generateTime = 3000;
        this.colisionInt = null;

        this.character = new Character(this.htmlElements.character, this.htmlElements.container);
    }

    init() {
        this.character.init();
        this.generateObstacle();
        this.collisionInterval();
        // console.log("Character positiontX: " + this.character.positionX);
        // console.log("Obstacle positiontX: " + this.obstacle.positionX);
        // console.log(`Character positiontX + width:  ${this.character.positionX + CHARACTER_WIDTH}`);
        // console.log(`Obstacle positiontX + width: ${this.obstacle.positionX + this.obstacle.width}`);
        // console.log(`Character positiontY:  ${this.character.positionY}`);
        // console.log(`Obstacle positiontY:  ${this.obstacle.positionY}`);
        // console.log(`Obstacle positiontY + height:  ${this.obstacle.positionY + this.obstacle.height}`);
    }

    generateObstacle() {
        this.generator = setInterval(() => {
            const obstacle = new Obstacle(this.htmlElements.container);
            this.obstacles.push(obstacle);
        }, this.generateTime)
    }

    removeObstacle() {
        this.obstacles.shift();
    }

    collisionInterval() {
        this.colisionInt = setInterval(() => this.checkCollision(), 1);
    }

    checkCollision() {

        this.obstacles.forEach(obstacle => {
            if ((this.character.positionX + CHARACTER_WIDTH >= obstacle.positionX) && (this.character.positionX <= obstacle.positionX + obstacle.width) && (this.character.positionY <= obstacle.positionY + obstacle.height * 100 / CONTAINER_HEIGHT)) {
                clearInterval(obstacle.interval);
                clearInterval(this.generator);
                clearInterval(this.character.jumpInterval);
                this.character.stopAnimation();
            }
        })
    }
}

export const game = new Game();
game.init();