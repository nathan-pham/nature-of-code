import Canvas from "/lib/Canvas.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();

let r, angle, angleVel, angleAcc;
let test = 1;

canvas.setup(() => {
    r = 100;

    angle = 0;
    angleVel = 0;
    angleAcc = 0.01;
});

canvas.draw(({ utils }) => {
    if (Math.abs(angle - 4 * 2 * Math.PI) < 0.01) {
        return;
    }

    angleVel += angleAcc;
    angle += angleVel;
    angleAcc = 0;

    test += 0.01;
    r = Noise.perlin2(test, 0) * 100 + 100;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);

    utils
        // .clear()
        .custom("save")
        .custom("translate", canvas.width / 2, canvas.height / 2)
        .fill("rgba(0, 0, 0, 0.1)")
        .stroke("rgba(0, 0, 0, 0.1)")
        .strokeWidth(2)
        .line(0, 0, x, y)
        .stroke()
        .circle(x, y, 1)
        .fill()
        .stroke()
        .custom("restore");
});
