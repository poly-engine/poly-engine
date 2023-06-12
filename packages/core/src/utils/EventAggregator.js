import { Event } from "./Event";

/**
 * @class EventAggregator
 */
export class EventAggregator {
    constructor() {
        /** @type {Map<string, Event>} */
        this.eventMap = new Map;
    }

    /**
     * 
     * @param {string} id 
     * @param {number} subId 
     */
    unsubId(id, subId) {
        let event = this.eventMap.get(id);
        if (event) event.unsubId(subId);
    }
    /**
     * 
     * @param {string} id 
     */
    clear(id) {
        let event = this.eventMap.get(id);
        if (event) event.clear();
    }

    //#region ActionAny
    /**
     * 
     * @param {string} id 
     * @param {Function} action 
     * @param {object} caller 
     * @returns {number}
     */
    sub(id, action, caller = null) {
        let event = this.eventMap.get(id);
        if (!event) {
            event = new EventAny();
            this.eventMap.set(id, event);
        }
        return event.sub(action, caller);
    }
    /**
     * 
     * @param {string} id 
     * @param {Function} action 
     * @param {object} caller 
     */
    unsub(id, action, caller = null) {
        let event = this.eventMap.get(id);
        if (event) event.unsub(action, caller);
    }
    /**
     * 
     * @param {string} id 
     * @param  {...any} t 
     */
    pub(id, ...t) {
        let event = this.eventMap.get(id);
        if (event) event.pub(t);
    }
    //#endregion
}