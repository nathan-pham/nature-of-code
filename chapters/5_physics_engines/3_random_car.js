import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();
const origin = new Vector(canvas.width / 2, canvas.height / 2);

let polygon;
// averageRadius,
// irregularity,
// spikiness,
// verticeCount

canvas.setup(() => {
    const width = 200;
    const height = 100;

    polygon = generateCar(width, height).map((point) =>
        point.add(origin.copy().sub(new Vector(width / 2, height / 2)))
    );
});

canvas.draw(({ utils }) => {
    utils.clear();

    // draw wheels
    const wheels = [polygon[4], polygon[6]];
    for (const wheel of wheels) {
        utils.fill("#7f7f7f").circle(wheel.x, wheel.y, 40).fill();
    }

    // draw car body
    utils.custom("beginPath");
    for (let i = 0; i < polygon.length - 1; i++) {
        utils
            .custom("moveTo", polygon[i].x, polygon[i].y)
            .custom("lineTo", polygon[i + 1].x, polygon[i + 1].y);
    }
    utils.custom("lineTo", polygon[0].x, polygon[0].y).stroke();

    // draw vertices of car body
    for (let i = 0; i < polygon.length; i++) {
        utils.fill("#000").circle(polygon[i].x, polygon[i].y, 5).fill();
    }
});

const generateCar = (width, height) => {
    // outline a rectangle with Vectors
    const points = [
        new Vector(0, 0),
        new Vector(width / 2, 0),
        new Vector(width, 0),
        new Vector(width, height / 2),
        new Vector(width, height), // wheel
        new Vector(width / 2, height),
        new Vector(0, height), // wheel
        new Vector(0, height / 2),
    ].map((point) => point.add(Vector.randomUnit().setMag(Math.random() * 75)));

    return points;
};
