import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();

const stringLength = 200;
const gravity = 0.8;

let origin;
let angle, angleVel, angleAcc;

canvas.setup(() => {
    origin = new Vector(canvas.width / 2, 0);

    angle = Math.PI / 4;
    angleVel = 0;
    angleAcc = 0;
});

canvas.draw(({ mouse, utils }) => {
    if (mouse.down) {
        angleAcc = 0;
        angleVel = 0;
        angle = CustomMath.map(
            mouse.x,
            0,
            canvas.width,
            -Math.PI / 2,
            Math.PI / 2
        );
    } else {
        angleAcc = ((-1 * gravity) / stringLength) * Math.sin(angle);
        angleVel += angleAcc;
        angle += angleVel;

        angleVel *= 0.99;
    }

    const bobX = stringLength * Math.sin(angle);
    const bobY = stringLength * Math.cos(angle);

    utils
        .clear()
        // draw text
        .fill("#000")
        .custom(
            "fillText",
            "Press your mouse and drag to set the pendulum!",
            10,
            22
        )

        // draw rope
        .stroke("#000")
        .fill(mouse.down ? "#000" : "#fff")
        .custom("save")
        .custom("translate", origin.x, origin.y)
        .line(0, 0, bobX, bobY)
        .stroke()

        // draw pendulum
        .circle(bobX, bobY, 10)
        .fill()
        .stroke()
        .custom("restore");
});
