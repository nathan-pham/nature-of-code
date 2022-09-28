import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    // initialize classes
    const Vehicle = VehicleFactory(p);
    const Path = PathFactory(p);

    let path;
    let vehicles = [];

    const setup = () => {
        p.createCanvas(700, 700);
        path = new Path();
    };

    const draw = () => {
        p.background(255);

        // update
        vehicles.forEach((vehicle) => {
            vehicle.borders();
            vehicle.applyForces(path, vehicles);
            vehicle.update();
        });

        // draw
        path.draw();
        vehicles.forEach((vehicle) => vehicle.draw());

        p.strokeWeight();
        p.text("Pressing your mouse will add a vehicle.", 15, 20);

        if (p.mouseIsPressed) {
            vehicles.push(new Vehicle(p.mouseX, p.mouseY));
        }
    };

    return { setup, draw };
});

function PathFactory(p) {
    return class Path {
        points = [];
        radius = 30;

        constructor() {
            this.points = this.createPoints();
        }

        get diameter() {
            return this.radius * 2;
        }

        createPoints(margin = 100) {
            const points = [
                p.createVector(margin, margin),
                p.createVector(p.width - margin, margin),
                p.createVector(p.width - margin, p.height - margin),
                p.createVector(margin, p.height - margin),
            ];

            return points;
        }

        drawPath() {
            p.beginShape();
            p.noFill();
            for (const point of this.points) {
                p.vertex(point.x, point.y);
            }
            p.endShape(p.CLOSE);
        }

        draw() {
            p.stroke(200);
            p.strokeWeight(this.diameter);
            this.drawPath();

            p.stroke(0);
            p.strokeWeight(1);
            this.drawPath();
        }
    };
}

function VehicleFactory(p) {
    return class Vehicle {
        maxSpeed = 2;
        maxForce = 0.2;
        radius = 4;

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

        applyForces(path, vehicles) {
            const followForce = this.follow(path);
            const separateForce = this.separate(vehicles);
            followForce && this.acc.add(followForce.mult(1.5));
            separateForce && this.acc.add(separateForce);
        }

        follow(path) {
            const futurePos = this.pos.copy().add(this.vel.copy().setMag(50));
            const [normalPoint, points] = Vehicle.findNormalPoint(
                path,
                futurePos
            );

            if (
                normalPoint &&
                points &&
                p5.Vector.dist(futurePos, normalPoint) > path.radius
            ) {
                const [end, start] = points;
                const target = end
                    .copy()
                    .sub(start)
                    .setMag(20)
                    .add(normalPoint);

                const desired = target
                    .copy()
                    .sub(this.pos)
                    .setMag(this.maxSpeed);

                const seek = desired.copy().sub(this.vel).limit(this.maxForce);
                return seek;
            }

            return p.createVector(0, 0);
        }

        static findNormalPoint(path, pos) {
            const points = [...path.points, path.points[0]];
            const normalPoints = [];

            for (let i = 0; i < points.length - 1; i++) {
                const origin = points[i];
                const end = points[i + 1];

                const a = end.copy().sub(origin);
                const b = pos.copy().sub(origin);

                const scalarProjection = a.normalize().mult(b.dot(a));
                const normalPoint = scalarProjection.copy().add(origin);
                normalPoints.push([normalPoint, origin, end]);
            }

            let maxNormalPoint = null;
            let maxPoints = null;
            let maxDistance = 10000;
            for (const [normalPoint, origin, end] of normalPoints) {
                // AC + CB = AB
                if (
                    !(
                        Math.abs(
                            origin.dist(normalPoint) +
                                end.dist(normalPoint) -
                                origin.dist(end)
                        ) < 0.05
                    )
                ) {
                    maxPoints = [origin, end];
                    continue;
                }

                if (pos.dist(normalPoint) < maxDistance) {
                    maxDistance = pos.dist(normalPoint);
                    maxNormalPoint = normalPoint;
                    maxPoints = [origin, end];
                }
            }

            return [maxNormalPoint, maxPoints];
        }

        separate(vehicles, separationRadius = 25) {
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
