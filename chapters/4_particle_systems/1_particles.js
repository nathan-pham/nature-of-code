import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();
let particleSystems;

canvas.setup(({ mouse }) => {
    particleSystems = [];

    mouse.onPress(() => {
        particleSystems.push(new ParticleSystem(mouse.pos.copy()));
    });
});

canvas.draw(({ utils }) => {
    for (const system of particleSystems) {
        system.update();
    }

    utils
        .clear()
        // draw text
        .fill("#000")
        .custom(
            "fillText",
            "Press you mouse to create a new particle system!",
            10,
            22
        )

        // draw particle systems
        .drawArray(particleSystems);
});

class ParticleSystem {
    particles = [];
    origin = new Vector(canvas.width / 2, canvas.height / 2);

    constructor(origin) {
        this.origin = origin;
    }

    update() {
        this.particles.push(
            Math.random() > 0.5
                ? new Particle(this.origin)
                : new SquareParticle(this.origin)
        );

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            particle.applyGravity().removeLife().update();
            if (particle.dead) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(utils) {
        utils.drawArray(this.particles);
    }
}

class Particle {
    pos = new Vector();
    vel = new Vector();
    acc = Vector.randomUnit().setMag(2);
    radius = 5;
    dead = false;

    constructor(origin, lifespan = 75) {
        this.pos = origin.copy();

        this.lifespan = lifespan;
        this.initialLifespan = lifespan;
    }

    applyGravity() {
        this.acc.add(new Vector(0, 0.1));
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

class SquareParticle extends Particle {
    draw(utils) {
        utils
            .custom("save")
            .customSet(
                "globalAlpha",
                CustomMath.map(this.lifespan, 0, this.initialLifespan, 0, 1)
            )
            .custom("translate", this.pos.x, this.pos.y)
            .custom("rotate", this.vel.angle())
            .fill("#7f7f7f")
            .stroke("#000")
            .square(0, 0, this.radius * 2)
            .fill()
            .stroke()
            .custom("restore");
    }
}
