import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas();

const sinComponentsSize = 100;
let sinComponents = [];

canvas.setup(() => {
    sinComponents = new Array(sinComponentsSize)
        .fill(0)
        .map((_, i) => new SinComponent(i));
});

canvas.draw(({ utils }) => {
    utils.clear().drawArray(sinComponents);
});

class SinComponent {
    radius = 5;
    fillColor = `rgba(0, 0, 0, 0.1)`;
    strokeColor = "rgb(0, 0, 0)";

    constructor(i) {
        this.i = i;
        this.x = CustomMath.lerp(
            this.radius,
            canvas.width - this.radius,
            (this.i + 0.5) / sinComponentsSize
        );
    }

    draw(utils) {
        const amplitude = (canvas.height - this.radius * 2) / 4;
        const y =
            amplitude * Math.sin(canvas.frameCount / 30 + this.i / 10) +
            canvas.height / 2;

        utils
            .fill(this.fillColor)
            .stroke(this.strokeColor)
            .circle(this.x, y, this.radius)
            .fill()
            .stroke();
    }
}
