/**
 * Power Alt-Tab
 * @autor: emerino <emerino at gmail dot com>
 *
 * Some code reused (and some stolen) from ui.altTab script.
 */

const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Meta = imports.gi.Meta;
const Lang = imports.lang;
const AltTab = imports.ui.altTab;
const WorkspaceThumbnail = imports.ui.workspaceThumbnail;
const SwitcherPopup = imports.ui.switcherPopup;

const ExtensionUtils = imports.misc.extensionUtils;
const Utils = ExtensionUtils.getCurrentExtension().imports.utils;
const ExtensionService
        = Utils.use("nuevebit.gs.ExtensionService");


const MRUAltTabManager = new Lang.Class({
    Name: 'MRUAltTabManager',

    _init: function (workspaces) {
        this._workspaces = workspaces || [];

        //this.changeWorkspaces();
    },
    getWorkspaces: function() {
        return this._workspaces;
    },

    changeWorkspaces: function () {
        let workspaces = [];

        for (let i = 0; i < global.screen.n_workspaces; ++i) {
            let ws = global.screen.get_workspace_by_index(i);

            workspaces.push(ws);
        }

        if (this._workspaces.length) {
            let orderedWorkspaces = [];

            for (let i in this._workspaces) {
                let ws = this._workspaces[i];

                let index = workspaces.indexOf(ws);

                if (index != -1) {
                    workspaces.splice(index, 1);

                    orderedWorkspaces.push(ws);
                }
            }

            workspaces = orderedWorkspaces.concat(workspaces);
        }

        this._workspaces = workspaces;
    },

    switchWorkspace: function () {
        let currentWorkspace = global.screen.get_active_workspace();
        let workspaceIndex = this._workspaces.indexOf(currentWorkspace);

        if (workspaceIndex != -1) {
            this._workspaces.splice(workspaceIndex, 1);
        }

        this._workspaces.unshift(currentWorkspace);
    },


});

const PowerAltTab = new Lang.Class({
    Name: "PowerAltTab",

    _init: function () {
        this._switcher = new MRUAltTabManager();
        this._extensionService = new ExtensionService({
            switcher: this._switcher
        }); 
    },

    enable: function () {
        Utils.connectAndTrack(this, global.screen, "notify::n-workspaces",
                Lang.bind(this._switcher, this._switcher.changeWorkspaces));

        Utils.connectAndTrack(this, global.window_manager, "switch-workspace",
                Lang.bind(this._switcher, this._switcher.switchWorkspace));

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
