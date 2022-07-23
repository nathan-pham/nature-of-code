import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

let mover;

canvas.setup(() => {
    mover = new Mover();
});

canvas.draw(({ mouse, utils }) => {
    mover.applyForce(new Vector(0, 0.3)); // apply gravity
    if (mouse.down) {
        mover.applyForce(new Vector(0.2, 0)); // apply wind
    }

    mover.update().boundaries();

    utils.clear();
    utils
        .fill("#000")
        .custom("fillText", "Press your mouse to apply wind!", 10, 22)
        .draw(mover);
});

class Mover {
    pos = new Vector(canvas.width / 2, canvas.height / 2);
    vel = new Vector();
    acc = new Vector();
    radius = 10;

    constructor() {}

    applyForce(force) {
        this.acc.add(force);
        return this;
    }

    update() {
        this.vel.add(this.acc);
        this.vel.mult(0.999); // apply friction
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
