import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas(700, 700);
const gridSize = 5;
const margin = 20;

let background, palette;
let sketches;

canvas.setup(({ utils }) => {
    [background, ...palette] = utils.palette();
    sketches = [];

    utils.background(background);

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            sketches.push(
                new Sketch(
                    new Vector(
                        CustomMath.lerp(
                            margin,
                            canvas.width - margin,
                            (x + 0.5) / gridSize
                        ),
                        CustomMath.lerp(
                            margin,
                            canvas.height - margin,
                            (y + 0.5) / gridSize
                        )
                    ),
                    CustomMath.choice(palette)
                )
            );
        }
    }
});

canvas.draw(({ utils }) => {
    for (const sketch of sketches) {
        sketch.update();
        sketch.draw(utils);
    }
});

class Sketch {
    constructor(origin, color) {
        this.origin = origin;
        this.color = color;

        this.radius = CustomMath.random(5, 15);
        this.cosOffset = CustomMath.random(30, 40);
        this.sinOffset = CustomMath.random(30, 40);

        this.pos = this.origin.copy();
        this.vel = new Vector(
            CustomMath.choice([-1, 0, 1]),
            CustomMath.choice([-1, 1])
        );

        this.prevPos = this.pos.copy();
    }

    update() {
        this.pos.add(this.vel);
        this.vel.mult(0.995);
        this.vel.x += Math.cos(this.pos.x / this.cosOffset);
        this.vel.y += Math.sin(this.pos.y / this.sinOffset);
        this.radius *= 0.99;
    }

    draw(utils) {
        utils
            .stroke(this.color)
            .strokeWidth(this.radius * 2)
            .line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
            .stroke()
            .fill(this.color)
            .circle(this.pos.x, this.pos.y, this.radius)
            .fill();
        // .fill("black")
        // .circle(this.origin.x, this.origin.y, 20)
        // .fill();

        this.prevPos = this.pos.copy();
    }
}
