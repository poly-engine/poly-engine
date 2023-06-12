import { Util } from "@poly-engine/core";

/**
 * @class AssetManager
 */
export class AssetManager {
    constructor(world) {
        this.world = world;
        this.em = world.entityManager;
        this.assetCom = this.em.getComponentId("Asset");

        this._assetDataMap = new Map;
        this._assetDataMaps = [];

        this._loaderMap = new Map;


        /** The number of retries after failing to load assets. */
        this.retryCount = 1;
        /** Retry delay time after failed to load assets, in milliseconds. */
        this.retryInterval = 0;
        /** The default timeout period for loading assets, in milliseconds. */
        this.timeout = Infinity;

        this._loadingPromises = {};
        this._assetPool = Object.create(null);
        this._assetUrlPool = Object.create(null);
        this._referResourcePool = Object.create(null);
        this._graphicResourcePool = Object.create(null);
        this._contentRestorerPool = Object.create(null);
    }

    createAssetData(id, type, ...compNames) {
        id ??= Util.createUUID();
        let assetData = Object.create(null);
        const asset = assetData.Asset = this.em.createComponent(this.assetCom);
        asset.id = id;
        asset.type = type;
        for (let i = 0; i < compNames.length; i++) {
            let compName = compNames[i];
            let compId = this.em.getComponentId(compName);
            let comp = this.em.createComponent(compId);
            if (comp.id !== undefined)
                comp.id = id;
            assetData[compName] = comp;
        }
        return assetData;
    }

    /**
     * 
     * @param {object} data 
     * @returns {boolean}
     */
    addAssetData(data) {
        let id = data.Asset.id;
        let type = data.Asset.type;

        let compId = this.em.getComponentId(type);
        if (compId === undefined)
            return false;
        let map = this._assetDataMaps[compId];
        if (!map) {
            map = new Map();
            this._assetDataMaps[compId] = map;
            // this._assetTypeDatas[compId] = 
        }
        this._assetDataMap.set(id, data);
        map.set(id, data);
        return true;
    }
    /**
     * 
     * @param {string} id 
     * @returns {object}
     */
    removeAssetData(id) {
        let data = this._assetDataMap.get(id);
        if (!data)
            return data;
        this._assetDataMap.delete(id);
        let compId = this.em.getComponentId(data.type);
        let map = this._assetDataMaps[compId];
        map.delete(id);
        return data;
    }
    /**
     * 
     * @param {string} id 
     * @returns {object}
     */
    getAssetData(id) {
        return this._assetDataMap.get(id);
    }

    /**
     * 
     * @param {string} id 
     * @returns {Entity}
     */
    loadAssetEntity(id) {
        // if(typeof id === 'object'){
        //     id = id.id;
        //     type = id.type;
        // }
        const em = this.em;
        let entity = em.getSharedEntity(this.assetCom, id);
        if (entity === -1) {
            let data = this._assetDataMap.get(id);
            if (!data)
                return -1;
            entity = em.createEntity();
            for (let compName in data) {
                const compId = em.getComponentId(compName);
                let comp = em.setComponentByJson(entity, compId, data[compName]);
                // console.log(comp);
            }
        }
        const asset = em.getComponent(entity, this.assetCom);
        asset.refCount++;
        return entity;
    }
    /**
     * 
     * @param {string | Entity} id 
     */
    unloadAssetEntity(id) {
        const em = this.em;
        let entity = id;
        if (typeof id === 'string')
            entity = em.getSharedEntity(this.assetCom, id);
        if (entity === -1)
            return;
        const asset = em.getComponent(entity, this.assetCom);
        if (asset == null)
            em.destroyEntity(entity);
        else {
            asset.refCount--;
            if (asset.refCount === 0) {
                //unload
                em.destroyEntity(entity);
            }
        }
    }
    /**
     * 
     * @param {string} id 
     * @returns {Entity}
     */
    getAssetEntity(id) {
        return this.em.getSharedEntity(this.assetCom, id);
    }
}