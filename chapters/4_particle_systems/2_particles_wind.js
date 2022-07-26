import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();
let particleSystem;
let repeller;

canvas.setup(() => {
    particleSystem = new ParticleSystem(new Vector(canvas.width / 2, 50));
    repeller = new Repeller(new Vector(canvas.width / 2, canvas.height / 2));
});

canvas.draw(({ utils }) => {
    particleSystem.update();
    repeller.repel(particleSystem);

    utils
        .clear()
        // draw text
        .fill("#000")
        .custom(
            "fillText",
            "Press you mouse to apply wind! The big boi circle repels particles.",
            10,
            22
        )

        // draw particle system
        .draw(repeller)
        .draw(particleSystem);
});

class Repeller {
    radius = 10;

    constructor(pos, k = 30) {
        this.pos = pos.copy();
        this.k = k;
    }

    repel(particleSystem) {
        for (const particle of particleSystem.particles) {
            const force = particle.pos.copy().sub(this.pos);
            const distance = CustomMath.constrain(force.mag(), 4, 40);
            force.setMag(this.k);

            particle.applyForce(force.div(Math.pow(distance, 2)));
        }
    }

    draw(utils) {
        utils
            .fill("#7f7f7f")
            .stroke()
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill()
            .stroke();
    }
}

class ParticleSystem {
    particles = [];
    origin = new Vector(canvas.width / 2, canvas.height / 2);

    constructor(origin) {
        this.origin = origin;
    }

    update() {
        // create new particle
        this.particles.push(
            Math.random() > 0.5
                ? new Particle(this.origin)
                : new SquareParticle(this.origin)
        );

        // apply wind if mouse is down
        if (canvas.mouse.down) {
            this.applyForce(new Vector(0.3, 0));
        }

        // update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            particle.applyGravity().removeLife().update();
            if (particle.dead) {
                this.particles.splice(i, 1);
            }
        }
    }

    applyForce(force) {
        for (const particle of this.particles) {
            particle.acc.add(force.copy());
        }

        return this;
    }

    draw(utils) {
        utils.drawArray(this.particles);
    }
}

class Particle {
    pos = new Vector();
    vel = new Vector();
    acc = Vector.randomUnit().setMag(1);
    radius = 5;
    mass = 1;
    dead = false;

    constructor(origin, lifespan = 90) {
        this.pos = origin.copy();

        this.lifespan = lifespan;
        this.initialLifespan = lifespan;
    }

    applyGravity() {
        this.acc.add(new Vector(0, 0.1));
        return this;
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
