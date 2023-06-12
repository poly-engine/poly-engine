import { Module } from "@poly-engine/core";
import { SceneDef, SceneFlagDef, SceneStateDef } from "./scene/Scene.js";
import { SceneSystem } from "./scene/SceneSystem.js";
import { SceneManager } from "./scene/SceneManager.js";

export class SceneModule extends Module {
    init() {
        const world = this.world;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        const cloneManager = world.cloneManager;

        //component
        const sceneCom = em.registerComponent('Scene', SceneDef);
        const sceneStateCom = em.registerComponent('SceneState', SceneStateDef);
        const sceneFlagCom = em.registerComponent('SceneFlag', SceneFlagDef);

        //query
        world.sceneManager = new SceneManager(world);

        //system
        //LateUpdate: 200
        const sceneSystem = sm.addSystem(SceneSystem, true);

    }

}