# The Nature of Code

JavaScript code examples from the Nature of Code by Daniel Shiffman

## Chapters

0. Introduction
    1. Introduction
    2. Random Walker
    3. Gaussian Distribution
    4. Custom Distribution
    5. Perlin Noise
1. Vectors
    1. Bouncing Ball
    2. Mouse Acceleration
    3. Mouse String
2. Forces
    1. Mover
    2. Mover Mass
    3. Mover Friction
    4. Fluid Drag
    5. Gravitational Attraction
3. Oscillation
    1. Rotation
    2. Polar Coordinates
    3. Simple Harmonic Motion
    4. Oscillators

## Vanilla Canvas

Yet another wrapper around the HTML5 canvas, similar to p5.js but less abstraction. I've included a file called `chapterTemplate.js` that was used as a starting point in all of the chapter demos.

-   `lib/Canvas.js` - Canvas class (includes a `Mouse` & `setup`/`draw` functions)
-   `lib/CanvasUtils.js` - Canvas drawing utils (like how to draw a line)
-   `lib/CustomMath.js` - Custom math utils (like `random` and `map`)
-   `lib/Vector.js` - Vector class for managing simple vector math
-   `lib/Mouse.js` - Internal mouse class, already included with `Canvas`