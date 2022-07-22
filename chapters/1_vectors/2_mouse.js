import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

export const canvas = new Canvas();
const vCenter = new Vector(canvas.width / 2, canvas.height / 2);

canvas.setup(() => {});

canvas.draw(({ mouse, utils }) => {
    const vMouse = new Vector(mouse.x, mouse.y);
    vMouse.sub(vCenter).setMag(75);

    // center + deltaB = mouse
    // mouse - center = deltaB (vec towards mouse)

    utils.clear();

    utils
        .stroke("#000")
        .custom("save")
        .custom("translate", vCenter.x, vCenter.y)
        .line(0, 0, vMouse.x, vMouse.y)
        .stroke()
        .custom("restore");
});
