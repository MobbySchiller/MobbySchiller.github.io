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
            lossScreenPoints: document.getElementById('loss-points'),
            modal: document.getElementById('modal'),
            restartBtn: document.getElementById('restart-button'),
        }
        this.score = 0;
        this.scoreInterval = null;
        this.obstacles = [];
        this.obstacleGenerator = null;
        this.clouds = [];
        this.cloudsGenerator = null;
        this.generateTime = 2000;
        this.colisionInt = null;

        this.character = new Character(this.htmlElements.character, this.htmlElements.container);
        this.htmlElements.restartBtn.addEventListener('click', this.restartGame);
    }

    init() {
        this.character.init();
        this.generateObstacle();
        this.generateClouds();
        this.scoreCounter();
        this.collisionInterval();
    }

    generateObstacle() {
        this.obstacleGenerator = setInterval(() => {
            const obstacle = new Obstacle(this.htmlElements.obstaclesContainer);
            this.obstacles.push(obstacle);
        }, this.generateTime * 3 / 2)
    }
    generateClouds() {
        this.cloudsGenerator = setInterval(() => {
            const cloud = new Cloud(this.htmlElements.cloudsContainer);
            this.clouds.push(cloud);
        }, this.generateTime)
    }

    removeObstacle() {
        this.obstacles.shift();
    }

    removeCloud() {
        this.clouds.shift();
    }

    scoreDisplay() {
        this.htmlElements.score.textContent = this.score;
    }

    scoreCounter() {
        this.scoreInterval = setInterval(() => {
            this.score++;
            this.scoreDisplay();
        }, 1500)
    }

    collisionInterval() {
        this.colisionInt = setInterval(() => this.checkCollision(), 1);
    }

    checkCollision() {
        this.obstacles.forEach(obstacle => {
            if ((this.character.positionX + CHARACTER_WIDTH - 6 >= obstacle.positionX) && (this.character.positionX + 6 <= obstacle.positionX + obstacle.width) && (this.character.positionY + 2 <= obstacle.positionY + obstacle.height * 100 / CONTAINER_HEIGHT)) {
                this.stopObstacle(obstacle);
                this.stopCharacter();
                this.stopScoring();
                this.showCollision();
                this.stopCheckingCollision();
                setTimeout(this.showResult, 3000);
            }
        })
    }

    stopObstacle(object) {
        clearInterval(this.obstacleGenerator);
        clearInterval(object.interval);
        setTimeout(() => {
            object.removeObstacle();
        }, 3000);
        this.obstacleGenerator = null;
    }

    stopCharacter() {
        clearInterval(this.character.jumpInterval);
        this.character.stopEventListeners();
        this.character.leftArrow = false;
        this.character.rightArrow = false;
        this.character.stopAnimation();
    }
    stopScoring() {
        clearInterval(this.scoreInterval);
    }

    stopCheckingCollision() {
        clearInterval(this.colisionInt);
    }

    showCollision() {
        this.htmlElements.lossScreen.classList.add('loss-screen');
    }

    showResult = () => {
        this.htmlElements.modal.classList.add('modal-result--visible');
        this.htmlElements.lossScreenPoints.textContent = this.score;
        this.htmlElements.restartBtn.disabled = false;
    }

    restartGame = () => {
        this.htmlElements.restartBtn.disabled = true;
        this.score = 0;
        this.htmlElements.lossScreen.classList.remove('loss-screen');
        this.htmlElements.modal.classList.remove('modal-result--visible');
        this.obstacles = [];
        this.clouds = [];
        this.scoreCounter();
        this.scoreDisplay();
        this.character.resumeAnimation();
        this.character = new Character(this.htmlElements.character, this.htmlElements.container);
        this.character.init();
        this.generateObstacle();
        this.collisionInterval();
        console.log(this.obstacleGenerator)
    }
}

export const game = new Game();
game.init();