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
    const MRUWorkspaceManager = Utils.use("nuevebit.gs.MRUWorkspaceManager");
    const SignalTracker = Utils.use("gs.SignalTracker");
    const GSScreen = Utils.use("gs.GSScreen");
    const Meta = imports.gi.Meta;
    const Main = imports.ui.main;
    const Lang = imports.lang;
 
    /**
     * Takes the necessary actions to enable or disable the PowerAltTab extension.
     * TODO: implement a DI container
     * 
     * @param array opts
     * @returns {nuevebit.gs.ExtensionService}
     */
    gs.ExtensionService = function (opts) {
        opts = opts || {};
        let signalTracker = opts.tracker || new SignalTracker();
        let screen = opts.screen || new GSScreen(global.screen);
        let wsManager = opts.manager || new MRUWorkspaceManager(screen);
        let wsStarter = opts.wsStarter || new WSSwitcherStarter(wsManager);

        this.enable = function () {
            // track worskpaces added or deleted
            signalTracker.track(
                    global.screen,
                    "notify::n-workspaces",
                    Lang.bind(wsManager, wsManager.updateWorkspaces));

            // track workspace switches
            signalTracker.track(
                    global.window_manager,
                    "switch-workspace",
                    Lang.bind(wsManager, wsManager.switchActiveWorkspace));

            // init workspaces
            wsManager.updateWorkspaces();

            // when enabled, show the WS switcher popup instead of the default
            // WM switcher on switch-group
            setKeybindingsHandler(Lang.bind(wsStarter, wsStarter.start));
        };

        this.disable = function () {
            // untrack all tracked signals
            signalTracker.untrackAll();

            let appStarter = opts.appStarter || new AppSwitcherStarter(Main.wm);

            // show default GS switcher on switch-group
            setKeybindingsHandler(Lang.bind(appStarter, appStarter.start));
        };

        // TODO: This should be part of the API, instead of calling directly
        // GI functions (which may change more often)
        function setKeybindingsHandler(startFunc) {
            Meta.keybindings_set_custom_handler(
                    'switch-group',
                    startFunc);

            Meta.keybindings_set_custom_handler(
                    'switch-group-backward',
                    startFunc);
        }
    };

})(nuevebit.gs);

