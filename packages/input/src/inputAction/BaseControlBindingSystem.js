import { System, SystemGroupType } from "@poly-engine/core";
import { ArrayUtil } from "@poly-engine/core";
import { InputButtonState } from "../input/InputButtonState.js";
import { InputControlType } from "../input/InputControlType.js";

/**
 * @class CanvasSystem
 */
export class BaseControlBindingSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.PreUpdate;
        this.index = 101;

        this.inputActionCom = this.em.getComponentId('InputAction');
        this.inputActionStateCom = this.em.getComponentId('InputActionState');
        this.baseControlBindingCom = this.em.getComponentId('BaseControlBinding');

        this.que_canvasState = this.qm.createQuery({
            all: [this.inputActionCom, this.inputActionStateCom, this.baseControlBindingCom]
        });

        // this.que_canvasInit = this.qm.createQuery({
        //     all: [this.inputActionCom],
        //     none: [this.inputActionStateCom],
        // });

        this.inputManager = world.inputManager;
    }
    init() {
    }
    _update() {
        const em = this.em;

        // this.que_canvasInit.forEach(entity => {
        //     let canvas = em.getComponent(entity, this.inputActionCom);

        //     let canvasState = em.createComponent(this.inputActionStateCom);
        //     canvasState.value = [...canvas.defaultValue];

        //     this.que_canvasInit.defer(() => {
        //         em.setComponent(entity, this.inputActionStateCom, canvasState);
        //     });
        // });

        this.que_canvasState.forEach(entity => {
            const action = em.getComponent(entity, this.inputActionCom);
            const actionState = em.getComponent(entity, this.inputActionStateCom);
            const bindingBuf = em.getComponent(entity, this.baseControlBindingCom);

            // const value = actionState.value;

            for (let j = 0; j < bindingBuf.length; j++) {
                const binding = bindingBuf.get(j);

                if (actionState.performed)
                    return;

                if (!this._hasValue(binding))
                    continue;

                actionState.performed = this._updateValue(action, actionState, binding);
            }

        });
    }

    _hasValue(binding) {
        const device = this.inputManager.devices[binding.deviceType];
        if (binding.controls != null) {
            for (let i = 0; i < binding.controls.length; i++) {
                const c = binding.controls[i];
                let d = this.inputManager.devices[c.deviceType];
                if (!d.hasValue(c.controlId))
                    return false;
            }
        }
        return device.hasValue(binding.controlId);
    }
    _updateValue(action, actionState, binding) {
        const value = actionState.value;
        const device = this.inputManager.devices[binding.deviceType];
        if (binding.controls != null) {
            for (let i = 0; i < binding.controls.length; i++) {
                const c = binding.controls[i];
                let d = this.inputManager.devices[c.deviceType];
                if (!d.isPerformed(c.controlId, InputButtonState.Held))
                    return false;
            }
        }
        const ok = device.isPerformed(binding.controlId, binding.buttonState);
        if (ok) {
            if (action.controlType === InputControlType.Button) {
                value[0] = 1;
            }
            else
                ArrayUtil.copy(device.getValue(binding.controlId), value);
        }
        return ok;
    }

}
