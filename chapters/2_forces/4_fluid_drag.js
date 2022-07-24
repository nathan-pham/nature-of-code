import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

// F_drag = -0.5 * p * ||v||^2 * A * C_d * v_unit
// p = density of air -> default 1
// A = area of object
// C_d = drag coefficient

// could be simplified to
// F_drag = -C_d * ||v||^2 * v_unit

const generateDrag = (vel) =>
    vel
        .copy()
        .normalize()
        .mult(-1 * C_d * Math.pow(vel.mag(), 2));

const gravity = new Vector(0, 0.2);
const C_d = 0.4;

const moversSize = 5;
const fluidHeight = canvas.height / 2;

let movers;

canvas.setup(() => {
    movers = new Array(moversSize).fill(0).map((_, i) => new Mover(i));
});

canvas.draw(({ mouse, utils }) => {
    // update movers
    for (const mover of movers) {
        mover.applyGravity().applyDrag().update().boundaries();
    }

    // draw fluid
    utils
        .clear()
        .fill("#333233")
        .rect(0, fluidHeight, canvas.width, canvas.height - fluidHeight)
        .fill();

    // draw movers
    for (const mover of movers) {
        utils.draw(mover);
    }
});

class Mover {
    pos = new Vector(canvas.width / 2, 40);
    vel = new Vector();
    acc = new Vector();
    mass = 3;
    radius = 10;

    constructor(i) {
        this.mass = CustomMath.random(1, 10);
        this.radius = this.mass * 3;
        this.pos.x = CustomMath.lerp(0, canvas.width, (i + 0.5) / moversSize);
    }

    applyForce(force) {
        this.acc.add(force.copy().div(this.mass));
        return this;
    }

    applyGravity() {
        this.acc.add(gravity);
        return this;
    }

    applyDrag() {
        if (this.pos.y - this.radius > fluidHeight) {
            this.applyForce(generateDrag(this.vel));
        }

        return this;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        return this;
    }

    boundaries() {
        if (this.pos.x < this.radius) {
            this.pos.x = this.radius;
            this.vel.x *= -1;
        }

        if (this.pos.x > canvas.width - this.radius) {
            this.pos.x = canvas.width - this.radius;
            this.vel.x *= -1;
        }

        if (this.pos.y < this.radius) {
            this.pos.y = this.radius;
            this.vel.y *= -1;
        }

        if (this.pos.y > canvas.height - this.radius) {
            this.pos.y = canvas.height - this.radius;
            this.vel.y *= -1;
        }

        return this;
    }

    draw(utils) {
        utils
            .fill("#7f7f7f")
            .stroke("#000")
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill()
            .stroke();
    }
}
