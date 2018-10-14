/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

import { Lang } from "core";
import { lookup } from "nuevebit/switcher_utils";

/**
 * Default SwitcherStarter, handles showing the GS switcher.
 * 
 * @returns {nuevebit.gs.AppSwitcherStarter}
 */
export default class AppSwitcherStarter {
    constructor(wm) {
        this.wm = wm;
        this.startFunc = lookup(wm);
    }

    start(display, win, binding) {
        // delegate to wm startFunc
        Lang.bind(this.wm, this.startFunc)(display, screen, win, binding);
    }
}
