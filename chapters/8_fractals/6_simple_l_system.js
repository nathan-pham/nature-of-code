import useP5 from "/lib/useP5.js";

export const canvas = useP5((p) => {
    let generations = [];

    const setup = () => {
        p.createCanvas(600, 600);
        generations.push("A");
    };

    const draw = () => {
        p.background(255);

        p.push();
        p.translate(15, 20);
        p.text("Press space to move on to the next generation.", 0, 0);
        generations.forEach((generation, i) => {
            let idx = i + 1;
            p.text(`Generation ${idx}: ${generation}`, 0, idx * 15);
        });
        p.pop();
    };

    const keyPressed = () => {
        if (p.key === " ") {
            getNextGeneration();
        }
    };

    const getNextGeneration = () => {
        const prevGeneration = generations[generations.length - 1];
        const nextGeneration = [];

        for (let i = 0; i < prevGeneration.length; i++) {
            const char = prevGeneration.charAt(i);
            if (char === "A") {
                nextGeneration.push("ABA");
            } else if (char === "B") {
                nextGeneration.push("BBB");
            }
        }

        generations.push(nextGeneration.join(""));
    };

    return { setup, draw, keyPressed };
});
