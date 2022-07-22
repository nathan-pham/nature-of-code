import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas();

canvas.draw(({ utils }) => {
    const scale = 800;
    const mean = canvas.width / 2;
    const xloc = CustomMath.randomNormal() * scale + mean;

    utils
        .fill("rgba(0, 0, 0, 0.01)")
        .circle(xloc, canvas.height / 2, 16)
        .fill();
});
