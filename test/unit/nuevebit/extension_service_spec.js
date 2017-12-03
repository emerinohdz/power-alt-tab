/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

import ExtensionService from "nuevebit/extension_service"; 
import SignalTracker from "gs/signal_tracker";

describe("ExtensionService", function () {
    it("should enable the extension", function () {
        let tracker = new SignalTracker();
        // when enabled, signals should be tracked
        let service = new ExtensionService({
            tracker: tracker,
            manager: newWSManager(),
            wsStarter: newStarter()
        });

        service.enable();
            
        expect(tracker.getTrackedSignals().length).toBe(2);
    });

    it("should disable the extension", function() {
        let tracker = new SignalTracker();
        // when enabled, signals should be tracked
        let service = new ExtensionService({
            tracker: tracker,
            manager: newWSManager(),
            wsStarter: newStarter(),
            appStarter: newStarter()
        });

        service.enable();
        service.disable();
            
        expect(tracker.getTrackedSignals().length).toBe(0);
    });

    function newWSManager() {
        return {
            getWorkspaces: function(){ return [];},
            updateWorkspaces: function () {},
            switchActiveWorkspace: function () {}
        };
    }

    function newStarter() {
        return {
            start: function () {}
        };
    }

});