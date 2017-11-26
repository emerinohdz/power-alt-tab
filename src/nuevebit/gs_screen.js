/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {
    const ExtensionUtils = imports.misc.extensionUtils;
    const Utils = ExtensionUtils.getCurrentExtension().imports.utils;
    const WSSwitcherStarter = Utils.use("nuevebit.gs.WSSwitcherStarter");
    const AppSwitcherStarter = Utils.use("nuevebit.gs.AppSwitcherStarter");
    const Meta = imports.gi.Meta;
    const Main = imports.ui.main;
    const Lang = imports.lang;

    /**
     * Gnome Shell global.screen wrapper. 
     * 
     * @param {global.screen} screen
     */
    gs.GSScreen = function (screen) {

        this.getWorkspaces = function () {
            let workspaces = [];

            for (let i = 0; i < screen.n_workspaces; ++i) {
                let ws = screen.get_workspace_by_index(i);

                workspaces.push(ws);
            }

            return workspaces;
        };

        this.getActiveWorkspace = function () {
            return screen.get_active_workspace();
        };

    };

})(nuevebit.gs);