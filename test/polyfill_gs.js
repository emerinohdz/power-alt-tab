/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

// GS uses log() to write to stdout, we should include this polyfill for
// unit testing
var log = console.log;

// Lang global
var Lang = {
    bind: function (context, func, args) {
        _.bind(func, context, args);
    }
};

// Meta global
var Meta = {
    keybindings_set_custom_handler: function (key, handler) {

    },
    VirtualModifier: {
        SHIFT_MASK: 1
    }
};

// Main global
var Main = {
    wm: {}
};