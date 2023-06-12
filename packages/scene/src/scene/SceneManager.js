import { SparseSet, World } from "@poly-engine/core";

/**
 * @class SceneManager
 */
export class SceneManager {

    constructor(world) {
        /** @type {World} */
        this.world = world;
        this.em = world.entityManager;
        /** @type {TransformManager} */
        this.tm = world.transformManager;
        /** @type {AssetManager} */
        this.assetManager = world.assetManager;

        this.sceneCom = this.em.getComponentId("Scene");
        this.sceneStateCom = this.em.getComponentId("SceneState");
        this.sceneFlagCom = this.em.getComponentId("SceneFlag");

        this.transformCom = this.em.getComponentId("Transform");

        this.activeId = null;
        this.activeEntity = -1;

        this.sceneQue = world.queryManager.createQuery({ all: [this.sceneCom] });

    }

    //#region scene
    getSceneEntity(id) {
        if (id == null)
            return this.activeEntity;
        if (typeof id === "number")
            return id;
        return this.em.getSharedEntity(this.sceneCom, id);
    }

    setActiveScene(idOrEnt) {
        const sceneEnt = this.getSceneEntity(idOrEnt);
        if(sceneEnt === -1)
            return;
        const scene = this.em.getComponent(sceneEnt, this.sceneCom);
        this.activeId = scene.id;
        this.activeEntity = sceneEnt;
    }

    createSceneEntity(id, template) {
        const em = this.em;

        let sceneEnt = this.getSceneEntity(id);
        if(sceneEnt !== -1)
            return -1;
        sceneEnt = em.createEntity();
        em.setComponentByArgs(sceneEnt, this.sceneCom, id, template);

        // if (template != null) {

        //     const ents = em.entitiesFromJson(template);
        //     for (let i = 0; i < ents.length; i++) {
        //         const ent = ents[i];
        //         if (this.transformManager.isRootEntity(ent))
        //             this.addToScene(ent, sceneEnt);
        //     }
        // }

        if (this.activeId == null) {
            this.activeId = id;
            this.activeEntity = sceneEnt;
        }
        return sceneEnt;
    }

    loadSceneEntity(id, isAdditive) {
        if (isAdditive !== true) {
            //TODO unload all scenes
            this.unloadAllSceneEntities();
        }
        let sceneEnt = this.assetManager.loadAssetEntity(id);
        if (sceneEnt === -1)
            return -1;
        if (this.activeId == null) {
            this.activeId = id;
            this.activeEntity = sceneEnt;
        }
        return sceneEnt;
    }

    unloadSceneEntity(id) {
        const scneEnt = this.getSceneEntity(id);
        if(scneEnt === -1)
            return;
        
    }

    unloadAllSceneEntities() {
        const ents = this.sceneQue.getEntities();
        ents.forEach((ent) => {
            // this.em.destroyEntity(ent);
            this.assetManager.unloadAssetEntity(ent);
        });
        this.activeId = null;
        this.activeEntity = -1;
    }
    //#endregion

    //#region entity scene
    getEntityScene(entity) {
        if (entity === -1)
            return -1;
        const rootEnt = this.tm.getRootEntity(entity);
        const flag = this.em.getComponent(rootEnt, this.sceneFlagCom);
        if (flag == null)
            return -1;
        return flag.entity;
    }

    addEntityToScene(entity, id) {
        let sceneEnt = this.getSceneEntity(id);
        if (sceneEnt === -1)
            return false;
        const rootEnt = entity;//this.tm.getRootEntity(entity);
        const sceneState = this.em.getComponent(sceneEnt, this.sceneStateCom);
        if(sceneState == null)
            return false;
        const entSet = sceneState.entSet;
        if (entSet.has(rootEnt))
            return false;
        entSet.add(rootEnt);
        let flag = this.em.setComponentByArgs(rootEnt, this.sceneFlagCom, sceneEnt);
        return true;
    }
    removeEntityFromScene(entity, id) {
        let sceneEnt = this.getSceneEntity(id);
        if (sceneEnt === -1)
            return false;
        const rootEnt = entity;//this.tm.getRootEntity(entity);
        const sceneState = this.em.getComponent(sceneEnt, this.sceneStateCom);
        if(sceneState == null)
            return false;
        const entSet = sceneState.entSet;
        if (!entSet.has(rootEnt))
            return false;
        entSet.remove(rootEnt);
        this.em.removeComponent(rootEnt, this.sceneFlagCom);
        return true;
    }
    //#endregion

    //#region sceneData
    hierachyToJson(entities, context) {
        // let ents = new Array(entities);
        let entSet = new SparseSet();
        entities.forEach((entity) => {
            entSet.add(entity);
        });
        entities.forEach((entity) => {
            this.forEachChild(entity, (ent) => {
                entSet.add(ent);
            });
        });
        return this.em.createPrefab(entSet.values, context);
    }

    createSceneData() {

    }

    //#endregion
}