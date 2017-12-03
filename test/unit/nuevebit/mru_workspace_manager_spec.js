/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

import MRUWorkspaceManager from "nuevebit/mru_workspace_manager";

describe("MRUWorkspaceManager", function () {
    it("should get the list of managed workspaces", function () {
        let manager = new MRUWorkspaceManager(newScreen([1, 2, 3]));
        expect(manager.getWorkspaces()).toEqual([1, 2, 3]);
    });

    it("should update workspaces according to the ones on the screen", function () {
        let workspaces = [1, 2, 3];
        let screen = newScreen(workspaces);

        let manager = new MRUWorkspaceManager(screen);
        
        // screen workspaces change, 2 new added
        workspaces.push(4);
        workspaces.push(5);

        // it should remain 1, 2, 3, not updated yet
        expect(manager.getWorkspaces()).toEqual([1, 2, 3]);
        
        manager.updateWorkspaces();

        // once updated, workspaces should change
        expect(manager.getWorkspaces()).toEqual([1, 2, 3, 4, 5]);
    });

    it("should switch workspaces according to the active workspace on the screen", function () {
        var screen = newScreen([1, 2, 3], 2);
        let manager = new MRUWorkspaceManager(screen);
        
        manager.switchActiveWorkspace();

        expect(manager.getWorkspaces()).toEqual([2, 1, 3]);
    });

    function newScreen(workspaces, active) {
        return {
            getActiveWorkspace: function() {
                return active;
            },
            getWorkspaces: function () {
                return workspaces;
            }
        };
    }
});

