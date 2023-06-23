import { SparseSet, System, SystemGroupType } from "@poly-engine/core";

export class SceneSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 200;

        this.transformManager = world.transformManager;
        this.sceneManager = world.sceneManager;

        this.sceneCom = this.em.getComponentId('Scene');
        this.sceneStateCom = this.em.getComponentId('SceneState');
        this.sceneFlagCom = this.em.getComponentId('SceneFlag');
        this.parentDirtyCom = this.em.getComponentId('ParentDirty');
        this.transformCom = this.em.getComponentId('Transform');

        this.que_initState = this.qm.createQuery({ all: [this.sceneCom], not: [this.sceneStateCom] });
        this.que_releaseState = this.qm.createQuery({ all: [this.sceneStateCom], not: [this.sceneCom] });

        this.que_releaseFlag = this.qm.createQuery({ all: [this.sceneFlagCom], not: [this.transformCom] });
        this.que_parentDirty = this.qm.createQuery({ all: [this.parentDirtyCom] });

        this.que_sceneFlag = this.qm.createQuery({ all: [this.transformCom, this.sceneFlagCom] });
    }
    init() {
    }
    _update(delta) {
        const em = this.em;

        this.que_initState.forEach(entity => {
            const scene = em.getComponent(entity, this.sceneCom);
            const sceneState = em.createComponent(this.sceneStateCom);
            this._initState(entity, scene, sceneState);

            this.que_initState.defer(() => {
                em.setComponent(entity, this.sceneStateCom, sceneState);
            });
        });
        this.que_releaseState.forEach(entity => {
            const sceneState = em.getComponent(entity, this.sceneStateCom);
            this._releaseState(entity, sceneState);

            this.que_releaseState.defer(() => {
                em.removeComponent(entity, this.sceneStateCom);
            });
        });

        this.que_releaseFlag.forEach(entity => {
            const sceneFlag = em.getComponent(entity, this.sceneFlagCom);
            const sceneEnt = sceneFlag.entity;
            const sceneState = em.getComponent(sceneEnt, this.sceneStateCom);

            sceneState.entSet.remove(entity);
            console.log(entity, sceneEnt, sceneState.entSet.values);

            this.que_releaseFlag.defer(() => {
                em.removeComponent(entity, this.sceneFlagCom);
            });
        });
        this.que_parentDirty.forEach(entity => {
            const parentDirty = em.getComponent(entity, this.parentDirtyCom);
            const lastEnt = parentDirty.lastEnt;
            if (parentDirty.curEnt === -1) {
                let sceneEnt = this.sceneManager.getEntityScene(lastEnt);
                if (sceneEnt !== -1) {
                    this.que_parentDirty.defer(() => {
                        // em.removeComponent(entity, this.sceneFlagCom);
                        this.sceneManager.addEntityToScene(entity, sceneEnt);
                    });
                }
            } else {
                if (em.hasComponent(entity, this.sceneFlagCom)) {
                    this.que_parentDirty.defer(() => {
                        this.sceneManager.removeEntityFromScene(entity, sceneEnt);
                        // em.removeComponent(entity, this.sceneFlagCom);
                    });
                }
                // this.sceneManager.removeFromScene(entity, sceneEnt);
            }
        });
    }

    _initState(sceneEnt, scene, sceneState) {
        const em = this.em;
        const datas = scene.entDatas;
        //[{c1:{p1:0}, c2:{p2:'aa'}}]
        // sceneState.entities = entities;
        sceneState.entSet = new SparseSet();

        if (datas != null) {
            const entities = em.entitiesFromJson(datas);
            entities.forEach((ent) => {
                if (this.transformManager.isRootEntity(ent)) {
                    // this.sceneManager.addEntityToScene(ent, sceneEnt);
                    let flag = this.em.setComponentByArgs(ent, this.sceneFlagCom, sceneEnt);
                    sceneState.entSet.add(ent);
                }
            });
        }

        this.que_sceneFlag.forEach(entity => {
            const sceneFlag = em.getComponent(entity, this.sceneFlagCom);
            if (sceneFlag.entity !== sceneEnt)
                return;
            sceneState.entSet.add(entity);
        });
    }
    _releaseState(sceneEnt, sceneState) {
        const em = this.em;

        const entities = sceneState.entSet.values;
        entities.forEach((ent) => this.transformManager.destroyHierachy(ent));
        sceneState.entSet.clear();
    }

}