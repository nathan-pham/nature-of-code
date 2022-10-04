import p5 from "p5";

// blank object to trick my own library
const canvas = {
    isP5: true,
    setup: () => {},
    draw: () => {},
    mount: () => {},
    unmount: () => {},
};

const useP5 = (globals) => {
    document.querySelector("canvas")?.remove();

    new p5((p) => {
        Object.assign(p, globals(p));

        canvas.unmount = () => {
            p.remove();
        };

        canvas.mount = () => {
            useP5(globals);
        };
    }, "app__canvas");

    return canvas;
};

export default useP5;
