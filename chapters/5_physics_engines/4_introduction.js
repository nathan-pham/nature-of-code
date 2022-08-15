import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

import Matter from "https://esm.sh/matter-js@0.18.0";
const { Engine, Runner, Bodies, Composite } = Matter;

export const canvas = new Canvas();

let engine, runner;

canvas.setup(({ mouse }) => {
    // initialize world
    engine = Engine.create();

    const ground = Bodies.rectangle(
        canvas.width / 2,
        canvas.height,
        canvas.width,
        20,
        {
            isStatic: true,
        }
    );
    Composite.add(engine.world, [ground]);

    runner = Runner.create();
    Runner.run(runner, engine);

    // add event listeners
    mouse.onPress(() => {
        Composite.add(engine.world, [
            Bodies.rectangle(
                mouse.x,
                mouse.y,
                CustomMath.random(5, 25),
                CustomMath.random(5, 25)
            ),
        ]);
    });
});

canvas.draw(({ utils, ctx }) => {
    const bodies = Composite.allBodies(engine.world);

    utils
        .background("white")
        .fill("black")
        .custom("fillText", "Press to place a new box.", 10, 22);

    ctx.beginPath();

    for (let i = 0; i < bodies.length; i += 1) {
        const vertices = bodies[i].vertices;

        // draw body
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
