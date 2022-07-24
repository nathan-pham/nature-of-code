import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

const gravity = new Vector(0, 0.2);
const wind = new Vector(0.3, 0);
const mu = 0.1;

let movers;

canvas.setup(() => {
    movers = new Array(5).fill(0).map(() => new Mover());
});

canvas.draw(({ mouse, utils }) => {
    // update loop
    for (const mover of movers) {
        mover.acc.add(gravity); // directly apply gravity - mass has no effect here
        if (mouse.down) {
            mover.applyForce(wind); // apply wind
        }

        mover.update().boundaries();
    }

    utils.clear();

    utils
        .fill("#000")
        .custom("fillText", "Press your mouse to apply wind!", 10, 22);

    // render loop
    for (const mover of movers) {
        utils.draw(mover);
    }
});

class Mover {
    pos = new Vector(canvas.width / 2, canvas.height / 2);
    vel = new Vector();
    acc = new Vector();
    mass = 3;
    radius = 10;

    constructor() {
        this.mass = CustomMath.random(1, 10);
        this.radius = this.mass * 3;

        this.pos.x = CustomMath.random(this.radius, canvas.width - this.radius);
    }

    applyForce(force) {
        this.acc.add(force.copy().div(this.mass));
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
