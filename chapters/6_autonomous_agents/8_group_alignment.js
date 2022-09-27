import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    // initialize classes
    const Vehicle = VehicleFactory(p);

    let vehicles = [];

    const setup = () => {
        p.createCanvas(700, 700);
    };

    const draw = () => {
        p.background(255);

        // update
        vehicles.forEach((vehicle) => {
            vehicle.borders();
            vehicle.align(vehicles);
            vehicle.update();
        });

        // draw
        vehicles.forEach((vehicle) => vehicle.draw());

        p.strokeWeight();
        p.text("Pressing your mouse will add a vehicle.", 15, 20);

        if (p.mouseIsPressed) {
            vehicles.push(new Vehicle(p.mouseX, p.mouseY));
        }
    };

    return { setup, draw };
});

function VehicleFactory(p) {
    return class Vehicle {
        maxSpeed = 2;
        maxForce = 0.2;
        radius = 6;

        constructor(initialX, initialY) {
            this.pos = p.createVector(initialX, initialY);
            this.vel = p5.Vector.random2D().mult(this.maxSpeed);
            this.acc = p.createVector(0, 0);
        }

        get diameter() {
            return this.radius * 2;
        }

        borders() {
            if (this.pos.x > p.width + this.diameter) {
                this.pos.x = -this.diameter;
            } else if (this.pos.x < -this.diameter) {
                this.pos.x = p.width + this.diameter;
            }

            if (this.pos.y > p.height + this.diameter) {
                this.pos.y = -this.diameter;
            } else if (this.pos.y < -this.diameter) {
                this.pos.y = p.height + this.diameter;
            }
        }

        align(vehicles) {
            vehicles = vehicles.filter(
                (vehicle) =>
                    !(vehicle === this || vehicle.pos.dist(this.pos) < 0)
            );

            if (vehicles.length > 0) {
                const averageVelocity = vehicles.reduce(
                    (acc, curr) => acc.copy().add(curr.vel),
                    p.createVector(0, 0)
                );

                this.seek(averageVelocity.div(vehicles.length));
            }
        }

        seek(desired) {
            const steer = desired
                .setMag(this.maxSpeed)
                .sub(this.vel)
                .limit(this.maxForce);

            this.acc.add(steer);
        }

        update() {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        draw() {
            // draw vehicle
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.vel.heading() + Math.PI / 2);
            p.fill(200);
            p.stroke(0);
            p.strokeWeight(1);
            p.beginShape();
            p.vertex(0, -this.diameter);
            p.vertex(-this.radius, this.diameter);
            p.vertex(this.radius, this.diameter);
            p.endShape(p.CLOSE);
            p.pop();
        }
    };
}
