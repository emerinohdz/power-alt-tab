/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

/**
 * Gnome Shell global.screen wrapper. 
 * 
 * @param {global.screen} screen
 */
export default class Screen {

    constructor(screen) {
        this.screen = screen;
    }

    getWorkspaces() {
        let workspaces = [];

        for (let i = 0; i < this.screen.n_workspaces; ++i) {
            let ws = this.screen.get_workspace_by_index(i);

            workspaces.push(ws);
        }

        return workspaces;
    }

    getActiveWorkspace() {
        return this.screen.get_active_workspace();
    }

};
