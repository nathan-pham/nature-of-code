import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas();

// y = amplitude * sin(2PI * x / period)
// logically, x / period is a ratio of 2PI (percent of full period)

const amplitude = 75;
const period = 150;

canvas.draw(({ utils, frameCount }) => {
    const x = amplitude * Math.cos(2 * Math.PI * (frameCount / period));

    utils
        .clear()
        .custom("save")
        .custom("translate", canvas.width / 2, canvas.height / 2)
        .stroke("#000")
        .fill("#7f7f7f")

        // draw line
        .line(0, 0, x, 0)
        .stroke()

        // draw circle
        .circle(x, 0, 10)
        .fill()
        .stroke()
        .custom("restore");
});
