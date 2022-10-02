import useP5 from "/lib/useP5.js";
import p5 from "p5";

// https://gorillasun.de/blog/a-guide-to-hexagonal-grids-in-p5js

export const canvas = useP5((p) => {
    const Grid = GridFactory(p);
    const size = 40;

    let grid;

    const setup = () => {
        p.createCanvas(innerWidth, innerHeight - 50);
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
        constructor(size) {
            this.radius = Math.min(p.width, p.height) / size / 2;
            this.state = this.generateState();
        }

        get diameter() {
            return this.radius * 2;
        }

        get width() {
            return Math.ceil(p.width / this.diameter / 1.5);
        }

        get height() {
            return Math.ceil((p.height / this.diameter) * 2.3);
        }

        generateState(useRandom = true) {
            // create a 2D array of 0s
            const state = new Array(this.height)
                .fill(0)
                .map(() =>
                    new Array(this.width)
                        .fill(0)
                        .map(() =>
                            useRandom ? Math.floor(Math.random() * 1.33) : 0
                        )
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

                    // https://davidsiaw.github.io/blog/2014/11/21/hexlife/
                    // if a live cell is surrounded by 3 or 4 live cells, it stays alive
                    if (get() === 1 && (neighbors == 3 || neighbors == 4)) {
                        set(1);
                    }

                    // if a dead cell is surrounded by 2 live cells, the dead cell becomes alive
                    else if (get() === 0 && neighbors == 2) {
                        set(1);
                    }

                    // in all other cases, the cell dies
                    else {
                        set(0);
                    }
                }
            }

            this.state = newState;
        }

        getNeighbors(x, y) {
            let neighbors = 0;

            // get the neighbors of a hexagonal grid
            // https://www.redblobgames.com/grids/hexagons/#neighbors-axial
            // davidsiaw.github.io/hexlife/

            const coords =
                y % 2
                    ? [
                          [x, y - 1],
                          [x - 1, y],
                          [x, y + 1],
                          [x + 1, y - 1],
                          [x + 1, y],
                          [x + 1, y + 1],
                      ]
                    : [
                          [x - 1, y - 1],
                          [x - 1, y],
                          [x - 1, y + 1],
                          [x, y - 1],
                          [x + 1, y],
                          [x, y + 1],
                      ];

            for (const coord of coords) {
                let [xIdx, yIdx] = coord;

                yIdx =
                    (yIdx < 0 ? yIdx + this.state.length : yIdx) %
                    this.state.length;
                xIdx =
                    (xIdx < 0 ? xIdx + this.state[0].length : xIdx) %
                    this.state[0].length;

                neighbors += this.state[yIdx][xIdx];
            }

            return neighbors;
        }

        update() {
            this.nextGeneration();
        }

        drawPolygon(centerX = 0, centerY = 0, n = 6) {
            p.beginShape();
            p.strokeJoin(p.ROUND);

            for (let i = 0; i < n; i++) {
                const angle = p.TWO_PI * (i / n);

                p.vertex(
                    centerX + this.radius * Math.cos(angle),
                    centerY + this.radius * Math.sin(angle)
                );
            }

            p.endShape(p.CLOSE);
        }

        draw() {
            p.stroke(0);
            for (let y = 0; y < this.state.length; y++) {
                for (let x = 0; x < this.state[y].length; x++) {
                    const _y = (y * this.diameter) / 2.3; // magic numbers?
                    const _x = x * this.diameter * 1.5;
                    const cell = this.state[y][x];

                    p.push();
                    p.fill(cell === 1 ? 0 : 255);
                    p.translate(
                        _x + this.diameter * (y % 2 === 0 ? 0 : 0.75),
                        _y
                    );
                    this.drawPolygon();
                    p.pop();
                }
            }
        }
    };
}
