import {System} from './System.js';

/**
 * @enum {number}
 * @prop {number} PreUpdate 
 * @prop {number} FixedUpdate 
 * @prop {number} Update 
 * @prop {number} LateUpdate 
 * @prop {number} RenderUpdate 
 */
export const SystemGroupType = {
    PreUpdate: 0,
    FixedUpdate: 1,
    Update: 2,
    LateUpdate: 3,
    RenderUpdate: 4
};

/**
 * @class SystemGroup
 */
export class SystemGroup {
    /**
     * @private
     * @param {World} world 
     * @param {number} groupId 
     */
    constructor(world, groupId) {
        this._world = world;
        this.groupId = groupId;
        this._nextSystemId = 0;
        /** @type {System[]} */
        this.systems = [];
        this.systemMap = new Map();
        this._deferred = [];
    }
    /**
     * @private
     * @param {System} system 
     * @param {number} index 
     * @returns {boolean}
     */
    addSystem(system) {
        let index = system.index;
        const name = system.name;
        if (this.systemMap.has(name))
            return false;
        this.systemMap.set(name, system);

        if (index < 0) index = this._nextSystemId++;
        else if (index >= this._nextSystemId) this._nextSystemId = index + 1;

        const pos = this.systems.findIndex(sys => sys.index >= index);
        if (pos == -1) this.systems.push(system);
        else this.systems.splice(pos, 0, system);
        // system.world = this.world;
        system.index = index;
        system.groupId = this.groupId;
        return true;
    }
    removeSystem(name) {
        const system = this.systemMap.get(name);
        if (system) {
            this.systemMap.delete(name);
            const index = this.systems.indexOf(system);
            this.systems.splice(index, 1);
            // system.release()
            // system.world = undefined;
            system.index = -1;
            system.groupId = -1;
        }
        return system;
    }
    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        const systems = this.systems;
        // const world = this._world;
        for (let s = 0, sl = systems.length; s < sl; s++) {
            let system = systems[s];
            system.update(delta);
        }
        if (this._deferred.length > 0) {
            this._deferred.forEach(action => action());
            this._deferred.length = 0;
        }
    }
    /**
     * 
     * @param {Function} action 
     */
    defer(action) {
        this._deferred.push(action)
    }
}