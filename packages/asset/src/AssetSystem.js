import { System, SystemGroupType } from "@poly-engine/core";

/**
 * @class AssetSystem
 */
export class AssetSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 50;

        // this._assetDataMap = new Map;
        // this._assetDataMaps = [];

        // this.em = this.world.entityManager;
        // this.qm = this.world.queryManager;

        this.assetCom = this.em.getComponentId('Asset');
        // this.assetRefStateComp = em.getComponentId('AssetRefState');

        this.que_asset = this.qm.createQuery({
            all: [this.assetCom]
        });
    }
    init() {

    }
    _update() {

    }
    // /**
    //  * 
    //  * @param {object} data 
    //  * @returns {boolean}
    //  */
    // addAssetData(data) {
    //     let id = data.Asset.id;
    //     let type = data.Asset.type;

    //     let compId = this.em.getComponentId(type);
    //     if (compId === undefined)
    //         return false;
    //     let map = this._assetDataMaps[compId];
    //     if (!map) {
    //         map = new Map();
    //         this._assetDataMaps[compId] = map;
    //         // this._assetTypeDatas[compId] = 
    //     }
    //     this._assetDataMap.set(id, data);
    //     map.set(id, data);
    //     return true;
    // }
    // /**
    //  * 
    //  * @param {string} id 
    //  * @returns {object}
    //  */
    // removeAssetData(id) {
    //     let data = this._assetDataMap.get(id);
    //     if (!data)
    //         return data;
    //     this._assetDataMap.delete(id);
    //     let compId = this.em.getComponentId(data.type);
    //     let map = this._assetDataMaps[compId];
    //     map.delete(id);
    //     return data;
    // }
    // /**
    //  * 
    //  * @param {string} id 
    //  * @returns {object}
    //  */
    // getAssetData(id) {
    //     return this._assetDataMap.get(id);
    // }
    // // getAssetData(id, type) {
    // //     const compId = this.em.getComponentId(type);
    // //     if (compId === undefined)
    // //         return null;
    // //     const map = this._assetDataMaps[compId];
    // //     if (!map)
    // //         return null;
    // //     return map[id];
    // // }
    // /**
    //  * 
    //  * @param {string} id 
    //  * @returns {Entity}
    //  */
    // loadAssetEntity(id) {
    //     // if(typeof id === 'object'){
    //     //     id = id.id;
    //     //     type = id.type;
    //     // }
    //     const em = this.em;
    //     let entity = em.getSharedEntity(this.assetComp, id);
    //     if (entity === -1) {
    //         let data = this._assetDataMap.get(id);
    //         if (!data)
    //             return -1;
    //         entity = em.createEntity();
    //         for(let compName in data){
    //             const compId = em.getComponentId(compName);
    //             let comp = em.setComponentByJson(entity, compId, data[compName]);
    //             console.log(comp);
    //         }
    //         // const compId = em.getComponentId(data.type);
    //         // entity = em.createEntity();
    //         // em.setComponentByArgs(entity, this.assetComp, id, data.type);
    //         // let comp = em.setComponentByJson(entity, compId, data);
    //     }
    //     const asset = em.getComponent(entity, this.assetComp);
    //     asset.refCount++;
    //     return entity;
    // }
    // /**
    //  * 
    //  * @param {string | Entity} id 
    //  */
    // unloadAssetEntity(id) {
    //     const em = this.em;
    //     let entity = id;
    //     if (typeof id === 'string')
    //         entity = em.getSharedEntity(this.assetComp, id);
    //     if (entity === -1)
    //         return;
    //     const asset = em.getComponent(entity, this.assetComp);
    //     asset.refCount--;
    //     if (asset.refCount === 0) {
    //         //unload
    //         em.destroyEntity(entity);
    //     }
    // }
    // /**
    //  * 
    //  * @param {string} id 
    //  * @returns {Entity}
    //  */
    // getAssetEntity(id) {
    //     return this.em.getSharedEntity(this.assetComp, id);
    // }
}