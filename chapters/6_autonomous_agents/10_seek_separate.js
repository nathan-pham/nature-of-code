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
            vehicle.applyForces(vehicles);
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
        radius = 8;

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

        applyForces(vehicles) {
            const seekForce = this.seek(p.createVector(p.mouseX, p.mouseY));
            const separateForce = this.separate(vehicles);

            separateForce.mult(2);
            seekForce.mult(1);

            this.acc.add(seekForce);
            this.acc.add(separateForce);
        }

        seek(target) {
            const desired = target.copy().sub(this.pos).setMag(this.maxSpeed);
            const steer = desired.copy().sub(this.vel).limit(this.maxForce);
            return steer;
        }

        separate(vehicles, separationRadius = 30) {
            // get all vehicles within separationRadius && not equal to this one
            vehicles = vehicles.filter(
                (v) => !(v === this || v.pos.dist(this.pos) > separationRadius)
            );

            // separation: average of all vectors pointing away from other vehicles
            if (vehicles.length > 0) {
                const desiredSeparation = vehicles
                    .reduce(
                        (sep, other) =>
                            sep
                                .copy()
                                .add(
                                    this.pos
                                        .copy()
                                        .sub(other.pos)
                                        .normalize()
                                        .div(this.pos.dist(other.pos))
                                ),
                        p.createVector(0, 0)
                    )
                    .div(vehicles.length);

                const steer = desiredSeparation
                    .setMag(this.maxSpeed)
                    .sub(this.vel)
                    .limit(this.maxForce);

                return steer;
            }

            return p.createVector(0, 0);
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
            p.fill(200);
            p.stroke(0);
            p.strokeWeight(1);
            p.circle(0, 0, this.diameter);
            p.pop();
        }
    };
}
