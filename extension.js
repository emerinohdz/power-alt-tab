
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Lang = imports.lang;

function SimpleAltTab() {
	this._init();
}

SimpleAltTab.prototype = {
	_init: function() {
        let tracker = Shell.WindowTracker.get_default();
        tracker.connect('notify::focus-app', Lang.bind(this, this._focusChanged));

        this.actor = new Shell.GenericContainer({ name: 'altTabInvisiblePopup',
                                                  reactive: true,
                                                  visible: false });

		this._initWindowList();
	},

	_initWindowList: function() {
		this._windows = [];
		this._lastWindow = null;
		this._currentWindow = null;

		let windowActors = global.get_window_actors();

		for (let i in windowActors) {
			let win = windowActors[i].get_meta_window();

			if (win.has_focus()) {
				this._currentWindow = win;
			}

			this._windows.push(win);
		}

//		this._windows.sort(Lang.bind(this, this._sortWindows));
//		this._windows.unshift(this._lastFocused);
	},

	_focusChanged: function() {
		this._lastWindow = this._currentWindow;

		if (global.display.focus_window) {
			this._currentWindow = global.display.focus_window;
		}
	},

	_iterateWindows: function(shellwm, binding, mask, window, backwards) {
		if (this._windows.length == 0) {
			this._initWindowList();
		}

		this._windows = this._windows.filter(function(win) {
			return win != this._lastWindow && win != this._currentWindow;
		});

		this._windows.sort(Lang.bind(this, this._sortWindows));

		if (this._lastWindow) {
			this._windows.unshift(this._lastWindow);
		} 

		if (this._currentWindow) {
			this._windows.push(this._currentWindow);
		}

		Main.activateWindow(this._windows[0]);
	},

    _sortWindows : function(win1, win2) {
		let t1 = win1.get_user_time();
		let t2 = win2.get_user_time();

		if (t2 > t1) {
			return 1;
		} else {
			return -1;
		}
    }
}

let simpleAltTab;

function init() {
}

function altTab(shellwm, binding, mask, window, backwards) {
	simpleAltTab._iterateWindows(shellwm, binding, mask, window, backwards);
}

function enable() {
	if (!simpleAltTab) {
		simpleAltTab = new SimpleAltTab();
	}

    Main.wm.setKeybindingHandler('switch_windows', altTab);
    Main.wm.setKeybindingHandler('switch_group', altTab);
    Main.wm.setKeybindingHandler('switch_windows_backward', altTab);
    Main.wm.setKeybindingHandler('switch_group_backward', altTab);
}

function disable() {
	if (simpleAltTab) {
		simpleAltTab = null;
	}

    Main.wm.setKeybindingHandler('switch_windows', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    Main.wm.setKeybindingHandler('switch_group', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    Main.wm.setKeybindingHandler('switch_windows_backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
    Main.wm.setKeybindingHandler('switch_group_backward', Lang.bind(Main.wm, Main.wm._startAppSwitcher));
}
