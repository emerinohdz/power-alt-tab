/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var gs = gs || {};

(function (gs) {

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

})(gs);