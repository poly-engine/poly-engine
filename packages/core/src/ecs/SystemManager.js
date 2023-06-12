import { System } from './System.js';
import { SystemGroup } from './SystemGroup.js';

/**
 * @class SystemManager
 */
export class SystemManager {
    constructor(world) {
        this.world = world;

        //system
        /** 
         * @type {SystemGroup[]} 
         * @private
         */
        this._systemGroups = [];
        /** 
         * @type {Map<string, System>} 
         * @private
         */
        this._systemMap = new Map();
    }
    update(delta) {
        let groupId = -1;
        if (groupId < 0) {
            const groups = this._systemGroups;
            for (let s = 0, sl = groups.length; s < sl; s++) {
                groups[s]?.update(delta);
            }
        } else {
            this._systemGroups[groupId]?.update(delta)
        }
    }

    //#region System
    /**
     * 
     * @param {Object} options 
     * @param {boolean} isInit
     * @returns {System}
     */
    addSystem(options, isInit = false) {
        let name = options.name;
        let system = this._systemMap.get(name);
        if (system)
            return system;

        if (typeof options === 'function') {
            system = new options(this.world);
        }
        else if (options instanceof System) {
            system = options;
        }
        else {
            system = new System(this.world);
            system.initFunc = options.init;
            system.releaseFunc = options.release;
            system.updateFunc = options.update;
            system.enable = options.enable || true;
            system.index = options.index || -1;
            system.groupId = options.groupId || 0;
        }
        // system.world = this.world;
        system.name = name;
        let groupId = system.groupId;

        this._systemMap.set(name, system);
        // this[name] = system;
        let group = this._systemGroups[groupId];
        if (!group) {
            group = new SystemGroup(this.world, groupId);
            this._systemGroups[groupId] = group;
        }
        group.addSystem(system);
        if (isInit)
            system.init();
        return system;
    }
    removeSystem(name, isRelease = false) {
        const system = this._systemMap.get(name);
        if (system) {
            this._systemMap.delete(name);
            // delete this[name];
            let group = this._systemGroups[system.groupId];
            group?.removeSystem(name);
            if (isRelease)
                system.release();
        }
        return system;
    }
    /**
     * 
     * @param {string | Constructor} name 
     * @returns {System}
     */
    getSystem(name) {
        if (name.name)
            name = name.name;
        let system = this._systemMap.get(name);
        return system;
    }
    //#endregion
}