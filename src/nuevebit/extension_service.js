/*  
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */


import {Lang, Main, Meta} from "core";

import Screen from "gs/screen";
import SignalTracker from "gs/signal_tracker";
import MRUWorkspaceManager from "nuevebit/mru_workspace_manager";
import AppSwitcherStarter from "nuevebit/app_switcher_starter";
import WSSwitcherStarter from "nuevebit/ws_switcher_starter";

// TODO: This should be part of the API, instead of calling directly
// GI functions (which may change more often)
var setKeybindingsHandler = function (startFunc) {
    Meta.keybindings_set_custom_handler(
            'switch-group',
            startFunc);

    Meta.keybindings_set_custom_handler(
            'switch-group-backward',
            startFunc);
};

/**
 * Takes the necessary actions to enable or disable the PowerAltTab extension.
 * TODO: implement a DI container
 * 
 * @param array opts
 * @returns {nuevebit.gs.ExtensionService}
 */
export default class ExtensionService {
    constructor(opts) {
        opts = opts || {};
        this.signalTracker = opts.tracker || new SignalTracker();
        this.screen = opts.screen || new Screen(window.global.workspace_manager);
        this.wsManager = opts.manager || new MRUWorkspaceManager(this.screen);
        this.wsStarter = opts.wsStarter || new WSSwitcherStarter(this.wsManager);

        this.opts = opts;
    }

    enable() {
        // track worskpaces added or deleted
        this.signalTracker.track(
                window.global.workspace_manager,
                "notify::n-workspaces",
                Lang.bind(this.wsManager, this.wsManager.updateWorkspaces));

        // track workspace switches
        this.signalTracker.track(
                window.global.window_manager,
                "switch-workspace",
                Lang.bind(this.wsManager, this.wsManager.switchActiveWorkspace));

        // init workspaces
        this.wsManager.updateWorkspaces();

        // when enabled, show the WS switcher popup instead of the default
        // WM switcher on switch-group
        setKeybindingsHandler(Lang.bind(this.wsStarter, this.wsStarter.start));
    }

    disable() {
        // untrack all tracked signals
        this.signalTracker.untrackAll();

        let appStarter = this.opts.appStarter || new AppSwitcherStarter(Main.wm);

        // show default GS switcher on switch-group
        setKeybindingsHandler(Lang.bind(appStarter, appStarter.start));
    }

};
