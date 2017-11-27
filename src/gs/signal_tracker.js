/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var gs = gs || {};

(function (gs) {

    /**
     * SignalTrackers are responsible for tracking and untracking (connecting
     * and disconnecting) signals from given subjects. There should normally be
     * one single SignalTracker per extension.
     * 
     */
    gs.SignalTracker = function () {

        // global tracked signals
        let trackedSignals = {};

        function generateGUID() {
            // not truly a GUID, but works fine for our purposes
            return Math.random().toString(36).substring(2)
                    + (new Date()).getTime().toString(36);
        }

        function untrack(guid) {
            let tracked = trackedSignals[guid];
            tracked.subject.disconnect(tracked.id);

            delete trackedSignals[guid];
        }

        /**
         * Connects and tracks signals of the given subject, executes callback
         * each time the signal is emited.
         * 
         * @param {object} subject
         * @param {string} signal
         * @param {function} callback
         * @returns {string} a GUID identifying the tracked signal.
         * 
         */
        this.track = function (subject, signal, callback) {
            let id = subject.connect(signal, callback);
            let guid = generateGUID();

            trackedSignals[guid] = {
                subject: subject,
                signal: signal,
                id: id
            };

            return guid;
        };

        /**
         * Return the given tracked signal if found.
         * @param {string} guid
         * @returns {object} the tracked signal or null if not found
         */
        this.find = function (guid) {
            return (trackedSignals.hasOwnProperty(guid))
                    ? trackedSignals[guid]
                    : null;
        };

        /**
         * Returns a list containing the tracked signals.
         * 
         */
        this.getTrackedSignals = function () {
            return Object.entries(trackedSignals).map(function (e, i) {
                return {
                    guid: e[0],
                    tracked: e[1]
                }
            });
        };

        /**
         * Disconnects and untracks the given tracked signal.
         * 
         * @param {string} guid the globally assigned GUID for the tracked signal.
         */
        this.untrack = function (guid) {
            untrack(guid);
        };

        /**
         * Disconnects all signals tracked by this tracker.
         * 
         */
        this.untrackAll = function () {
            Object.keys(trackedSignals).forEach(function (guid) {
                untrack(guid);
            });
        };
    };
})(gs);