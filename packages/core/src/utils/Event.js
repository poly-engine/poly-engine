class EventSub {
    constructor(id, caller, action) {
        this.id = id;
        this.caller = caller;
        this.action = action;
    }
}
/**
 * @class Event
 */
export class Event {
    constructor() {
        /** @type {EventSub[]} */
        this.subs = [];
        this.subId = 0;
    }
    /**
     * 
     * @param {Function} action 
     * @param {object} caller 
     * @returns {number}
     */
    sub(action, caller = null) {
        let i = this.subs.findIndex((sub) => sub.action === action && sub.caller === caller)
        if (i >= 0) return -1;
        let sub = new EventSub(this.subId++, caller, action);
        this.subs.push(sub);
        return sub.id;
    }
    /**
     * 
     * @param {Function} action 
     * @param {object} caller 
     */
    unsub(action, caller = null) {
        let i = this.subs.findIndex((sub) => sub.action === action && sub.caller === caller)
        if (i >= 0) this.subs.splice(i, 1);
    }
    /**
     * 
     * @param {number} subId 
     */
    unsubId(subId) {
        let i = this.subs.findIndex((sub) => sub.id === subId)
        if (i >= 0) this.subs.splice(i, 1);
    }
    /**
     * 
     * @param  {...any} t 
     */
    pub(...t) {
        this.subs.forEach(sub => sub.action.call(sub.caller, t));
    }
    // publish(...t: any[]) { this.actions.forEach(fn => fn(t)); }
    clear() {
        this.subs.length = 0;
    }
}
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