import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => {
    const Tree = TreeFactory(p);

    let tree;

    const setup = () => {
        p.createCanvas(600, 600);

        tree = new Tree(p.createVector(p.width / 2, p.height), 200);
    };

    const draw = () => {
        p.background(255);
        tree.draw();

        p.text(
            "Move your mouse horizontally to change the tree angle.",
            15,
            20
        );
    };

    return { setup, draw };
});

function TreeFactory(p) {
    return class Tree {
        constructor(origin, initialHeight, lengthRetention = 0.6) {
            this.origin = origin;
            this.initialHeight = initialHeight;
            this.lengthRetention = lengthRetention;
        }

        drawBranch(angle, length) {
            p.push();
            p.rotate(angle);
            p.strokeWeight(p.map(length, 0, this.initialHeight, 1, 5));
            p.line(0, 0, 0, -length);

            // if the length is long enough, draw more branches at -length
            if (length > 5) {
                p.translate(0, -length);
                this.drawBranches(length * this.lengthRetention);
            }

            p.pop();
        }

        drawBranches(length) {
            // map mouse x to angle & then draw branches at each angle to form a V
            const angle = p.map(p.mouseX, 0, p.width, 0, p.PI / 2);
            this.drawBranch(angle, length);
            this.drawBranch(-angle, length);
        }

        draw() {
            p.push();
            p.translate(this.origin.x, this.origin.y);
            this.drawBranch(0, this.initialHeight);
            p.pop();
        }
    };
}
