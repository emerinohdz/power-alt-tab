/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

import Meta from "gi/meta";
import MRUList from "nuevebit/mru_list";

/**
 * Keeps the list of workspaces ordered by Most Recently Used. 
 *
 * @param {mixed} screen the current screen that handles workspaces
 */
export default class MRUWorkspaceManager {
    constructor(screen) {
        this.screen = screen;
        this.workspaces = new MRUList(screen.getWorkspaces());
    }

    getWorkspaces() {
        return this.workspaces.toArray();
    }

    /**
     * Updates WS list with fresh WS' from a Screen. This method should
     * be called every time the screen changes its workspaces.
     * 
     */
    updateWorkspaces() {
        this.workspaces.update(this.screen.getWorkspaces());
    }

    /**
     * Switches the current WS at the beginning of the WS list. This method
     * should be called every time the screen's active workspace changes.
     */
    switchActiveWorkspace() {
        this.workspaces.switch(this.screen.getActiveWorkspace());
    }
};
