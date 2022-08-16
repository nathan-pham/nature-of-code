import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

import Matter from "https://esm.sh/matter-js@0.18.0";
const { Engine, Runner, Bodies, Composite } = Matter;

export const canvas = new Canvas(600, 600);
const radius = 10;

let engine, runner, mouseConstraint;

canvas.setup(() => {
    // initialize world
    engine = Engine.create();

    // create chain
    let x = canvas.width / 2;
    let y = 30;

    let chain = [
        Bodies.circle(x, y, radius, {
            isStatic: true,
        }),
    ];
    let prevBody = chain[0];

    for (let i = 1; i < 20; i++) {
        let body = Bodies.circle(x, y + i * (radius * 1.5), radius);

        if (prevBody) {
            const constraint = Matter.Constraint.create({
                bodyA: body,
                bodyB: prevBody,
                length: radius * 2,
                stiffness: 0.2,
            });

            chain.push(constraint);
        }

        prevBody = body;
        chain.push(prevBody);
    }

    // add chain
    Composite.add(engine.world, chain);

    // add mouse
    // mouse.body is the body being drawn
    Composite.add(
        engine.world,
        (mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: Matter.Mouse.create(canvas.canvas),
        }))
    );

    runner = Runner.create();
    Runner.run(runner, engine);
});

canvas.draw(({ utils, ctx }) => {
    const bodies = Composite.allBodies(engine.world);
    const constraints = Composite.allConstraints(engine.world);

    // draw text
    utils
        .background("white")
        .fill("black")
        .custom(
            "fillText",
            "Use your mouse to interact with the chain.",
            10,
            22
        );

    // draw bodies
    // ideally you would create your own class for this
    for (const body of bodies) {
        utils
            .stroke(mouseConstraint.body === body ? "red" : "#999")
            .circle(body.position.x, body.position.y, radius)
            .stroke();
    }

    // draw constraints
    for (const constraint of constraints) {
        const bodyA = constraint.bodyA?.position;
        const bodyB = constraint.bodyB?.position;

        if (bodyA && bodyB) {
            utils
                .stroke("#333")
                .line(bodyA.x, bodyA.y, bodyB.x, bodyB.y)
                .stroke();
        }
    }
});
