import { Event } from "../utils/Event.js";
import { SparseSet } from "../utils/Sparseset.js";
import { Archetype } from "./Archetype.js";
import { CompMode, CompStore, CompType } from "./CompStore.js";

/**
 * @typedef {number} Entity
 */


export function isValidEntity(entity) {
    return entity !== undefined && entity >= 0;
}

/**
 * @class EntityManager
 * @param {World} world 
 */
export class EntityManager {
    constructor(world) {
        /** @type {World}*/
        this.world = world;
        // /** @type {ComponentManager}*/
        // this._compManager = world.componentManager;

        //archetype
        this.rootArchetype = new Archetype(0, null, 0);
        this._archetypes = [];
        this._archetypes.push(this.rootArchetype);

        //entity
        /**
         * @type {Archetype[]}
         * @private
         */
        this._entityArchetypes = [];
        this.deletedEntities = [];
        this._nextEntityId = 0;
        this._entitySet = new SparseSet();
        this.entities = this._entitySet.values;

        this._tempCompIds = [];

        this.entityCreatedEvent = new Event();
        this.entityDestroyedEvent = new Event();

        //compnent
        this._nextCompId = 0;
        /** 
         * @type {Map<string, CompStore>}
         * @private
         */
        this._compStoreMap = new Map;
        /** 
         * @type {CompStore[]} 
         * @private
         */
        this._compStores = [];
    }
    update(delta) {
        //remove all event components
        //TODO add event component store to list.
        for (let i = 0; i < this._compStores.length; i++) {
            const store = this._compStores[i];
            const compId = store.id;
            if (store.mode === CompMode.Event) {
                for (let j = store.entities.length - 1; j >= 0; j--) {
                    const entity = store.entities[j];
                    this.removeComponent(entity, compId);
                }
            }
        }
        //delete empty entity
        let archetype = this.rootArchetype;
        let entities = archetype.entities;
        let l = entities.length;
        if (l > 0) {
            for (let i = l - 1; i >= 0; i--) {
                let entity = entities[i];
                this._destroyEmptyEntity(entity);
            }
        }
    }

    //#region archetype
    /**
     * 
     * @private
     * @param {Entity} entity 
     * @param {number} compId 
     * @returns {Archetype}
     */
    _transformComponent(entity, compId) {
        let archetype = this._entityArchetypes[entity];
        archetype.entitySet.remove(entity);
        archetype = this._transformArchetype(archetype, compId);
        archetype.entitySet.add(entity);
        this._entityArchetypes[entity] = archetype;
        return archetype;
    }
    /**
     * @private
     * @param {Archetype} archetype 
     * @param {number} compId 
     * @returns {Archetype}
     */
    _transformArchetype(archetype, compId) {
        let nextArch = archetype.adjacent[compId];
        if (nextArch !== undefined)
            return nextArch;
        let cids = archetype.compIds;
        let added = false;
        let length = 0;
        for (let i = 0; i < cids.length; i++) {
            let cid = cids[i];
            if (!added && compId <= cid) {
                added = true;
                if (compId === cid) continue;
                this._tempCompIds[length++] = compId;
            }
            this._tempCompIds[length++] = cid;
        }
        if (!added)
            this._tempCompIds[length++] = compId;
        nextArch = this._getArchetype(this._tempCompIds, length);
        archetype.adjacent[compId] = nextArch;
        nextArch.adjacent[compId] = archetype;
        return nextArch;
    }
    /**
     * 
     * @private
     * @param {number[]} compIds 
     * @param {number} count 
     * @returns {Archetype}
     */
    _getArchetype(compIds, count) {
        let curArch = this.rootArchetype;
        count ??= compIds.length;
        if (compIds === null || count === 0)
            return curArch;
        for (let i = 0; i < count; i++) {
            // archetype = this._transformArchetype(archetype, cids[i]!)
            let cid = compIds[i];
            let nextArch = curArch.adjacent[cid];
            if (!nextArch) {
                let nextArchId = this._archetypes.length;
                nextArch = new Archetype(nextArchId, compIds, i + 1);
                nextArch.adjacent[cid] = curArch;
                curArch.adjacent[cid] = nextArch;
                this._archetypes.push(nextArch);

                // this._onArchetypeCreated(nextArch);
                const queryManager = this.world.queryManager;
                for (let query of queryManager._queryMap.values()) {
                    query._tryAdd(nextArch);
                }
            }
            curArch = nextArch;
        }
        return curArch;
    }
    /**
     * 
     * @param  {...Entity} compIds 
     * @returns {Archetype}
     */
    getArchetype(...compIds) {
        let archetype = this.rootArchetype;
        if (compIds === undefined || compIds.length === 0)
            return archetype;
        var count = compIds.length;
        if (count > 1) compIds.sort((a, b) => a - b);
        return this._getArchetype(compIds, count);
    }
    /**
     * 
     * @param  {Entity} entity 
     * @returns {Archetype}
     */
    getEntityArchetype(entity) {
        return this._entityArchetypes[entity];
    }
    //#endregion

    //#region entity
    /**
     * 
     * @param  {...(number)} compIds 
     * @returns {Entity}
     */
    createEntity(...compIds) {
        // const compManager = this.world.componentManager;
        // let compIds = compManager._storeOrIdsToIds(...storeOrIds);
        const entity = this.deletedEntities.length > 0
            ? this.deletedEntities.pop()
            : this._nextEntityId++;
        //add compnents
        for (let i = 0, l = compIds.length; i < l; i++) {
            let cid = compIds[i];
            let store = this._compStores[cid];
            // let store = compManager.getCompStore(cid);
            store.set(entity);
        }
        //add to archetype
        let archetype = this.getArchetype(...compIds);
        archetype.entitySet.add(entity);
        this._entityArchetypes[entity] = archetype;
        this._entitySet.add(entity);
        return entity;
    }

    /**
     * 
     * @param {Entity | null} entity 
     * @param {object} data 
     * @param {object} context 
     * @returns {Entity}
     */
    entityFromJson(entity, data, context) {
        // const entity = this.createEntity();
        entity ??= this.createEntity();
        for (let compName in data) {
            const compId = this.getComponentId(compName);
            let comp = this.setComponentByJson(entity, compId, data[compName], context);
            // console.log(comp);
        }
        return entity;
    }
    /**
     * 
     * @param {Entity} entity 
     * @param {object | null} json 
     * @param {object} context 
     * @returns {object}
     */
    entityToJson(entity, json, context) {
        let archetype = this.getEntityArchetype(entity);
        const compIds = archetype.compIds;
        // //empty entity
        // if (compIds.length === 0)
        //     return null;

        json ??= Object.create(null);
        for (let i = 0; i < compIds.length; i++) {
            const compId = compIds[i];
            const store = this._compStores[compId];
            //only base comp
            if (store.mode !== CompMode.Base)
                continue;
            json[store.name] = store.toJson(store.get(entity), context);
        }
        return json;
    }
    /**
     * 
     * @param {object[]} datas 
     * @param {object} context 
     * @returns {Entity[]}
     */
    entitiesFromJson(datas, context) {
        const entMap = datas.map((data) => this.createEntity());
        context ??= {};
        context.world = this;
        context.entMap = entMap;

        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const entity = entMap[i];
            this.entityFromJson(entity, data, context);
            // for (let compName in data) {
            //     const compId = this.getComponentId(compName);
            //     let comp = this.setComponentByJson(entity, compId, data[compName], context);
            //     // console.log(comp);
            // }
        }
        return entMap;
    }
    /**
     * 
     * @param {Entity[]} entities 
     * @param {object} context 
     * @returns {object[]}
     */
    entitiesToJson(entities, context) {
        const jsons = [];
        const entSet = new SparseSet();
        entities.forEach((ent) => entSet.add(ent));
        context ??= {};
        context.world = this;
        context.entMap = entSet.indices;

        // for (let i = 0, l = entities.length; i < l; i++) {
        //     let entity = entities[i];
        //     let archetype = this.getEntityArchetype(entity);
        //     //empty entity
        //     if (archetype.compIds.length === 0)
        //         continue;
        //     entSet.add(entity);
        // }
        for (let i = 0, l = entities.length; i < l; i++) {
            let entity = entities[i];
            const json = this.entityToJson(entity, null, context);
            if (json != null)
                jsons.push(json);
        }
        return jsons;
    }

    /**
     * 
     * @param {Entity} entity 
     * @returns {boolean}
     */
    hasEntity(entity) {
        return this._entityArchetypes[entity] !== undefined;
    }
    /**
     * 
     * @param {Entity} entity 
     */
    destroyEntity(entity) {
        // const compManager = this.world.componentManager;
        // this._assertEntity(entity);
        //remove components
        let archetype = this._entityArchetypes[entity];
        let cids = archetype.compIds;
        let l = cids.length;
        let isDestroy = true;
        for (let i = l - 1; i >= 0; i--) {
            let cid = cids[i];
            let store = this._compStores[cid];
            // let store = compManager.getCompStore(cid);
            if (store.mode !== CompMode.State)
                this.removeComponent(entity, cid);
            else
                isDestroy = false;
        }
        if (isDestroy)
            this._destroyEmptyEntity(entity);
    }
    _destroyEmptyEntity(entity) {
        this.rootArchetype.entitySet.remove(entity);
        this._entityArchetypes[entity] = undefined;
        this.deletedEntities.push(entity);
        this._entitySet.remove(entity);

        // this.entityNames[entity] = undefined;
    }
    /**
     * 
     * @param {number} compId 
     * @returns {Entity}
     */
    getSingletonEntity(compId) {
        const store = this._compStores[compId];
        // const store = storeOrId;
        if (!store || store.entities.length === 0)
            return -1;
        return store.entities[0];
    }
    //#endregion

    //#region prefab
    /**
     * @typedef {Object} Prefab
     * @property {number[]} ents 
     * @property {string[]} stores 
     * @property {object[]} comps 
     */

    /**
     * 
     * @param {Prefab} prefab 
     * @returns {Entity[]}
     */
    createEntitiesFromPrefab(prefab, context) {
        // const compManager = this.world.componentManager;
        let ents = prefab.ents;
        let stores = prefab.stores;
        let comps = prefab.comps;
        let entMap = ents.map((ent) => this.createEntity());
        // let compStoreMap = stores.map((compName) => compManager.getCompStore(compName));
        let compStoreMap = stores.map((compName) => this._compStoreMap.get(compName));
        context ??= {};
        context.world = this;
        context.entMap = entMap;

        for (let i = 0, l = ents.length; i < l; i++) {
            let ent = entMap[i];
            let entComps = ents[i];
            for (let j = 0, jl = entComps.length; j < jl; j++) {
                let cid = entComps[j];
                let cindex = entComps[++j];
                let compStore = compStoreMap[cid];
                if (compStore.isTag)
                    this.setComponent(ent, compStore.id);
                else {
                    let comp = compStore.fromJson(comps[cid][cindex], context);
                    this.setComponent(ent, compStore.id, comp);
                }
            }
        }
        return entMap;
    }
    /**
     * 
     * @param {Entity[]} entities 
     * @returns {Prefab}
     */
    createPrefabFromEntities(entities, context) {
        // const compManager = this.world.componentManager;
        let ents = [];
        let stores = [];
        let comps = [];
        let entSet = new SparseSet();
        let compStores = [];
        let compStoreSet = new SparseSet();
        let sharedRefs = [];
        let ent = 0;
        // let entMap = [];
        context ??= {};
        context.world = this;
        context.entMap = entSet.indices;
        context.compStoreSet = compStoreSet;
        let exportShared = context.exportShared;
        // let context = { entMap: entSet.indices };

        for (let i = 0, l = entities.length; i < l; i++) {
            let entity = entities[i];
            let archetype = this.getEntityArchetype(entity);
            //empty entity
            if (archetype.compIds.length === 0)
                continue;
            entSet.add(entity);
        }

        for (let i = 0, l = entities.length; i < l; i++) {
            let entity = entities[i];
            // entSet.add(ent);
            let entComps = [];
            let archetype = this.getEntityArchetype(entity);
            //empty entity
            if (archetype.compIds.length === 0)
                continue;
            archetype.compIds.forEach((compId) => {
                // let compStore = compManager.getCompStore(compId);
                let compStore = this._compStores[compId];
                //only base comp
                if (compStore.mode !== CompMode.Base)
                    return;
                let has = compStoreSet.has(compId);
                compStoreSet.add(compId);
                let index = compStoreSet.indexOf(compId);
                let compJson = null;
                if (!has) {
                    comps[index] = [];
                    compStores[index] = compStore;
                    sharedRefs[index] = {};
                }
                let compDatas = comps[index];
                let sharedRef = sharedRefs[index];
                let dataIndex = compDatas.length;
                if (!compStore.isTag) {
                    let comp = compStore.get(entity);
                    // compDatas.push(compStore.toJson(comp));
                    // comps[index][ent] = compStore.toJson(comp);
                    if (compStore.type === CompType.Shared) {
                        let refIndex = sharedRef[comp.id];
                        if (refIndex === undefined) {
                            refIndex = compDatas.length;
                            if (exportShared === true)
                                // compJson = { id: comp.id };
                                compDatas.push({ id: comp.id });
                            else
                                // compJson = compStore.toJson(comp, context);
                                compDatas.push(compStore.toJson(comp, context));
                            sharedRef[comp.id] = refIndex;
                        }
                        dataIndex = refIndex;
                    }
                    else
                        // compJson = compStore.toJson(comp, context);
                        compDatas.push(compStore.toJson(comp, context));
                }
                entComps.push(index);
                entComps.push(dataIndex);
                // if (compJson) {
                //         entComps.push(index);
                //         entComps.push(dataIndex);
                //         compDatas.push(compJson);
                //     }
            });
            ents.push(entComps);
            ent++;
        }
        stores = compStores.map((store) => store.name);
        return { stores, ents, comps };
    }
    //#endregion

    //#region component
    /**
     * 
     * @param {string} compName 
     * @param {Object} options 
     * @param {?CompType} options.type 
     * @param {?CompMode} options.mode  
     * @param {?object} options.schema  
     * @returns {number}
     */
    registerComponent(compName, options) {
        let compStore = this._compStoreMap.get(compName);
        if (compStore !== undefined)
            return compStore;
        var compId = this._nextCompId++;
        compStore = new CompStore(compId, compName, options);
        compStore._world = this.world;
        this._compStoreMap.set(compName, compStore);
        this._compStores[compId] = compStore;
        // this[compName] = compStore;
        return compId;
    }
    /**
     * 
     * @param {number} compId 
     * @returns {CompStore}
     */
    getCompStore(compId) {
        return this._compStores[compId];
    }
    getComponentId(compName) {
        return this._compStoreMap.get(compName)?.id;
    }
    getComponentName(compId) {
        return this._compStores[compId]?.name;
    }

    createComponent(compId, ...args) {
        const store = this._compStores[compId];
        return store.create(...args);
    }
    componentFromJson(compId, json, context) {
        const store = this._compStores[compId];
        return store.fromJson(json, context);
    }
    componentToJson(compId, comp, context) {
        const store = this._compStores[compId];
        return store.toJson(comp, context);
    }

    /**
     * @param {Entity} entity 
     * @param {number} compId 
     * @returns {boolean}
     */
    hasComponent(entity, compId) {
        const store = this._compStores[compId];
        return store.has(entity);
    }
    /**
     * 
     * @param {Entity} entity 
     * @param {number} compId 
     * @returns {object}
     */
    getComponent(entity, compId) {
        const store = this._compStores[compId];
        return store.get(entity);
    }
    /**
     * 
     * @param {Entity} entity 
     * @param {number} compId 
     * @param {object} comp 
     * @returns {object}
     */
    setComponent(entity, compId, comp) {
        const store = this._compStores[compId];
        if (!store.has(entity)) {
            // const archetype = this._entityArchetypes[entity];
            if (store.group) {
                let oldCompId = this.getComponentIdByGroup(entity, store.group);
                if (oldCompId)
                    this.removeComponent(entity, oldCompId);
            }
            this._transformComponent(entity, store.id);
        }
        return store.set(entity, comp);
    }
    setComponentByArgs(entity, compId, ...args) {
        const store = this._compStores[compId];
        let comp = store.create(...args);
        return this.setComponent(entity, compId, comp);
    }
    setComponentByJson(entity, compId, json, context) {
        const store = this._compStores[compId];
        let comp = null;
        if (store.type === CompType.Buffered) {
            comp = this.setComponent(entity, compId);
            for (let i = 0; i < json.length; i++)
                comp.add(store.fromJson(json[i], context));
        }
        else {
            comp = store.fromJson(json, context);
            this.setComponent(entity, compId, comp);
        }
        return comp;
    }
    /**
     * 
     * @param {Entity} entity 
     * @param {number} compId 
     * @returns {boolean}
     */
    removeComponent(entity, compId) {
        const store = this._compStores[compId];
        if (!store.has(entity))
            return false;
        let archetype = this._transformComponent(entity, store.id);
        store.remove(entity);
        return true;
    }
    getSharedComponent(compId, id) {
        const store = this._compStores[compId];
        return store.getShared(id);
    }
    getSharedEntity(compId, id) {
        const store = this._compStores[compId];
        return store.getSharedEntity(id);
    }
    getSingletonComponent(compId) {
        const store = this._compStores[compId];
        if (!store || store.entities.length === 0)
            return undefined;
        return store.get(store.entities[0]);
    }
    hasSingletonComponent(compId) {
        const store = this._compStores[compId];
        return store && store.entities.length > 0;
    }
    // /**
    //  * 
    //  * @param {Entity} entity 
    //  * @returns {CompStore[]}
    //  */
    // getCompStores(entity) {
    //     // let stores = [];
    //     let compIds = this._entityArchetypes[entity].compIds;
    //     return compIds.map((compId) => this.getCompStore(compId));
    // }
    _getCompStoreByGroup(entity, group) {
        let compIds = this._entityArchetypes[entity].compIds;
        for (let i = 0; i < compIds.length; i++) {
            let cid = compIds[i];
            let store = this.getCompStore(cid);
            if (store.group === group)
                return store;
        }
        return undefined;
    }
    getComponentIdByGroup(entity, group) {
        return this._getCompStoreByGroup(entity, group)?.id;
    }
    getComponentByGroup(entity, group) {
        return this._getCompStoreByGroup(entity, group)?.get(entity);
    }
    //#endregion
}