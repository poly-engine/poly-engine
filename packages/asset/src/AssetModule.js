import { CompMode, CompType, Module } from "@poly-engine/core";
import { AssetRefPropHandler } from "./PropHandlers.js";
import { AssetSystem } from "./AssetSystem.js";
import { AssetManager } from "./AssetManager.js";
import { LoadManager } from "./loader1/LoadManager.js";
/**
 * @class AssetModule
 */
export class AssetModule extends Module {
    init() {
        const world = this.world;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        const cloneManager = world.cloneManager;
        
        // cloneManager.registerPropHandler('assetRef', new AssetRefPropHandler());

        //component
        const assetCom = em.registerComponent('Asset', {
            type: CompType.Shared,
            schema: {
                id: { type: 'string', default: null },
                type: { type: 'string', default: null },
                name: { type: 'string', default: null },
                refCount: { type: 'number', default: 0 },
            }
        });

        //system
        const assetSys = sm.addSystem(AssetSystem);
        assetSys.init();

        world.assetManager = new AssetManager(world);
        world.loadManager = new LoadManager(world);
    }
}