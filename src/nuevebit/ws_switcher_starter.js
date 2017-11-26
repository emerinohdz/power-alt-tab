/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {
    const Meta = imports.gi.Meta;
    const ExtensionUtils = imports.misc.extensionUtils;
    const Utils = ExtensionUtils.getCurrentExtension().imports.utils;
    const WorkspaceSwitcherPopup 
                = Utils.use("nuevebit.gs.WorkspaceSwitcherPopup");

    /**
     * WS SwitcherStarter, handles showing the Workspace Switcher popup.
     * 
     * @param {nuevebit.gs.WorkspaceSwitcher} switcher
     */
    gs.WSSwitcherStarter = function (switcher) {

        this.start = function (display, screen, win, binding) {
            let modifiers = binding.get_modifiers();
            let backwards = modifiers & Meta.VirtualModifier.SHIFT_MASK;

            // use the WS switcher popup
            let popup = new WorkspaceSwitcherPopup(switcher.getWorkspaces());

            if (!popup.show(backwards, binding.get_name(), binding.get_mask())) {
                popup.destroy();
            }
        };
    };
})(nuevebit.gs);
