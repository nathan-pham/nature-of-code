import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    const margin = 50;

    let origin; // start line
    let vec; // end line

    const setup = () => {
        p.createCanvas(500, 500);

        const y = p.height - margin;

        origin = p.createVector(margin, y);
        vec = p.createVector(p.width - margin, y - 40).sub(origin);
    };

    const draw = () => {
        const mouse = p.createVector(p.mouseX, p.mouseY).sub(origin);
        const b = vec.copy();
        const sp = b.normalize().mult(mouse.dot(b)); // scalar projection

        p.background(255);

        p.push();
        p.translate(origin.x, origin.y);

        // draw vector & mouse
        p.line(0, 0, vec.x, vec.y);
        p.line(0, 0, mouse.x, mouse.y);

        // draw perpendicular line from mouse to vector
        p.line(mouse.x, mouse.y, sp.x, sp.y);
        p.circle(sp.x, sp.y, 10);
        p.pop();
    };

    return { setup, draw };
});
