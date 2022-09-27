import useP5 from "/lib/useP5.js";
import p5 from "p5";

import { VehicleFactory as BaseVehicleFactory } from "./6_path_following.js";

// similar code to path_following but with a more complex path
export const canvas = useP5((p) => {
    // initialize classes
    const Path = PathFactory(p);
    const Vehicle = VehicleFactory(p);

    let vehicles = [];
    let path;

    const setup = () => {
        p.createCanvas(700, 700);
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
        p.text(
            "Pressing your mouse will add a vehicle.\nPress space to regenerate the path.",
            15,
            20
        );

        if (p.mouseIsPressed) {
            vehicles.push(new Vehicle(p.mouseX, p.mouseY));
        }
    };

    const keyPressed = () => {
        // regenerate path on space
        if (p.keyCode === 32) {
            path = new Path();
        }
    };

    return { setup, draw, keyPressed };
});

function PathFactory(p) {
    return class Path {
        constructor() {
            this.points = Path.createPoints();
            this.radius = 20;
        }

        get diameter() {
            return this.radius * 2;
        }

        /**
         * Randomly generate a path to follow
         * @param {number} segments - Number of line segments
         * @returns Array of points (vectors)
         */
        static createPoints(segments = 3) {
            const points = [];

            for (let i = 0; i <= segments; i++) {
                points.push(
                    p.createVector(
                        p.lerp(-20, p.width + 20, i / segments),
                        p.random(-100, 100) + p.height / 2
                    )
                );
            }

            return points;
        }

        drawPoints() {
            for (let i = 0; i < this.points.length - 1; i++) {
                p.line(
                    this.points[i].x,
                    this.points[i].y,
                    this.points[i + 1].x,
                    this.points[i + 1].y
                );
            }
        }

        draw() {
            // draw radius
            p.strokeWeight(this.diameter);
            p.stroke(200);
            this.drawPoints();

            // draw path
            p.strokeWeight(1);
            p.stroke(0);
            this.drawPoints();
        }
    };
}

function VehicleFactory(p) {
    const BaseVehicle = BaseVehicleFactory(p);
    return class Vehicle extends BaseVehicle {
        /**
         * Format points into old path format
         * @param {Path} path - Path with an array of points
         * @returns Path with {start, end} format
         */
        static formatPath(path) {
            const paths = [];
            for (let i = 0; i < path.points.length - 1; i++) {
                paths.push({
                    start: path.points[i],
                    end: path.points[i + 1],
                });
            }

            return paths;
        }

        static getNormalPoints(posPredict, paths) {
            const normalPoints = paths.map((path) =>
                Vehicle.getNormalPoint(posPredict, path)
            );

            // get the closest normal point
            let closestNormalPoint = null;
            let closestIdx = null;
            let closestDistance = 100000;
            for (let i = 0; i < normalPoints.length; i++) {
                let normalPoint = normalPoints[i];
                let path = paths[i];

                if (
                    normalPoint.x < path.start.x ||
                    normalPoint.x > path.end.x
                ) {
                    normalPoint = path.end.copy();
                }

                const distance = p5.Vector.dist(posPredict, normalPoint);
                if (distance < closestDistance) {
                    closestNormalPoint = normalPoint;
                    closestDistance = distance;
                    closestIdx = i;
                }
            }
            return [closestNormalPoint, closestIdx];
        }

        follow(path) {
            const posPredict = this.pos.copy().add(this.vel.copy().setMag(50));
            const paths = Vehicle.formatPath(path);
            const [normalPoint, pathIdx] = Vehicle.getNormalPoints(
                posPredict,
                paths
            );

            if (
                normalPoint &&
                p5.Vector.dist(posPredict, normalPoint) > path.radius
            ) {
                const target = paths[pathIdx].end
                    .copy()
                    .sub(paths[pathIdx].start)
                    .setMag(10)
                    .add(normalPoint); // target points a little bit ahead of normal

                this.seek(target);
            }
        }

        borders(path) {
            // reset position when off screen
            const end = path.points[path.points.length - 1];
            const start = path.points[0];

            if (this.pos.x > end.x + this.diameter) {
                this.pos.x = start.x - this.diameter;
                this.pos.y = start.y;
            }
        }
    };
}
