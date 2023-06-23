import { Util } from "../utils/Util.js";
import { Archetype } from "./Archetype.js";

/**
 * @callback EntityCallback
 * @param {number} entity
 */
function compareNumbers(a, b) { return a - b }

/**
 * @class Query
 */
export class Query {
    /**
     * @static
     * @param {number[]} everyIds 
     * @param {number[]} someIds 
     * @param {number[]} notIds 
     * @param {number[]} noneIds 
     * @returns {number}
     */
    static hashCode(everyIds, someIds, notIds, noneIds) {
        // let hash = 0;
        // if (everyIds) hash += everyIds.length;
        // if (someIds) hash += someIds.length;
        // if (notIds) hash += notIds.length;
        // if (noneIds) hash += noneIds.length;
        everyIds?.sort(compareNumbers);
        someIds?.sort(compareNumbers);
        notIds?.sort(compareNumbers);
        noneIds?.sort(compareNumbers);
        // // calculate hash.
        // everyIds?.forEach((value) => hash = hash * 13 + value);
        // someIds?.forEach((value) => hash = hash * 17 + value);
        // notIds?.forEach((value) => hash = hash * 23 + value);
        // noneIds?.forEach((value) => hash = hash * 31 + value);
        const h0 = everyIds ? Util.hashCodeOfNums(...everyIds) : 0;
        const h1 = someIds ? Util.hashCodeOfNums(...someIds) : 0;
        const h2 = notIds ? Util.hashCodeOfNums(...notIds) : 0;
        const h3 = noneIds ? Util.hashCodeOfNums(...noneIds) : 0;
        let hash = Util.hashCodeOfNums(h0, h1, h2, h3);
        return hash;
    }
    /**
     * 
     * @private
     * @param {number} hash 
     * @param {number[]} everyIds 
     * @param {number[]} someIds 
     * @param {number[]} notIds 
     * @param {number[]} noneIds 
     */
    constructor(hash, everyIds, someIds, notIds, noneIds) {
        this.hash = hash;
        /** @type {Archetype[]} */
        this.archetypes = [];
        this._everyIds = everyIds;
        this._someIds = someIds;
        this._notIds = notIds;
        this._noneIds = noneIds;
        /** @type {Function[]} */
        this._deferred = [];
        /** 
         * @type {number} 
         * @private
         */
        this._refCount = 0;
    }
    _match(...cids) {
        if (this._everyIds && !this._everyIds.every(cid => cids.includes(cid))) return false;
        if (this._someIds && !this._someIds.some(cid => cids.includes(cid))) return false;
        if (this._notIds && this._notIds.some(cid => cids.includes(cid))) return false;
        if (this._noneIds && this._noneIds.every(cid => cids.includes(cid))) return false;
        return true;
    }
    /**
     * @private
     * @param {Archetype} archetype 
     * @returns {boolean}
     */
    _tryAdd(archetype) {
        let compIds = archetype.compIds;
        if (!this._match(...compIds)) return false;
        this.archetypes.push(archetype);
        return true;
    }
    /**
     * 
     * @param {EntityCallback} callbackfn 
     */
    forEach(callbackfn) {
        for (let i = this.archetypes.length - 1; i >= 0; i--) {
            const entities = this.archetypes[i].entities;
            for (let j = entities.length - 1; j >= 0; j--) {
                callbackfn(entities[j]);
            }
        }
        if (this._deferred.length > 0) {
            this._deferred.forEach(action => action());
            this._deferred.length = 0;
        }
    }
    // forEach1(callbackfn) {
    //     for (let i = this.archetypes.length - 1; i >= 0; i--) {
    //         const entities = this.archetypes[i].entities;
    //         let entity;
    //         for (let j = entities.length - 1; j >= 0; j--) {
    //             entity = entities[j];
    //             callbackfn(entity, );
    //         }
    //     }
    //     if (this._deferred.length > 0) {
    //         this._deferred.forEach(action => action());
    //         this._deferred.length = 0;
    //     }
    // }
    /**
     * 
     * @param {Function} action 
     */
    defer(action) {
        this._deferred.push(action)
    }
    /**
     * 
     * @param {Entity[]} entities 
     * @returns {Entity[]}
     */
    getEntities(entities) {
        entities ??= [];
        this.forEach((entity) => {
            entities.push(entity);
        });
        return entities;
    }
    /**
     * 
     * @returns {Entity}
     */
    getSingletonEntity() {
        let entity = -1;
        for (let i = 0, l = this.archetypes.length; i < l; i++) {
            const entities = this.archetypes[i].entities;
            if (entities.length > 0)
                entity = entities[0];
        }
        return entity;
    }
}
