const defaultFontStyle = "14px Arial";

export default class CanvasUtils {
    /**
     * create a new wrapper around the canvas context for easier rendering
     * @param {Canvas} canvas - canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.ctx;
        this.font();
    }

    /**
     * Fill the canvas with a solid color
     * @param {string} backgroundColor - background color of the canvas
     * @returns {CanvasUtils}
     */
    background(backgroundColor) {
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        return this;
    }

    /**
     * Clear the canvas
     * @returns {CanvasUtils}
     */
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        return this;
    }

    /**
     * Set the fill style of the canvas
     * @param {string} fillStyle - color
     * @returns {CanvasUtils}
     */
    fill(fillStyle) {
        fillStyle ? (this.ctx.fillStyle = fillStyle) : this.ctx.fill();
        return this;
    }

    /**
     * Set the fill style to transparent
     * @returns {CanvasUtils}
     */
    noFill() {
        this.fill("transparent");
        return this;
    }

    /**
     * Set the stroke style of the canvas
     * @param {string} strokeStyle - color
     * @returns {CanvasUtils}
     */
    stroke(strokeStyle) {
        strokeStyle ? (this.ctx.strokeStyle = strokeStyle) : this.ctx.stroke();
        return this;
    }

    /**
     * Set the stroke style to transparent
     * @returns {CanvasUtils}
     */
    noStroke() {
        this.stroke("transparent");
        return this;
    }

    /**
     * Set the line width
     * @param {number} width - line width
     * @returns {CanvasUtils}
     */
    strokeWidth(width) {
        this.ctx.lineWidth = width;
        return this;
    }

    /**
     * Draw an ellipse
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} width - x radius of the ellipse
     * @param {number} height - y radius of the ellipse
     * @returns {CanvasUtils}
     */
    ellipse(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
        return this;
    }

    /**
     * Draw a circle, wrapper around ellipse
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} radius - radius of the circle
     * @returns {CanvasUtils}
     */
    circle(x, y, radius) {
        return this.ellipse(x, y, radius, radius);
    }

    /**
     * Draw a rectangle
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} width - width of the rectangle
     * @param {number} height - height of the rectangle
     * @returns {CanvasUtils}
     */
    rect(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        return this;
    }

    /**
     * Draw a rectangle using x & y as a center
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} width - width of the rectangle
     * @param {number} height - height of the rectangle
     * @returns {CanvasUtils}
     */
    rectCenter(x, y, width, height) {
        return this.rect(x - width / 2, y - height / 2, width, height);
    }

    /**
     * Draw a square, wrapper around rect
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {number} width - width of the rectangle
     * @returns {CanvasUtils}
     */
    square(x, y, width) {
        return this.rect(x, y, width, width);
    }

    /**
     * Draw a line
     * @param {number} x1 - Ax coordinate
     * @param {number} y1 - Ay coordinate
     * @param {number} x2 - Bx coordinate
     * @param {number} y2 - By coordinate
     * @returns {CanvasUtils}
     */
    line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        return this;
    }

    /**
     * Set font style
     * @param {string|boolean} fontStyle - font style
     * @returns {CanvasUtils}
     */
    font(fontStyle = false) {
        this.fontStyle = fontStyle || defaultFontStyle;
        this.ctx.font = this.fontStyle;
        return this;
    }

    /**
     * Custom ctx functions
     * @param {string} func - function name
     * @param  {...any} args - function arguments
     * @returns
     */
    custom(func, ...args) {
        this.ctx[func](...args);
        return this;
    }

    /**
     * Custom ctx properties
     * @param {string} property - property name
     * @param {*} value - new property value
     */
    customSet(property, value) {
        this.ctx[property] = value;
        return this;
    }

    /**
     * Chain multiple renders together
     * @param {*} object - any object with .draw as a function
     * @returns {CanvasUtils}
     */
    draw(object) {
        if (typeof object.draw === "function") {
            object.draw(this);
            return this;
        }
    }

    /**
     * Chain multiple renders together
     * @param {*} objects - array of any objects with .draw as a function
     */
    drawArray(objects) {
        for (const object of objects) {
            this.draw(object);
        }
    }
}
