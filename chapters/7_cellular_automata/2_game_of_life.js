import useP5 from "/lib/useP5.js";
import p5 from "p5";

// 2D CA, Conway's Game of Life
// Uses generalities instead of accounting for every possible neighbor state
// 1. Death 1 -> 0 (overpopulation = 4+ live neighbors | loneliness = -1 live neighbors),
// 2. Birth 0 -> 1 (3+ live neighbors)
// 3. Stasis (in all other cases, stay the same)

export const canvas = useP5((p) => {
    const Grid = GridFactory(p);
    const size = 5;

    let grid;

    const setup = () => {
        p.createCanvas(1000, 600);
        grid = new Grid(size);
    };

    const draw = () => {
        p.background(255);
        grid.draw();
        grid.update();
    };

    return { setup, draw };
});

function GridFactory(p) {
    return class Grid {
        constructor(cellSize) {
            this.cellSize = cellSize;
            this.state = this.generateState();
            console.log(this.state);
        }

        get width() {
            return Math.floor(p.width / this.cellSize);
        }

        get height() {
            return Math.floor(p.height / this.cellSize);
        }

        generateState(useRandom = true) {
            // create a 2D array of 0s
            const state = new Array(this.height)
                .fill(0)
                .map(() =>
                    new Array(this.width)
                        .fill(0)
                        .map(() => (useRandom ? (p.random() > 0.9 ? 1 : 0) : 0))
                );

            return state;
        }

        nextGeneration() {
            this.generation++;
            const newState = this.generateState(false);

            for (let y = 0; y < this.state.length; y++) {
                for (let x = 0; x < this.state[y].length; x++) {
                    const neighbors = this.getNeighbors(x, y);

                    const get = () => this.state[y][x];
                    const set = (n = 0) => (newState[y][x] = n);

                    // 1. Death 1 -> 0 (overpopulation = 4+ live neighbors | loneliness = -1 live neighbors),
                    if (get() === 1 && (neighbors >= 4 || neighbors <= 1)) {
                        set(0);
                    }

                    // 2. Birth 0 -> 1 (3+ live neighbors)
                    else if (get() === 0 && neighbors == 3) {
                        set(1);
                    }

                    // 3. Stasis (in all other cases, stay the same)
                    else {
                        set(get());
                    }
                }
            }

            this.state = newState;
        }

        getNeighbors(x, y) {
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    // infinite canvas by looping negative indexes
                    const yIdx =
                        ((i < 0 ? i + this.height : i) + y) % this.height;

                    const xIdx =
                        ((j < 0 ? j + this.width : j) + x) % this.width;

                    neighbors += this.state[yIdx][xIdx];
                }
            }

            // remove self from loop
            neighbors -= this.state[y][x];

            return neighbors;
        }

        update() {
            this.nextGeneration();
        }

        draw() {
            for (let y = 0; y < this.state.length; y++) {
                for (let x = 0; x < this.state[y].length; x++) {
                    const cell = this.state[y][x];
                    p.fill(cell === 1 ? 0 : 255);
                    p.noStroke();
                    p.rect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
    };
}
