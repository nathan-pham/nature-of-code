import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    const Grid = GridFactory(p);
    const size = 20;

    let grid;

    const setup = () => {
        p.createCanvas(500, 500);
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
        constructor(radius) {
            this.radius = radius;
            this.state = this.generateState();
        }

        get diameter() {
            return this.radius * 2;
        }

        get size() {
            return Math.floor(p.width / this.radius);
        }

        generateState(useRandom = true) {
            // create a 2D array of 0s
            const state = new Array(this.size)
                .fill(0)
                .map(() =>
                    new Array(this.size)
                        .fill(0)
                        .map(() => (useRandom ? (p.random() > 0.9 ? 1 : 0) : 0))
                );

            return state;
        }

        nextGeneration() {
            this.generation++;
        }

        getNeighbors(x, y) {}

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
            // count = 0
            // for(y = 0; y < gridHeight; y+=hexagonSize/2.3){
            //   for(x = 0; x < gridWidth; x+=hexagonSize*1.5){
            //     drawHexagon(x+hexagonSize*(count%2==0)*0.75, y, hexagonSize/2)
            //   }
            //   count ++
            // }

            p.stroke(0);
            p.noFill();
            for (let y = 0; y < this.state.length; y++) {
                for (let x = 0; x < this.state[y].length; x++) {
                    const _y = (y * this.radius) / 2.3;
                    const _x = x * this.radius * 1.5;

                    p.push();
                    p.translate(
                        _x + this.radius * (y % 2 === 0 ? 0 : 0.75),
                        _y
                    );
                    this.drawPolygon();
                    p.pop();
                    // const cell = this.state[y][x];

                    // p.push();

                    // // p.fill(cell === 1 ? 0 : 255);
                    // // p.noStroke();
                    // p.noFill();
                    // p.stroke(0);
                    // this.drawPolygon(0, 0);
                    // p.pop();
                }
            }
        }
    };
}
