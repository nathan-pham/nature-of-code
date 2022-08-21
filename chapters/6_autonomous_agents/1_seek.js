import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => {
    let vehicle;

    const setup = () => {
        p.createCanvas(500, 500);
        vehicle = new Vehicle(p.createVector(p.width / 2, p.height / 2));
    };

    const draw = () => {
        p.background(255);
        vehicle.seek(p.createVector(p.mouseX, p.mouseY));
        vehicle.update();
        vehicle.draw();
    };

    class Vehicle {
        constructor(pos) {
            this.pos = pos;
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);

            this.maxSpeed = 2;
            this.maxForce = 0.1;
        }

        seek(target) {
            const desired = target.copy().sub(this.pos);
            desired.setMag(this.maxSpeed);

            const steer = desired.copy().sub(this.vel);
            steer.limit(this.maxForce);
            this.acc.add(steer);
        }

        update() {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        draw() {
            const r = 6;

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
        }
    }

    return { setup, draw };
});
