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
        this.createCanvas();
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
    }

    /**
     * start the animation loop
     * @param {Function} _animate - function to be called on each animation frame
     */
    draw(_animate) {
        const animate = () => {
            _animate(this);
            this.animationId = window.requestAnimationFrame(animate);
        };

        animate();
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
    }

    /**
     * stop animation & clear canvas
     */
    unmount() {
        cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}
