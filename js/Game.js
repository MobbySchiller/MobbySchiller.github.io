import { Character, CHARACTER_WIDTH } from './Character.js';
import { Obstacle } from './Obstacle.js';

export const DEFAULT_POSITION_Y = 33;
export const CONTAINER_WIDTH = 800;

class Game {

    constructor() {
        this.htmlElements = {
            character: document.getElementById('character'),
            container: document.getElementById('game-container'),
        }
        this.obstacles = [];
        this.generateTime = 1000;

        this.character = new Character(this.htmlElements.character, this.htmlElements.container);
        this.obstacle = new Obstacle(this.htmlElements.container);
    }

    init() {
        this.character.init();
        this.generateObstacle();
    }

    generateObstacle() {
        this.generator = setInterval(() => {
            const obstacle = new Obstacle(this.htmlElements.container);
            this.obstacles.push(obstacle);
            this.checkCollision();
        }, this.generateTime)
    }

    removeObstacle() {
        this.obstacles.shift();
    }
}

export const game = new Game();
game.init();