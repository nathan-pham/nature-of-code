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
    const vEndMouse = vMouse.copy().sub(vCenter).setMag(75);

    // center + deltaB = mouse
    // mouse - center = deltaB (vec towards mouse)

    ball.update(vMouse);

    utils.clear();

    utils
        .stroke("#000")
        .custom("save")
        .custom("translate", vCenter.x, vCenter.y)
        .line(0, 0, vEndMouse.x, vEndMouse.y)
        .stroke()
        .custom("restore")
        .draw(ball);
});

class Ball {
    constructor() {
        this.pos = vCenter.copy();
        this.vel = new Vector();
        this.acc = new Vector();
    }

    update(mouse) {
        this.acc.add(mouse.copy().sub(this.pos).mult(0.01));

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.vel.limit(5);
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
