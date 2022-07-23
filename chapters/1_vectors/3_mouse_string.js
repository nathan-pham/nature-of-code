import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();
const vCenter = new Vector(canvas.width / 2, canvas.height / 2);

let ball;

canvas.setup(() => {
    ball = new Ball();
});

canvas.draw(({ mouse, utils }) => {
    const vMouse = new Vector(mouse.x, mouse.y);
    vMouse.sub(ball.pos);

    // center + deltaB = mouse
    // mouse - center = deltaB (vec towards mouse)

    // make updates
    ball.acc.add(vMouse.copy().mult(0.001)); // move towards mouse
    ball.acc.add(new Vector(0, 0.1)); // apply  gravity
    ball.update();

    utils.clear();

    utils
        .stroke("#000") // draw line
        .line(mouse.x, mouse.y, ball.pos.x, ball.pos.y)
        .stroke()
        .draw(ball); // draw ball
});

class Ball {
    constructor() {
        this.pos = vCenter.copy();
        this.vel = new Vector();
        this.acc = new Vector();
    }

    update() {
        this.vel.add(this.acc);
        this.vel.mult(0.99); // apply friction
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    draw(utils) {
        utils
            .fill("#7f7f7f")
            .stroke("#000")
            .circle(this.pos.x, this.pos.y, 10)
            .fill()
            .stroke();
    }
}
