import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

import { Mover as BaseMover } from "../2_forces/1_mover.js";

export const canvas = new Canvas();

// Force of gravity = (G * m1 * m2) * r_unit / d^2
// r_unit = direction of force = location 2 - location 1

const G = 0.6;
const moversSize = 3;

let attracter;
let movers;

canvas.setup(() => {
    attracter = new Attracter();
    movers = new Array(moversSize).fill(0).map((_, i) => new Mover(i));

    movers.forEach((mover) => mover.applyForce(Vector.randomUnit().mult(5)));
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

        this.mass = 3;
        this.radius = 10;
        this.pos = new Vector(
            CustomMath.random(
                this.radius + 75,
                canvas.width - this.radius - 75
            ),
            CustomMath.random(this.radius, canvas.height - this.radius)
        );
    }

    draw(utils) {
        const lineWidth =
            Math.sin(canvas.frameCount / 20 + this.vel.mag() * 2) * 10;
        const x = this.radius * 2 + lineWidth;

        utils
            .custom("save")

            // draw car body
            .fill("rgba(0, 0, 0, 0.1)")
            .stroke("#000")
            .custom("translate", this.pos.x, this.pos.y)
            .custom("rotate", this.vel.angle())
            .rectCenter(0, 0, this.radius * 2, this.radius)
            .fill()
            .stroke()

            // draw "puller"
            .fill("#000")
            .stroke("#000")
            .line(0, 0, x, 0)
            .stroke()
            .circle(x, 0, 3)
            .fill()
            .custom("restore");
    }

    attract(mover) {
        return Attracter.attract(this, mover);
    }
}

class Attracter {
    pos = new Vector(canvas.width / 2, canvas.height / 2);
    radius = 10;
    mass = 55;

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
