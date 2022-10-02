import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => {
    const setup = () => {
        p.createCanvas(600, 600);
        p.noLoop();

        p.background(255);
        drawTriangle(p, p.width / 2, p.height / 2, 200);
    };

    return { setup };
});

function drawTriangle(p, x, y, radius) {
    p.stroke(0);
    p.noFill();

    //  draw sierpinksi triangle recursively
    if (radius > 2) {
        p.triangle(
            x - radius,
            y + radius,
            x + radius,
            y + radius,
            x,
            y - radius
        );
        drawTriangle(p, x - radius / 2, y + radius / 2, radius / 2); // draw left triangle
        drawTriangle(p, x + radius / 2, y + radius / 2, radius / 2); // draw right triangle
        drawTriangle(p, x, y - radius / 2, radius / 2); // draw top triangle
    }
}
