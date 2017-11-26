/**
 * Power Alt-Tab
 * @autor: emerino <emerino at gmail dot com>
 *
 * Some code reused (and some stolen) from ui.altTab script.
 */

const Lang = imports.lang;
const ExtensionUtils = imports.misc.extensionUtils;
const Utils = ExtensionUtils.getCurrentExtension().imports.utils;

const MRUWorkspaceManager = Utils.use("nuevebit.gs.MRUWorkspaceManager");
const ExtensionService = Utils.use("nuevebit.gs.ExtensionService");


const PowerAltTab = new Lang.Class({
    Name: "PowerAltTab",

    _init: function () {
        this._manager = new MRUWorkspaceManager();
        this._extensionService = new ExtensionService({
            manager: this._manager
        });
    },

    enable: function () {
        Utils.connectAndTrack(this, global.screen, "notify::n-workspaces",
                Lang.bind(this._manager, this._manager.updateWorkspaces));

        Utils.connectAndTrack(this, global.window_manager, "switch-workspace",
                Lang.bind(this._manager, this._manager.switchActiveWorkspace));

        this._extensionService.enable();
    },

    disable: function () {
        Utils.disconnectTrackedSignals(this);

        this._extensionService.disable();
    }
});

let powerAltTab = null;

function init() {
    powerAltTab = new PowerAltTab();
}

function enable() {
    powerAltTab.enable();
}

function disable() {
    powerAltTab.disable();
}
