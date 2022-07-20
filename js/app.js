import { options } from "./options.js";

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
            const option = document.createElement("option");
            option.value = `${prefix}/${chapter}/${demo}`;
            option.textContent = demo;
            optgroup.appendChild(option);
        }
    });

    return select;
};

/**
 * load a new demo
 * @param {string} demoPath - path to dynamically load a js module from
 */
const selectOption = async (demoPath) => {
    // cleanup previous demo
    previousModule.unmount();

    // load new demo
    const module = await import(demoPath);
    Object.assign(previousModule, module);
    previousModule.mount();
};

// store previous module (to run cleanup function)
const previousModule = {
    mount: () => {},
    unmount: () => {},
};

// append select to body
const select = renderOptions("/chapters", options);
document.body.appendChild(select);

// listen for changes to load new demo
select.addEventListener("change", (e) => selectOption(e.target.value));
selectOption(select.value);
