import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

import { Mover as BaseMover } from "../2_forces/1_mover.js";

export const canvas = new Canvas();

// Hooke's law
// Fs = -k * x
// k = spring constant
// x = displacement = stretched length - rest length
// direction of force is bob - origin

const origin = new Vector(canvas.width / 2, 0);
let spring, bob;

canvas.setup(() => {
    spring = new Spring(150);
    bob = new Bob(new Vector(origin.x, spring.restLength + 50));
});

canvas.draw(({ mouse, utils }) => {
    spring.connect(bob);

    // apply gravity
    bob.acc.add(new Vector(0, 0.1));

    // apply wind if mouse is pressed
    if (mouse.down) {
        bob.applyForce(new Vector(0.1, 0));
    }

    bob.update();

    utils
        .clear()
        .stroke("#000")
        // draw text
        .fill("#000")
        .custom("fillText", "Press your mouse to apply wind!", 10, 22)

        // draw rope
        .line(origin.x, origin.y, bob.pos.x, bob.pos.y)
        .stroke()

        // draw bob
        .draw(bob);
});

class Spring {
    k = 0.01;

    constructor(restLength) {
        this.restLength = restLength;
    }

    connect(bob) {
        const springForce = bob.pos.copy().sub(origin);
        const currentLength = springForce.mag();
        const displacement = currentLength - this.restLength;

        springForce.normalize().mult(-this.k * displacement);
        bob.applyForce(springForce);
    }
}

class Bob extends BaseMover {
    constructor(initialBobPos) {
        super();
        this.pos = initialBobPos;
    }

    draw(utils) {
        utils.fill("#fff").circle(this.pos.x, this.pos.y, 10).fill().stroke();
    }
}
