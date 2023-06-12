import { System, SystemGroupType } from "@poly-engine/core";
import { InputActionPhase } from "./InputActionPhase";

/**
 * @class OrbitControlSystem
 */
export class OrbitControlSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.PreUpdate;
        this.index = 100;

        this.inputActionCom = this.em.getComponentId('OrbitControl');
        this.inputActionStateCom = this.em.getComponentId('OrbitControlState');

        this.que_canvasState = this.qm.createQuery({
            all: [this.inputActionCom, this.inputActionStateCom]
        });

        this.que_canvasInit = this.qm.createQuery({
            all: [this.inputActionCom],
            none: [this.inputActionStateCom],
        });
        // this.que_canvasRelease = this.qm.createQuery({
        //     all: [this.inputActionStateCom],
        //     none: [this.inputActionCom],
        // });
        this.timeManager = world.timeManager;
        this.inputManager = world.inputManager;
    }
    init() {
    }
    _update(delta) {
        const em = this.em;

        this.que_canvasInit.forEach(entity => {
            let canvas = em.getComponent(entity, this.inputActionCom);

            let canvasState = em.createComponent(this.inputActionStateCom);
            canvasState.value = [...canvas.defaultValue];

            this.que_canvasInit.defer(() => {
                em.setComponent(entity, this.inputActionStateCom, canvasState);
            });
        });
        // this.que_canvasRelease.forEach(entity => {
        //     let canvasState = em.getComponent(entity, this.inputActionStateCom);
        //     window.removeEventListener("blur", canvasState._onBlur);
        //     window.removeEventListener("focus", canvasState._onFocus);
        //     canvasState._onBlur = null;
        //     canvasState._onFocus = null;

        //     this.que_canvasRelease.defer(() => {
        //         em.removeComponent(entity, this.inputActionStateCom);
        //     });
        // });

        this.que_canvasState.forEach(entity => {
            let action = em.getComponent(entity, this.inputActionCom);
            let actionState = em.getComponent(entity, this.inputActionStateCom);

            actionState.performed = false;
        });
    }

    // hasActionValue(actionId) {
    //     let comp = null;
    //     if (typeof actionId === "string")
    //         comp = this.em.getSharedComponent(this.inputActionStateCom, actionId);
    //     else
    //         comp = this.em.getComponent(actionId, this.inputActionStateCom);
    //     return comp.phase !== InputActionPhase.Waiting;
    // }
    // getActionValue(actionId) {
    //     let comp = null;
    //     if (typeof actionId === "string")
    //         comp = this.em.getSharedComponent(this.inputActionStateCom, actionId);
    //     else
    //         comp = this.em.getComponent(actionId, this.inputActionStateCom);
    //     return comp?.value;
    // }
    // isActionPerformed(actionId) {
    //     let comp = null;
    //     if (typeof actionId === "string")
    //         comp = this.em.getSharedComponent(this.inputActionStateCom, actionId);
    //     else
    //         comp = this.em.getComponent(actionId, this.inputActionStateCom);
    //     return comp.phase === InputActionPhase.Performed && comp.frame === this.timeManager.frameCount;
    // }
}
