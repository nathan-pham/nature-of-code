import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

canvas.setup(() => {});

canvas.draw(({ utils }) => {
    utils.clear();
});
