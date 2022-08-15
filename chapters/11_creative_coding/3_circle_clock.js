import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas(500, 500);
const origin = new Vector(canvas.width / 2, canvas.height / 2);
const clockRadius = 200;
const hourRadius = 20;
const minuteRadius = 4;
const secondsRadius = 2;

let background, palette;

let angle = 0;

canvas.setup(({ utils }) => {
    [background, ...palette] = utils.palette();
});

canvas.draw(({ utils }) => {
    utils.background(background);
    utils.fill(palette[0]).circle(origin.x, origin.y, clockRadius).fill();

    angle += 0.002;

    utils
        .custom("save")
        .custom("translate", origin.x, origin.y)
        .custom("rotate", angle);

    const [hours, minutes, seconds] = getTime();

    // render hours
    for (let i = 0; i < hours; i++) {
        const pos = polarToCartesian(
            clockRadius - 45,
            CustomMath.lerp(0, Math.PI * 2, (i + 9) / 12)
        );
        // .add(origin);

        utils.fill(palette[1]).circle(pos.x, pos.y, hourRadius).fill();
    }

    utils.custom("rotate", angle);

    // render minutes
    for (let i = 0; i < minutes; i++) {
        const pos = polarToCartesian(
            clockRadius - 95,
            CustomMath.lerp(0, Math.PI * 2, (i + 45) / 60)
        );
        // .add(origin);

        utils.fill(palette[2]).circle(pos.x, pos.y, minuteRadius).fill();
    }

    utils.custom("rotate", angle);

    // render seconds
    for (let i = 0; i < seconds; i++) {
        const pos = polarToCartesian(
            clockRadius - 120,
            CustomMath.lerp(0, Math.PI * 2, (i + 45) / 60)
        );
        // .add(origin);

        utils.fill(palette[3]).circle(pos.x, pos.y, secondsRadius).fill();
    }

    utils.custom("restore");
});

const polarToCartesian = (r, angle) =>
    new Vector(r * Math.cos(angle), r * Math.sin(angle));

const getTime = () => {
    const date = new Date();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return [hours, minutes, seconds];
};
