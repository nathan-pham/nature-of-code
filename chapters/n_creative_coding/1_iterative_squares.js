import CustomMath from "/lib/CustomMath.js";
import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas(500, 500);
const gridSize = 5;

let background = "#fff";
let palette = [];

canvas.setup(({ utils }) => {
    [background, ...palette] = utils.palette();
    utils.background(background);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const width = canvas.width / gridSize;
            const height = canvas.height / gridSize;

            const x = i * width;
            const y = j * height;

            drawSquares(x, y, width, height);

            // utils.stroke("#000").rect(x, y, width, height).stroke();
        }
    }
});

const drawSquares = (x, y, width, height) => {
    // parent rectangle
    canvas.utils
        .stroke(CustomMath.choice(palette))
        .rect(x, y, width, height)
        .stroke();

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const spacing = 10;
    for (let i = 0; i < spacing; i++) {
        const rectSize = i * spacing;

        if (Math.random() > 0.25) {
            canvas.utils
                .stroke(CustomMath.choice(palette))
                // add 0.5 to make pixels align
                .rectCenter(centerX + 0.5, centerY + 0.5, rectSize, rectSize)
                .stroke();
        }
    }
};

// canvas.draw(({ utils }) => {
//     utils.clear();
// });
