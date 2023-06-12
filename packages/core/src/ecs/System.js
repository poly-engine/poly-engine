/**
 * @callback SystemUpdateFunc
 * @param {number} delta
 */

/**
 * @class System
 */
export class System {
    constructor(world) {
        this.world = world;
        this.em = this.world.entityManager;
        this.qm = this.world.queryManager;
        this.sm = this.world.systemManager;

        this.name = null;
        this.index = -1;
        this.groupId = -1;
        /** @type {boolean} */
        this.enable = true;
        this.initFunc = null;
        this.releaseFunc = null;
        this.updateFunc = null;

        this._deferred = [];
    }
    init() {
        this.initFunc?.();
    }
    release() {
        this.releaseFunc?.();
    }
    update(delta) {
        this._update(delta);
        if (this._deferred.length > 0) {
            this._deferred.forEach(action => action());
            this._deferred.length = 0;
        }
    }
    _update(delta) {
        this.updateFunc?.(delta);
    }
    /**
     * 
     * @param {Function} action 
     */
    defer(action) {
        this._deferred.push(action);
    }
}