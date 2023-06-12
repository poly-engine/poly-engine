import { Module } from "@poly-engine/core";
import { OrbitControl1Def, OrbitControl1StateDef } from "./orbitControl/OrbitControl1";
import { OrbitControl1System } from "./orbitControl/OrbitControl1System";

/**
 * @class ControlsModule
 */
export class ControlsModule extends Module {
    init() {
        const world = this.world;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        //component
        const inputActionCom = em.registerComponent('OrbitControl', OrbitControl1Def);
        const inputActionStateCom = em.registerComponent('OrbitControlState', OrbitControl1StateDef);

        //system
        //100
        const inputActionSys = sm.addSystem(OrbitControl1System, true);

    }
    preUpdate(deltaTime) {
    }

}