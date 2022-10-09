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
        mutationRate = 0.01;

        dead = false;
        success = false;

        constructor(target, pos = p.createVector(0, 0), existingDna) {
            this.target = target;
            this.pos = pos.copy();
            this.initialPos = pos.copy();

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

        copy() {
            return new Boid(
                this.target,
                this.initialPos.copy(),
                this.dna.map((v) => v.copy())
            );
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
            for (let i = 0; i < this.dna.length; i++) {
                if (p.random() < this.mutationRate) {
                    this.dna[i] = p5.Vector.random2D();
                }
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
            p.stroke(0);
            p.fill(200, 100);
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
                .map(() => new Boid(this.target, this.pos));

            return boids;
        }

        // return (maxFitness, (boid, fitness))
        calculateFitnessPool() {
            const fitnessPool = this.boids.map((b) => b.calculateFitness());
            const maxFitness = Math.max(...fitnessPool);

            return {
                maxFitness,
                fitnessPool: this.boids.map((b, i) => ({
                    boid: b,
                    fitness: fitnessPool[i],
                })),
            };
        }

        randomChild(maxFitness, fitnessPool) {
            const { boid, fitness } = p.random(fitnessPool);
            const r = p.random(maxFitness);
            if (r < fitness) {
                return boid;
            }

            // otherwise reject & pick a new child
            return this.randomChild(maxFitness, fitnessPool);
        }

        nextGeneration() {
            this.generation++;
            this.currentFrame = 0;

            const { maxFitness, fitnessPool } = this.calculateFitnessPool();
            this.boids = [];
            this.boids = new Array(this.boidsCount)
                .fill(0)
                .map(() =>
                    this.randomChild(maxFitness, fitnessPool).copy().mutate()
                );
        }

        update() {
            const acceleration = this.acceleration ? 15 : 1;
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
