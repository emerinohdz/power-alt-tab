/**
 * Utility functions
 */

const ExtensionUtils = imports.misc.extensionUtils;
const importer = ExtensionUtils.getCurrentExtension().imports;

// this object holds the classes that can be "imported" using
// use(), this classes have to be manually specified,
// they have to be declared in order, that is, if a class depends
// on another class then the dependency class should be declared
// first
// NOTE: it does not support circular references
// TODO: Improve to make class importing automatic
let classes = {};

// GS API
classes["gs.SignalTracker"]
        = importer.gs.signal_tracker.gs.SignalTracker;

classes["nuevebit.gs.GSScreen"]
        = importer.gs.gs_screen.gs.GSScreen;

// extension API
classes["nuevebit.gs.SwitcherUtils"]
        = importer.nuevebit.switcher_utils.nuevebit.gs.SwitcherUtils;

classes["nuevebit.gs.AppSwitcherStarter"]
        = importer.nuevebit.app_switcher_starter.nuevebit.gs.AppSwitcherStarter;

classes["nuevebit.gs.WorkspaceThumbnailList"]
        = importer.nuevebit.workspace_thumbnail_list.nuevebit.gs.WorkspaceThumbnailList;

classes["nuevebit.gs.WorkspaceSwitcherPopup"]
        = importer.nuevebit.workspace_switcher_popup.nuevebit.gs.WorkspaceSwitcherPopup;

classes["nuevebit.gs.WSSwitcherStarter"]
        = importer.nuevebit.ws_switcher_starter.nuevebit.gs.WSSwitcherStarter;

classes["nuevebit.gs.MRUList"]
        = importer.nuevebit.mru_list.nuevebit.gs.MRUList;

classes["nuevebit.gs.MRUWorkspaceManager"]
        = importer.nuevebit.mru_workspace_manager.nuevebit.gs.MRUWorkspaceManager;

classes["nuevebit.gs.ExtensionService"]
        = importer.nuevebit.extension_service.nuevebit.gs.ExtensionService;

/**
 * Imports the given class. This is useful for testing, where this whole
 * Utils "object" can be mocked.
 */
function use(name) {
    return classes[name];
}

/* Note : credit to the shellshape extension, from which these functions
 * are modified. https://extensions.gnome.org/extension/294/shellshape/
 * Signals are stored by the owner, storing both the target &
 * the id to clean up later.
 * 
 * Minor modifications by @emerino (we don't like obscure code)
 */
function connectAndTrack(owner, subject, name, cb) {
    if (!owner.hasOwnProperty('_GnomeShellExtension_bound_signals')) {
        owner._GnomeShellExtension_bound_signals = [];
    }

    let id = subject.connect(name, cb);
    owner._GnomeShellExtension_bound_signals.push([subject, id]);
}

function disconnectTrackedSignals(owner) {
    if (!owner || !owner._GnomeShellExtension_bound_signals) {
        return;
    }

    owner._GnomeShellExtension_bound_signals.forEach(
            function (sig) {
                let subject = sig[0];
                let id = sig[1];

                subject.disconnect(id);
            }
    );

    delete owner._GnomeShellExtension_bound_signals;
}
