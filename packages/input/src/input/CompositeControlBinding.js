import { ButtonState } from "./InputAction.js";
import { InputControlType } from "./InputControlType.js";

export class CompositeControlBinding {
    constructor(action, device, controlId, phase) {
        this.action = action;

        this.device = device;
        this.controlId = controlId;
        this.buttonState = phase;
    }

    hasValue() {
        return this.device.hasValue(this.controlId);
        // if(!this.device.hasValue(controlId))
        //     return false;
    }
    updateValue() {
        const value = this.action.value;
        const ok = this.device.isPerformed(this.controlId, this.buttonState);
        if(ok){
            if (this.action.type === InputControlType.Button){
                value[0] = 1;
            }
            else
                this.action.copyValue(this.device.getValue(this.controlId));
        }
        return ok;
        // if (this.action.type === InputControlType.Button) {
        //     if (this.buttonState === ButtonState.Down) {
        //         if (this.device.isButtonDown(this.controlId)) {
        //             value[0] = 1;
        //             // this.action.phase = performed;
        //             return true;
        //         }
        //     }
        //     else if (this.buttonState === ButtonState.Up) {
        //         if (this.device.isButtonUp(this.controlId)) {
        //             value[0] = 1;
        //             return true;
        //         }
        //     }
        //     else if (this.buttonState === ButtonState.Held) {
        //         if (this.device.isButtonHeld(this.controlId)) {
        //             value[0] = 1;
        //             return true;
        //         }
        //     }
        //     value[0] = 0;
        // } else {
        //     this.action.copyValue(this.device.getValue(this.controlId));
        //     return true;
        // }

        // return false;
    }

}
