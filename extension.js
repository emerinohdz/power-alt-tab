/**
 * Power Alt-Tab
 * @autor: emerino <donvodka at gmail dot com>
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

function WorkspacesThumbnailList(workspaces) {
	this._init(workspaces);
}

WorkspacesThumbnailList.prototype = {
	__proto__: AltTab.SwitcherList.prototype,

	_init: function(workspaces) {
        AltTab.SwitcherList.prototype._init.call(this);

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
        AltTab.SwitcherList.prototype._allocate.call(this, actor, box, flags);

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
}

function Switcher(list, thumbnails, activateSelected) {
	this._init(list, thumbnails, activateSelected);
}

Switcher.prototype = {
	_init: function(list, thumbnails, activateSelected) {
        this.actor = new Shell.GenericContainer({ name: 'altTabInvisiblePopup',
                                                  reactive: true,
                                                  visible: false });

        this.actor.connect('get-preferred-width', Lang.bind(this, this._getPreferredWidth));
        this.actor.connect('get-preferred-height', Lang.bind(this, this._getPreferredHeight));
        this.actor.connect('allocate', Lang.bind(this, this._allocate));
        this.actor.connect('destroy', Lang.bind(this, this._onDestroy));

		this._list = list;
		this._thumbnails = thumbnails;
		this._modifierMask = null;
		this._initialDelayTimeoutId = 0;
		this._currentIndex = 0;
		this._onActivateSelected = activateSelected;
		this._haveModal = false;

        Main.uiGroup.add_actor(this.actor);
	},

    _getPreferredWidth: function (actor, forHeight, alloc) {
        alloc.min_size = global.screen_width;
        alloc.natural_size = global.screen_width;
    },

    _getPreferredHeight: function (actor, forWidth, alloc) {
        alloc.min_size = global.screen_height;
        alloc.natural_size = global.screen_height;
    },

    _allocate: function (actor, box, flags) {
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

	show: function(shellwm, binding, mask, window, backwards) {
        if (!Main.pushModal(this.actor))
            return false;

		this._haveModal = true;

        this._modifierMask = AltTab.primaryModifier(mask);

        this.actor.connect('key-press-event', Lang.bind(this, this._keyPressEvent));
        this.actor.connect('key-release-event', Lang.bind(this, this._keyReleaseEvent));

        this.actor.add_actor(this._thumbnails.actor);
        this._thumbnails.actor.get_allocation_box();

        // Need to force an allocation so we can figure out whether we
        // need to scroll when selecting
        this.actor.opacity = 0;
        this.actor.show();
        this.actor.get_allocation_box();

		this._next();

        // There's a race condition; if the user released Alt before
        // we got the grab, then we won't be notified. (See
        // https://bugzilla.gnome.org/show_bug.cgi?id=596695 for
        // details.) So we check now. (Have to do this after updating
        // selection.)
        let [x, y, mods] = global.get_pointer();
        if (!(mods & this._modifierMask)) {
			this._activateSelected();

			return false;
        }

        // We delay showing the popup so that fast Alt+Tab users aren't
        // disturbed by the popup briefly flashing.
        this._initialDelayTimeoutId = Mainloop.timeout_add(AltTab.POPUP_DELAY_TIMEOUT,
                                                           Lang.bind(this, function () {
                                                               this.actor.opacity = 255;
                                                               this._initialDelayTimeoutId = 0;
                                                           }));

		return true;
	},

	_next: function() {
		if ((this._currentIndex + 1) == this._list.length) {
			this._currentIndex = 0;
		} else {
			this._currentIndex++;
		}

		this._thumbnails.highlight(this._currentIndex, true);
	},

	_previous: function() {
		if (this._currentIndex == 0) {
			this._currentIndex = this._list.length - 1;
		} else {
			this._currentIndex--;
		}

		this._thumbnails.highlight(this._currentIndex, true);
	},

    _keyPressEvent : function(actor, event) {
        let keysym = event.get_key_symbol();
        let event_state = Shell.get_event_state(event);

        let backwards = event_state & Clutter.ModifierType.SHIFT_MASK;
        let action = global.display.get_keybinding_action(event.get_key_code(), event_state);

        if (keysym == Clutter.Escape) {
            this.destroy();
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP) {
			!backwards ? this._next() : this._previous();
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP_BACKWARD) {
			this._previous();
        } else if (action == Meta.KeyBindingAction.SWITCH_WINDOWS) {
			!backwards ? this._next() : this._previous();
        } else if (action == Meta.KeyBindingAction.SWITCH_WINDOWS_BACKWARD) {
			this._previous();
		}

        return true;
    },

    _keyReleaseEvent : function(actor, event) {
        let [x, y, mods] = global.get_pointer();
        let state = mods & this._modifierMask;

        if (state == 0) {
			this._activateSelected();
		}

        return true;
    },

    _popModal: function() {
        if (this._haveModal) {
            Main.popModal(this.actor);
            this._haveModal = false;
        }
    },

	_activateSelected: function() {
		this._onActivateSelected(this._list[this._currentIndex]);

		this.destroy();
	},

	_onDestroy: function() {
		this._popModal();

		this._list= null;
		this._thumbnails = null;

        if (this._initialDelayTimeoutId != 0)
            Mainloop.source_remove(this._initialDelayTimeoutId);
	},

	destroy: function() {
		this._onDestroy();

		this.actor.destroy();
	}
}

/**
 * This class handles window and workspace events, so we can keep a
 * stack of these two ordered by the most recently focused component.
 *
 */
function Manager() {
	this._init();
}

Manager.prototype = {
	_init: function() {
        let tracker = Shell.WindowTracker.get_default();
        tracker.connect('notify::focus-app', Lang.bind(this, this._focusChanged));

		global.screen.connect("notify::n-workspaces", Lang.bind(this, this._changeWorkspaces));
        global.window_manager.connect('switch-workspace', Lang.bind(this, this._switchWorkspace));

		this._windows = [];
		this._workspaces = [];

		this._changeWorkspaces();
	}, 

	_changeWorkspaces: function() {
		let workspaces = [];

		for ( let i=0; i < global.screen.n_workspaces; ++i ) {
            let ws = global.screen.get_workspace_by_index(i);

			if (ws._windowAddedId) {
				ws.disconnect(ws._windowAddedId);
				ws.disconnect(ws._windowRemovedId);
			}

            ws._windowAddedId = ws.connect('window-added',
                                    Lang.bind(this, this._windowAdded));
            ws._windowRemovedId = ws.connect('window-removed',
                                    Lang.bind(this, this._windowRemoved));

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

	_windowAdded: function(metaWorkspace, metaWindow) {
		if (this._windows.indexOf(metaWindow) == -1) {
			this._windows.splice(1, 0, metaWindow);
		}
    },

    _windowRemoved: function(metaWorkspace, metaWindow) {
		let windowIndex = this._windows.indexOf(metaWindow);

		if (windowIndex != -1) {
			this._windows.splice(windowIndex, 1);
		}
    },

	_initWindowList: function() {
		this._windows = [];

		let windowActors = global.get_window_actors();

		for (let i in windowActors) {
			let win = windowActors[i].get_meta_window();

			this._windows.push(win);
		}

		// Sort windows by user time
		this._windows.sort(Lang.bind(this, this._sortWindows));
	},

	_focusChanged: function() {
		if (!this._windows.length) {
			this._initWindowList();
		}

		let focusedWindow = global.display.focus_window;

		if (focusedWindow) {
			let windowIndex = this._windows.indexOf(focusedWindow);

			if (windowIndex != -1) {
				// remove the window from the list first
				this._windows.splice(windowIndex, 1);
			} 		

			// stack the window
			this._windows.unshift(focusedWindow);
		}
	},

    _sortWindows : function(win1, win2) {
		let t1 = win1.get_user_time();
		let t2 = win2.get_user_time();

		if (t2 > t1) {
			return 1;
		} else {
			return -1;
		}
    },

	_activateSelectedWorkspace: function(workspace) {
		workspace.activate(global.get_current_time());
	},

	_activateSelectedWindow: function(win) {
		Main.activateWindow(win);
	},

	_startWindowSwitcher: function(shellwm, binding, mask, window, backwards) {
		if (!this._workspaces.length) {
			this._changeWorkspaces();
		}

		let list = null;
		let thumbnails = null;
		let onActivateSelected = null;
		let currentWorkspace = global.screen.get_active_workspace();
		let currentIndex = 0;

		if (binding == "switch_windows") {
			list = this._workspaces;
			thumbnails = new WorkspacesThumbnailList(list);
			onActivateSelected = this._activateSelectedWorkspace;
		} else {
			list = this._windows.filter(function(win) {
				return win.get_workspace() == currentWorkspace;
			});

			if (list.length == 1 && list[0].get_workspace() == currentWorkspace) {
				return;
			}

			thumbnails = new AltTab.ThumbnailList(list);
			onActivateSelected = this._activateSelectedWindow;

			if (!global.display.focus_window) {
				currentIndex = -1;
			}
		}

		if (list.length) {
			let switcher = new Switcher(list, thumbnails, onActivateSelected);
			switcher._currentIndex = currentIndex;

			if (!switcher.show(shellwm, binding, mask, window, backwards)) {
				switcher.destroy();
			}
		}
	}
}

let manager = null;

function init() {
}

function enable() {
	if (!manager) {
		manager = new Manager();
	}

    Main.wm.setKeybindingHandler('switch_windows', Lang.bind(manager, manager._startWindowSwitcher));
    Main.wm.setKeybindingHandler('switch_group', Lang.bind(manager, manager._startWindowSwitcher));
    Main.wm.setKeybindingHandler('switch_windows_backward', Lang.bind(manager, manager._startWindowSwitcher));
    Main.wm.setKeybindingHandler('switch_group_backward', Lang.bind(manager, manager._startWindowSwitcher));
}

function disable() {
	if (manager) {
		manager = null;
	}

    Main.wm.setKeybindingHandler('switch_windows', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    Main.wm.setKeybindingHandler('switch_group', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    Main.wm.setKeybindingHandler('switch_windows_backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    Main.wm.setKeybindingHandler('switch_group_backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
}
