import { options } from "./options.js";

// simple utility to get hash location
const hash = () => location.hash.substring(1);

/**
 *
 * @param {string} prefix - prepended to all demos (where demos are stored, like in ./chapters)
 * @param {Record<string, string[]>} options - JSON generated from buildOptions.js
 * @returns {HTMLSelectElement} select element containing the options
 */
const renderOptions = (prefix, options) => {
    const select = document.createElement("select");

    Object.entries(options).forEach(([chapter, demos]) => {
        // create option section
        const optgroup = document.createElement("optgroup");
        optgroup.value = chapter;
        optgroup.label = chapter;
        select.appendChild(optgroup);

        // add demos to option section
        for (const demo of demos) {
            const value = `${prefix}/${chapter}/${demo}`;
            const option = document.createElement("option");
            option.value = value;
            option.textContent = demo;
            optgroup.appendChild(option);

            if (hash() === value) {
                select.value = value;
            }
        }
    });

    return select;
};

/**
 * Create a play button
 * @returns {HTMLButtonElement}
 */
const renderButton = () => {
    const button = document.createElement("button");
    button.textContent = "play";
    return button;
};

// store previous module (to run cleanup function)
const previousModule = {
    canvas: {
        mount: () => {},
        unmount: () => {},
    },
};

/**
 * load a new demo
 * @param {string} demoPath - path to dynamically load a js module from
 */
const selectOption = async (demoPath) => {
    location.hash = demoPath;

    // cleanup previous demo
    previousModule.canvas.unmount();

    // load new demo
    const module = await import(demoPath);
    Object.assign(previousModule, module);

    if (!module.canvas.isP5) {
        module.canvas.mount();
    }
};

// append select to body
const appOptions = document.getElementById("app__options");
const select = renderOptions("/chapters", options);
const button = renderButton();

appOptions.appendChild(select);
appOptions.appendChild(button);

// listen for changes to load new demo
select.addEventListener("change", (e) => selectOption(e.target.value));
window.addEventListener("hashchange", () => selectOption(hash()));

// set default demo or load from hash
if (location.hash) {
    selectOption(hash());
} else {
    location.hash = select.value;
}

// reload demo if play pressed
button.addEventListener("click", () => {
    previousModule.canvas.unmount();
    previousModule.canvas.mount();
    button.blur();
});
