export default class Vector {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds two vectors together
     * @param {Vector} vector
     * @returns {Vector}
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Subtracts two vectors from each other (wrapper around add)
     * @param {Vector} vector
     * @returns {Vector}
     */
    sub(vector) {
        return this.add(vector.copy().mult(-1));
    }

    /**
     * Multiplies a vector by a scalar
     * @param {Vector} scalar - scalar to multiply vector by
     * @returns {Vector}
     */
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divides a vector by a scalar (wrapper around mult)
     * @param {Vector} scalar - scalar to divide by
     * @returns {Vector}
     */
    div(scalar = 1) {
        return this.mult(1 / scalar);
    }

    /**
     * Get the magnitude of a vector
     * @returns {number}
     */
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalize vector to a length of 1
     * @returns {Vector}
     */
    normalize() {
        return this.div(this.mag());
    }

    /**
     * Limit the length of a vector
     * @param {number} max - maximum vector length
     * @returns
     */
    limit(max) {
        if (this.mag() > max) {
            this.normalize().mult(max);
        }

        return this;
    }

    /**
     * Get the angle of the vector in radians
     * @returns {number}
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Rotate the vector by a certain amount
     * @param {number} angle - amount of rotate vector in radians
     * @returns {Vector}
     */
    rotate(angle) {
        const mag = this.mag();
        this.x = Math.cos(angle) * mag;
        this.y = Math.sin(angle) * mag;

        return this;
    }

    /**
     * Get a string representation of the vector
     * @returns {string}
     */
    toString() {
        return `Vector(${this.x}, ${this.y})`;
    }

    /**
     * Create a complete copy of the vector
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y);
    }

    /**
     * Create a vector from an angle
     * @param {number} angle - angle in radians
     * @param {number} mag - magnitude of vector
     * @returns
     */
    static fromAngle(angle, mag = 1) {
        return new Vector(Math.cos(angle) * mag, Math.sin(angle) * mag);
    }

    /**
     * Generate a random vector
     * @param {number} min - minimum random value
     * @param {number} max - maximum random value
     * @returns
     */
    static random(min = 0, max = 1) {
        return new Vector(
            Math.random() * (max - min) + min,
            Math.random() * (max - min) + min
        );
    }

    /**
     * Create a vector populated with zeroes
     * @returns {Vector}
     */
    static zero() {
        return new Vector(0, 0);
    }
}
