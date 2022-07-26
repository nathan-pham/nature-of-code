import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();

canvas.setup(() => {});

canvas.draw(({ utils }) => {
    utils.clear();
});
