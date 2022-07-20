const fs = require("fs");
const path = require("path");

const buildOptions = (chaptersDir = "./chapters", buildDir = "./js") => {
    const chapters = fs.readdirSync(chaptersDir);
    const options = {};

    for (const chapter of chapters) {
        const demos = fs.readdirSync(path.join(chaptersDir, chapter));
        options[chapter] = demos;
    }

    fs.writeFileSync(
        path.join(buildDir, "options.js"),
        `export const options = ${JSON.stringify(options, null, 4)};`
    );
};

buildOptions();
