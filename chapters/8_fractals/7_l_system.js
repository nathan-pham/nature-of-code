import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => {
    const Turtle = TurtleFactory(p);
    const LSystem = LSystemFactory(p);

    let turtle, lsystem;

    const setup = () => {
        p.createCanvas(600, 600);

        // create turtle
        const origin = p.createVector(p.width / 2, p.height);
        turtle = new Turtle(origin, p.radians(-15), 10, p.radians(25));

        // add rules
        lsystem = new LSystem("---F");
        lsystem.addRule("F", "FF+[+F-F-F]-[-F+F+F]");

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

export function TurtleFactory(p) {
    return class Turtle {
        constructor(initialPos, initialAngle, length, theta) {
            this.initialPos = initialPos;
            this.initialAngle = initialAngle;

            this.todo = "";
            this.length = length;
            this.theta = theta;
        }

        setTodo(todo) {
            this.todo = todo;
            return this;
        }

        setLength(length) {
            this.length = length;
            return this;
        }

        setAngle(theta) {
            this.theta = theta;
            return this;
        }

        draw() {
            p.push();
            p.translate(this.initialPos.x, this.initialPos.y);
            p.rotate(this.initialAngle);
            // interpret turtle path
            for (let i = 0; i < this.todo.length; i++) {
                const char = this.todo.charAt(i);
                switch (char) {
                    case "F":
                        p.line(0, 0, this.length, 0);
                        p.translate(this.length, 0);
                        break;

                    case "G":
                        p.translate(this.length, 0);
                        break;

                    case "+":
                        p.rotate(this.theta);
                        break;

                    case "-":
                        p.rotate(-this.theta);
                        break;

                    case "[":
                        p.push();
                        break;

                    case "]":
                        p.pop();
                        break;
                }
            }
            p.pop();
        }
    };
}

export function LSystemFactory(p) {
    return class LSystem {
        constructor(initialGeneration = "") {
            this.rules = {};
            this.state = initialGeneration;
        }

        addRule(char, nextCharGeneration) {
            this.rules[char] = nextCharGeneration;
        }

        nextGeneration() {
            let nextGeneration = "";
            for (let i = 0; i < this.state.length; i++) {
                const char = this.state.charAt(i);
                if (this.rules.hasOwnProperty(char)) {
                    nextGeneration += this.rules[char];
                } else {
                    nextGeneration += char;
                }
            }

            this.state = nextGeneration;
        }
    };
}
