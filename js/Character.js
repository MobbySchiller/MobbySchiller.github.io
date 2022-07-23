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
    }

    init() {
        this.setPosition();
        this.eventListeners();
        this.gameLoop();
    }

    setPosition() {
        this.element.style.left = `${this.positionX}px`;
        this.element.style.bottom = `${this.positionY}%`;
    }

    eventListeners() {
        window.addEventListener('keydown', (e) => {
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
                    console.log('w górę');
                    if (!this.allowToJump) {
                        this.allowToJump = true;
                        this.goUp = true;
                        this.jumpUp();
                    }
                    break;
            }
        })
        window.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 37:
                    this.leftArrow = false;
                    break;
                case 39:
                    this.rightArrow = false;
                    break;
            }
        })
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
        this.setPosition();
    }

    jumpUp() {
        this.stopAnimation();
        this.jumpInterval = setInterval(() => this.verticalMove(), 14);
    }

    stopAnimation() {
        if (this.allowToJump) {
            this.element.classList.remove('character--animation');
        } else {
            this.element.classList.add('character--animation');
        }
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
                this.stopAnimation();
                clearInterval(this.jumpInterval);
                this.jump = null;
            }
        }
        this.setPosition();
    }
}