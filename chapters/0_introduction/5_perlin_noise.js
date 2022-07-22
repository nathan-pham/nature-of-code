import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();

let t;

canvas.setup(() => {
    t = 0;
});

canvas.draw(({ utils }) => {
    t += 0.01;
    const x = Noise.perlin2(t, 0) * 200 + canvas.width / 2;

    utils
        .clear()
        .fill("#000")
        .circle(x, canvas.height / 2, 10)
        .fill();
});
