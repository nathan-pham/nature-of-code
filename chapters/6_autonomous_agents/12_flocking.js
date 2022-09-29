import useP5 from "/lib/useP5.js";
import p5 from "p5";

const ALIGNMENT = 40;
const SEPARATION = 30;
const COHESION = 30;

export const canvas = useP5((p) => {
    const Vehicle = VehicleFactory(p);
    let vehicles = [];

    const setup = () => {
        p.createCanvas(700, 700);
    };

    const draw = () => {
        p.background(255);

        vehicles.forEach((vehicle) => {
            vehicle.applyForces(vehicles);
            vehicle.boundary();
            vehicle.update();
        });

        vehicles.forEach((vehicle) => {
            vehicle.draw();
        });

        p.text("Press your mouse to add a new vehicle", 15, 20);

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
        radius = 3;

        constructor(initialX, initialY) {
            this.pos = p.createVector(initialX, initialY);
            this.vel = p5.Vector.random2D().setMag(this.maxSpeed);
            this.acc = p.createVector(0, 0);
        }

        get diameter() {
            return this.radius * 2;
        }

        filterVehicles(vehicles, radius) {
            return vehicles.filter(
                (v) => !(v === this || this.pos.dist(v.pos) > radius)
            );
        }

        applyForces(vehicles) {
            const alignmentForce = this.alignment(vehicles).mult(1);
            const separationForce = this.separation(vehicles).mult(1.75);
            const cohesionForce = this.cohesion(vehicles).mult(1);

            this.acc.add(alignmentForce);
            this.acc.add(separationForce);
            this.acc.add(cohesionForce);
        }

        seek(targetVel) {
            return targetVel
                .setMag(this.maxSpeed)
                .sub(this.vel)
                .limit(this.maxForce);
        }

        alignment(vehicles) {
            vehicles = this.filterVehicles(vehicles, ALIGNMENT);

            if (vehicles.length > 0) {
                const targetVel = vehicles
                    .reduce(
                        (targetVel, v) => targetVel.copy().add(v.vel),
                        p.createVector(0, 0)
                    )
                    .div(vehicles.length);

                return this.seek(targetVel);
            }

            return p.createVector(0, 0);
        }

        separation(vehicles, radius) {
            vehicles = this.filterVehicles(vehicles, radius || SEPARATION);

            if (vehicles.length > 0) {
                const targetVel = vehicles
                    .reduce(
                        (targetVel, v) =>
                            targetVel
                                .copy()
                                .add(
                                    this.pos
                                        .copy()
                                        .sub(v.pos)
                                        .div(this.pos.dist(v.pos))
                                ),
                        p.createVector(0, 0)
                    )
                    .div(vehicles.length);

                return this.seek(targetVel);
            }

            return p.createVector(0, 0);
        }

        cohesion(vehicles) {
            return this.separation(vehicles, COHESION).mult(-1);
        }

        boundary() {
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

        update() {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        draw() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.vel.heading() + Math.PI / 2);
            p.stroke(0);
            p.fill(200);
            p.beginShape();
            p.vertex(0, -this.diameter);
            p.vertex(-this.radius, this.diameter);
            p.vertex(this.radius, this.diameter);
            p.endShape(p.CLOSE);
            p.pop();
        }
    };
}
