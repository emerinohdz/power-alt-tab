/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

import {Meta} from "core";
import PowerWorkspaceSwitcherPopup from "nuevebit/workspace_switcher_popup";

/**
 * WS SwitcherStarter, handles showing the Workspace Switcher popup.
 * 
 * @param {nuevebit.gs.PowerWorkspaceSwitcher} manager
 */
export default class WSSwitcherStarter {
    constructor(manager) {
        this.manager = manager;
    }

    start(display, win, binding) {
        let modifiers = binding.get_modifiers();
        let backwards = modifiers & Meta.VirtualModifier.SHIFT_MASK;

        // use the WS switcher popup
        let popup = new PowerWorkspaceSwitcherPopup(this.manager.getWorkspaces());

        if (!popup.show(backwards, binding.get_name(), binding.get_mask())) {
            popup.destroy();
        }
    }
}
