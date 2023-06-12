// import { World } from "@poly-engine/core";
// import { TransformManager } from "../transform/TransformManager";

// /**
//  * @class SceneManager
//  */
// export class SceneManager {

//     constructor(world) {
//         /** @type {World} */
//         this.world = world;
//         this.em = world.entityManager;
//         /** @type {TransformManager} */
//         this.tm = world.transformManager;
//         this.assetManager = world.assetManager;

//         this.sceneCom = this.em.getComponentId("Scene");
//         this.sceneStateCom = this.em.getComponentId("SceneState");
//         this.sceneFlagCom = this.em.getComponentId("SceneFlag");

//         this.activeId = null;
//         this.activeEntity = -1;
//     }

//     getSceneEntity(id) {
//         if (id == null)
//             return this.activeEntity;
//         if (typeof id === "number")
//             return id;
//         return this.em.getSharedEntity(this.sceneCom, id);
//     }
//     getEntityScene(entity){
//         if(entity === -1)
//             return -1;
//         const rootEnt = this.tm.getRootEntity(entity);
//         const flag = this.em.getComponent(rootEnt, this.sceneFlagCom);
//         if(flag == null)
//             return -1;
//         return flag.entity;
//     }

//     addToScene(entity, id) {
//         let sceneEnt = this.getSceneEntity(id);
//         if (sceneEnt === -1)
//             return false;
//         const rootEnt = entity;//this.tm.getRootEntity(entity);
//         const sceneState = this.em.getComponent(sceneEnt, this.sceneStateCom);
//         const entSet = sceneState.entSet;
//         if (entSet.has(rootEnt))
//             return false;
//         entSet.add(rootEnt);
//         this.em.setComponentByArgs(rootEnt, this.sceneFlagCom, sceneEnt);
//         return true;
//     }
//     removeFromScene(entity, id) {
//         let sceneEnt = this.getSceneEntity(id);
//         if (sceneEnt === -1)
//             return false;
//         const rootEnt = entity;//this.tm.getRootEntity(entity);
//         const sceneState = this.em.getComponent(sceneEnt, this.sceneStateCom);
//         const entSet = sceneState.entSet;
//         if (!entSet.has(rootEnt))
//             return false;
//         entSet.remove(rootEnt);
//         this.em.removeComponent(rootEnt, this.sceneFlagCom);
//         return true;
//     }

//     hierachyToJson(entities, context) {
//         // let ents = new Array(entities);
//         let entSet = new SparseSet();
//         entities.forEach((entity) => {
//             entSet.add(entity);
//         });
//         entities.forEach((entity) => {
//             this.forEachChild(entity, (ent) => {
//                 entSet.add(ent);
//             });
//         });
//         return this.em.createPrefab(entSet.values, context);
//     }

//     setActiveScene(id){

//     }

//     loadScene(id, isAdditive) {
//         if(isAdditive !== true){
//             //TODO unload all scenes
//         }
//         this.assetManager.loadAssetEntity(id);
//     }

//     unloadScene(id) {

//     }
// }