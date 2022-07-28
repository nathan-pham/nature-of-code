import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

export const canvas = new Canvas();
const origin = new Vector(canvas.width / 2, canvas.height - 75);
const maxDepth = 10;

let nodes = [];
let palette;
let background;

canvas.setup(({ utils }) => {
    nodes = [];
    [background, ...palette] = utils.palette();
    nodes.push(new Node(origin, maxDepth));

    utils
        .background(background)
        // draw trunk
        .strokeWidth(1)
        .stroke(palette[0])
        .line(origin.x, origin.y, canvas.width / 2, canvas.height)
        .stroke()

        // draw branches
        .drawArray(nodes);
});

class Node {
    constructor(origin, depth = 1) {
        this.origin = origin.copy();
        this.depth = depth;

        this.getBranches();
        this.addNode();
    }

    getBranches() {
        const length = this.depth * 4 + maxDepth;

        const branchA = this.origin
            .copy()
            .sub(Vector.fromAngle(Math.PI / 4, length));

        const branchB = this.origin
            .copy()
            .sub(Vector.fromAngle((3 * Math.PI) / 4, length));

        // add noise to branches
        branchA.add(
            Vector.fromAngle(
                CustomMath.randomNormal(-Math.PI, Math.PI),
                Noise.perlin2(this.origin.x, this.origin.y) * length
            )
        );

        branchB.add(
            Vector.fromAngle(
                CustomMath.randomNormal(-Math.PI, Math.PI),
                Noise.perlin2(this.origin.x, this.origin.y) * length
            )
        );

        this.branchA = branchA;
        this.branchB = branchB;
    }

    addNode() {
        if (this.depth > 0) {
            nodes.push(new Node(this.branchA, this.depth - 1));
            nodes.push(new Node(this.branchB, this.depth - 1));
        }
    }

    draw(utils) {
        utils
            .stroke(palette[this.depth % palette.length])

            // draw first branch
            .line(this.origin.x, this.origin.y, this.branchA.x, this.branchA.y)
            .stroke()

            // draw second branch
            .line(this.origin.x, this.origin.y, this.branchB.x, this.branchB.y)
            .stroke();
    }
}
