import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    const GeneticAlgorithm = GeneticAlgorithmFactory(p);
    const target = "To be or not to be, that is the question.";

    let ga;
    const setup = () => {
        p.createCanvas(700, 700);
        ga = new GeneticAlgorithm(target, 0.1, 1000);
    };

    const draw = () => {
        ga.nextGeneration();

        p.background(255);
        p.push();
        p.translate(15, 20);
        p.text(`Generation: ${ga.generation}`, 0, 0);
        ga.draw();
        p.pop();
    };

    const keyPressed = () => {
        if (p.key === " ") {
            ga.nextGeneration();
            p.redraw();
        }
    };

    return { setup, draw, keyPressed };
});

function GeneticAlgorithmFactory(p) {
    return class GeneticAlgorithm {
        constructor(target, mutationChance, populationCount) {
            this.target = target;
            this.mutationChance = mutationChance;
            this.populationCount = populationCount;
            this.population = [];
            this.generation = 0;

            this.bestFitness = 0;
            this.bestIndividual = "";

            this.initializePopulation();
        }

        // create string of random characters
        initializeIndividual() {
            return new Array(this.target.length)
                .fill(" ")
                .map(() => GeneticAlgorithm.randomCharacter())
                .join("");
        }

        // create an array of random individuals (which are a string of random characters)
        initializePopulation() {
            this.population = new Array(this.populationCount)
                .fill(" ")
                .map(() => this.initializeIndividual());
        }

        static randomCharacter() {
            const chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!? ";
            return chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // get the fitness
        // each character that matches the target = more fit (max of 1)
        calculateFitness(individual) {
            let fitness = 0;
            for (let i = 0; i < this.target.length; i++) {
                const expected = this.target.charAt(i);
                const actual = individual.charAt(i);
                if (expected === actual) {
                    fitness++;
                }
            }

            const normalizeFitness = fitness / this.target.length;

            if (normalizeFitness > this.bestFitness) {
                this.bestFitness = normalizeFitness;
                this.bestIndividual = individual;
            }

            if (normalizeFitness === 1) {
                p.noLoop();
            }

            return normalizeFitness;
        }

        // create a pool with each individual appearing in proportion to its fitness
        calculateFitnessPool() {
            const pool = [];
            // convert [0, 1] to [0, 100]
            const individualCounts = this.population.map((individual) =>
                Math.round(this.calculateFitness(individual) * 100)
            );

            for (let i = 0; i < this.populationCount; i++) {
                const individual = this.population[i];
                const individualCount = individualCounts[i];

                for (let j = 0; j < individualCount; j++) {
                    pool.push(individual);
                }
            }

            return pool;
        }

        mutate(individual) {
            // mutate a single character
            if (p.random() < this.mutationChance) {
                const arrayIndividual = individual.split("");
                arrayIndividual[Math.floor(Math.random() * individual.length)] =
                    GeneticAlgorithm.randomCharacter();

                return arrayIndividual.join("");
            }

            return individual;
        }

        // combine two individuals at a random point to form a child
        crossover(individualA, individualB) {
            let split = Math.floor(Math.random() * individualA.length);
            return (
                individualA.substring(0, split) + individualB.substring(split)
            );
        }

        // move on to the next generation
        nextGeneration() {
            this.generation++;
            const pool = this.calculateFitnessPool();
            for (let i = 0; i < this.populationCount; i++) {
                const a = p.random(pool);
                const b = p.random(pool);
                const child = this.crossover(a, b);
                this.population[i] = this.mutate(child);
            }
        }

        // draw the entire population
        draw() {
            p.push();
            p.textFont("monospace");
            for (let i = 0; i < this.populationCount; i++) {
                p.text(this.population[i], 0, (i + 1) * 20);
            }

            p.translate(this.target.length * 7, 0);
            p.text(
                `best: ${this.bestIndividual}\nfitness: ${(
                    this.bestFitness * 100
                ).toFixed(2)}%`,
                0,
                20
            );

            p.pop();
        }
    };
}
