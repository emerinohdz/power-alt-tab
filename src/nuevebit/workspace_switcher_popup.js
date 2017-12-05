
import WorkspaceThumbnailList from "nuevebit/workspace_thumbnail_list";
import {Meta, Main, Lang, Mainloop, Clutter, SwitcherPopup} from "core";

// TODO: there are problems when extending using ES6 classes and transpiling with
// babel, calling super constructor throws an error
const WorkspaceSwitcherPopup = new Lang.Class({
    Name: 'WorkspaceSwitcherPopup',
    Extends: SwitcherPopup,

    _init: function (workspaces) {
        this.parent(workspaces);

        this._workspaces = workspaces;
        this._switcherList = new WorkspaceThumbnailList(this._workspaces);
        this._activateTimeout = 0;
    },

    _allocate: function (actor, box, flags) {
        this.parent(actor, box, flags);
        // add thumbnail clones to popup
        let primary = Main.layoutManager.primaryMonitor;
        this._switcherList.addClones(primary.height);

    },
    _keyPressHandler: function (keysym, action) {
        if (keysym == Clutter.Escape) {
            this.destroy();
        } else if (keysym == Clutter.q || keysym == Clutter.Q) {
            this.destroy();
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP || action == Meta.KeyBindingAction.SWITCH_APPLICATIONS) {
            this._select(this._next());
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP_BACKWARD || action == Meta.KeyBindingAction.SWITCH_APPLICATIONS_BACKWARD) {
            this._select(this._previous());
        }

        return Clutter.EVENT_STOP;
    },

    _initialSelection: function (backward, binding) {
        if (binding == 'switch-windows-backward' || backward)
            this._select(this._items.length - 1);
        else if (this._items.length == 1)
            this._select(0);
        else
            this._select(1);
    },

    _select: function (index) {
        this.parent(index);

        let thumbnailsFocused = (window != null);
        this._switcherList.highlight(index, thumbnailsFocused);
    },

    _finish: function (timestamp) {
        this.parent(timestamp);

        // is this the right way to handle this? if we don't delay it
        // metacity will complain because the timestamp passed by SwitcherPopup
        // is actually the current time
        /*
         this._activateTimeout = Mainloop.timeout_add(10, Lang.bind(this, function() {
         this._activateSelected(this._items[this._selectedIndex], timestamp);
         this._activateTimeout = 0;
         }));
         */
        this._activateSelected(this._items[this._selectedIndex], timestamp);
    },

    _onDestroy: function () {
        this.parent();

        if (this._activateTimeout) {
            //Mainloop.source_remove(this._activateTimeout);
        }
    },

    _activateSelected: function (workspace, timestamp) {
        workspace.activate(timestamp);
    },

});

export default WorkspaceSwitcherPopup;