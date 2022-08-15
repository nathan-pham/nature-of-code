import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

import Matter from "https://esm.sh/matter-js@0.18.0";
const { Engine, Runner, Bodies, Composite } = Matter;

export const canvas = new Canvas(600, 600);

let engine, runner;

canvas.setup(() => {
    // initialize world
    engine = Engine.create();

    // add ground
    Composite.add(engine.world, [
        Bodies.rectangle(canvas.width / 2, 150, canvas.width / 2, 20, {
            isStatic: true,
            angle: Math.PI / 7,
        }),
        Bodies.rectangle(canvas.width / 2, 450, canvas.width, 20, {
            isStatic: true,
            angle: -Math.PI / 7,
        }),
    ]);

    runner = Runner.create();
    Runner.run(runner, engine);
});

canvas.draw(({ mouse, utils, ctx }) => {
    const bodies = Composite.allBodies(engine.world);

    // if mouse is down, add circles
    if (mouse.down) {
        Composite.add(engine.world, [
            Bodies.circle(mouse.x, mouse.y, CustomMath.random(2, 10)),
        ]);
    }

    utils
        .background("white")
        .fill("black")
        .custom("fillText", "Press to place a new circle.", 10, 22);

    ctx.beginPath();

    // update loop
    for (const body of bodies) {
        if (body.position.y > canvas.height + 50) {
            Matter.Composite.remove(engine.world, body);
        }
    }

    // draw loop
    for (const body of bodies) {
        const { vertices } = body;

        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let j = 1; j < vertices.length; j += 1) {
            ctx.lineTo(vertices[j].x, vertices[j].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#999";
    ctx.stroke();
});
