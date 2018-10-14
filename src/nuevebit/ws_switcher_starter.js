/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

import {Meta} from "core";
import WorkspaceSwitcherPopup from "nuevebit/workspace_switcher_popup";

/**
 * WS SwitcherStarter, handles showing the Workspace Switcher popup.
 * 
 * @param {nuevebit.gs.WorkspaceSwitcher} manager
 */
export default class WSSwitcherStarter {
    constructor(manager) {
        this.manager = manager;
    }

    start(display, win, binding) {
        let modifiers = binding.get_modifiers();
        let backwards = modifiers & Meta.VirtualModifier.SHIFT_MASK;

        // use the WS switcher popup
        let popup = new WorkspaceSwitcherPopup(this.manager.getWorkspaces());

        if (!popup.show(backwards, binding.get_name(), binding.get_mask())) {
            popup.destroy();
        }
    }
}
