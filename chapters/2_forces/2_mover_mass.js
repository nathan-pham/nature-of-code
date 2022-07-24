import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

import { Mover as BaseMover } from "./1_mover.js";

export const canvas = new Canvas();

const gravity = new Vector(0, 0.2);
const wind = new Vector(0.3, 0);

let movers;

canvas.setup(() => {
    movers = new Array(5).fill(0).map(() => new Mover());
});

canvas.draw(({ mouse, utils }) => {
    // update loop
    for (const mover of movers) {
        // directly apply gravity - mass has no effect here
        mover.acc.add(gravity);

        // apply wind if mouse is down
        if (mouse.down) {
            mover.applyForce(wind);
        }

        mover.update().boundaries();
    }

    utils.clear();

    utils
        .fill("#000")
        .custom("fillText", "Press your mouse to apply wind!", 10, 22)
        .drawArray(movers);
});

class Mover extends BaseMover {
    constructor() {
        super();

        this.mass = CustomMath.random(1, 10);
        this.radius = this.mass * 3;
        this.pos.x = CustomMath.random(this.radius, canvas.width - this.radius);
    }
}
