/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

/**
 * Takes the necessary actions to enable or disable the PowerAltTab extension.
 * 
 * @param array opts
 * @returns {nuevebit.gs.ExtensionService}
 */
nuevebit.gs.ExtensionService = function (opts) {
    opts = opts || {};

    // TODO: DI container
    var wm = opts.wm || Main.wm;
    var meta = opts.meta || Meta;
    var manager = opts.manager;

    // handler lookup of the default GS switcher starter function (fully binded)
    // this is needed in order to maintain backwards compatibility between 
    // GS versions, because the name of the method changes constantly
    var switcherStarter = opts.switcherLookup;

    this.enable = function () {
        // init workspaces
        manager.changeWorkspaces();

        // when enabled, show the WS switcher popup instead of the default
        // WM switcher on switch-group
        setKeybindingsHandler(showPATSwitcher);
    };

    this.disable = function () {
        // show default GS switcher on switch-group
        setKeybindingsHandler(switcherStarter.lookup());
    };

    function showPATSwitcher(display, screen, win, binding) {
        let modifiers = binding.get_modifiers();
        let backwards = modifiers & meta.VirtualModifier.SHIFT_MASK;

        let popup = new WorkspaceSwitcherPopup(manager.getWorkspaces());

        if (!popup.show(backwards, binding.get_name(), binding.get_mask())) {
            popup.destroy();
        }
    }

    function setKeybindingsHandler(startFunc) {
        meta.keybindings_set_custom_handler('switch-group', startFunc);
        meta.keybindings_set_custom_handler('switch-group-backward', startFunc);
    }
};


