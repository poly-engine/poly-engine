import { InputButtonState } from "./InputButtonState.js";
import { InputControlType } from "./InputControlType.js";

export class InputDevice {
    constructor(world) {
        this.timeManager = world.timeManager;
        this.htmlManager = world.htmlManager;

        this.canvasElement = this.htmlManager.canvasElement;

        this.buttonHeldNum = 0;
        this.controlDatas = [];

        this._isFocus = false;
    }

    isButtonHeld(button) {
        if (button === undefined) {
            return this.buttonHeldNum > 0;
        } else
            return this.controlDatas[button].value[0] > 0;
    }

    isButtonDown(button) {
        if (button === undefined) {
            for (let i = 0; i < this.controlDatas.length; i++) {
                const data = this.controlDatas[i];
                if (data.type !== InputControlType.Button)
                    continue;
                if (data.value[0] > 0 && data.frame === this.timeManager.frameCount)
                    return true;
            }
            return false;
        } else {
            const data = this.controlDatas[button];
            return data.value[0] > 0 && data.frame === this.timeManager.frameCount;
        }
    }
    isButtonUp(button) {
        if (button === undefined) {
            for (let i = 0; i < this.controlDatas.length; i++) {
                const data = this.controlDatas[i];
                if (data.type !== InputControlType.Button)
                    continue;
                if (data.value[0] === 0 && data.frame === this.timeManager.frameCount)
                    return true;
            }
            return false;
        } else {
            const data = this.controlDatas[button];
            return data.value[0] === 0 && data.frame === this.timeManager.frameCount;
        }
    }

    hasValue(button, thisFrame) {
        const data = this.controlDatas[button];
        if (data.frame === this.timeManager.frameCount)
            return true;
        if(thisFrame === true)
            return false;
        return !data.isDefault();
    }
    getValue(button) {
        return this.controlDatas[button].value;
    }
    isPerformed(controlId, buttonState) {
        const control = this.controlDatas[controlId];
        if (control.type === InputControlType.Button) {
            if (buttonState === InputButtonState.Down) {
                if (this.isButtonDown(controlId)) {
                    return true;
                }
            }
            else if (buttonState === InputButtonState.Up) {
                if (this.isButtonUp(controlId)) {
                    return true;
                }
            }
            else if (buttonState === InputButtonState.Held) {
                if (this.isButtonHeld(controlId)) {
                    return true;
                }
            }
            return false;
        }
        else {
            return !control.isDefault();
        }
    }

    _update() {

    }
    _onFocus() {
    }
    _onBlur() {
    }

    _reset() {
        for (let i = 0; i < this.controlDatas.length; i++) {
            this.controlDatas[i].reset();
        }
    }

    _onButtonDown(button) {
        const data = this.controlDatas[button];
        if (data.value[0] === 0) {
            this.buttonHeldNum++;
            data.value[0] = 1;
            data.frame = this.timeManager.frameCount;
        }
    }
    _onButtonUp(button) {
        const data = this.controlDatas[button];
        if (data.value[0] === 1) {
            this.buttonHeldNum--;
            data.value[0] = 0;
            data.frame = this.timeManager.frameCount;
        }
    }
}