/**
 * Power Alt-Tab
 * @autor: emerino <dovodka at gmail dot com>
 *
 */

import ExtensionService from "nuevebit/extension_service";

let extensionService = null;

export function init() {
    extensionService = new ExtensionService();
}

export function enable() {
    extensionService.enable();
}

export function disable() {
    extensionService.disable();
}
