import { InputControl } from "../input/InputControl.js";
import { InputControlType } from "../input/InputControlType.js";
import { InputDevice } from "../input/InputDevice.js";
import { Keys } from "./Keys.js";

export class KeyboardDevice extends InputDevice {
    constructor(world) {
        super(world);

        // Need to set tabIndex to make the canvas focus.
        this.canvasElement.tabIndex = this.canvasElement.tabIndex;

        for (let i = 0; i <= Keys.Unidentified; i++) {
            // this.controlDatas[i] = { type: InputControlType.Button, value: false, def: false };
            this.controlDatas[i] = new InputControl(InputControlType.Button);
        }

        this._onKeyDownEvent = this._onKeyDownEvent.bind(this);
        this._onKeyUpEvent = this._onKeyUpEvent.bind(this);

        this._onFocus();
    }

    _onKeyDownEvent(evt) {
        // this.nativeEvents.push(evt);
        const keyCode = Keys[evt.code];
        // const data = this.controlDatas[keyCode];
        // if (!data.value) {
        //     this.buttonHeldNum++;
        //     data.value = true;
        //     data.fame = this.timeManager.frameCount;
        // }
        this._onButtonDown(keyCode);
    }
    _onKeyUpEvent(evt) {
        const keyCode = Keys[evt.code];
        // const data = this.controlDatas[keyCode];
        // if (data.value) {
        //     this.buttonHeldNum--;
        //     data.value = false;
        //     data.fame = this.timeManager.frameCount;
        // }
        this._onButtonUp(keyCode);
    }
    _onFocus() {
        if (!this._isFocus) {
            this.canvasElement.addEventListener("keydown", this._onKeyDownEvent);
            this.canvasElement.addEventListener("keyup", this._onKeyUpEvent);
            this._isFocus = true;
        }
    }
    _onBlur() {
        if (this._isFocus) {
            this.canvasElement.removeEventListener("keydown", this._onKeyDownEvent);
            this.canvasElement.removeEventListener("keyup", this._onKeyUpEvent);
            this._reset();
            this._isFocus = false;
        }
    }
}