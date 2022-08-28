import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    let vehicles = [];
    let field;

    const setup = () => {
        p.createCanvas(700, 700);
        field = new FlowField();
    };

    const draw = () => {
        p.background(255);

        // add a new vehicle on mouse press
        if (p.mouseIsPressed) {
            vehicles.push(new Vehicle(p.createVector(p.mouseX, p.mouseY)));
        }

        // update vehicles
        vehicles.forEach((vehicle) => {
            vehicle.seek(field.getVector(vehicle));
            vehicle.update();
            vehicle.draw();
        });

        p.text("Pressing your mouse will add a vehicle.", 15, 20);
    };

    class FlowField {
        constructor(resolution = 20) {
            this.resolution = resolution;
            this.grid = this.createGrid();
        }

        createGrid() {
            // create a 2d array of angles based on noise
            const grid = [];
            for (let y = 0; y < p.height; y += this.resolution) {
                const row = [];
                for (let x = 0; x < p.width; x += this.resolution) {
                    row.push(
                        p.map(p.noise(x / 100, y / 100), 0, 1, 0, p.TWO_PI)
                    );
                }

                grid.push(row);
            }

            return grid;
        }

        getVector(vehicle) {
            // convert location -> index in grid
            const x = p.constrain(
                p.floor(vehicle.pos.x / this.resolution),
                0,
                this.resolution
            );

            const y = p.constrain(
                p.floor(vehicle.pos.y / this.resolution),
                0,
                this.resolution
            );

            return p5.Vector.fromAngle(this.grid[y][x]);
        }

        draw() {
            // draw all angles in the grid
            for (let y = 0; y < this.grid.length; y++) {
                for (let x = 0; x < this.grid[y].length; x++) {
                    p.push();
                    p.translate(
                        (x + 0.5) * this.resolution,
                        (y + 0.5) * this.resolution
                    );
                    p.rotate(this.grid[y][x]);
                    p.rect(0, 0, 10, 0);
                    p.pop();
                }
            }
        }
    }

    class Vehicle {
        constructor(pos) {
            this.pos = pos;
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);

            this.maxSpeed = 5;
            this.maxForce = 0.1;
            this.r = 6;
        }

        seek(desired) {
            // the desired vel is the field vector
            desired.setMag(this.maxSpeed);

            const steer = desired.copy().sub(this.vel);
            steer.limit(this.maxForce);
            this.acc.add(steer);
        }

        update() {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);

            const d = this.r * 2;

            // "infinite" canvas
            if (this.pos.x < -d) {
                this.pos.x = p.width + d;
            } else if (this.pos.x > p.width + d) {
                this.pos.x = -d;
            }

            if (this.pos.y < -d) {
                this.pos.y = p.height + d;
            } else if (this.pos.y > p.height + d) {
                this.pos.y = -d;
            }
        }

        draw() {
            const r = this.r;

            p.push();

            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.vel.heading() + Math.PI / 2);

            // draw triangle
            p.fill(100);
            p.stroke(0);
            p.beginShape();
            p.vertex(0, -r * 2);
            p.vertex(-r, r * 2);
            p.vertex(r, r * 2);
            p.endShape(p.CLOSE);

            p.pop();
        }
    }

    return { setup, draw };
});
