/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var nuevebit = nuevebit || {};
nuevebit.gs = nuevebit.gs || {};

(function (gs) {
    const Meta = imports.gi.Meta;
    const ExtensionUtils = imports.misc.extensionUtils;
    const Utils = ExtensionUtils.getCurrentExtension().imports.utils;

    /**
     * Keeps a list of items ordered by Most Recently Used. Items can be
     * updated (added/removed) and can be switched to the start of the
     * list (which will be the most recently used item).
     */
    gs.MRUList = function (items) {
        items = items.concat([]) || [];

        this.toArray = function() {
            return items.concat([]);
        };

        this.size = function() {
            return items.length;
        };

        this.get = function (index) {
            return items[index];
        };

        /**
         * Iterate the current list.
         * 
         * @param {function} callback
         */
        this.forEach = function (callback) {
            items.forEach(callback);
        };

        /**
         * Updates the items list with the provided new items. Existing
         * items retain their order and are placed first, new items are placed
         * at the end of the list.
         * 
         * @param {array} newItems 
         * 
         */
        this.update = function (newItems) {
            // order workspaces, new workspaces are placed at the end
            // of the list
            if (items.length) {
                let existing = [];

                items.forEach(function (item) {
                    let index = newItems.indexOf(item);

                    // existing should go first
                    if (index !== -1) {
                        // remove from newItems list
                        newItems.splice(index, 1);

                        existing.push(item);
                    }
                });

                // newItems added at the end
                newItems = existing.concat(newItems);
            }

            // update current items
            items = newItems;
        };

        /**
         * Moves item to the start of the list.
         * 
         * @param {mixed} item 
         */
        this.switch = function (item) {
            let index = items.indexOf(item);

            // remove from list
            if (index !== -1) {
                items.splice(index, 1);
            }

            // add it back to the start
            items.unshift(item);
        };
    };
})(nuevebit.gs);



