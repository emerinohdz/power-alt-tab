/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

// GS uses log() to write to stdout, we should include this polyfill for
// unit testing
var log = console.log;

window.global = {
    screen: {
        connect: function (signal, cb) {},
        disconnect: function (id) {}
    },
    window_manager: {
        connect: function (signal, cb) {},
        disconnect: function (id) {}
    }
};

const imports = {
    lang: {
        bind: function (context, func, args) {
            _.bind(func, context, args);
        },
        Class: function (obj) {
            return obj;
        }
    },
    misc: {
        extensionUtils: {
            getCurrentExtension: function () {
                return {
                    imports: {
                        utils: classFinder
                    }
                };
            }
        }
    },
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
            SwitcherPopup: function() { },
            SwitcherList: function(){ }
        },
        main: {
            wm: {}
        }
    }
};