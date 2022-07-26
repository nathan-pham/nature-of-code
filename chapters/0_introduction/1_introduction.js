import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

let ball;
let radius = 10;

canvas.setup(() => {
    ball = new Vector(0, canvas.height / 2);
});

canvas.draw(({ utils }) => {
    // update ball position
    ball.x += 1;

    // render ball
    utils.clear();
    utils.fill("#000").circle(ball.x, ball.y, radius).fill();
});
