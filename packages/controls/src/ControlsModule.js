import { Module } from "@poly-engine/core";
import { OrbitControlDef, OrbitControlStateDef } from "./orbitControl/OrbitControl";
import { OrbitControl1Def, OrbitControl1StateDef } from "./orbitControl/OrbitControl1";
import { OrbitControl1System } from "./orbitControl/OrbitControl1System";
import { OrbitControlSystem } from "./orbitControl/OrbitControlSystem";

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
        const orbitControl1Com = em.registerComponent('OrbitControl1', OrbitControl1Def);
        const orbitControl1StateCom = em.registerComponent('OrbitControlState1', OrbitControl1StateDef);

        const orbitControlCom = em.registerComponent('OrbitControl', OrbitControlDef);
        const orbitControlStateCom = em.registerComponent('OrbitControlState', OrbitControlStateDef);

        //system
        //LateUpdate: 10
        const orbitControl1Sys = sm.addSystem(OrbitControl1System, true);
        //LateUpdate: 10
        const orbitControlSys = sm.addSystem(OrbitControlSystem, true);

    }
    preUpdate(deltaTime) {
    }

}