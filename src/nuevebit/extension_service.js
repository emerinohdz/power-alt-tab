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
    const SignalTracker = Utils.use("nuevebit.gs.SignalTracker");
    const Meta = imports.gi.Meta;
    const Main = imports.ui.main;
    const Lang = imports.lang;

    /**
     * Takes the necessary actions to enable or disable the PowerAltTab extension.
     * TODO: DI container
     * 
     * @param array opts
     * @returns {nuevebit.gs.ExtensionService}
     */
    gs.ExtensionService = function (opts) {
        opts = opts || {};
        let signalTracker = opts.tracker || new SignalTracker();

        this.enable = function () {
            let wsManager = opts.manager || new MRUWorkspaceManager();
            let wsStarter
                    = opts.wsStarter || new WSSwitcherStarter(wsManager);

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
            let appStarter
                    = opts.appStarter || new AppSwitcherStarter(Main.wm);

            // untrack all tracked signals
            signalTracker.untrackAll();

            // show default GS switcher on switch-group
            setKeybindingsHandler(Lang.bind(appStarter, appStarter.start));
        };

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

