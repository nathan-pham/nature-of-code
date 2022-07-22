import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();

let radius = 10;
let pos, vel;

canvas.setup(() => {
    pos = new Vector(canvas.width / 2, canvas.height / 2);
    vel = Vector.randomUnit().setMag(4);
});

canvas.draw(({ utils }) => {
    // update pos
    pos.add(vel);

    // bounce off walls
    if (pos.x < radius || pos.x > canvas.width - radius) {
        vel.x *= -1;
    }

    if (pos.y < radius || pos.y > canvas.height - radius) {
        vel.y *= -1;
    }

    // render ball
    utils
        .clear()
        .fill("#7f7f7f")
        .stroke("#000")
        .circle(pos.x, pos.y, radius)
        .fill()
        .stroke();
});
