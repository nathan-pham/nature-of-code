import CanvasUtils from "./CanvasUtils.js";
import Mouse from "./Mouse.js";

export default class Canvas {
    /**
     * create a new utility Canvas
     * @param {number} width - width of the canvas
     * @param {number} height - height of the canvas
     */
    constructor(width = 800, height = 200) {
        this.width = width;
        this.height = height;

        this.animationId = 0;

        // callbacks
        this.animationCb = () => {};
        this.setupCb = () => {};

        this.createCanvas();
        this.createMouse();
    }

    /**
     * create a new canvas (or use existing one)
     */
    createCanvas() {
        const existingCanvas = document.querySelector("canvas");
        this.canvas = existingCanvas || document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        // update canvas dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        // create canvas utils
        this.utils = new CanvasUtils(this.ctx);
    }

    /**
     * create a new mouse
     */
    createMouse() {
        this.mouse = new Mouse(this);
        this.mouse.addEventListeners();
    }

    /**
     * store setup callback
     * @param {Function} cb - function to be called after canvas is mounted
     */
    setup(cb) {
        this.setupCb = cb;
    }

    /**
     * store animation callback
     * @param {Function} cb - function to be called on each animation frame
     */
    draw(cb) {
        this.animationCb = cb;
    }

    /**
     * add canvas to the screen
     */
    mount() {
        const app = document.getElementById("app") || document.body;
        const existingCanvas = document.querySelector("canvas");

        if (!existingCanvas) {
            app.appendChild(this.canvas);
        }

        this.setupCb(this);

        // start animation
        const animate = () => {
            this.animationCb(this);
            this.animationId = window.requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * stop animation & clear canvas
     */
    unmount() {
        cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.mouse.removeEventListeners();
    }
}
