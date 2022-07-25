import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

const origin = new Vector(canvas.width / 2, canvas.height / 2);
let ball, trampoline;

canvas.setup(() => {
    ball = new Ball(new Vector(origin.x, 30));
    trampoline = new Trampoline();
});

canvas.draw(({ utils }) => {
    ball.contact(trampoline).applyGravity().update();

    utils.clear().drawArray([trampoline, ball]);
});

class Ball {
    pos = Vector.zero();
    vel = Vector.zero();
    acc = Vector.zero();
    radius = 15;
    mass = 30;

    constructor(pos) {
        this.pos = pos;
    }

    draw(utils) {
        utils
            .fill("#fff")
            .stroke("#000")
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill()
            .stroke();
    }

    applyForce(force) {
        this.acc.add(force.copy().div(this.mass));
        return this;
    }

    applyGravity() {
        const gravity = new Vector(0, 0.1);
        this.acc.add(gravity);
        return this;
    }

    update() {
        this.vel.add(this.acc);
        this.vel.mult(0.99);
        this.pos.add(this.vel);
        this.acc.mult(0);
        return this;
    }

    contact(trampoline) {
        if (
            this.pos.y + this.radius >=
            canvas.height - trampoline.restingHeight
        ) {
            // compress trampoline
            trampoline.height = canvas.height - ball.pos.y - ball.radius;
            trampoline.contact(this);
        } else {
            trampoline.height = trampoline.restingHeight;
        }

        return this;
    }
}

class Trampoline {
    constructor(k = 1, width = 200, restingHeight = 60) {
        this.k = k;
        this.width = width;
        this.height = restingHeight;
        this.restingHeight = restingHeight;

        this.pos = new Vector(canvas.width / 2, canvas.height);
    }

    setHeight(newHeight) {
        this.height = newHeight;
    }

    contact(ball) {
        ball.applyForce(
            new Vector(0, this.k * (this.height - this.restingHeight))
        );
    }

    draw(utils) {
        utils
            .fill("#000")
            .rect(
                this.pos.x - this.width / 2,
                this.pos.y,
                this.width,
                -this.height
            )
            .fill();
    }
}
