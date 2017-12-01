/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {

    // supported function names
    let supported = [
        "_startSwitcher",
        "_startAppSwitcher",
        "__startAppSwitcher",
        "__startSwitcher"
    ];

    gs.SwitcherUtils = {
        /**
         * Handles lookup of the default GS start switcher method, depending
         * on the current GS version.
         * 
         * @returns {function}
         */
        lookup: function (wm) {
            let switcher;
            supported.forEach(function(name) {
                if (typeof wm[name] !== "undefined") {
                    switcher = wm[name];
                }
            });

            if (!switcher) {
                throw "No starter method available in current WM";
            }

            return switcher;
        }
    };

})(nuevebit.gs);

