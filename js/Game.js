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
            obstaclesContainer: document.getElementById('obstacles-container'),
            cloudsContainer: document.getElementById('clouds-container'),
            score: document.getElementById('score'),
            lossScreen: document.getElementById('loss'),
            lossScreenPoints: document.getElementById('loss-score'),
            recordScreenPoints: document.getElementById('record-score'),
            modal: document.getElementById('modal'),
            restartBtn: document.getElementById('restart-button'),
        }

        this.score = {
            result: 0,
            interval: null,
        }

        this.obstacles = {
            array: [],
            generator: null,
            generateTime: 3400,
            speedLevel: null,
        };

        this.clouds = {
            array: [],
            generator: null,
            generateTime: 2000,
        }

        this.collisionInt = null;

        this.character = new Character(this.htmlElements.character, this.htmlElements.container);
        this.htmlElements.restartBtn.addEventListener('click', this.restartGame);
        this.cloudsGenerator();
    }

    init() {
        this.character.init();
        this.obstacleGenerator(this.obstacles.generateTime);
        this.adjustSpeedLevel();
        this.scoreCounter();
        this.collisionInterval();
    }

    obstacleGenerator(time) {
        this.obstacles.generator = setInterval(() => {
            this.generateObstacle();
        }, time)
    }

    generateObstacle() {
        const obstacle = new Obstacle(this.htmlElements.obstaclesContainer);
        this.obstacles.array.push(obstacle);
    }

    cloudsGenerator() {
        this.clouds.generator = setInterval(() => {
            const cloud = new Cloud(this.htmlElements.cloudsContainer);
            this.clouds.array.push(cloud);
        }, this.clouds.generateTime)
    }

    removeObstacle() {
        this.obstacles.array.shift();
    }

    removeCloud() {
        this.clouds.array.shift();
    }

    scoreCounter() {
        this.score.interval = setInterval(() => {
            this.score.result++;
            this.scoreDisplay();
        }, 1500)
    }

    scoreDisplay() {
        this.htmlElements.score.textContent = this.score.result;
    }

    changeSpeedLevel(time) {
        clearInterval(this.obstacles.generator)
        this.obstacles.generator = null;
        this.obstacleGenerator(time);
    }

    adjustSpeedLevel() {
        this.obstacles.speedLevel = setInterval(() => {
            if (this.obstacles.generateTime >= 1000) {
                this.obstacles.generateTime -= 300;
                this.changeSpeedLevel(this.obstacles.generateTime);
            }
        }, 8000)
    }

    collisionInterval() {
        this.collisionInt = setInterval(() => this.checkCollision(), 1);
    }

    checkCollision() {
        this.obstacles.array.forEach(obstacle => {
            if ((this.character.positionX + CHARACTER_WIDTH - 12 >= obstacle.positionX) && (this.character.positionX + 12 <= obstacle.positionX + obstacle.width) && (this.character.positionY + 3 <= obstacle.positionY + obstacle.height * 100 / CONTAINER_HEIGHT)) {
                this.stopAndRemoveObstacle(obstacle);
                this.stopCharacter();
                this.stopScoring();
                this.showCollision();
                this.stopCheckingCollision();
                clearInterval(this.obstacles.speedLevel);
                this.obstacles.speedLevel = null;
                setTimeout(this.showResult, 3000);
            }
        })
    }

    stopAndRemoveObstacle(object) {
        clearInterval(this.obstacles.generator);
        clearInterval(object.interval);
        setTimeout(() => {
            object.removeObstacle();
        }, 3000);
        this.obstacles.generator = null;
    }

    stopCharacter() {
        clearInterval(this.character.jumpInterval);
        this.character.stopEventListeners();
        this.character.leftArrow = false;
        this.character.rightArrow = false;
        this.character.stopAnimation();
    }

    stopScoring() {
        if (this.score.result > parseInt(localStorage.getItem('record'))
            || Number.isNaN(parseInt(localStorage.getItem('record')))) {
            localStorage.setItem('record', this.score.result);
        }
        clearInterval(this.score.interval);
    }

    stopCheckingCollision() {
        clearInterval(this.collisionInt);
        this.collisionInt = null;
    }

    showCollision() {
        this.htmlElements.lossScreen.classList.add('loss-screen');
    }

    showResult = () => {
        this.htmlElements.modal.classList.add('modal-result--visible');
        this.htmlElements.lossScreenPoints.textContent = this.score.result;
        this.htmlElements.recordScreenPoints.textContent = localStorage.getItem('record');
        this.htmlElements.restartBtn.disabled = false;
    }

    restartGame = () => {
        this.obstacles.generateTime = 3400;
        this.score.result = 0;
        this.scoreDisplay();


        this.htmlElements.restartBtn.disabled = true;
        this.htmlElements.lossScreen.classList.remove('loss-screen');
        this.htmlElements.modal.classList.remove('modal-result--visible');

        this.obstacles.array = [];
        this.clouds.array = [];

        this.character.resumeAnimation();
        this.character = new Character(this.htmlElements.character, this.htmlElements.container);

        this.init();
    }
}

export const game = new Game();
game.init();