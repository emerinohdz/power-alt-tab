/**
 * Power Alt-Tab
 * @autor: emerino <emerino at gmail dot com>
 *
 * Some code reused (and some stolen) from ui.altTab script.
 */

const Lang = imports.lang;
const ExtensionUtils = imports.misc.extensionUtils;
const Utils = ExtensionUtils.getCurrentExtension().imports.utils;

const ExtensionService = Utils.use("nuevebit.gs.ExtensionService");

let extensionService = null;

function init() {
    extensionService = new ExtensionService();
}

function enable() {
    extensionService.enable();
}

function disable() {
    extensionService.disable();
}
