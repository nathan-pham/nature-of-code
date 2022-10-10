import useP5 from "/lib/useP5.js";
import "p5";

export const canvas = useP5((p) => {
    const { Palettes } = useModule(p);

    let palettes;

    const setup = () => {
        const canvas = p.createCanvas(400, 700);
        canvas.elt.oncontextmenu = (e) => e.preventDefault();
        palettes = new Palettes(4, 7);
    };

    const draw = () => {
        p.background(255);
        palettes.update();
        palettes.draw();
    };

    const keyPressed = () => {
        if (p.key === " ") {
            palettes.nextGeneration();
        }
    };

    return { setup, draw, keyPressed };
});

function useModule(p) {
    class Color {
        dna = [];
        dnaLength = 3;

        constructor(x, width, height, dna) {
            this.x = x;
            this.width = width;
            this.height = height;
            this.dna = dna || this.initDNA();
        }

        initDNA() {
            return new Array(this.dnaLength)
                .fill(0)
                .map(() => p.random() * 255);
        }

        copy() {
            return new Color(this.x, this.width, this.height, [...this.dna]);
        }

        mutate() {
            // mutate random value of color
            const i = p.floor(p.random(this.dnaLength));
            this.dna[i] = p.lerp(this.dna[i], p.random() * 255, 0.5);
            return this;
        }

        draw() {
            // draw color bg
            p.push();
            p.translate(this.x, 0);
            p.noStroke();
            p.fill(...this.dna);
            p.rect(0, 0, this.width, this.height);
            p.pop();
        }
    }

    class Palette {
        fitness = 1;
        mutationRate = 0.5;

        constructor(y, colorsCount, colorSizeX, colorSizeY, colors) {
            this.y = y;
            this.colorsCount = colorsCount;
            this.colorSizeX = colorSizeX;
            this.colorSizeY = colorSizeY;
            this.colors = colors || this.initColors();
        }

        initColors() {
            const colors = new Array(this.colorsCount)
                .fill(0)
                .map(
                    (_, x) =>
                        new Color(
                            x * this.colorSizeX,
                            this.colorSizeX,
                            this.colorSizeY
                        )
                );

            return colors;
        }

        update() {
            if (p.mouseIsPressed) {
                const width = this.colorSizeX * this.colorsCount;
                const height = this.colorSizeY;
                const top = this.y * this.colorSizeY;
                const left = 0;

                const dir = p.mouseButton === p.LEFT ? 1 : -1;

                if (
                    p.mouseX > left &&
                    p.mouseX < left + width &&
                    p.mouseY > top &&
                    p.mouseY < top + height
                ) {
                    this.fitness = Math.max(this.fitness + dir, 0);
                }
            }
        }

        draw() {
            p.push();
            p.translate(0, this.y * this.colorSizeY);
            this.colors.forEach((c) => c.draw());
            p.translate(this.colorSizeX / 2, this.colorSizeY / 2);
            p.textAlign(p.CENTER, p.CENTER);
            p.textStyle(p.BOLD);
            p.fill(255);
            p.stroke(0);
            p.strokeWeight(4);
            p.textSize(20);
            p.text(`${this.fitness}`, 0, 0);
            p.pop();
        }

        copy() {
            return new Palette(
                this.y,
                this.colorsCount,
                this.colorSizeX,
                this.colorSizeY,
                this.colors.map((c) => c.copy())
            );
        }

        mutate() {
            // mutate a random color
            if (p.random() < this.mutationRate) {
                const color = p.random(this.colors);
                color.mutate();
            }

            return this;
        }

        crossover(palette) {
            const childA = this.copy();
            const childB = palette.copy();
            const split = p.floor(p.random(childA.colors.length));

            childA.colors = [
                ...childA.colors.slice(0, split),
                ...childB.colors.slice(split),
            ];

            return childA;
        }
    }

    class Palettes {
        generation = 0;

        constructor(segmentsX, segmentsY) {
            this.segmentsX = segmentsX;
            this.segmentsY = segmentsY;
            this.palettes = this.initPalettes();
        }

        get colorSizeX() {
            return p.width / this.segmentsX;
        }

        get colorSizeY() {
            return p.height / this.segmentsY;
        }

        initPalettes() {
            const palettes = new Array(this.segmentsY)
                .fill(0)
                .map(
                    (_, y) =>
                        new Palette(
                            y,
                            this.segmentsX,
                            this.colorSizeX,
                            this.colorSizeY
                        )
                );

            return palettes;
        }

        getMaxFitness() {
            // get maximum fitness
            let maxFitness = 0;
            for (const palette of this.palettes) {
                if (palette.fitness > maxFitness) {
                    maxFitness = palette.fitness;
                }
            }

            return maxFitness;
        }

        randomChild(maxFitness, depth = 0) {
            const child = p.random(this.palettes);
            const r = p.random(maxFitness);

            // if you've called this 100 times then return the random palette
            if (depth > 100) {
                return child;
            }

            if (r < child.fitness) {
                return child;
            }

            return this.randomChild(maxFitness, depth++);
        }

        nextGeneration() {
            this.generation++;
            const maxFitness = this.getMaxFitness();
            const palettes = new Array(this.segmentsY).fill(0).map((_, i) => {
                const childA = this.randomChild(maxFitness).copy().mutate();
                const childB = this.randomChild(maxFitness).copy().mutate();

                childA.crossover(childB);
                childA.y = i;
                return childA;
            });

            this.palettes = palettes;
        }

        update() {
            this.palettes.forEach((p) => p.update());
        }

        draw() {
            this.palettes.forEach((p) => p.draw());
        }
    }

    return { Color, Palette, Palettes };
}
