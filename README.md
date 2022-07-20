# Nature of Code

Code implementations of the "Nature of Code" by Daniel Shiffman except with Vanilla JavaScript. Use `node buildOptions.js` to read the files in `chapters` and update the frontend.

## Chapters

1. Vectors
    1. Introduction

## Vanilla Canvas

Yet another wrapper around the HTML5 canvas, similar to p5.js but less abstraction. I've included a file called `chapterTemplate.js` that was used as a starting point in all of the chapter demos.

-   `lib/Canvas.js` - Canvas class (includes a `Mouse` & `setup`/`draw` functions)
-   `lib/CanvasUtils.js` - Canvas drawing utils (like how to draw a line)
-   `lib/CustomMath.js` - Custom math utils (like `random` and `map`)
-   `lib/Vector.js` - Vector class for managing simple vector math
-   `lib/Mouse.js` - Internal mouse class, already included with `Canvas`
