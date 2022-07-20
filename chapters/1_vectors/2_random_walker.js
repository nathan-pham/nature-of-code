import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

const walkerPos = new Vector();

const walkerStates = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
].map((state) => new Vector(...state));

canvas.setup(() => {
    walkerPos.x = canvas.width / 2;
    walkerPos.y = canvas.height / 2;
});

canvas.draw(({ utils }) => {
    // update walker position
    walkerPos.add(CustomMath.choice(walkerStates));

    // draw walker
    utils.fill("#000").square(walkerPos.x, walkerPos.y, 1).fill();
});
