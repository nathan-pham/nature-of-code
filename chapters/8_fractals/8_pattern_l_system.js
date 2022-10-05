import useP5 from "/lib/useP5.js";
import { LSystemFactory, TurtleFactory } from "./7_l_system.js";

export const canvas = useP5((p) => {
    const LSystem = LSystemFactory(p);
    const Turtle = TurtleFactory(p);

    let turtle, lsystem;

    const setup = () => {
        p.createCanvas(600, 600);

        turtle = new Turtle(p.createVector(0, p.height), 0, 5, p.PI / 2);
        lsystem = new LSystem("F-F-F-F");
        lsystem.addRule("F", "F[F]-F+F[--F]+F-F");
        p.noLoop();
    };

    const draw = () => {
        p.background(255);
        lsystem.nextGeneration();
        turtle.setTodo(lsystem.state).draw();
        p.text("Press space to advance to the next generation", 15, 20);
    };

    const keyPressed = () => {
        if (p.key === " ") {
            p.redraw();
        }
    };

    return { setup, draw, keyPressed };
});
