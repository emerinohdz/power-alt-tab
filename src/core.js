/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

/**
 * GS and GJS exports. This is needed for UMD, so importing core GS files
 * can be done with:
 * 
 * import {Lang, Meta, Main} from "core"
 * 
 * This way, we can easily integrate the native (core) GS/GJS API to work 
 * with ES6 imports.
 * 
 * TODO: Provide exports for the whole GS API available through imports.
 */
module.exports = {
    Lang: imports.lang,
    Main: imports.ui.main,
    Meta: imports.gi.Meta,
    Shell: imports.gi.Shell,
    St: imports.gi.St,
    WorkspaceThumbnail: imports.ui.workspaceThumbnail,
    SwitcherList: imports.ui.switcherPopup.SwitcherList,
    SwitcherPopup: imports.ui.switcherPopup.SwitcherPopup,
    Clutter: imports.gi.Clutter,
    Tweener: imports.ui.tweener,
    AltTab: imports.ui.altTab
};

