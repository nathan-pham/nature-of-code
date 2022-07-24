import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

import { Mover as BaseMover } from "./1_mover.js";

export const canvas = new Canvas();

// F_drag = -0.5 * p * ||v||^2 * A * C_d * v_unit
// p = density of air -> default 1
// A = area of object
// C_d = drag coefficient

// could be simplified to
// F_drag = -C_d * ||v||^2 * v_unit

const gravity = new Vector(0, 0.2);

const moversSize = 6;
const fluidHeight = canvas.height / 2;
const fluidDragConstant = 0.4;

let liquid;
let movers;

canvas.setup(() => {
    liquid = new Liquid(fluidHeight, fluidDragConstant);
    movers = new Array(moversSize).fill(0).map((_, i) => new Mover(i));
});

canvas.draw(({ utils }) => {
    // update movers
    for (const mover of movers) {
        mover
            .applyGravity()
            .applyDrag(liquid.drag(mover))
            .update()
            .boundaries();
    }

    // draw liquid and movers
    utils.clear().draw(liquid).drawArray(movers);
});

class Liquid {
    constructor(fluidHeight, fluidDragConstant) {
        this.height = fluidHeight;
        this.C_d = fluidDragConstant;
    }

    contains(mover) {
        if (mover.pos.y - mover.radius > this.height) {
            return true;
        }

        return false;
    }

    drag(mover) {
        // return drag force if mover is in the liquid
        if (this.contains(mover)) {
            return mover.vel
                .copy()
                .normalize()
                .mult(-1 * this.C_d * Math.pow(mover.vel.mag(), 2));
        }

        return new Vector(0, 0);
    }

    draw(utils) {
        utils
            .fill("#333233")
            .rect(0, this.height, canvas.width, canvas.height - this.height)
            .fill();

        return this;
    }
}

class Mover extends BaseMover {
    constructor(i) {
        super();

        this.mass = CustomMath.random(3, 10);
        this.radius = this.mass * 3;

        this.pos.x = CustomMath.lerp(0, canvas.width, (i + 0.5) / moversSize);
        this.pos.y = 40;
    }

    applyForce(force) {
        this.acc.add(force.copy().div(this.mass));
        return this;
    }

    applyGravity() {
        this.acc.add(gravity);
        return this;
    }

    applyDrag(drag) {
        return this.applyForce(drag);
    }
}
