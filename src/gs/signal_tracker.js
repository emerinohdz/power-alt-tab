/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

function generateGUID () {
// not truly a GUID, but works fine for our purposes
    return Math.random().toString(36).substring(2)
            + (new Date()).getTime().toString(36);
};

/**
 * SignalTrackers are responsible for tracking and untracking (connecting
 * and disconnecting) signals from given subjects. There should normally be
 * one single SignalTracker per extension.
 * 
 */
export default class SignalTracker {
    constructor() {
        this.trackedSignals = {};
    }

// global tracked signals


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
    track(subject, signal, callback) {
        let id = subject.connect(signal, callback);
        let guid = generateGUID();
        this.trackedSignals[guid] = {
            subject: subject,
            signal: signal,
            id: id
        };
        return guid;
    }
    /**
     * Return the given tracked signal if found.
     * @param {string} guid
     * @returns {object} the tracked signal or null if not found
     */
    find(guid) {
        return (this.trackedSignals.hasOwnProperty(guid))
                ? this.trackedSignals[guid]
                : null;
    }
    /**
     * Returns a list containing the tracked signals.
     * 
     */
    getTrackedSignals() {
        return Object.entries(this.trackedSignals).map(function (e, i) {
            return {
                guid: e[0],
                tracked: e[1]
            }
        });
    }
    /**
     * Disconnects and untracks the given tracked signal.
     * 
     * @param {string} guid the globally assigned GUID for the tracked signal.
     */
    untrack(guid) {
        let tracked = this.trackedSignals[guid];
        tracked.subject.disconnect(tracked.id);
        delete this.trackedSignals[guid];
    }
    /**
     * Disconnects all signals tracked by this tracker.
     * 
     */
    untrackAll() {
        Object.keys(this.trackedSignals).forEach((guid) => {
            this.untrack(guid);
        });
    }
}