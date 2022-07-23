import Canvas from "/lib/Canvas.js";

export const canvas = new Canvas();

const bucketSize = 100;
let bucket;

canvas.setup(() => {
    bucket = new Array(bucketSize).fill(0);
});

canvas.draw(({ utils }) => {
    utils.clear();

    const r1 = Math.random();
    const r2 = Math.random(); // threshold
    const y = r1 * r1; // y = x * x

    if (r2 < y) {
        // increment bucket
        let x = Math.floor(r1 * bucketSize);
        bucket[x]++;
    }

    for (let i = 0; i < bucket.length; i++) {
        const height = bucket[i];
        const width = canvas.width / bucketSize;

        utils
            .fill("#000")
            .rect(i * width, canvas.height, width, -height)
            .fill();
    }
});
