import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    let origin;
    let vec;

    const setup = () => {
        p.createCanvas(500, 500);
        origin = p.createVector(p.width / 2, p.height / 2);
        vec = p5.Vector.random2D().mult(150);
    };

    const draw = () => {
        const mouse = p.createVector(p.mouseX, p.mouseY).sub(origin);
        const angle =
            (Math.acos(mouse.dot(vec) / (mouse.mag() * vec.mag())) * 180) /
            Math.PI;

        p.background(255);

        p.text(
            `${parseInt(angle)}° between <${parseInt(vec.x)}, ${parseInt(
                vec.y
            )}> and <${mouse.x}, ${mouse.y}>`,
            15,
            20
        );

        p.push();
        p.translate(origin.x, origin.y);
        p.line(0, 0, vec.x, vec.y);
        p.line(0, 0, mouse.x, mouse.y);
        p.pop();
    };

    return { setup, draw };
});
