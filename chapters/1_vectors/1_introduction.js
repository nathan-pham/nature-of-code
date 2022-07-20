import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas();

canvas.draw(({ ctx }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
