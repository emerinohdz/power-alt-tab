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
    const ExtensionUtils = imports.misc.extensionUtils;
    const Utils = ExtensionUtils.getCurrentExtension().imports.utils;
    const SwitcherUtils = Utils.use("nuevebit.gs.SwitcherUtils");
    const Lang = imports.lang;

    gs.AppSwitcherStarter = function (wm, utils) {
        utils = utils || SwitcherUtils;
        let startFunc = utils.lookup(wm);

        this.start = function (display, screen, win, binding) {
            // delegate to wm startFunc
            Lang.bind(wm, startFunc)(display, screen, win, binding);
        };
    };
})(nuevebit.gs);