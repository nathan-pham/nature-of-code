import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas();

// y = amplitude * sin(2PI * x / period)
// logically, x / period is a ratio of 2PI (percent of full period)

const oscillatorsSize = 10;
let oscillators = [];

canvas.setup(() => {
    oscillators = new Array(oscillatorsSize)
        .fill(0)
        .map(() => new Oscillator());
});

canvas.draw(({ utils }) => {
    utils.clear().drawArray(oscillators);
});

class Oscillator {
    amplitudeX = CustomMath.random(40, 150);
    periodX = CustomMath.random(100, 200);

    amplitudeY = CustomMath.random(40, 150);
    periodY = CustomMath.random(100, 200);

    draw(utils) {
        const x =
            this.amplitudeX *
            Math.sin(2 * Math.PI * (canvas.frameCount / this.periodX));

        const y =
            this.amplitudeY *
            Math.sin(2 * Math.PI * (canvas.frameCount / this.periodY));

        utils
            .custom("save")
            .custom("translate", canvas.width / 2, canvas.height / 2)
            .stroke("#000")
            .fill("#7f7f7f")

            // draw line
            .line(0, 0, x, y)
            .stroke()

            // draw circle
            .circle(x, y, 10)
            .fill()
            .stroke()
            .custom("restore");
    }
}
