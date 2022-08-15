import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";
import Vector from "/lib/Vector.js";

import Matter from "https://cdn.skypack.dev/matter-js@0.18.0";
import MatterAttractors from "https://cdn.skypack.dev/matter-attractors@0.1.6";

const { Engine, Runner, Bodies, Composite } = Matter;

Matter.use(MatterAttractors);

export const canvas = new Canvas(500, 500);
const origin = new Vector(canvas.width / 2, canvas.height / 2);

// configure clock
const clockRadius = 200;
const hourRadius = 30;
const minuteRadius = 15;
const secondsRadius = 5;

let background, palette;
let engine, runner;

canvas.setup(({ utils }) => {
    [background, ...palette] = utils.palette();

    engine = Engine.create();

    // remove gravity
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.scale = 0.1;

    const [hours, minutes, seconds] = getTime();

    const options = (label, radius, fillStyle) => ({
        mass: radius / 20,
        friction: 0,
        frictionAir: 0.02,
        restitution: 0.5,
        label,
        render: {
            fillStyle,
        },
    });

    // add attractive center
    Composite.add(
        engine.world,
        Bodies.circle(canvas.width / 2, canvas.height / 2, 0, {
            isStatic: true,
            render: {
                fillStyle: palette[0],
            },
            plugin: {
                attractors: [
                    (bodyA, bodyB) => {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                        };
                    },
                ],
            },
        })
    );

    // add hours
    for (let i = 0; i < hours; i++) {
        const pos = polarToCartesian(
            clockRadius - 45,
            CustomMath.lerp(0, Math.PI * 2, (i + 9) / 12)
        ).add(origin);

        Composite.add(
            engine.world,
            Bodies.circle(
                pos.x,
                pos.y,
                hourRadius,
                options("hour", hourRadius, palette[1])
            )
        );
    }

    // render minutes
    for (let i = 0; i < minutes; i++) {
        const pos = polarToCartesian(
            clockRadius - 95,
            CustomMath.lerp(0, Math.PI * 2, (i + 45) / 60)
        ).add(origin);

        Composite.add(
            engine.world,
            Bodies.circle(
                pos.x,
                pos.y,
                minuteRadius,
                options("minute", minuteRadius, palette[2])
            )
        );
    }

    // render seconds
    for (let i = 0; i < seconds; i++) {
        const pos = polarToCartesian(
            clockRadius - 120,
            CustomMath.lerp(0, Math.PI * 2, (i + 45) / 60)
        ).add(origin);

        Composite.add(
            engine.world,
            Bodies.circle(
                pos.x,
                pos.y,
                secondsRadius,
                options("second", secondsRadius, palette[3])
            )
        );
    }

    runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
        Runner.stop(runner);
    };
});

canvas.draw(({ utils }) => {
    const bodies = Composite.allBodies(engine.world);

    utils
        .background(background)

        // clock radius
        .fill(palette[0])
        .circle(origin.x, origin.y, clockRadius)
        .fill();

    for (const body of bodies) {
        utils
            .fill(body.render.fillStyle)
            .circle(body.position.x, body.position.y, body.circleRadius)
            .fill();
    }
});

const polarToCartesian = (r, angle) =>
    new Vector(r * Math.cos(angle), r * Math.sin(angle));

const getTime = () => {
    const date = new Date();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return [hours, minutes, seconds];
};
