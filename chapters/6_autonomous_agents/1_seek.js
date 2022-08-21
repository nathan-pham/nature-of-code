import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => ({
    setup() {
        p.createCanvas(500, 500);
    },
    draw() {
        p.background(0);
    },
}));
