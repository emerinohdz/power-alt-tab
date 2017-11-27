/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

describe("MRUList", function () {
    var MRUList = nuevebit.gs.MRUList;

    it("should return the items as an array", function(){
        var list = new MRUList([
            1, 2, 3
        ]);

        expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it("should return the number of items", function(){
        var list = new MRUList([
            1, 2
        ]);

        expect(list.size()).toBe(2);

        list.update([
            1, 2, 3, 4, 5
        ]);

        expect(list.size()).toBe(5);

        // none of the updated items include the existing ones
        list.update([
            6, 7, 8
        ]);

        expect(list.size()).toBe(3);

        // list can be emptied
        list.update([]);

        expect(list.size()).toBe(0);

    });

    it("should ignore existing items", function () {
        var list = new MRUList([
            1, 2, 3
        ]);

        list.update([
            1, 2, 3, 5
        ]);

        // only 5 should be added
        expect(list.size()).toBe(4);
        expect(list.get(3)).toBe(5);
    });

    it("should add new items at the end", function () {
        var list = new MRUList([
            1, 3, 5
        ]);

        list.update([
            6, 7, 1, 3, 5
        ]);

        // 6 and 7 should go at the end of the list
        expect(list.get(3)).toBe(6);
        expect(list.get(4)).toBe(7);
    });

    it("should keep existing items first", function () {
        var list = new MRUList([
            1, 2, 3
        ]);

        list.update([
            4, 5, 1, 2, 3
        ]);

        // existing items go first
        expect(list.get(0)).toBe(1);
        expect(list.get(1)).toBe(2);
        expect(list.get(2)).toBe(3);
    });

    it("should maintain the order of the existing items", function(){
        var list = new MRUList([
            3, 2, 1
        ]);

        list.update([
            1, 2, 3, 4, 5
        ]);

        // maintain original order
        expect(list.get(0)).toBe(3);
        expect(list.get(1)).toBe(2);
        expect(list.get(2)).toBe(1);
    });

    it("should remove not existing items on update", function() {
        var list = new MRUList([
            1, 2, 3
        ]);

        // remove 1 and 2
        list.update([
            3, 4, 5
        ]);

        expect(list.size()).toBe(3);

        expect(list.get(0)).toBe(3);
        expect(list.get(1)).toBe(4);
        expect(list.get(2)).toBe(5);
    });

});

