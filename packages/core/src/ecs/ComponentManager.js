// import { SparseSet } from "../utils/Sparseset.js";
// import { Util } from "../utils/Util.js";
// import { CompStore } from "./CompStore.js";
// import { vec2, Vec3, vec4, quat } from "../math/index.js";

// const isArray = Array.isArray;
// const objectKeys = Object.keys;
// export class ComponentManager {
//     constructor(world) {
//         this.world = world;
//         this._entityManager = world.entityManager;

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

//         // this._propHandlerMap = new Map;
//     }

//     //#region component
//     /**
//      * 
//      * @param {string} compName 
//      * @param {Object} options 
//      * @param {?CompType} options.type 
//      * @param {?CompMode} options.mode  
//      * @param {?object} options.schema  
//      * @returns {CompStore}
//      */
//     registerComponent(compName, options) {
//         let compStore = this._compStoreMap.get(compName);
//         if (compStore !== undefined)
//             return compStore;
//         var compId = this._nextCompId++;
//         compStore = new CompStore(compId, compName, options);
//         compStore._world = this.world;
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
//      * @private
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
//     /**
//      * @private
//      * @param {...(StoreOrId)} storeOrIds 
//      */
//     _storeOrIdsToIds(...storeOrIds) {
//         return storeOrIds?.map((storeOrId) => this._storeOrIdToStore(storeOrId).id);
//     }

//     // _createBuffer(store) {
//     //     let buf = store.bufPool.length > 0 ? store.bufPool.pop() : new CompBuffer(this);
//     //     return buf;
//     // }
//     // _destroyBuffer(store, buf) {
//     //     buf.clear();
//     //     store.bufPool.push(buf);
//     // }
//     // createComp(store, ...args) {
//     //     if (store.isTag)
//     //         return store.tag;
//     //     let comp = undefined;
//     //     if (this.compPool.length > 0)
//     //         comp = store.compPool.pop();
//     //     else
//     //         comp = this._createObj(store.schema, comp);
//     //     // this._init && this._init(comp, ...args);
//     //     if (args && args.length > 0)
//     //         this._initObjFromArgs(store.schema, comp, ...args);
//     //     return comp;
//     // }
//     // _destroyComp(store, comp) {
//     //     if (this.isTag) return;
//     //     comp = this._createObj(store.schema, comp);
//     //     // this._init && this._init(comp);
//     //     // this.releaseComp && this.releaseComp(comp);
//     //     this.compPool.push(comp);
//     // }

//     // getComp(store, entity) {
//     //     return store.comps[entity];
//     // }
//     // hasComp(store, entity) {
//     //     return store.comps[entity] !== undefined;
//     // }
//     // setComp(store, entity, comp) {
//     //     let oldComp = store.comps[entity];
//     //     if (oldComp && oldComp === comp)
//     //         return comp;
//     //     if (oldComp)
//     //         this.removeComp(entity);

//     //     if (store.type === CompType.Buffered) {
//     //         comp ??= store._createBuffer();
//     //     }
//     //     else {
//     //         comp ??= store.createComp();
//     //         if (store.type === CompType.Shared) {
//     //             comp.id ??= Util.createUUID();
//     //             let compId = comp.id;
//     //             let refInfo = store.sharedCompMap.get(compId);
//     //             if (!refInfo) {
//     //                 refInfo = new SharedRefInfo(comp);
//     //                 store.sharedCompMap.set(compId, refInfo);
//     //             }
//     //             else
//     //                 comp = refInfo.comp;
//     //             refInfo.addRef(entity);
//     //         }
//     //     }
//     //     store.comps[entity] = comp;
//     //     store.entitySet.add(entity);
//     //     return comp;
//     // }
//     // /**
//     //  * 
//     //  * @private
//     //  * @param {Entity} entity 
//     //  * @returns {void}
//     //  */
//     // removeComp(store, entity) {
//     //     let comp = store.comps[entity];
//     //     if (!comp)
//     //         return false;
//     //     store.comps[entity] = undefined;
//     //     store.entitySet.remove(entity);
//     //     if (store.type === CompType.Buffered) {
//     //         store._destroyBuffer(comp);
//     //     }
//     //     else {
//     //         if (store.type === CompType.Shared) {
//     //             let compId = comp.id;
//     //             let sharedCompData = store.sharedCompMap.get(compId);
//     //             if (sharedCompData) {
//     //                 sharedCompData.removeRef(entity);
//     //                 if (sharedCompData.refCount > 0)
//     //                     return true;
//     //                 store.sharedCompMap.delete(compId);
//     //             }
//     //         }
//     //         store._destroyComp(comp);
//     //     }
//     //     return true;
//     // }
//     // //#region shared component
//     // getSharedComp(store, id) {
//     //     if (store.type !== CompType.Shared) return undefined;
//     //     return store.sharedCompMap.get(id)?.comp;
//     // }
//     // getSharedEntity(store, id) {
//     //     if (store.type !== CompType.Shared) return -1;
//     //     let refInfo = store.sharedCompMap.get(id);
//     //     if (!refInfo)
//     //         return -1;
//     //     return refInfo.entities[0];
//     // }
//     // getSharedRefInfo(store, id) {
//     //     if (store.type !== CompType.Shared) return undefined;
//     //     return store.sharedCompMap.get(id);
//     // }
//     // //#endregion

//     // loadCompFromJson(store, json, context) {
//     //     if (store.isTag)
//     //         return store.tag;
//     //     if (Array.isArray(json)) {
//     //         if (store.type === CompType.Buffered) {
//     //             //buffer
//     //             let buffer = this._createBuffer(store);
//     //             for (let i = 0, l = json.length; i < l; i++) {
//     //                 let comp = this.createComp(store);
//     //                 this._loadObjFromJson(store.schema, comp, json[i], context);
//     //                 buffer.add(comp);
//     //             }
//     //             return buffer;
//     //         }
//     //         return undefined;
//     //     }
//     //     else {
//     //         let comp = this.createComp(store);
//     //         this._loadObjFromJson(store.schema, comp, json, context);
//     //         return comp;
//     //     }
//     // }
//     // saveCompToJson(store, comp, context) {
//     //     if (store.type === CompType.Buffered) {
//     //         let buffer = comp;
//     //         let array = [];
//     //         for (let i = 0, l = buffer.length; i < l; i++) {
//     //             let json = this._saveObjToJson(store.schema, buffer.get(i), context);
//     //             array.push(json);
//     //         }
//     //         return array;
//     //     }
//     //     else {
//     //         let json = this._saveObjToJson(store.schema, comp, context);
//     //         return json;
//     //     }
//     // }

//     // registerPropHandler(type, handler) {
//     //     this._propHandlerMap.set(type, handler);
//     // }

// }