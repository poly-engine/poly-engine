// import { Archetype } from "./archetype.js";
// import { CompType, CompStore, CompMode } from "./component.js";
// import { Query } from "./query.js";
// import { SparseSet } from "../utils/sparseset.js";
// import { System, SystemGroup } from "./system.js";

// /**
//  * @class World
//  * @param {string} id 
//  * @param {object} data 
//  */
// export class World {
//     constructor(id = "default", data = undefined) {
//         this.id = id;
//         this.data = data;
//         // this.initialized = false;

//         //archetype
//         this.rootArchetype = new Archetype(0, null, 0);
//         this._archetypes = [];
//         this._archetypes.push(this.rootArchetype);

//         //entity
//         /**
//          * @type {Archetype[]}
//          * @private
//          */
//         this._entityArchetypes = [];
//         this.deletedEntities = [];
//         this._nextEntityId = 0;
//         this._entitySet = new SparseSet();
//         this.entities = this._entitySet.values;

//         //compnent
//         this._nextCompId = 0;
//         /** 
//          * @type {Map<string, CompStore>}
//          * @private
//          */
//         this._compStoreMap = new Map;
//         /** 
//          * @type {CompStore[]} 
//          * @private
//          */
//         this._compStores = [];
//         this._tempCompIds = [];

//         //query
//         /** 
//          * @type {Map<number, Query>} 
//          * @private
//          */
//         this._queryMap = new Map;

//         //system
//         /** 
//          * @type {SystemGroup[]} 
//          * @private
//          */
//         this._systemGroups = [];
//         /** 
//          * @type {Map<string, System>} 
//          * @private
//          */
//         this._systemMap = new Map();

//         //module
//         /** 
//          * @type {Map<string, Module>} 
//          * @private
//          */
//         this._moduleMap = new Map();

//         //scene
//         this._nexSceneId = 0;
//         this._sceneMap = new Map();
//         this.activeScene = null;
//     }

//     //#region world
//     /**
//      * 
//      */
//     destroy() {
//     }
//     /**
//      * 
//      * @param {number} delta 
//      */
//     update(delta) {
//         // if (!this.initialized) return;
//         let groupId = -1;
//         if (groupId < 0) {
//             const groups = this._systemGroups;
//             for (let s = 0, sl = groups.length; s < sl; s++) {
//                 groups[s]?.update(delta);
//             }
//         } else {
//             this._systemGroups[groupId]?.update(delta)
//         }

//         //delete empty entity
//         let archetype = this.rootArchetype;
//         let entities = archetype.entities;
//         let l = entities.length;
//         if (l > 0) {
//             for (let i = l - 1; i >= 0; i--) {
//                 let entity = entities[i];
//                 this._destroyEmptyEntity(entity);
//             }
//         }
//     }
//     //#endregion

//     //#region entity
//     /**
//      * 
//      * @param  {...(StoreOrId)} storeOrIds 
//      * @returns {Entity}
//      */
//     createEntity(...storeOrIds) {
//         let compIds = this._storeOrIdsToIds(...storeOrIds);
//         const entity = this.deletedEntities.length > 0
//             ? this.deletedEntities.pop()
//             : this._nextEntityId++;
//         //add compnents
//         for (let i = 0, l = compIds.length; i < l; i++) {
//             let cid = compIds[i];
//             let store = this._compStores[cid];
//             store.set(entity);
//         }
//         //add to archetype
//         let archetype = this.getArchetype(...compIds);
//         archetype.entitySet.add(entity);
//         this._entityArchetypes[entity] = archetype;
//         this._entitySet.add(entity);
//         return entity;
//     }
//     /**
//      * @typedef {Object} Prefab
//      * @property {number[]} ents 
//      * @property {string[]} stores 
//      * @property {object[]} comps 
//      */

//     /**
//      * 
//      * @param {Prefab} prefab 
//      * @returns {Entity[]}
//      */
//     createEntities(prefab, context) {
//         let ents = prefab.ents;
//         let stores = prefab.stores;
//         let comps = prefab.comps;
//         let entMap = ents.map((ent) => this.createEntity());
//         let compStoreMap = stores.map((compName) => this.getCompStore(compName));
//         context ??= {};
//         context.world = this;
//         context.entMap = entMap;
//         // let context = { entMap: entMap };

//         for (let i = 0, l = ents.length; i < l; i++) {
//             let ent = entMap[i];
//             let entComps = ents[i];
//             for (let j = 0, jl = entComps.length; j < jl; j++) {
//                 let cid = entComps[j];
//                 let cindex = entComps[++j];
//                 let compStore = compStoreMap[cid];
//                 if (compStore.isTag)
//                     this.setComponent(ent, compStore);
//                 else {
//                     let comp = compStore.fromJson(comps[cid][cindex], context);
//                     this.setComponent(ent, compStore, comp);
//                 }
//             }
//         }
//         return entMap;
//     }
//     /**
//      * 
//      * @param {Entity[]} entities 
//      * @returns {Prefab}
//      */
//     createPrefab(entities, context) {
//         let ents = [];
//         let stores = [];
//         let comps = [];
//         let entSet = new SparseSet();
//         let compStores = [];
//         let compStoreSet = new SparseSet();
//         let sharedRefs = [];
//         let ent = 0;
//         // let entMap = [];
//         context ??= {};
//         context.world = this;
//         context.entMap = entSet.indices;
//         context.compStoreSet = compStoreSet;
//         let exportShared = context.exportShared;
//         // let context = { entMap: entSet.indices };

//         for (let i = 0, l = entities.length; i < l; i++) {
//             let entity = entities[i];
//             let archetype = this.getEntityArchetype(entity);
//             //empty entity
//             if (archetype.compIds.length === 0)
//                 continue;
//             entSet.add(entity);
//         }

//         for (let i = 0, l = entities.length; i < l; i++) {
//             let entity = entities[i];
//             // entSet.add(ent);
//             let entComps = [];
//             let archetype = this.getEntityArchetype(entity);
//             //empty entity
//             if (archetype.compIds.length === 0)
//                 continue;
//             archetype.compIds.forEach((compId) => {
//                 let compStore = this.getCompStore(compId);
//                 //only base comp
//                 if (compStore.mode !== CompMode.Base)
//                     return;
//                 let has = compStoreSet.has(compId);
//                 compStoreSet.add(compId);
//                 let index = compStoreSet.indexOf(compId);
//                 let compJson = null;
//                 if (!has) {
//                     comps[index] = [];
//                     compStores[index] = compStore;
//                     sharedRefs[index] = {};
//                 }
//                 let compDatas = comps[index];
//                 let sharedRef = sharedRefs[index];
//                 let dataIndex = compDatas.length;
//                 if (!compStore.isTag) {
//                     let comp = compStore.get(entity);
//                     // compDatas.push(compStore.toJson(comp));
//                     // comps[index][ent] = compStore.toJson(comp);
//                     if (compStore.type === CompType.Shared) {
//                         let refIndex = sharedRef[comp.id];
//                         if (refIndex === undefined) {
//                             refIndex = compDatas.length;
//                             if (exportShared === true)
//                                 // compJson = { id: comp.id };
//                                 compDatas.push({ id: comp.id });
//                             else
//                                 // compJson = compStore.toJson(comp, context);
//                                 compDatas.push(compStore.toJson(comp, context));
//                             sharedRef[comp.id] = refIndex;
//                         }
//                         dataIndex = refIndex;
//                     }
//                     else
//                         // compJson = compStore.toJson(comp, context);
//                         compDatas.push(compStore.toJson(comp, context));
//                 }
//                 entComps.push(index);
//                 entComps.push(dataIndex);
//                 // if (compJson) {
//                 //         entComps.push(index);
//                 //         entComps.push(dataIndex);
//                 //         compDatas.push(compJson);
//                 //     }
//             });
//             ents.push(entComps);
//             ent++;
//         }
//         stores = compStores.map((store) => store.name);
//         return { stores, ents, comps };
//     }
//     // createEntities(jsons) {
//     //     for (let i = 0, l = jsons.length; i < l; i++) {
//     //         let json = jsons[i];
//     //         this.createEntityFromJson(json);
//     //     }
//     // }
//     // createEntityFromJson(json){
//     //     let entity = json.id;
//     //     this.rootArchetype.entitySet.add(entity);
//     //     this._entityArchetypes[entity] = this.rootArchetype;

//     //     for(let key in json){
//     //         if(key === 'id') continue;
//     //         let comp = this[key];
//     //         if(!comp) continue;
//     //         let data = comp.create();
//     //         Object.assign(data, json[key]);
//     //         this.setComponent(entity, comp, data);
//     //     }
//     // }
//     /**
//      * 
//      * @param {Entity} entity 
//      * @returns {boolean}
//      */
//     hasEntity(entity) {
//         return this._entityArchetypes[entity] !== undefined;
//     }
//     /**
//      * 
//      * @param {Entity} entity 
//      */
//     destroyEntity(entity) {
//         // this._assertEntity(entity);
//         //remove components
//         let archetype = this._entityArchetypes[entity];
//         let cids = archetype.compIds;
//         let l = cids.length;
//         let isDestroy = true;
//         for (let i = l - 1; i >= 0; i--) {
//             let cid = cids[i];
//             let store = this._compStores[cid];
//             if (store.mode !== CompMode.State)
//                 this.removeComponent(entity, cid);
//             else
//                 isDestroy = false;
//         }
//         if (isDestroy)
//             this._destroyEmptyEntity(entity);
//     }
//     _destroyEmptyEntity(entity) {
//         this.rootArchetype.entitySet.remove(entity);
//         this._entityArchetypes[entity] = undefined;
//         this.deletedEntities.push(entity);
//         this._entitySet.remove(entity);

//         // this.entityNames[entity] = undefined;
//     }
//     /**
//      * 
//      * @param {StoreOrId} comp 
//      * @returns {Entity}
//      */
//     getSingletonEntity(comp) {
//         const store = this._storeOrIdToStore(comp);
//         if (!store || store.entities.length === 0)
//             return -1;
//         return store.entities[0];
//     }
//     //#endregion

//     //#region component
//     /**
//      * 
//      * @param {string} compName 
//      * @param {Object} options 
//      * @param {?CompType} options.type 
//      * @param {?CompMode} options.mode  
//      * @param {?Function} options.init  
//      * @param {?Function} options.fromJson  
//      * @param {?Function} options.toJson  
//      * @param {?object} options.schema  
//      * @returns {CompStore}
//      */
//     registerComponent(compName, options) {
//         let compStore = this._compStoreMap.get(compName);
//         if (compStore !== undefined)
//             return compStore;
//         var compId = this._nextCompId++;
//         compStore = new CompStore(compId, compName, options);
//         // if (options?.init) compStore._init = options?.init;
//         // if (options?.toJson) compStore._toJson = options?.toJson;
//         // if (options?.fromJson) compStore._fromJson = options?.fromJson;
//         // compStore.releaseComp = options?.releaseComp;
//         this._compStoreMap.set(compName, compStore);
//         this._compStores[compId] = compStore;
//         this[compName] = compStore;
//         return compStore;
//     }
//     /**
//      * 
//      * @param {string | number} nameOrId 
//      * @returns {CompStore}
//      */
//     getCompStore(nameOrId) {
//         if (typeof nameOrId === 'number')
//             return this._compStores[nameOrId];
//         return this._compStoreMap.get(nameOrId);
//     }
//     /**
//      * 
//      * @param {StoreOrId} storeOrId 
//      * @returns {CompStore}
//      */
//     _storeOrIdToStore(storeOrId) {
//         if (storeOrId instanceof CompStore) {
//         }
//         else if (typeof storeOrId === "number")
//             storeOrId = this._compStores[storeOrId];
//         else if (typeof storeOrId === "string")
//             storeOrId = this._compStoreMap[storeOrId];
//         return storeOrId;
//     }
//     _transformComponent(archetype, entity, store) {
//         archetype.entitySet.remove(entity);
//         archetype = this._transformArchetype(archetype, store.id);
//         archetype.entitySet.add(entity);
//         this._entityArchetypes[entity] = archetype;
//         return archetype;
//     }
//     /**
//      * @param {Entity} entity 
//      * @param {StoreOrId} storeOrId 
//      * @returns {boolean}
//      */
//     hasComponent(entity, storeOrId) {
//         const store = this._storeOrIdToStore(storeOrId);
//         return store.has(entity);
//     }
//     /**
//      * 
//      * @param {Entity} entity 
//      * @param {StoreOrId} storeOrId 
//      * @returns {object}
//      */
//     getComponent(entity, storeOrId) {
//         const store = this._storeOrIdToStore(storeOrId);
//         return store.get(entity);
//     }
//     /**
//      * 
//      * @param {Entity} entity 
//      * @param {StoreOrId} storeOrId 
//      * @param {object} comp 
//      * @returns {object}
//      */
//     setComponent(entity, storeOrId, comp) {
//         const store = this._storeOrIdToStore(storeOrId);
//         if (!store.has(entity)) {
//             const archetype = this._entityArchetypes[entity];
//             this._transformComponent(archetype, entity, store);
//         }
//         return store.set(entity, comp);
//     }
//     /**
//      * 
//      * @param {Entity} entity 
//      * @param {StoreOrId} comp 
//      * @returns {boolean}
//      */
//     removeComponent(entity, comp) {
//         const store = this._storeOrIdToStore(comp);
//         if (!store.has(entity))
//             return false;
//         let archetype = this._entityArchetypes[entity];
//         archetype = this._transformComponent(archetype, entity, store);
//         store.remove(entity);
//         return true;
//     }
//     getSingleton(comp) {
//         const store = this._storeOrIdToStore(comp);
//         if (!store || store.entities.length === 0)
//             return undefined;
//         return store.get(store.entities[0]);
//     }
//     hasSingleton(comp) {
//         return this.getSingletonEntity(comp) >= 0;
//     }
//     /**
//      * 
//      * @param {Entity} entity 
//      * @returns {CompStore[]}
//      */
//     getCompStores(entity) {
//         // let stores = [];
//         let compIds = this._entityArchetypes[entity].compIds;
//         return compIds.map((compId) => this.getCompStore(compId));
//     }
//     //#endregion

//     //#region archetype
//     /**
//      * @private
//      * @param {Archetype} archetype 
//      * @param {number} compId 
//      * @returns {Archetype}
//      */
//     _transformArchetype(archetype, compId) {
//         let nextArch = archetype.adjacent[compId];
//         if (nextArch !== undefined)
//             return nextArch;
//         let cids = archetype.compIds;
//         let added = false;
//         let length = 0;
//         for (let i = 0; i < cids.length; i++) {
//             let cid = cids[i];
//             if (!added && compId <= cid) {
//                 added = true;
//                 if (compId === cid) continue;
//                 this._tempCompIds[length++] = compId;
//             }
//             this._tempCompIds[length++] = cid;
//         }
//         if (!added)
//             this._tempCompIds[length++] = compId;
//         nextArch = this._getArchetype(this._tempCompIds, length);
//         archetype.adjacent[compId] = nextArch;
//         nextArch.adjacent[compId] = archetype;
//         return nextArch;
//     }
//     /**
//      * 
//      * @private
//      * @param {number[]} compIds 
//      * @param {number} count 
//      * @returns {Archetype}
//      */
//     _getArchetype(compIds, count) {
//         let curArch = this.rootArchetype;
//         count ??= compIds.length;
//         if (compIds === null || count === 0)
//             return curArch;
//         for (let i = 0; i < count; i++) {
//             // archetype = this._transformArchetype(archetype, cids[i]!)
//             let cid = compIds[i];
//             let nextArch = curArch.adjacent[cid];
//             if (!nextArch) {
//                 let nextArchId = this._archetypes.length;
//                 nextArch = new Archetype(nextArchId, compIds, i + 1);
//                 nextArch.adjacent[cid] = curArch;
//                 curArch.adjacent[cid] = nextArch;
//                 this._archetypes.push(nextArch);

//                 // this._onArchetypeCreated(nextArch);
//                 for (let query of this._queryMap.values()) {
//                     query._tryAdd(nextArch);
//                 }
//             }
//             curArch = nextArch;
//         }
//         return curArch;
//     }
//     /**
//      * 
//      * @param  {...Entity} compIds 
//      * @returns {Archetype}
//      */
//     getArchetype(...compIds) {
//         let archetype = this.rootArchetype;
//         if (compIds === undefined || compIds.length === 0)
//             return archetype;
//         var count = compIds.length;
//         if (count > 1) compIds.sort((a, b) => a - b);
//         return this._getArchetype(compIds, count);
//     }
//     /**
//      * 
//      * @param  {Entity} entity 
//      * @returns {Archetype}
//      */
//     getEntityArchetype(entity) {
//         return this._entityArchetypes[entity];
//     }
//     //#endregion

//     //#region Query
//     /**
//      * @private
//      * @param {...(StoreOrId)} storeOrIds 
//      */
//     _storeOrIdsToIds(...storeOrIds) {
//         return storeOrIds?.map((storeOrId) => this._storeOrIdToStore(storeOrId).id);
//     }
//     /**
//      * 
//      * @param {string} id 
//      * @param {object} options 
//      * @param {?StoreOrId[]} options.all 
//      * @param {?StoreOrId[]} options.any 
//      * @param {?StoreOrId[]} options.not 
//      * @param {?StoreOrId[]} options.none 
//      * @returns {Query}
//      */
//     createQuery(id, options) {
//         let query = this[id];
//         if (query !== undefined)
//             return query;

//         let everyIds = options.all && this._storeOrIdsToIds(...options.all);
//         let someIds = options.any && this._storeOrIdsToIds(...options.any);
//         let notIds = options.not && this._storeOrIdsToIds(...options.not);
//         let noneIds = options.none && this._storeOrIdsToIds(...options.none);
//         let hash = Query.hashCode(everyIds, someIds, notIds, noneIds);
//         query = this._queryMap.get(hash);
//         if (query !== undefined) {
//             query.refCount++;
//             return query;
//         }
//         query = new Query(hash, everyIds, someIds, notIds, noneIds);
//         this._queryMap.set(hash, query);
//         this[id] = query;
//         this._archetypes.forEach((archetype) => {
//             query._tryAdd(archetype);
//         })
//         return query;
//     }
//     //#endregion

//     //#region System
//     /**
//      * 
//      * @param {string} name 
//      * @param {any} options 
//      * @returns {System}
//      */
//     addSystem(name, options) {
//         let system = this._systemMap.get(name);
//         if (system)
//             return system;

//         // if (!!systemOrFunc.prototype && systemOrFunc.prototype.constructor === systemOrFunc)
//         //     system = new systemOrFunc(this, name);
//         // else
//         //     system = new System(this, name, systemOrFunc);
//         system = new System(this, name, options.update);
//         let enable = options?.enable || true;
//         let index = options?.index || -1;
//         let groupId = options?.groupId || 0;

//         this._systemMap.set(name, system);
//         this[name] = system;
//         let group = this._systemGroups[groupId];
//         if (!group) {
//             group = new SystemGroup(this, groupId);
//             this._systemGroups[groupId] = group;
//         }
//         group.addSystem(system, index);
//         system.groupId = groupId;
//         system.enable = enable;
//         return system;
//     }
//     removeSystem(name) {
//         const system = this._systemMap.get(name);
//         if (system) {
//             this._systemMap.delete(name);
//             delete this[name];
//             let group = this._systemGroups[system.groupId];
//             group?.removeSystem(name);
//             // if (this.initialized)
//             //     system.release && system.release(this);
//         }
//         return system;
//     }
//     getSystem(name) {
//         let system = this._systemMap.get(name);
//         return system;
//     }
//     //#endregion

//     //#region module
//     /**
//      * 
//      * @param {string} name 
//      * @param {Module} module 
//      * @param {object} settings 
//      */
//     addModule(name, module, settings) {
//         let oldModule = this._moduleMap.get(name);
//         if (oldModule)
//             oldModule.release();
//         module.init(this, settings);
//         this._moduleMap.set(name, module);
//         this[name] = module;
//     }
//     //#endregion

//     //#region scene
//     loadScene(json, isAdditive) {

//     }
//     unloadScene(name) {

//     }
//     setActiveScene(sceneOrId) {

//     }
//     getScene(name) {

//     }
//     //#endregion
// }