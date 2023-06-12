import { SparseSet } from "../utils/Sparseset.js";
import { Util } from "../utils/Util.js";
import { CompBuffer } from "./CompBuffer.js";

/**
 * @typedef {(CompStore | string | number)} StoreOrId
 */
/**
 * @enum {number}
 * @prop {number} Common 
 * @prop {number} Tag 
 * @prop {number} Shared 
 * @prop {number} Buffered 
 */
export const CompType = {
    Common: 0,
    Tag: 1,
    Shared: 2,
    Buffered: 3,
    // Group: 4
}
/**
 * @enum {number}
 * @prop {number} Base 
 * @prop {number} State 
 * @prop {number} Event 
 * @prop {number} Command 
 * @prop {number} Flag 
 */
export const CompMode = {
    Base: 0,
    State: 1,
    Event: 2,
    Command: 3,
    Flag: 4
}
class SharedRefInfo {
    constructor(comp) {
        this.comp = comp;
        this.entities = [];
        this.refCount = 0;
    }
    addRef(entity) {
        this.refCount++;
        this.entities.push(entity);
    }
    removeRef(entity) {
        let index = this.entities.indexOf(entity);
        if (index < 0)
            return;
        this.refCount--;
        this.entities.splice(index, 1);
    }
}
/**
 * @class CompStore
 */
export class CompStore {
    /**
     * @private
     * @param {number} id 
     * @param {string} name 
     * @param {?number} type 
     * @param {?number} mode 
     */
    constructor(id, name, options) {
        /** @type {number} */
        this.id = id;
        /** @type {string} */
        this.name = name;
        /** @type {number} */
        this.type = options?.type || CompType.Common;
        /** @type {number} */
        this.mode = options?.mode || CompMode.Base;
        this.schema = options?.schema;

        this.compPool = [];
        this.bufPool = [];
        this.comps = [];
        this.entitySet = new SparseSet();
        this.entities = this.entitySet.values;

        this.sharedCompMap = new Map();

        this.tag = Object.create(null);
        this.isTag = this.type === CompType.Tag;

        this._world = null;
        this.group = options?.group;
    }
    _createBuffer() {
        let buf = this.bufPool.length > 0 ? this.bufPool.pop() : new CompBuffer(this);
        return buf;
    }
    _destroyBuffer(buf) {
        buf.clear();
        this.bufPool.push(buf);
    }
    create(...args) {
        if (this.isTag)
            return this.tag;
        let comp = undefined;
        if (this.compPool.length > 0)
            comp = this.compPool.pop();
        else
            // comp = Object.create(null);
            comp = this._world.cloneManager.createObj(this.schema, comp);
        this._world.cloneManager.initObjFromArgs(this.schema, comp, ...args);
        return comp;
    }

    _destroy(comp) {
        if (this.isTag) return;
        comp = this._world.cloneManager.createObj(this.schema, comp);
        // this._init && this._init(comp);
        // this.releaseComp && this.releaseComp(comp);
        this.compPool.push(comp);
    }

    fromJson(json, context) {
        if (this.isTag)
            return this.tag;
        if (Array.isArray(json)) {
            if (this.type === CompType.Buffered) {
                //buffer
                let buffer = this._createBuffer();
                for (let i = 0, l = json.length; i < l; i++) {
                    let comp = this.create();
                    this._world.cloneManager.loadObjFromJson(this.schema, comp, json[i], context);
                    // this._fromJson(comp, json[i], context);
                    // let comp = this.fromJson(json[i]);
                    buffer.add(comp);
                }
                return buffer;
            }
            return undefined;
        }
        else {
            let comp = this.create();
            this._world.cloneManager.loadObjFromJson(this.schema, comp, json, context);
            // this._fromJson(comp, json, context);
            return comp;
        }
    }
    toJson(comp, context) {
        if (this.isTag)
            return {};
        if (this.type === CompType.Buffered) {
            let buffer = comp;
            let array = [];
            for (let i = 0, l = buffer.length; i < l; i++) {
                // let json = this._toJson(buffer.get(i), null, context);
                let json = this._world.cloneManager.saveObjToJson(this.schema, buffer.get(i), context);
                array.push(json);
            }
            return array;
        }
        else {
            let json = this._world.cloneManager.saveObjToJson(this.schema, comp, context);
            // let json = this._toJson(comp, null, context);
            return json;
        }
    }

    /**
     * 
     * @param {Entity} entity 
     * @return {object}
     */
    get(entity) {
        return this.comps[entity];
    }
    /**
     * 
     * @param {Entity} entity 
     * @return {boolean}
     */
    has(entity) {
        return this.comps[entity] !== undefined;
    }
    /**
     * 
     * @private
     * @param {Entity} entity 
     * @param {object} comp 
     * @returns {object}
     */
    set(entity, comp) {
        let oldComp = this.comps[entity];
        if (oldComp && oldComp === comp)
            return comp;
        if (oldComp)
            this.remove(entity);

        if (this.type === CompType.Buffered) {
            comp ??= this._createBuffer();
        }
        else {
            comp ??= this.create();
            if (this.type === CompType.Shared) {
                comp.id ??= Util.createUUID();
                let compId = comp.id;
                let refInfo = this.sharedCompMap.get(compId);
                if (!refInfo) {
                    refInfo = new SharedRefInfo(comp);
                    this.sharedCompMap.set(compId, refInfo);
                }
                else
                    comp = refInfo.comp;
                refInfo.addRef(entity);
            }

        }
        this.comps[entity] = comp;
        this.entitySet.add(entity);
        return comp;
    }
    /**
     * 
     * @private
     * @param {Entity} entity 
     * @returns {void}
     */
    remove(entity) {
        let comp = this.comps[entity];
        if (!comp)
            return false;
        this.comps[entity] = undefined;
        this.entitySet.remove(entity);
        if (this.type === CompType.Buffered) {
            this._destroyBuffer(comp);
        }
        else {
            if (this.type === CompType.Shared) {
                let compId = comp.id;
                let sharedCompData = this.sharedCompMap.get(compId);
                if (sharedCompData) {
                    sharedCompData.removeRef(entity);
                    if (sharedCompData.refCount > 0)
                        return true;
                    this.sharedCompMap.delete(compId);
                }
            }
            this._destroy(comp);
        }
        return true;
    }

    //#region shared component
    getShared(id) {
        if (this.type !== CompType.Shared) return undefined;
        return this.sharedCompMap.get(id)?.comp;
    }
    getSharedEntity(id) {
        if (this.type !== CompType.Shared) return -1;
        let refInfo = this.sharedCompMap.get(id);
        if (!refInfo)
            return -1;
        return refInfo.entities[0];
    }
    getSharedRefInfo(id) {
        if (this.type !== CompType.Shared) return undefined;
        return this.sharedCompMap.get(id);
    }
    //#endregion

}