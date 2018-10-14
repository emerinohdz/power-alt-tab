/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

/*
 * This file should be included when testing using GJS (jasmine-gjs).  
 */

// TODO: This currently disables GS' imports mechanism and includes only
// the needed parts
global.imports = {
    lang: imports.lang,
    gi: {
        Meta: {
            keybindings_set_custom_handler: function (key, handler) {

            },
            VirtualModifier: {
                SHIFT_MASK: 1
            }
        }
    },
    ui: {
        switcherPopup: {
            SwitcherPopup: function () { },
            SwitcherList: function () { }
        },
        main: {
            wm: {}
        }
    }
};

global.window.global = {

    workspace_manager: {
        connect: function (signal, cb) {},
        disconnect: function (id) {}
    },
    window_manager: {
        connect: function (signal, cb) {},
        disconnect: function (id) {}
    }
};

