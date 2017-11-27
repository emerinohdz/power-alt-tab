/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var gs = gs || {};

describe("GSScreen", function () {
    const GSScreen = gs.GSScreen;

    it("should return the list of workspaces", function () {
        let screen = new GSScreen({
            n_workspaces: 2,
            get_workspace_by_index: function (index) {
                switch(index) {
                    case 0: return 1;
                    case 1: return 2;
                }
            }
        });

        // should return the two items defined in get_workspace_by_index
        expect(screen.getWorkspaces()).toEqual([1, 2]);
    });

    it("should return the active workspace", function() {
        let screen = new GSScreen({
            get_active_workspace: function() {
                return 5;   
            }
        });

        // should return the item defined in get_active_workspace
        expect(screen.getActiveWorkspace()).toBe(5);
    });
});
