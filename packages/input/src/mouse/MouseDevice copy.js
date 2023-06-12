// import { SparseSet } from "@poly-engine/core";
// export const ControlType = {
//     Button: 0,
//     Axis1D: 1,
//     Axis2D: 2,
//     Axis3D: 3,
// }
// export const MouseControl = {
//     Left: 0,
//     Mid: 1,
//     Right: 2,

//     Move: 3,
//     Pos: 4,
//     Scroll: 5
// };
// export class MouseDevice {
//     constructor(world) {
//         this.timeManager = world.timeManager;
//         this.canvasManager = world.canvasManager;

//         this.canvasElement = canvasManager.canvasElement;

//         this.nativeEvents = [];

//         // this.curFrameHeldDownList = new SparseSet();
//         // this.curFrameDownList = new SparseSet();
//         // this.curFrameUpList = new SparseSet();

//         this.buttonHeldNum = 0;
//         // this.buttonDownNum = 0;
//         // this.buttonUpNum = 0;

//         this.controlDatas = [];
//         this.controlDatas[MouseControl.Left] = { type: ControlType.Button, value: false, def: false };
//         this.controlDatas[MouseControl.Mid] = { type: ControlType.Button, value: false, def: false };
//         this.controlDatas[MouseControl.Right] = { type: ControlType.Button, value: false, def: false };
//         this.controlDatas[MouseControl.Move] = { type: ControlType.Axis2D, value: [0, 0], def: [0, 0] };
//         this.controlDatas[MouseControl.Pos] = { type: ControlType.Axis2D, value: [0, 0], def: [0, 0] };
//         this.controlDatas[MouseControl.Scroll] = { type: ControlType.Axis3D, value: [0, 0, 0], def: [0, 0, 0] };

//         this._onPointerEvent = this._onMouseEvent.bind(this);

//         this._hadListener = false;
//         this._onFocus();
//     }

//     isButtonHeld(button) {
//         if (button === undefined) {
//             return this.buttonHeldNum > 0;
//         } else {
//             return this.controlDatas[button].value;
//         }
//     }
//     isButtonDown(button) {
//         if (button === undefined) {
//             // return this.buttonDownNum > 0;
//             for (let i = 0; i < this.controlDatas.length; i++) {
//                 const data = this.controlDatas[i];
//                 if (data.value && data.frame === this.timeManager.frameCount)
//                     return true;
//             }
//         } else {
//             const data = this.controlDatas[button];
//             return data.value && data.frame === this.timeManager.frameCount;
//         }
//     }
//     isButtonUp(button) {
//         if (button === undefined) {
//             return this.curFrameUpList.length > 0;
//         } else {
//             return this.curFrameUpList.has(button);
//         }
//     }
//     _isDefaultData(data) {
//         const type = data.type;
//         const value = data.value;
//         const def = data.def;
//         if (type === ControlType.Button)
//             return value === def;
//         else if (type === ControlType.Axis1D)
//             return value === def;
//         else if (type === ControlType.Axis2D)
//             return value[0] === def[0] && value[1] === def[1];
//         else if (type === ControlType.Axis3D)
//             return value[0] === def[0] && value[1] === def[1] && value[2] === def[2];
//         return false;
//     }
//     hasValue(button) {
//         const data = this.controlDatas[button];
//         if (data.frame === this.timeManager.frameCount)
//             return true;
//         return !this._isDefaultData(data);
//     }
//     getValue(button) {
//         return this.controlDatas[button].value;
//     }

//     _update() {
//         const { nativeEvents, curFrameDownList, curFrameUpList, curFrameHeldDownList } = this;
//         curFrameDownList.length = 0;
//         curFrameUpList.length = 0;

//         if (nativeEvents.length > 0) {
//             // const frameCount = this.timeManager.frameCount;
//             for (let i = 0, n = nativeEvents.length; i < n; i++) {
//                 const evt = nativeEvents[i];
//                 const button = evt.button;
//                 switch (evt.type) {
//                     case "mousedown":
//                         if (!curFrameHeldDownList.has(button)) {
//                             curFrameDownList.add(button);
//                             curFrameHeldDownList.add(button);
//                         }
//                         break;
//                     case "mouseup":
//                         if (curFrameHeldDownList.has(button)) {
//                             curFrameHeldDownList.remove(button);
//                         }
//                         curFrameUpList.add(button);
//                         break;
//                     default:
//                         break;
//                 }
//             }
//             nativeEvents.length = 0;
//         }
//     }

//     _onMouseDownEvent(evt) {
//         this.canvasElement.focus();

//         const button = evt.button;
//         const data = this.controlDatas[button];
//         if (!data.value) {
//             this.buttonHeldNum++;
//             data.value = true;
//             data.fame = this.timeManager.frameCount;
//         }
//     }
//     _onMouseUpEvent(evt) {
//         this.canvasElement.focus();

//         const button = evt.button;
//         const data = this.controlDatas[button];
//         if (data.value) {
//             this.buttonHeldNum--;
//             data.value = false;
//             data.frame = this.timeManager.frameCount;
//         }
//     }
//     _onMouseMoveEvent(evt) {
//         const pos = this.controlDatas[MouseControl.Pos];
//         const move = this.controlDatas[MouseControl.Move];

//         move.value[0] = evt.pageX - pos.value[0];
//         move.value[1] = evt.pageY - pos.value[1];
//         pos.value[0] = evt.pageX;
//         pos.value[1] = evt.pageY;

//         pos.frame = move.frame = this.timeManager.frameCount;
//     }
//     _onWheelEvent(evt) {
//         evt.preventDefault();
//         const delta = this.controlDatas[MouseControl.Scroll];
//         delta.value[0] += evt.deltaX;
//         delta.value[1] += evt.deltaY;
//         delta.value[2] += evt.deltaZ;
//         delta.frame = this.timeManager.frameCount;
//     }
//     _onFocus() {
//         if (!this._hadListener) {
//             const { canvasElement, _onMouseEvent: onPointerEvent } = this;
//             canvasElement.addEventListener('wheel', this._onWheelEvent, false);
//             canvasElement.addEventListener('mousedown', this.onMouseDown, false);
//             canvasElement.addEventListener('mousemove', this._onMouseMoveEvent, false);
//             canvasElement.addEventListener('mouseup', this.onMouseUp, false);
//             this._hadListener = true;
//         }
//     }
//     _onBlur() {
//         if (this._hadListener) {
//             this.canvasElement.removeEventListener("keydown", _onKeyEvent);
//             this.canvasElement.removeEventListener("keyup", _onKeyEvent);
//             this.curFrameHeldDownList.length = 0;
//             this.curFrameDownList.clear();
//             this.curFrameUpList.clear();
//             this.nativeEvents.clear();
//             this._hadListener = false;
//         }
//     }
// }