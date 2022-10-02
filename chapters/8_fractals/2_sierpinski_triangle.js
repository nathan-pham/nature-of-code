import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => {
    const setup = () => {
        p.createCanvas(600, 600);
        p.noLoop();

        p.background(255);
        drawTriangle(p, p.width / 2, p.height / 2, 300);
    };

    return { setup };
});

function drawTriangle(p, x, y, radius) {
    p.stroke(0);
    p.noFill();

    // if (diameter > 10) {
    //     drawCircle(p, x + radius, y, radius);
    //     drawCircle(p, x - radius, y, radius);
    //     drawCircle(p, x, y + radius, radius);
    //     drawCircle(p, x, y - radius, radius);
    // }
}
