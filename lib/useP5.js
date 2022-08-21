import p5 from "p5";

const useP5 = (globals) => {
    // blank object to trick my own library
    const canvas = {
        setup: () => {},
        draw: () => {},
        mount: () => {},
        unmount: () => {},
    };

    new p5((p) => {
        document.querySelector("canvas")?.remove();
        Object.assign(p, globals(p));

        canvas.mount = () => {
            useP5(globals);
        };

        canvas.unmount = () => {
            p.noLoop();
        };
    }, "app__canvas");

    return canvas;
};

export default useP5;
