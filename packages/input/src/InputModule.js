import { Module } from "@poly-engine/core";
import { InputManager } from "./input/InputManager.js";
import { BaseControlBindingSystem } from "./inputAction/BaseControlBindingSystem.js";
import { BaseControlBindingDef, InputActionDef, InputActionStateDef } from "./inputAction/InputAction.js";
import { InputActionPerformSystem } from "./inputAction/InputActionPerformSystem.js";
import { InputActionSystem } from "./inputAction/InputActionSystem.js";
/**
 * @class InputModule
 */
export class InputModule extends Module {
    init() {
        const world = this.world;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        //component
        const inputActionCom = em.registerComponent('InputAction',  InputActionDef);
        const inputActionStateCom = em.registerComponent('InputActionState',  InputActionStateDef);
        const baseControlBindingCom = em.registerComponent('BaseControlBinding',  BaseControlBindingDef);

        world.inputManager = new InputManager(world);

        //system
        //100
        const inputActionSys = sm.addSystem(InputActionSystem, true);
        //101
        const baseControlBindingSys = sm.addSystem(BaseControlBindingSystem, true);
        //200
        const inputActionPerformSys = sm.addSystem(InputActionPerformSystem, true);

    }
    preUpdate(deltaTime){
        this.world.inputManager.update(deltaTime);
    }

}