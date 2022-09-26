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
    5. Sin Wave
    6. Gravitational Pullers
    7. Pendulum
    8. Springs
    9. Trampoline
4. Particle Systems
    1. Particles
    2. Particles Wind
    3. Fire
5. Physics Engines
    1. Getting Started
    2. Random Polygons
    3. Random Car
    4. Introduction
    5. Circles
    6. Constraints
6. Autonomous Agents
    1. Seek
    2. Arrive
    3. Flow Field
    4. Angle Between
    5. Scalar Projection
    6. Path Following
    7. Complex Path Following
11. Creative Coding
    1. Iterative Squares
    2. Face Generator
    3. Circle Clock
    3. Circle Clock Matter
12. Random
    1. Fractal Tree
    2. Grid Dynamic Sketches

## Vanilla Canvas

Yet another wrapper around the HTML5 canvas, similar to p5.js but less abstraction. I've included a file called `chapterTemplate.js` that was used as a starting point in all of the chapter demos.

-   `lib/Canvas.js` - Canvas class (includes a `Mouse` & `setup`/`draw` functions)
-   `lib/CanvasUtils.js` - Canvas drawing utils (like how to draw a line)
-   `lib/CustomMath.js` - Custom math utils (like `random` and `map`)
-   `lib/Vector.js` - Vector class for managing simple vector math
-   `lib/Mouse.js` - Internal mouse class, already included with `Canvas`

## Build Options

`npm run build` or `node buildOptions.js` will re-compile a list of options found in `chapters` and update this README to reflect those changes.