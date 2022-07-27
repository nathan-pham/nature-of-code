import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";
import Noise from "/lib/Noise.js";

import Matter from "https://esm.sh/matter-js@0.18.0";

const { Engine, Render, Runner, Bodies, Composite } = Matter;

export const canvas = new Canvas();

let engine, runner;

canvas.setup(() => {
    // initialize world
    engine = Engine.create();

    // create two boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 20, 20);
    const boxB = Bodies.rectangle(450, 50, 20, 20);
    const ground = Bodies.rectangle(
        canvas.width / 2,
        canvas.height,
        canvas.width,
        20,
        {
            isStatic: true,
        }
    );
    Composite.add(engine.world, [boxA, boxB, ground]);

    runner = Runner.create();
    Runner.run(runner, engine);
});

canvas.draw(({}) => {
    var bodies = Composite.allBodies(engine.world);
    const context = canvas.ctx;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    for (var i = 0; i < bodies.length; i += 1) {
        var vertices = bodies[i].vertices;

        context.moveTo(vertices[0].x, vertices[0].y);

        for (var j = 1; j < vertices.length; j += 1) {
            context.lineTo(vertices[j].x, vertices[j].y);
        }

        context.lineTo(vertices[0].x, vertices[0].y);
    }

    context.lineWidth = 1;
    context.strokeStyle = "#999";
    context.stroke();
});
