import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();
const origin = new Vector(canvas.width / 2, 20);
let particles;

canvas.setup(() => {
    particles = [];
});

canvas.draw(({ utils }) => {
    particles.push(new Particle());

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.applyGravity().removeLife().update();

        if (particle.dead) {
            particles.splice(i, 1);
        }
    }

    utils.clear().drawArray(particles);
});

class Particle {
    pos = origin.copy();
    vel = new Vector();
    acc = Vector.randomUnit().setMag(1.5);
    radius = 5;
    dead = false;

    constructor(lifespan = 75) {
        this.lifespan = lifespan;
        this.initialLifespan = lifespan;
    }

    applyGravity() {
        this.acc.add(new Vector(0, 0.2));
        return this;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        return this;
    }

    removeLife() {
        this.lifespan -= 1;
        if (this.lifespan <= 0 || this.pos.y >= canvas.height + this.radius) {
            this.dead = true;
        }

        return this;
    }

    draw(utils) {
        utils
            .custom("save")
            .customSet(
                "globalAlpha",
                CustomMath.map(this.lifespan, 0, this.initialLifespan, 0, 1)
            )
            .fill("#7f7f7f")
            .stroke("#000")
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill()
            .stroke()
            .custom("restore");
    }
}
