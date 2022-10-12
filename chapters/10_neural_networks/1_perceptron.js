import useP5 from "/lib/useP5.js";
import p5 from "p5";

// f(x) = m * x + b
const f = (x) => 0.3 * x - 0.2;

export const canvas = useP5((p) => {
    const Perceptron = PerceptronFactory(p);
    const Point = PointFactory(p);

    const pointsCount = 200;
    let perceptron;
    let points = [];

    let i = 0;

    const setup = () => {
        p.createCanvas(600, 600);
        perceptron = new Perceptron(3);
        points = new Array(pointsCount).fill(0).map(() => new Point());
    };

    const draw = () => {
        p.background(255);

        // train perceptron
        perceptron.train(points[i % points.length]);
        i++;

        // draw f(x)
        {
            const p1 = new Point(-1, perceptron.guessY(-1));
            const p2 = new Point(1, perceptron.guessY(1));
            p.line(p1.getX(), p1.getY(), p2.getX(), p2.getY());
        }

        {
            const p1 = new Point(-1, f(-1));
            const p2 = new Point(1, f(1));
            p.line(p1.getX(), p1.getY(), p2.getX(), p2.getY());
        }

        // draw p
        for (const point of points) {
            point.update(perceptron);
            point.draw();
        }
    };

    return { setup, draw };
});

function PointFactory(p) {
    return class Point {
        constructor(x = p.random(-1, 1), y = p.random(-1, 1)) {
            this.x = x;
            this.y = y;
            this.bias = 1;
            this.label = this.getLabel();
            this.predictedLabel = null;
        }

        getLabel() {
            // are you above the line or below the line
            const label = this.y > f(this.x);
            return label ? 1 : -1;
        }

        getX() {
            return p.map(this.x, -1, 1, 0, p.width);
        }

        getY() {
            return p.map(this.y, -1, 1, p.height, 0);
        }

        getInputs() {
            return [this.x, this.y, this.bias];
        }

        update(perceptron) {
            this.predictedLabel = perceptron.predict(this.getInputs());
        }

        draw() {
            p.push();
            p.translate(this.getX(), this.getY());

            // draw class
            p.fill(this.label === 1 ? 255 : 0);
            p.circle(0, 0, 16);

            // draw if prediction is correct
            p.fill(this.predictedLabel === this.label ? "green" : "red");
            p.circle(0, 0, 8);
            p.pop();
        }
    };
}

function PerceptronFactory(p) {
    return class Perceptron {
        constructor(inputCount, learningRate = 0.01) {
            this.inputCount = inputCount;
            this.learningRate = learningRate;
            this.weights = this.initWeights();
        }

        train(point) {
            const inputs = point.getInputs();
            const prediction = this.predict(inputs);
            const error = point.label - prediction;

            // update weights
            for (let i = 0; i < this.weights.length; i++) {
                // lr * error * input
                this.weights[i] += error * inputs[i] * this.learningRate;
            }
        }

        activate(output) {
            return output >= 0 ? 1 : -1;
        }

        predict(inputs) {
            let weightedSum = 0;
            for (let i = 0; i < this.weights.length; i++) {
                weightedSum += inputs[i] * this.weights[i];
            }

            // activate function
            return this.activate(weightedSum);
        }

        // create random array of weights
        initWeights() {
            const weights = new Array(this.inputCount)
                .fill(0)
                .map(() => p.random(-1, 1));

            return weights;
        }

        guessY(x) {
            const [w0, w1, w2] = this.weights;
            return (-w0 / w1) * x - w2 / w1;
        }
    };
}
