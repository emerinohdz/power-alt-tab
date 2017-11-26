/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {
    gs.SwitcherUtils = {
        /**
         * Handles lookup of the default GS start switcher method, depending
         * on the current GS version.
         * TODO: Improve.
         * 
         * @returns {string}
         */
        lookup: function (wm) {
            var switcher = (typeof wm.__startSwitcher !== "undefined")
                    ? wm.__startSwitcher // support GS 3.26
                    : wm.__startAppSwitcher; // support GS < 3.26

            if (!switcher) {
                switcher = wm._startSwitcher; // support GS >= 3.26.2
            }

            if (!switcher) {
                throw "No starter method available in current WM";
            }

            return switcher;
        }
    };

})(nuevebit.gs);

