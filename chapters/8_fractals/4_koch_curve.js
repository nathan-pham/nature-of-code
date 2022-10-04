import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    const KochLine = KochLineFactory(p);
    const pointsCount = 3;
    const radius = 250;
    let lines = [];

    const setup = () => {
        p.createCanvas(700, 700);

        const origin = p.createVector(p.width / 2, p.height / 2);
        const points = new Array(pointsCount).fill(0).map((_, i) => {
            const angle = p.TWO_PI * (i / 3) - p.PI / 2;

            return origin
                .copy()
                .add(p.createVector(p.cos(angle), p.sin(angle)).mult(radius));
        });

        points.push(points[0]);

        for (let i = 0; i < points.length - 1; i++) {
            lines.push(new KochLine(points[i], points[i + 1]));
        }
    };

    const draw = () => {
        p.background(255);

        lines.forEach((line) => line.update());
        lines.forEach((line) => line.draw());

        p.text(
            "Press space to add a new set.\nIf you hold your mouse, the lines will wiggle!",
            15,
            20
        );
    };

    const keyPressed = () => {
        if (p.key === " ") {
            nextGeneration();
        }
    };

    const nextGeneration = () => {
        const nextLines = [];

        for (const line of lines) {
            const points = line.getPoints();

            for (let i = 0; i < points.length - 1; i++) {
                nextLines.push(
                    new KochLine(points[i].copy(), points[i + 1].copy())
                );
            }
        }

        lines = nextLines;
    };

    return { setup, draw, keyPressed };
});

function KochLineFactory(p) {
    return class KochLine {
        constructor(start, end) {
            this.start = start;
            this.end = end;
        }

        get length() {
            return this.start.copy().sub(this.end).mag();
        }

        getPoints() {
            const a = this.start.copy();
            const v = this.end.copy().sub(this.start).div(3);
            a.add(v);
            v.rotate(-p.radians(60));
            a.add(v);

            const points = [
                this.start.copy(),
                this.start.copy().lerp(this.end, 1 / 3),
                a,
                this.start.copy().lerp(this.end, 2 / 3),
                this.end.copy(),
            ];

            return points;
        }

        update() {
            if (p.mouseIsPressed) {
                this.start.add(p5.Vector.random2D());
                this.end.add(p5.Vector.random2D());
            }
        }

        draw() {
            const points = this.getPoints();

            for (let i = 0; i < points.length - 1; i++) {
                p.line(
                    points[i].x,
                    points[i].y,
                    points[i + 1].x,
                    points[i + 1].y
                );
            }
        }
    };
}
