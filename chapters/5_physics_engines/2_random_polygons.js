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
    polygon = generatePolygon(200, 0, 0, 10).map((point) => point.add(origin));
});

canvas.draw(({ utils }) => {
    utils.clear();

    utils.custom("beginPath");
    for (let i = 0; i < polygon.length - 1; i++) {
        utils
            .custom("moveTo", polygon[i].x, polygon[i].y)
            .custom("lineTo", polygon[i + 1].x, polygon[i + 1].y);
    }
    utils.custom("lineTo", polygon[0].x, polygon[0].y).stroke();
});

const generatePolygon = (
    averageRadius,
    irregularity,
    spikiness,
    verticeCount
) => {
    // limit irregularity & spikes
    // prettier-ignore
    irregularity = CustomMath.constrain(irregularity, 0, 1) * (2 * Math.PI) / verticeCount;
    spikiness = CustomMath.constrain(spikiness, 0, 1) * averageRadius;

    const angles = ((steps, irregularity) => {
        const angles = [];
        const lowerBound = (2 * Math.PI) / steps - irregularity;
        const upperBound = (2 * Math.PI) / steps + irregularity;
        let sum = 0;

        for (let i = 0; i < steps; i++) {
            const angle = CustomMath.randomNormal(lowerBound, upperBound);
            angles.push(angle);
            sum += angle / (2 * Math.PI);
        }

        // normalize angles
        for (let i = 0; i < steps; i++) {
            angles[i] /= sum;
        }

        return angles;
    })(verticeCount, irregularity);

    const points = [];
    let angle = CustomMath.randomNormal(0, 2 * Math.PI);

    for (let i = 0; i < verticeCount; i++) {
        const radius = CustomMath.constrain(
            CustomMath.randomNormal(averageRadius, spikiness),
            0,
            2 * averageRadius
        );

        points.push(
            new Vector(radius * Math.cos(angle), radius * Math.sin(angle))
        );

        angle += angles[i];
    }

    return points;
};
