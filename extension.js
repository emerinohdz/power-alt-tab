
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Meta = imports.gi.Meta;
const Lang = imports.lang;
const AltTab = imports.ui.altTab;

function WindowSwitcher(windows) {
	this._init(windows);
}

WindowSwitcher.prototype = {
	_init: function(windows) {
        this.actor = new Shell.GenericContainer({ name: 'altTabInvisiblePopup',
                                                  reactive: true,
                                                  visible: false });

        this.actor.connect('get-preferred-width', Lang.bind(this, this._getPreferredWidth));
        this.actor.connect('get-preferred-height', Lang.bind(this, this._getPreferredHeight));
        this.actor.connect('allocate', Lang.bind(this, this._allocate));
        this.actor.connect('destroy', Lang.bind(this, this._onDestroy));

		this._windows = windows;
		this._thumbnails = null;
		this._modifierMask = null;
		this._initialDelayTimeoutId = 0;
		this._currentIndex = 0;
		this._haveModal = false;

		if (!global.display.focus_window) {
			this._currentIndex = -1;
		}

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

		if (this._windows.length == 1) {
			this.destroy();
			return false;
		}

        this._modifierMask = AltTab.primaryModifier(mask);

        this.actor.connect('key-press-event', Lang.bind(this, this._keyPressEvent));
        this.actor.connect('key-release-event', Lang.bind(this, this._keyReleaseEvent));

		this._thumbnails = new AltTab.ThumbnailList(this._windows);
        this.actor.add_actor(this._thumbnails.actor);
        this._thumbnails.actor.get_allocation_box();

        // Need to force an allocation so we can figure out whether we
        // need to scroll when selecting
        this.actor.opacity = 0;
        this.actor.show();
        this.actor.get_allocation_box();

		this._nextWindow();

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

	_nextWindow: function() {
		if ((this._currentIndex + 1) == this._windows.length) {
			this._currentIndex = 0;
		} else {
			this._currentIndex++;
		}

		this._thumbnails.highlight(this._currentIndex, true);
	},

	_previousWindow: function() {
		if (this._currentIndex == 0) {
			this._currentIndex = this._windows.length - 1;
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
			!backwards ? this._nextWindow() : this._previousWindow();
        } else if (action == Meta.KeyBindingAction.SWITCH_GROUP_BACKWARD) {
			this._previousWindow();
        } else if (action == Meta.KeyBindingAction.SWITCH_WINDOWS) {
			!backwards ? this._nextWindow() : this._previousWindow();
        } else if (action == Meta.KeyBindingAction.SWITCH_WINDOWS_BACKWARD) {
			this._previousWindow();
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
		Main.activateWindow(this._windows[this._currentIndex]);

		this.destroy();
	},

	_onDestroy: function() {
		this._popModal();

		this._windows = null;
		this._currentWindow = null;
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
 * This class handles windows events, so we can track the most
 * recently focused window and keep a queue of them.
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
		this._windows = [];

		this._changeWorkspaces();
	}, 

	_changeWorkspaces: function() {
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
        }
	},

	_windowAdded: function(metaWorkspace, metaWindow) {
		if (this._windows.indexOf(metaWindow) == -1) {
			this._windows.push(metaWindow);
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
				// move window to the head of the queue
				this._windows.splice(windowIndex, 1);
			} 		

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

	_startWindowSwitcher: function(shellwm, binding, mask, window, backwards) {
		let windows = null;

		if (binding == "switch_windows") {
			windows = this._windows;
		} else {
			let currentWorkspace = global.screen.get_active_workspace();

			windows = this._windows.filter(function(win) {
				return win.get_workspace() == currentWorkspace;
			});
		}

		let windowSwitcher = new WindowSwitcher(windows);

		if (!windowSwitcher.show(shellwm, binding, mask, window, backwards)) {
			windowSwitcher.destroy();
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
