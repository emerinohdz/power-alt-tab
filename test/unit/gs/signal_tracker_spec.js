/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

describe("SignalTracker", function () {
    const SignalTracker = gs.SignalTracker;

    it("should return the GUID for the tracked signal", function() {
        let tracker = new SignalTracker();
        let guid = tracker.track(newSubject(), "test", null);

        expect(guid).not.toBeNull();
    });

    it("should return the given tracked signal", function() {
        let tracker = new SignalTracker();
        let subject = newSubject();
        let guid = tracker.track(subject, "test", null);
        let tracked = tracker.find(guid);

        expect(tracked).not.toBeNull();
        expect(tracked.subject).toBe(subject);
        expect(tracked.signal).toBe("test");
        expect(tracked.id).toBe(1);
    });

    it("should untrack the given signal", function() {
        let tracker = new SignalTracker();
        let guid = tracker.track(newSubject(), "test", null);

        expect(tracker.find(guid)).not.toBeNull();

        tracker.untrack(guid);

        // should be null when not found
        expect(tracker.find(guid)).toBeNull();
    });

    it("should untrack all signals", function() {
        let tracker = new SignalTracker();
        let guid1 = tracker.track(newSubject(), "test", null);
        let guid2 = tracker.track(newSubject(), "test2", null);

        expect(tracker.find(guid1)).not.toBeNull();
        expect(tracker.find(guid2)).not.toBeNull();

        tracker.untrackAll();

        expect(tracker.find(guid1)).toBeNull();
        expect(tracker.find(guid2)).toBeNull();
    });
        
    it("should return the tracked signals", function() {
        let tracker = new SignalTracker();
        tracker.track(newSubject(), "test", null);
        tracker.track(newSubject(), "test2", null);

        let tracked = tracker.getTrackedSignals();
        expect(tracked[0].tracked.signal).toBe("test");
        expect(tracked[1].tracked.signal).toBe("test2");
    });

    function newSubject() {
        return {
            connect: function(signal, cb) { return 1; },
            disconnect: function(id) {}
        };
    }
});