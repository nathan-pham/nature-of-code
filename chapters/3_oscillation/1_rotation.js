import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();

let a, aVelocity, aAcceleration;

canvas.setup(() => {
    a = 0;
    aVelocity = 0;
    aAcceleration = 0;
});

canvas.draw(({ mouse, utils }) => {
    aAcceleration = CustomMath.map(mouse.x, 0, canvas.width, -0.01, 0.01);
    aVelocity += aAcceleration;
    aVelocity = CustomMath.constrain(aVelocity, -0.1, 0.1);
    a += aVelocity;
    aAcceleration = 0;

    utils
        .clear()
        // draw text
        .fill("#000")
        .custom(
            "fillText",
            "Move your mouse horizontally to increase or decrease the rectangle's angular acceleration.",
            10,
            22
        )

        // draw rectangle
        .custom("save")
        .custom("translate", canvas.width / 2, canvas.height / 2)
        .custom("rotate", a)
        .fill("#7f7f7f")
        .rectCenter(0, 0, 100, 50)
        .fill()
        .stroke()
        .custom("restore");
});
