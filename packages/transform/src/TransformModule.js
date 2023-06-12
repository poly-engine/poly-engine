import { glMatrix } from "@poly-engine/math";
import { Module } from "@poly-engine/core";
import { Mat4PropHandler, QuatPropHandler, Vec2PropHandler, Vec3PropHandler, Vec4PropHandler } from "./PropHandlers.js";
import { TransformSystem } from "./transform/TransformSystem.js";
import { TransformDef, TransformDirtyDef } from "./transform/Transform.js";
import { LocalToWorldDef, LtwChangedDef } from "./transform/LocalToWorld.js";
import { ParentDef, ParentDirtyDef } from "./transform/Parent.js";
import { ChildrenDef } from "./transform/Children.js";
import { TransformManager } from "./transform/TransformManager.js";

export class TransformModule extends Module {
    init() {
        const world = this.world;
        // const compManager = world.componentManager;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        const cloneManager = world.cloneManager;

        glMatrix.setMatrixArrayType(Array);
        cloneManager.registerPropHandler('vec2', new Vec2PropHandler());
        cloneManager.registerPropHandler('vec3', new Vec3PropHandler());
        cloneManager.registerPropHandler('vec4', new Vec4PropHandler());
        cloneManager.registerPropHandler('quat', new QuatPropHandler());
        cloneManager.registerPropHandler('mat4', new Mat4PropHandler());

        //component
        const com_children = em.registerComponent('Children', ChildrenDef);
        const com_parent = em.registerComponent('Parent', ParentDef);
        const com_parentDirty = em.registerComponent('ParentDirty', ParentDirtyDef);
        const com_transform = em.registerComponent('Transform', TransformDef);
        const com_localToWorld = em.registerComponent('LocalToWorld', LocalToWorldDef);
        const com_ltwChanged = em.registerComponent('LtwChanged', LtwChangedDef);
        const com_transformDirty = em.registerComponent('TransformDirty', TransformDirtyDef);

        // const sceneCom = em.registerComponent('Scene', SceneDef);
        // const sceneStateCom = em.registerComponent('SceneState', SceneStateDef);

        //query
        world.transformManager = new TransformManager(world);
        // world.sceneManager = new SceneManager(world);

        //system
        //LateUpdate: 1000
        const transformSystem = sm.addSystem(TransformSystem, true);

        //LateUpdate: 200
        // const sceneSystem = sm.addSystem(SceneSystem, true);

        // transformSystem.init();

    }

}