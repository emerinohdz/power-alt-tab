/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {
    const Meta = imports.gi.Meta;
    const ExtensionUtils = imports.misc.extensionUtils;
    const Utils = ExtensionUtils.getCurrentExtension().imports.utils;
    const MRUList = Utils.use("nuevebit.gs.MRUList");

    /**
     * Keeps the list of workspaces ordered by Most Recently Used. 
     *
     * @param {mixed} screen the current screen that handles workspaces
     */
    gs.MRUWorkspaceManager = function (screen) {
        let workspaces = new MRUList(screen.getWorkspaces());

        this.getWorkspaces = function() {
            return workspaces.toArray();
        };

        /**
         * Updates WS list with fresh WS' from a Screen. This method should
         * be called every time the screen changes its workspaces.
         * 
         */
        this.updateWorkspaces = function () {
            workspaces.update(screen.getWorkspaces());
        };

        /**
         * Switches the current WS at the beginning of the WS list. This method
         * should be called every time the screen's active workspace changes.
         */
        this.switchActiveWorkspace = function () {
            workspaces.switch(screen.getActiveWorkspace());
        };
    };
})(nuevebit.gs);


