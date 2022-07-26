const fs = require("fs");
const path = require("path");

/**
 * get the integer number that prefixes each chapter
 * @param {string} title - chapter or file name
 */
const extractNumber = (title) => parseInt(title.split("_").shift());

/**
 * generate options.js file so it can be referenced on the frontend
 * @param {string} chaptersDir - where to read chapters from
 * @param {string} buildDir - where to put output file
 */
const buildOptions = (chaptersDir = "./chapters", buildDir = "./js") => {
    const chapters = fs
        .readdirSync(chaptersDir)
        .sort((a, b) => extractNumber(a) - extractNumber(b));

    const options = {};

    for (const chapter of chapters) {
        const demos = fs.readdirSync(path.join(chaptersDir, chapter));
        options[chapter] = demos
            .sort((a, b) => extractNumber(a) - extractNumber(b))
            .filter((demo) => demo.endsWith(".js") && demo.includes("_")); // only save .js files and files with a prefix like _
    }

    // write options to options.js
    fs.writeFileSync(
        path.join(buildDir, "options.js"),
        `// do not edit this file, use buildOptions.js
export const options = ${JSON.stringify(options, null, 4)};`
    );

    return options;
};

/**
 * Write options to readme
 * @param {Record<string, string[]>} options - options compiled from buildOptions
 */
const buildReadme = (options) => {
    const readmeFile = "README.md";
    let readmeContents = fs.readFileSync(readmeFile, "utf-8");
    let stringifiedOptions = [];

    const startIdx = readmeContents.indexOf("## Chapters");
    const endIdx = readmeContents.indexOf("## Vanilla Canvas");

    // uppercase every word in a string
    const toUppercase = (title) => {
        return title
            .split(" ")
            .map((word) =>
                word.length < 3
                    ? word
                    : `${word.charAt(0).toUpperCase()}${word.slice(1)}`
            )
            .join(" ");
    };

    // format into [number]. sketch title
    const formatHeader = (header) => {
        let [number, ...title] = header.split("_");
        title = toUppercase(title.join(" ")).replace(".js", "");
        return `${number}. ${title}`;
    };

    Object.entries(options).forEach(([header, files], i) => {
        stringifiedOptions.push(formatHeader(header));
        for (const file of files) {
            stringifiedOptions.push(`    ${formatHeader(file)}`);
        }
    });

    readmeContents = `${readmeContents.substring(0, startIdx).trim()}

## Chapters

${stringifiedOptions.join("\n")}

${readmeContents.substring(endIdx).trim()}`;

    fs.writeFileSync(readmeFile, readmeContents);
};

const options = buildOptions();
buildReadme(options);
