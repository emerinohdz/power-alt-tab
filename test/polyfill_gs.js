/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

// GS uses log() to write to stdout, we should include this polyfill for
// unit testing
var log = console.log;

var classFinder = {
    use: function (name) {
        return eval(name);
    }
};

var imports = {
    lang: {
        bind: function (context, func, args) {
            _.bind(func, context, args);
        },
        Class: function(obj) {
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
            SwitcherPopup: {},
            SwitcherList: {}
        },
        Main: {
            wm: {}
        }
    }
};
