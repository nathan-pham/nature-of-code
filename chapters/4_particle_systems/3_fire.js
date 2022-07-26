import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();
const origin = new Vector(canvas.width / 2, canvas.height - 30);
let particles = [];

canvas.setup(() => {
    particles = [];
});

canvas.draw(({ mouse, utils }) => {
    particles.push(new Particle(origin));

    const windX = CustomMath.map(mouse.x, 0, canvas.width, -0.1, 0.1);
    const wind = new Vector(windX, 0);

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.applyGravity().applyForce(wind).removeLife().update();
        if (particle.dead) {
            particles.splice(i, 1);
        }
    }

    utils
        // draw background
        .background("#000")

        // draw text
        .fill("#fff")
        .custom(
            "fillText",
            "Move your mouse to change the wind's direction!",
            10,
            22
        )

        // draw wind direction slider
        .stroke("#fff")
        .line(canvas.width / 2, 60, canvas.width / 2 + windX * 1000, 60)
        .stroke()
        .fill("#fff")
        .circle(canvas.width / 2 + windX * 1000, 60, 2)
        .fill()

        // draw particle system
        .drawArray(particles);
});

class Particle {
    pos = new Vector();
    vel = new Vector(CustomMath.randomNormal(-1.5, 1.5), 0);
    acc = new Vector();
    radius = 20;
    dead = false;

    constructor(origin, lifespan = 50) {
        this.pos = origin.copy();

        this.lifespan = lifespan;
        this.initialLifespan = lifespan;
    }

    applyGravity() {
        this.acc.add(new Vector(0, -0.1));
        return this;
    }

    applyForce(force) {
        this.acc.add(force);
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
        if (this.lifespan <= 0 || this.pos.y <= -this.radius) {
            this.dead = true;
        }

        return this;
    }

    draw(utils) {
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
        const gradient = utils.ctx.createRadialGradient(
            this.pos.x,
            this.pos.y,
            0,
            this.pos.x,
            this.pos.y,
            this.radius
        );

        gradient.addColorStop(0, "yellow");
        gradient.addColorStop(0.25, "orange");
        gradient.addColorStop(0.5, "red");
        gradient.addColorStop(0.99, "transparent");

        utils
            .custom("save")
            .customSet(
                "globalAlpha",
                CustomMath.map(this.lifespan, 0, this.initialLifespan, 0, 1)
            )
            // https://stackoverflow.com/questions/42740839/html5-canvas-blendmode
            // blending
            .customSet("globalCompositeOperation", "lighter")
            .fill(gradient)
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill()
            .custom("restore");
    }
}
