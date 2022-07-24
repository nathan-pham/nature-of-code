import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

import { Mover as BaseMover } from "./1_mover.js";

export const canvas = new Canvas();

// Force of gravity = (G * m1 * m2) * r_unit / d^2
// r_unit = direction of force = location 2 - location 1

const G = 0.8;
const moversSize = 3;

let attracter;
let movers;

canvas.setup(() => {
    attracter = new Attracter();
    movers = new Array(moversSize).fill(0).map((_, i) => new Mover(i));

    movers.forEach((mover) => mover.applyForce(new Vector(5, 0)));
});

canvas.draw(({ utils }) => {
    for (const mover of movers) {
        mover.applyForce(attracter.attract(mover));

        // attractor forces between masses
        // for (const anotherMover of movers) {
        //     if (mover !== anotherMover) {
        //         mover.applyForce(anotherMover.attract(mover));
        //     }
        // }

        mover.update();
    }

    utils.clear().draw(attracter).drawArray(movers);
});

class Mover extends BaseMover {
    constructor(i) {
        super();

        this.mass = CustomMath.random(2, 5);
        this.radius = this.mass * 2;
        this.pos = new Vector(
            canvas.width / 2,
            CustomMath.lerp(0, canvas.height / 2, i / moversSize)
        );
    }

    draw(utils) {
        utils
            .fill("rgba(0, 0, 0, 0.1)")
            .stroke("#000")
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill()
            .stroke();
    }

    attract(mover) {
        return Attracter.attract(this, mover);
    }
}

class Attracter {
    pos = new Vector(canvas.width / 2, canvas.height / 2);
    radius = 20;
    mass = 50;

    draw(utils) {
        utils.fill("#000").circle(this.pos.x, this.pos.y, this.radius).fill();
    }

    static attract(objectA, objectB) {
        const force = objectA.pos.copy().sub(objectB.pos);
        const distance = CustomMath.constrain(force.mag(), 5, 25); // limit force because pixels are large

        return force
            .normalize()
            .mult(G * objectA.mass * objectB.mass)
            .div(Math.pow(distance, 2));
    }

    attract(mover) {
        return Attracter.attract(this, mover);
    }
}
