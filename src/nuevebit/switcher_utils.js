/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

// supported function names
const supported = [
    "_startSwitcher",
    "_startAppSwitcher",
    "__startAppSwitcher",
    "__startSwitcher"
];
/**
 * Handles lookup of the default GS start switcher method, depending
 * on the current GS version.
 * 
 * @param {object} wm GS window manager object
 * @returns {function}
 */
export function lookup(wm) {

    let switcher;
    for (let name of supported) {
        if (typeof wm[name] !== "undefined") {
            switcher = wm[name];
            break;
        }
    }

    if (!switcher) {
        throw "No starter method available in current WM";
    }

    return switcher;
}
