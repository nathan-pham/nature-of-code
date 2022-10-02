import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    const setup = () => {
        p.createCanvas(600, 600);
        p.noLoop();

        p.background(255);
        drawCircle(p, p.width / 2, p.height / 2, 300);
    };

    return { setup };
});

function drawCircle(p, x, y, diameter) {
    const radius = diameter / 2;
    p.stroke(0);
    p.noFill();
    p.circle(x, y, diameter);

    if (diameter > 10) {
        drawCircle(p, x + radius, y, radius);
        drawCircle(p, x - radius, y, radius);
        drawCircle(p, x, y + radius, radius);
        drawCircle(p, x, y - radius, radius);
    }
}
