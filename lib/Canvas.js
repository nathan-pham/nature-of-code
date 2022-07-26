import CanvasUtils from "./CanvasUtils.js";
import Mouse from "./Mouse.js";

export default class Canvas {
    /**
     * create a new utility Canvas
     * @param {number} width - width of the canvas
     * @param {number} height - height of the canvas
     */
    constructor(width = 800, height = 350) {
        this.width = width;
        this.height = height;

        this.animationId = 0;
        this.frameCount = 0;
        this.stopped = false;

        // callbacks
        this.resetCallbacks();
        this.createCanvas();
        this.createMouse();
    }

    resetCallbacks() {
        this.onUnmountCb = () => {};
        this.animationCb = () => {};
        this.setupCb = () => {};
    }

    /**
     * create a new canvas (or use existing one)
     */
    createCanvas() {
        const existingCanvas = document.querySelector("canvas");
        this.canvas = existingCanvas || document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        // update canvas dimensions
        this.updateSize();

        // create canvas utils
        this.utils = new CanvasUtils(this);
    }

    /**
     * Update the size of the canvas on mount
     */
    updateSize() {
        this.canvas.width = this.width * devicePixelRatio;
        this.canvas.height = this.height * devicePixelRatio;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
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

        this.updateSize();
        this.utils.mount();

        // reset frame count
        this.frameCount = 0;
        this.stopped = false;

        // setup
        this.onUnmountCb = this.setupCb(this);

        // start animation
        const animate = () => {
            if (this.stopped) {
                return;
            }

            this.frameCount++;
            this.animationCb(this);
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * stop animation & clear canvas
     */
    unmount() {
        cancelAnimationFrame(this.animationId);

        if (typeof this.onUnmountCb == "function") {
            this.onUnmountCb();
        }

        // stop
        this.stopped = true;

        // clear canvas ctx
        this.ctx.closePath();
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.mouse.removeEventListeners();
    }
}
