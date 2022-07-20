import Canvas from "/Canvas.js";

export const canvas = new Canvas();

canvas.draw(({ ctx }) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
