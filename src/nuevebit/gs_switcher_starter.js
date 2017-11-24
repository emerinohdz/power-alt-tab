/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

/**
 * Default SwitcherStarter, handles showing the GS switcher.
 * 
 * @returns {nuevebit.gs.GSSwitcherStarter}
 */
(function (gs) {
    gs.GSSwitcherStarter = function (wm) {
        let startFunc = gs.SwitcherUtils.lookup(wm);

        this.start = function (display, screen, win, binding) {
            // delegate to wm startFunc
            Lang.bind(wm, startFunc)(display, screen, win, binding);
        };
    };
})(nuevebit.gs);