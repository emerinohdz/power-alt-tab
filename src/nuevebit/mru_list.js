/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

/**
 * Keeps a list of items ordered by Most Recently Used. Items can be
 * updated (added/removed) and can be switched to the start of the
 * list (which will be the most recently used item).
 */
export default class MRUList {
    constructor(items) {
        this.items = items.concat([]) || [];
    }

    toArray() {
        return this.items.concat([]);
    }

    size() {
        return this.items.length;
    }

    get(index) {
        return this.items[index];
    }

    /**
     * Iterate the current list.
     * 
     * @param {function} callback
     */
    forEach(callback) {
        this.items.forEach(callback);
    }

    /**
     * Updates the items list with the provided new items. Existing
     * items retain their order and are placed first, new items are placed
     * at the end of the list.
     * 
     * @param {array} newItems 
     * 
     */
    update(newItems) {
        // order workspaces, new workspaces are placed at the end
        // of the list
        if (this.items.length) {
            let existing = [];

            this.items.forEach(function (item) {
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
        this.items = newItems;
    }

    /**
     * Moves item to the start of the list.
     * 
     * @param {mixed} item 
     */
    switch (item) {
        let index = this.items.indexOf(item);

        // remove from list
        if (index !== -1) {
            this.items.splice(index, 1);
        }

        // add it back to the start
        this.items.unshift(item);
    }
};