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

        let mounted = true;
        Object.assign(p, globals(p));

        canvas.unmount = () => {
            mounted = false;
            p.remove();
        };

        canvas.mount = () => {
            if (!mounted) {
                Object.assign(canvas, useP5(globals));
                mounted = true;
            }
        };
    }, "app__canvas");

    return canvas;
};

export default useP5;
