// import { SparseSet, System, SystemGroupType } from "@poly-engine/core";
// import { TransformManager } from "../transform/TransformManager";

// export class SceneSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.LateUpdate;
//         this.index = 200;

//         this.transformManager = world.transformManager;
//         this.sceneManager = world.sceneManager;

//         this.sceneCom = this.em.getComponentId('Scene');
//         this.sceneStateCom = this.em.getComponentId('SceneState');
//         this.sceneFlagCom = this.em.getComponentId('SceneFlag');
//         this.parentDirtyCom = this.em.getComponentId('ParentDirty');

//         this.que_initState = this.qm.createQuery({ all: [this.sceneCom], not: [this.sceneStateCom] });
//         this.que_releaseState = this.qm.createQuery({ all: [this.sceneStateCom], not: [this.sceneCom] });

//         this.que_releaseFlag = this.qm.createQuery({ all: [this.sceneFlagCom], not: [this.Transform] });
//         this.que_parentDirty = this.qm.createQuery({ all: [this.parentDirtyCom] });
//     }
//     init() {
//     }
//     _update(delta) {
//         const em = this.em;

//         this.que_initState.forEach(entity => {
//             const scene = em.getComponent(entity, this.sceneCom);
//             const sceneState = em.createComponent(this.sceneStateCom);
//             this._initState(scene, sceneState);

//             this.que_initState.defer(() => {
//                 em.setComponent(entity, this.sceneStateCom, sceneState);
//             });
//         });
//         this.que_releaseState.forEach(entity => {
//             const sceneState = em.getComponent(entity, this.sceneStateCom);
//             this._releaseState(sceneState);

//             this.que_releaseState.defer(() => {
//                 em.removeComponent(entity, this.sceneStateCom);
//             });
//         });

//         this.que_releaseFlag.forEach(entity => {
//             const sceneFlag = em.getComponent(entity, this.sceneFlagCom);
//             const sceneEnt = sceneFlag.sceneEnt;
//             const sceneState = em.getComponent(sceneEnt, this.sceneStateCom);

//             sceneState.entSet.remove(entity);

//             this.que_releaseFlag.defer(() => {
//                 em.removeComponent(entity, this.sceneFlagCom);
//             });
//         });
//         this.que_parentDirty.forEach(entity => {
//             const parentDirty = em.getComponent(entity, this.parentDirtyCom);
//             const lastEnt = parentDirty.lastEnt;
//             if (parentDirty.curEnt === -1) {
//                 let sceneEnt = this.transformManager.getEntityScene(lastEnt);
//                 if (sceneEnt !== -1) {
//                     this.sceneManager.addToScene(entity, sceneEnt);
//                     // em.setComponentByArgs(entity, this.sceneFlagCom, sceneEnt);
//                 }
//             } else {
//                 if (em.hasComponent(entity, this.sceneFlagCom)){
                    
//                 }
//                     // this.sceneManager.removeFromScene(entity, sceneEnt);
//             }
//             this.que_parentDirty.defer(() => {
//                 em.removeComponent(entity, this.sceneFlagCom);
//             });
//         });
//     }

//     _initState(scene, sceneState) {
//         const em = this.em;
//         const datas = scene.entDatas;
//         //[{c1:{p1:0}, c2:{p2:'aa'}}]
//         const entities = em.entitiesFromJson(datas);
//         // sceneState.entities = entities;
//         sceneState.entSet = new SparseSet();
//         entities.forEach((ent) => sceneState.entSet.add(ent));
//     }
//     _releaseState(sceneState) {
//         const em = this.em;

//         const entities = sceneState.entSet.values;
//         entities.forEach((ent) => em.destroyEntity(ent));
//         sceneState.entSet.clear();
//     }

// }