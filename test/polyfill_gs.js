/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

// GS uses log() to write to stdout, we should include this polyfill for
// unit testing
var log = console.log;

var classFinder = {
    use: function (name) {
        // TODO: it should delay loading of the actual class until the first
        // instance is created
        return eval(name);
    }
};

var global = {
    screen: {
        connect:function(signal, cb){},
        disconnect: function(id){}
    },
    window_manager: {
        connect:function(signal, cb){},
        disconnect: function(id){}
    }
};

var imports = {
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
            SwitcherPopup: {},
            SwitcherList: {}
        },
        main: {
            wm: {}
        }
    }
};
