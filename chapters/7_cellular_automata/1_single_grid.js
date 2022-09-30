import useP5 from "/lib/useP5.js";
import p5 from "p5";

// Elementary CA forms
// 1. uniformity
// 2. oscillation or repetition
// 3. random
// 4. complexity

export const canvas = useP5((p) => {
    const Grid = GridFactory(p);
    const size = 5;

    let grid;

    const setup = () => {
        p.createCanvas(500, 500);
        grid = new Grid(size);
    };

    const draw = () => {
        // p.background(255);
        grid.draw();
        grid.update();
    };

    return { setup, draw };
});

function GridFactory(p) {
    return class Grid {
        constructor(size, ruleset) {
            this.size = size;
            this.length = p.width / this.size;
            this.generation = 0;

            this.state = this.initializeState(false);
            this.ruleset = this.initializeRuleset(ruleset);
            console.log(this.ruleset);
        }

        // default rule 222
        initializeRuleset(values = [0, 1, 1, 1, 1, 0, 1, 1]) {
            if (values.length !== 8) {
                throw new Error(
                    "There should only be eight possible configurations for neighbors in elementary automata"
                );
            }

            const ruleset = {};
            for (let i = 0; i < values.length; i++) {
                ruleset[i.toString(2).padStart(3, "0")] = values[i];
            }
            return ruleset;
        }

        initializeState(useRandom = true) {
            const state = new Array(this.length).fill(0);

            if (useRandom) {
                return state.map((i) => (p.random() > 0.5 ? 1 : i));
            } else {
                state[Math.floor(this.length / 2)] = 1;
                return state;
            }
        }

        nextGeneration() {
            this.generation++;
            const newState = [...this.state];
            const state = this.state;

            const get = (i) => state[i].toString();

            for (let i = 1; i < state.length - 1; i++) {
                const key = get(i - 1) + get(i) + get(i + 1);
                newState[i] = this.ruleset[key];
            }
            this.state = newState;
        }

        update() {
            this.nextGeneration();
        }

        draw() {
            for (let i = 0; i < this.state.length; i++) {
                const cell = this.state[i];
                p.fill(cell === 1 ? 0 : 255);
                p.noStroke();
                p.rect(
                    i * this.size,
                    (this.generation * this.size) % p.height,
                    this.size,
                    this.size
                );
            }
        }
    };
}
