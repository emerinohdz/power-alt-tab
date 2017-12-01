/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

describe("SwitcherUtils", function () {
    var gs = nuevebit.gs;

    it("should lookup the starter function for GS _startSwitcher", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM_startSwitcher();
        let func = utils.lookup(wm);

        expect(func).toBe(wm._startSwitcher);
    });

    it("should lookup the starter function for GS __startSwitcher", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM__startSwitcher();
        let func = utils.lookup(wm);

        expect(func).toBe(wm.__startSwitcher);
    });

    it("should lookup the starter function for GS __startAppSwitcher", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM__startAppSwitcher();
        let func = utils.lookup(wm);

        expect(func).toBe(wm.__startAppSwitcher);
    });

    it("should lookup the starter function for GS _startAppSwitcher", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM_startAppSwitcher();
        let func = utils.lookup(wm);

        expect(func).toBe(wm._startAppSwitcher);
    });

    it("should fail if it cannot lookup the function with any of the known names", function () {
        // singleton
        let utils = gs.SwitcherUtils; 

        // it should fail, no function could be found
        expect(function () {
            utils.lookup({
                startSwitcher: function () {
                    // this method name is not available in any of the existing GS
                    // versions for the WM
                }
            });
        }).toThrow("No starter method available in current WM");
    });

    function newWM_startSwitcher() {
        return {
            _startSwitcher: function () {
                // no-op GS >= 3.26.2 method
            }
        };
    }

    function newWM__startSwitcher() {
        return {
            __startSwitcher: function () {

            }
        };
    }

    function newWM__startAppSwitcher() {
        return {
            __startAppSwitcher: function () {

            }
        };
    }

    function newWM_startAppSwitcher() {
        return {
            _startAppSwitcher: function () {

            }
        };
    }
});
