import { System, SystemGroupType } from "@poly-engine/core";
import { ArrayUtil } from "@poly-engine/core";
import { InputActionPhase } from "./InputActionPhase";

/**
 * @class InputActionPerformSystem
 */
export class InputActionPerformSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.PreUpdate;
        this.index = 200;

        this.inputActionCom = this.em.getComponentId('InputAction');
        this.inputActionStateCom = this.em.getComponentId('InputActionState');

        this.que_canvasState = this.qm.createQuery({
            all: [this.inputActionCom, this.inputActionStateCom]
        });
        this.timeManager = world.timeManager;
    }
    init() {
    }
    _update() {
        const em = this.em;

        this.que_canvasState.forEach(entity => {
            let action = em.getComponent(entity, this.inputActionCom);
            let actionState = em.getComponent(entity, this.inputActionStateCom);

            if (actionState.performed) {
                if (actionState.phase !== InputActionPhase.Performed) {
                    actionState.phase = InputActionPhase.Performed;
                    actionState.frame = this.timeManager.frameCount;
                }
            }
            else {
                if (actionState.phase === InputActionPhase.Performed) {
                    actionState.phase = InputActionPhase.Canceled;
                    actionState.frame = this.timeManager.frameCount;
                }
                if (actionState.phase === InputActionPhase.Canceled) {
                    actionState.phase = InputActionPhase.Waiting;
                    ArrayUtil.copy(action.defaultValue, actionState.value);

                    // frame = this.timeManager.frameCount;
                }
            }
        });
    }
}
