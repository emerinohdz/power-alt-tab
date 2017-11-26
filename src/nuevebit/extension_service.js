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
    const Meta = imports.gi.Meta;
    const Main = imports.ui.main;
    const Lang = imports.lang;

    //const WorkspaceSwitcher = Utils.use("nuevebit.gs.WorkspaceSwitcher");

    /**
     * Takes the necessary actions to enable or disable the PowerAltTab extension.
     * 
     * @param array opts
     * @returns {nuevebit.gs.ExtensionService}
     */
    gs.ExtensionService = function (opts) {
        opts = opts || {};

        // TODO: DI container

        this.enable = function () {
            let wsSwitcher = opts.switcher || new WorkspaceSwitcher();
            let wsStarter
                    = opts.wsStarter || new WSSwitcherStarter(wsSwitcher);

            // init workspaces
            wsSwitcher.changeWorkspaces();

            // when enabled, show the WS switcher popup instead of the default
            // WM switcher on switch-group
            setKeybindingsHandler(Lang.bind(wsStarter, wsStarter.start));
        };

        this.disable = function () {
            let appStarter
                    = opts.appStarter || new AppSwitcherStarter(Main.wm);

            // show default GS switcher on switch-group
            setKeybindingsHandler(Lang.bind(appStarter, appStarter.start));
        };

        function setKeybindingsHandler(startFunc) {
            Meta.keybindings_set_custom_handler('switch-group', startFunc);
            Meta.keybindings_set_custom_handler('switch-group-backward', startFunc);
        }
    };

})(nuevebit.gs);

