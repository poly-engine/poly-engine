import { SparseSet } from "../utils/Sparseset.js"

/**
 * @class Archetype
 */
export class Archetype {
    /**
     * @private
     * @param {number} id 
     * @param {number[]} cids 
     * @param {number} count 
     */
    constructor(id, cids, count) {
        this.id = id;
        this.compIds = new Array(count);
        for (let i = 0; i < count; i++)
            this.compIds[i] = cids[i];
        this.entitySet = new SparseSet();
        this.adjacent = [];
        this.entities = this.entitySet.values;
    }
    /**
     * 
     * @param {number} x 
     * @returns {boolean}
     */
    hasEntity(x) {
        return this.entitySet.has(x);
    }
    /**
     * 
     * @param {number} cid 
     * @returns {boolean}
     */
    hasComponent(cid) {
        return this.compIds.includes(cid);
    }
}
