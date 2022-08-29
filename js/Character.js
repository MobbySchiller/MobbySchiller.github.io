import { DEFAULT_POSITION_Y, CONTAINER_WIDTH } from './Game.js'

export const CHARACTER_WIDTH = 42;
const DEFAULT_POSITION_X = 100;
const MAX_POSITION_Y = 54;

export class Character {

    constructor(element, container) {
        this.element = element;
        this.container = container;
        this.positionX = DEFAULT_POSITION_X;
        this.positionY = DEFAULT_POSITION_Y;
        this.leftArrow = false;
        this.rightArrow = false;
        this.modifier = 3;
        this.jumpInterval = null;
        this.goUp = true;
        this.allowToJump = false;
        this.gameLoop();
    }

    init() {
        this.setPosition(DEFAULT_POSITION_X, DEFAULT_POSITION_Y);
        this.eventListeners();
    }

    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.bottom = `${y}%`;
    }

    eventListeners() {
        window.addEventListener('keydown', this.keydownAction);
        window.addEventListener('keyup', this.keyupAction);
    }

    stopEventListeners() {
        window.removeEventListener('keydown', this.keydownAction);
        window.removeEventListener('keyup', this.keyupAction);
    }

    keydownAction = (e) => {
        switch (e.keyCode) {
            case 37:
                this.leftArrow = true;
                this.rotateCharacter(e.keyCode)
                this.horizontalMove();
                break;
            case 39:
                this.rightArrow = true;
                this.rotateCharacter(e.keyCode)
                this.horizontalMove();
                break;
            case 32:
                if (!this.allowToJump) {
                    this.allowToJump = true;
                    this.goUp = true;
                    this.jumpUp();
                }
                break;
        }
    }

    keyupAction = (e) => {
        switch (e.keyCode) {
            case 37:
                this.leftArrow = false;
                break;
            case 39:
                this.rightArrow = false;
                break;
        }
    }

    gameLoop = () => {
        this.horizontalMove()
        requestAnimationFrame(this.gameLoop)
    }

    rotateCharacter(key) {
        if (key == 37) {
            this.element.classList.add('character--go-back');
        } else if (key == 39) {
            this.element.classList.remove('character--go-back');
        }
    }

    horizontalMove() {
        if (this.rightArrow && this.positionX + CHARACTER_WIDTH < CONTAINER_WIDTH) {
            this.positionX += this.modifier;
        } else if (this.leftArrow && this.positionX > 0) {
            this.positionX -= this.modifier;
        }
        this.setPosition(this.positionX, this.positionY);
    }

    jumpUp() {
        this.checkAnimation();
        this.jumpInterval = setInterval(() => this.verticalMove(), 14);
    }

    checkAnimation() {
        if (this.allowToJump) {
            this.stopAnimation();
        } else {
            this.resumeAnimation();
        }
    }

    stopAnimation() {
        this.element.classList.remove('character--animation');
    }

    resumeAnimation() {
        this.element.classList.add('character--animation');
    }

    verticalMove() {
        if (this.goUp) {
            if (this.positionY < MAX_POSITION_Y) {
                this.positionY += 1;
            } else {
                this.goUp = false;
            }
        } else {
            if (this.positionY > DEFAULT_POSITION_Y) {
                this.positionY -= 1;
            } else {
                this.allowToJump = false;
                this.checkAnimation();
                clearInterval(this.jumpInterval);
                this.jump = null;
            }
        }
        this.setPosition(this.positionX, this.positionY);
    }
}