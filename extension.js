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

/**
 * NOTE: It may not be safe to extend AltTab.SwitcherList because it doesn't 
 * disconnects signals properly, however it'll only be a problem when
 * enabling/disabling the extension constantly on the same gnome-shell
 * instance.
 */

const WorkspacesThumbnailList = new Lang.Class({
    Name: 'WorkspaceThumbnailList',
    Extends: SwitcherPopup.SwitcherList,

	_init: function(workspaces) {
        this.parent(true);

        let activeWorkspace = global.screen.get_active_workspace();
        let panelHeight = Main.panel.actor.height;
        let monitor = Main.layoutManager.primaryMonitor;

        this._labels = new Array();
        this._thumbnailBins = new Array();
        this._clones = new Array();
        this._workspaces = workspaces;
		this._availHeight = 0;

        this._porthole = {
            x: monitor.x,
            y: monitor.y + panelHeight,
            width: monitor.width,
            height: monitor.height - panelHeight
        };

        for (let i = 0; i < workspaces.length; i++) {
            let box = new St.BoxLayout({ style_class: 'thumbnail-box',
                                         vertical: true });

            let bin = new St.Bin({ style_class: 'thumbnail' });

            box.add_actor(bin);
            this._thumbnailBins.push(bin);

            let title = workspaces[i].index() + 1;
			title = title.toString();

			let name = new St.Label({ text: title });
			// St.Label doesn't support text-align so use a Bin
			let bin2 = new St.Bin({ x_align: St.Align.MIDDLE });
			this._labels.push(bin2);
			bin2.add_actor(name);
			box.add_actor(bin2);

			this.addItem(box, name);

        }
	},

	// We need to scale the workspaces here
	_allocate: function(actor, box, flags) {
        // TODO: how do we do this properly using new syntax?
//        AltTab.SwitcherList.prototype._allocate.call(this, actor, box, flags);
		this.parent(actor, box, flags);

        let panelHeight = Main.panel.actor.height;
		let scale = Math.min(1.0, 
				AltTab.THUMBNAIL_DEFAULT_SIZE / this._porthole.width, 
				this._availHeight / this._porthole.height);

		let childBox = new Clutter.ActorBox();

		childBox.x1 = 0;
		childBox.x2 = this._porthole.width;
		childBox.y1 = panelHeight;
		childBox.y2 = this._porthole.height;

		for (let i = 0; i < this._clones.length; i++) {
			this._clones[i].set_scale(scale, scale);
			this._clones[i].allocate(childBox, flags);
		}
	},

    addClones : function (availHeight) {
        if (!this._thumbnailBins.length)
            return;
        let totalPadding = this._items[0].get_theme_node().get_horizontal_padding() + this._items[0].get_theme_node().get_vertical_padding();
        totalPadding += this.actor.get_theme_node().get_horizontal_padding() + this.actor.get_theme_node().get_vertical_padding();
        let [labelMinHeight, labelNaturalHeight] = this._labels[0].get_preferred_height(-1);
        let spacing = this._items[0].child.get_theme_node().get_length('spacing');

        availHeight = Math.min(availHeight - labelNaturalHeight - totalPadding - spacing, AltTab.THUMBNAIL_DEFAULT_SIZE);
        let binHeight = availHeight + this._items[0].get_theme_node().get_vertical_padding() + this.actor.get_theme_node().get_vertical_padding() - spacing;
        binHeight = Math.min(AltTab.THUMBNAIL_DEFAULT_SIZE, binHeight);

        for (let i = 0; i < this._thumbnailBins.length; i++) {
            let workspace = this._workspaces[i];

			let clone = new WorkspaceThumbnail.WorkspaceThumbnail(workspace);
            clone.setPorthole(this._porthole.x, this._porthole.y,
							  this._porthole.width, this._porthole.height);

            this._thumbnailBins[i].set_height(binHeight);
            this._thumbnailBins[i].add_actor(clone.actor);
            this._clones.push(clone.actor);
        }

        // Make sure we only do this once
        this._thumbnailBins = new Array();
		this._availHeight = availHeight;
    }
})

const WorkspaceSwitcherPopup = new Lang.Class ({
    Name: 'ThumbnailSwitcherPopup',
    Extends: SwitcherPopup.SwitcherPopup,

	_init: function(workspaces) {
		this.parent();

		this._workspaces = workspaces;
	},

    _allocate: function (actor, box, flags) {
		this._thumbnails = this._switcherList;

		if (this._thumbnails) {
			let childBox = new Clutter.ActorBox();
			let primary = Main.layoutManager.primaryMonitor;

			let leftPadding = this.actor.get_theme_node().get_padding(St.Side.LEFT);
			let rightPadding = this.actor.get_theme_node().get_padding(St.Side.RIGHT);
			let bottomPadding = this.actor.get_theme_node().get_padding(St.Side.BOTTOM);
			let vPadding = this.actor.get_theme_node().get_vertical_padding();
			let hPadding = leftPadding + rightPadding;

			let [childMinHeight, childNaturalHeight] = this._thumbnails.actor.get_preferred_height(primary.width - hPadding);
			let [childMinWidth, childNaturalWidth] = this._thumbnails.actor.get_preferred_width(childNaturalHeight);
			childBox.x1 = Math.max(primary.x + leftPadding, primary.x + Math.floor((primary.width - childNaturalWidth) / 2));
			childBox.x2 = Math.min(primary.x + primary.width - rightPadding, childBox.x1 + childNaturalWidth);
			childBox.y1 = primary.y + Math.floor((primary.height - childNaturalHeight) / 2);
			this._thumbnails.addClones(primary.height);
			childBox.y2 = childBox.y1 + childNaturalHeight;
			this._thumbnails.actor.allocate(childBox, flags);
		}
    },

    _createSwitcher: function() {
		this._switcherList = new WorkspacesThumbnailList(this._workspaces);
		this._items = this._workspaces;

        return true;
    },

    _keyPressHandler: function(keysym, backwards, action) {
        if (keysym == Clutter.Escape) {
            this.destroy();
        } else if (keysym == Clutter.q || keysym == Clutter.Q) {
			this.destroy();
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP || action == Meta.KeyBindingAction.SWITCH_APPLICATIONS) {
			!backwards ? this._select(this._next()) : this._select(this._previous());
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP_BACKWARD || action == Meta.KeyBindingAction.SWITCH_APPLICATIONS_BACKWARD) {
			this._select(this._previous());
        } 

        return true;
    },

    _initialSelection: function(backward, binding) {
        if (binding == 'switch-windows-backward' || backward)
            this._select(this._items.length - 1);
        else if (this._items.length == 1)
            this._select(0);
        else
            this._select(1);
	},

	_select: function(index) {
		this.parent(index);

        let thumbnailsFocused = (window != null);
        this._switcherList.highlight(index, thumbnailsFocused);
	},

	_finish: function(timestamp) {
		this._activateSelected(this._items[this._selectedIndex], timestamp);

		this.parent();
	},

	_activateSelected: function(workspace, timestamp) {
		workspace.activate(timestamp);
	},

})

/**
 * This class handles window and workspace events, so we can keep a
 * stack of these two ordered by the most recently focused component.
 *
 */
const MRUAltTabManager = new Lang.Class({
    Name: 'MRUAltTabManager',

	_init: function() {
        // TODO: connect and track signals correctly
		global.screen.connect("notify::n-workspaces", Lang.bind(this, this._changeWorkspaces));
        global.window_manager.connect('switch-workspace', Lang.bind(this, this._switchWorkspace));

		this._workspaces = [];

		this._changeWorkspaces();
	}, 

	_changeWorkspaces: function() {
		let workspaces = [];

		for ( let i=0; i < global.screen.n_workspaces; ++i ) {
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

	_switchWorkspace: function() {
		let currentWorkspace = global.screen.get_active_workspace();
		let workspaceIndex = this._workspaces.indexOf(currentWorkspace);

		if (workspaceIndex != -1) {
			this._workspaces.splice(workspaceIndex, 1);
		}

		this._workspaces.unshift(currentWorkspace);
	},

	_startWorkspaceSwitcher: function(display, screen, window, binding) {
		if (!this._workspaces.length) {
			this._changeWorkspaces();
		}

        let modifiers = binding.get_modifiers();
        let backwards = modifiers & Meta.VirtualModifier.SHIFT_MASK;

		let switcher = new WorkspaceSwitcherPopup(this._workspaces);

		if (!switcher.show(backwards, binding.get_name(), binding.get_mask())) {
			switcher.destroy();
		}
	},
})

const PowerAltTab = new Lang.Class({
    Name: "PowerAltTab",

    _init: function() {
        this.manager = null;
    }, 

    enable: function() {
        this.manager = new MRUAltTabManager();
        this._setKeybindingsHandler(this.manager, this.manager._startWorkspaceSwitcher);
    },

    disable: function() {
        this.manager = null;
        this._setKeybindingsHandler(Main.wm, Main.wm._startAppSwitcher);
    },
        
    _setKeybindingsHandler: function(handler, groupSwitcher) {
        Meta.keybindings_set_custom_handler('switch-windows',
                                            Lang.bind(Main.wm, Main.wm._startWindowSwitcher));
        Meta.keybindings_set_custom_handler('switch-group',
                                            Lang.bind(handler, groupSwitcher));
        Meta.keybindings_set_custom_handler('switch-windows-backward',
                                            Lang.bind(Main.wm, Main.wm._startWindowSwitcher));
        Meta.keybindings_set_custom_handler('switch-group-backward',
                                            Lang.bind(handler, groupSwitcher));
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
