import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    const { Target, Population } = useModule(p);

    let target;
    let population;

    const setup = () => {
        p.createCanvas(600, 600);
        target = new Target(p.createVector(p.width / 2, 40));
        population = new Population(
            target,
            p.createVector(p.width / 2, p.height - 10),
            1000
        );
    };

    const draw = () => {
        p.background(255);
        target.draw();
        population.update();
        population.draw();
    };

    const keyPressed = () => {
        if (p.key === " ") {
            population.acceleration = !population.acceleration;
        }
    };

    return { setup, draw, keyPressed };
});

function useModule(p) {
    class Target {
        constructor(pos = p.createVector(0, 0), radius = 10) {
            this.pos = pos;
            this.radius = radius;
        }

        get diameter() {
            return this.radius * 2;
        }

        draw() {
            p.circle(this.pos.x, this.pos.y, this.diameter);
        }
    }

    class Boid {
        pos = p.createVector(0, 0);
        vel = p.createVector(0, 0);
        acc = p.createVector(0, 0);

        dna = []; // array of pVectors
        dnaIdx = 0;
        dnaCount = 400;

        radius = 5;
        maxSpeed = 2;
        mutationRate = 0.1;

        dead = false;
        success = false;

        constructor(target, pos = p.createVector(0, 0), existingDna) {
            this.target = target;
            this.pos = pos;

            this.dna =
                existingDna && Array.isArray(existingDna)
                    ? existingDna
                    : this.initializeDNA(this.dnaCount);
        }

        get diameter() {
            return this.radius * 2;
        }

        initializeDNA(dnaCount) {
            const dna = new Array(dnaCount)
                .fill(0)
                .map(() => p5.Vector.random2D());

            return dna;
        }

        applyForces() {
            this.dnaIdx++;
            if (this.dnaIdx <= this.dna.length) {
                this.acc.add(this.dna[this.dnaIdx]);
            } else {
                console.error("ran out of dna");
            }
        }

        boundaries() {
            if (
                this.pos.x > p.width ||
                this.pos.x < 0 ||
                this.pos.y > p.height ||
                this.pos.y < 0
            ) {
                this.dead = true;
            }

            if (this.pos.dist(this.target.pos) < this.target.radius) {
                this.success = true;
            }
        }

        calculateFitness() {
            // the fitness is composed of
            // 1. distance to target (worth more)
            // 2. how long it took to get there
            let d = 1 - this.pos.dist(this.target.pos) / p.height;
            let s = 1 - this.dnaIdx / this.dnaCount;
            let fitness = d * 0.75 + s * 0.25;

            this.success && (fitness *= 2);
            this.dead && (fitness /= 2);

            return fitness;
        }

        mutate() {
            // change a random vector
            if (p.random() < this.mutationRate) {
                this.dna[Math.floor(Math.random() * this.dna.length)] =
                    p5.Vector.random2D();
            }

            return this;
        }

        update() {
            // if you hit the target or died then stop moving
            if (!(this.dead || this.success)) {
                this.vel.add(this.acc);
                this.vel.setMag(this.maxSpeed);
                this.pos.add(this.vel);
                this.acc.mult(0);
            }
        }

        draw() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.vel.heading() + p.PI / 2);
            p.beginShape();
            p.vertex(0, -this.diameter);
            p.vertex(-this.radius, this.diameter);
            p.vertex(this.radius, this.diameter);
            p.endShape(p.CLOSE);
            p.pop();
        }
    }

    class Population {
        boids = [];
        generation = 0;
        currentFrame = 0;
        maxFrames = 400;
        acceleration = false;

        constructor(target, pos, boidsCount) {
            this.target = target;
            this.pos = pos;

            this.boidsCount = boidsCount;
            this.boids = this.initializeBoids(boidsCount);
        }

        // create an array of boids at a spawn
        initializeBoids(boidsCount) {
            const boids = new Array(boidsCount)
                .fill(0)
                .map(() => new Boid(this.target, this.pos.copy()));

            return boids;
        }

        calculateFitnessPool() {
            const fitnessPool = [];
            const fitnessCounts = this.boids.map((boid) =>
                boid.calculateFitness()
            );

            console.log(Math.max(...fitnessCounts));

            for (let i = 0; i < fitnessCounts.length; i++) {
                const fitnessCount = fitnessCounts[i];
                const boid = this.boids[i];

                const count = Math.floor(fitnessCount * 100);
                for (let j = 0; j < count; j++) {
                    fitnessPool.push(boid);
                }
            }

            return fitnessPool;
        }

        nextGeneration() {
            this.generation++;
            this.currentFrame = 0;

            const fitnessPool = this.calculateFitnessPool();
            const boids = new Array(this.boidsCount).fill(0).map(() => {
                const child = p.random(fitnessPool);
                const childCopy = new Boid(
                    this.target,
                    this.pos.copy(),
                    child.dna.map((v) => v.copy())
                ).mutate();

                return childCopy;
            });

            this.boids = boids;
        }

        update() {
            const acceleration = this.acceleration ? 10 : 1;
            for (let i = 0; i < acceleration; i++) {
                this.currentFrame++;
                if (this.currentFrame >= this.maxFrames) {
                    this.nextGeneration();
                }

                this.boids.forEach((boid) => {
                    boid.applyForces();
                    boid.boundaries();
                    boid.update();
                });
            }
        }

        draw() {
            p.text(
                `Generation: ${this.generation}\nFrame: ${this.currentFrame}/${this.maxFrames}`,
                15,
                20
            );
            this.boids.forEach((boid) => boid.draw());
        }
    }

    return { Boid, Target, Population };
}
