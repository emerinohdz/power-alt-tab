/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

describe("SwitcherUtils", function () {
    var gs = nuevebit.gs;

    it("should lookup the starter function for GS >= 3.26.2", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM_GS3_26_2();
        let func = utils.lookup(wm);

        expect(func).toBe(wm._startSwitcher);
    });

    it("should lookup the starter function for GS == 3.26", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM_GS3_26();
        let func = utils.lookup(wm);

        expect(func).toBe(wm.__startSwitcher);
    });

    it("should lookup the starter function for GS < 3.26", function () {
        // singleton
        let utils = gs.SwitcherUtils;
        let wm = newWM_GSOld();
        let func = utils.lookup(wm);

        expect(func).toBe(wm.__startAppSwitcher);
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

    function newWM_GS3_26_2() {
        return {
            _startSwitcher: function () {
                // no-op GS >= 3.26.2 method
            }
        };
    }

    function newWM_GS3_26() {
        return {
            __startSwitcher: function () {

            }
        };
    }

    function newWM_GSOld() {
        return {
            __startAppSwitcher: function () {

            }
        };
    }
});
