import useP5 from "/lib/useP5.js";

const height = 30;

export const canvas = useP5((p) => {
    const setup = () => {
        p.createCanvas(800, 330);
        p.noLoop();

        p.background(255);
        cantor(p, 0, 0, p.width);
    };

    return { setup };
});

function cantor(p, x, y, width) {
    p.noStroke();
    p.fill(0);
    p.rect(x, y, width, height);

    // erase middle third
    const widthThird = width / 3;
    p.fill(255);
    p.rect(x + widthThird, y, widthThird, height);

    if (width > 4) {
        const newY = y + height * 2;

        cantor(p, x, newY, widthThird);
        cantor(p, x + width * (2 / 3), newY, widthThird);
    }
}
