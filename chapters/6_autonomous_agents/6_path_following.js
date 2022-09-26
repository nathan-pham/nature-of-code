import useP5 from "/lib/useP5.js";
import p5 from "p5";

export const canvas = useP5((p) => {
    // 1. find vehicles future location
    // 2. is future location within path radius?
    //    2.1 if yes, do nothing
    //    2.2 if no, find closest point on path (scalar projection) & seek it

    // all behavior is based on desired velocity

    // initialize classes
    const Vehicle = VehicleFactory(p);
    const Path = PathFactory(p);

    let vehicles = [];
    let path;

    const setup = () => {
        p.createCanvas(500, 500);
        path = new Path();
    };

    const draw = () => {
        p.background(255);

        // update
        vehicles.forEach((vehicle) => {
            vehicle.follow(path);
            vehicle.borders(path);
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

export function VehicleFactory(p) {
    return class Vehicle {
        pos = p.createVector(0, 0);
        vel = p.createVector(0, 0);
        acc = p.createVector(0, 0);
        maxSpeed = 2;
        maxForce = 0.1;
        radius = 6;

        constructor(x, y) {
            this.pos = p.createVector(x, y);
            this.vel = p.createVector(this.maxSpeed, 0);
        }

        get diameter() {
            return this.radius * 2;
        }

        static getNormalPoint(pos, path) {
            const { start: origin, end } = path;
            const a = end.copy().sub(origin);
            const b = pos.copy().sub(origin);

            // scalar projection to get normal point
            const sp = a.normalize().mult(b.dot(a));
            const normalPoint = sp.copy().add(origin);

            return normalPoint;
        }

        borders(path) {
            // reset position when off screen
            if (this.pos.x > path.end.x + this.diameter) {
                this.pos.x = path.start.x - this.diameter;
                this.pos.y = path.start.y;
            }
        }

        follow(path) {
            // 50 is arbitrary (see ahead by 50 frames)
            const posPredict = this.pos.copy().add(this.vel.copy().setMag(50));
            const normalPoint = Vehicle.getNormalPoint(posPredict, path);

            // if vehicle is not within path, do something
            if (p5.Vector.dist(posPredict, normalPoint) > path.radius) {
                const target = path.end
                    .copy()
                    .sub(path.start)
                    .setMag(20)
                    .add(normalPoint); // target points a little bit ahead of normal

                this.seek(target);
            }
        }

        seek(target) {
            const desired = target.copy().sub(this.pos).setMag(this.maxSpeed);
            const steer = desired.copy().sub(this.vel).limit(this.maxForce);
            this.acc.add(steer);
        }

        update() {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        draw() {
            // translate vehicle
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.vel.heading() + Math.PI / 2);

            // draw vehicle
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

export function PathFactory(p) {
    return class Path {
        constructor(start, end, radius = 20) {
            const gradient = 50;

            this.start = start || p.createVector(0, p.height / 2 - gradient);
            this.end = end || p.createVector(p.width, p.height / 2 + gradient);
            this.radius = radius;
        }

        get strokeWeight() {
            return this.radius * 2;
        }

        draw() {
            // draw path radius
            p.stroke(200);
            p.strokeWeight(this.strokeWeight);
            p.line(this.start.x, this.start.y, this.end.x, this.end.y);

            // draw path line
            p.stroke(0);
            p.strokeWeight(1);
            p.line(this.start.x, this.start.y, this.end.x, this.end.y);
        }
    };
}
