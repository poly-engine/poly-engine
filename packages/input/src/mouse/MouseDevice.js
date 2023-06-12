import { InputControl } from "../input/InputControl.js";
import { InputControlType } from "../input/InputControlType.js";
import { InputDevice } from "../input/InputDevice.js";

export const MouseControl = {
    Left: 0,
    Mid: 1,
    Right: 2,

    Move: 3,
    Pos: 4,
    Scroll: 5
};
export class MouseDevice extends InputDevice {
    constructor(world) {
        super(world);

        // this.controlDatas[MouseControl.Left] = { type: InputControlType.Button, value: false, def: false };
        // this.controlDatas[MouseControl.Mid] = { type: InputControlType.Button, value: false, def: false };
        // this.controlDatas[MouseControl.Right] = { type: InputControlType.Button, value: false, def: false };
        // this.controlDatas[MouseControl.Move] = { type: InputControlType.Axis2D, value: [0, 0], def: [0, 0] };
        // this.controlDatas[MouseControl.Pos] = { type: InputControlType.Axis2D, value: [0, 0], def: [0, 0] };
        // this.controlDatas[MouseControl.Scroll] = { type: InputControlType.Axis3D, value: [0, 0, 0], def: [0, 0, 0] };
        this.controlDatas[MouseControl.Left] = new InputControl(InputControlType.Button);
        this.controlDatas[MouseControl.Mid] = new InputControl(InputControlType.Button);
        this.controlDatas[MouseControl.Right] = new InputControl(InputControlType.Button);
        this.controlDatas[MouseControl.Move] = new InputControl(InputControlType.Axis2D);
        this.controlDatas[MouseControl.Pos] = new InputControl(InputControlType.Axis2D);
        this.controlDatas[MouseControl.Scroll] = new InputControl(InputControlType.Axis3D);

        this._onMouseDownEvent = this._onMouseDownEvent.bind(this);
        this._onMouseUpEvent = this._onMouseUpEvent.bind(this);
        this._onMouseMoveEvent = this._onMouseMoveEvent.bind(this);
        this._onWheelEvent = this._onWheelEvent.bind(this);

        this._onFocus();
    }

    _onMouseDownEvent(evt) {
        this.canvasElement.focus();

        const button = evt.button;
        // const data = this.controlDatas[button];
        // if (!data.value) {
        //     this.buttonHeldNum++;
        //     data.value = true;
        //     data.fame = this.timeManager.frameCount;
        // }
        this._onButtonDown(button);
    }
    _onMouseUpEvent(evt) {
        this.canvasElement.focus();

        const button = evt.button;
        // const data = this.controlDatas[button];
        // if (data.value) {
        //     this.buttonHeldNum--;
        //     data.value = false;
        //     data.frame = this.timeManager.frameCount;
        // }
        this._onButtonUp(button);
    }
    _onMouseMoveEvent(evt) {
        const pos = this.controlDatas[MouseControl.Pos];
        const move = this.controlDatas[MouseControl.Move];

        move.value[0] = evt.pageX - pos.value[0];
        move.value[1] = evt.pageY - pos.value[1];
        pos.value[0] = evt.pageX;
        pos.value[1] = evt.pageY;

        pos.frame = move.frame = this.timeManager.frameCount;
    }
    _onWheelEvent(evt) {
        evt.preventDefault();
        const data = this.controlDatas[MouseControl.Scroll];
        data.value[0] = evt.deltaX;
        data.value[1] = evt.deltaY;
        data.value[2] = evt.deltaZ;
        data.frame = this.timeManager.frameCount;
    }
    _onContextMenu(evt) {
        //禁掉鼠标右键菜单
        evt.preventDefault()
    }
    _onFocus() {
        if (!this._isFocus) {
            document.addEventListener('contextmenu', this._onContextMenu);

            this.canvasElement.addEventListener('wheel', this._onWheelEvent, false);
            this.canvasElement.addEventListener('mousedown', this._onMouseDownEvent, false);
            this.canvasElement.addEventListener('mousemove', this._onMouseMoveEvent, false);
            this.canvasElement.addEventListener('mouseup', this._onMouseUpEvent, false);
            this._isFocus = true;
        }
    }
    _onBlur() {
        if (this._isFocus) {
            document.removeEventListener('contextmenu', this._onContextMenu);

            this.canvasElement.removeEventListener('wheel', this._onWheelEvent, false);
            this.canvasElement.removeEventListener('mousedown', this._onMouseDownEvent, false);
            this.canvasElement.removeEventListener('mousemove', this._onMouseMoveEvent, false);
            this.canvasElement.removeEventListener('mouseup', this._onMouseUpEvent, false);
            this._reset();
            this._isFocus = false;
        }
    }
}