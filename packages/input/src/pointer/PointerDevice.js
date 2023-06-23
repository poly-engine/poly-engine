// import { InputControl } from "../input/InputControl.js";
// import { InputControlType } from "../input/InputControlType.js";
// import { InputDevice } from "../input/InputDevice.js";

// export const PointerControl = {
//     Pointer0: 0,
//     Pointer0_Move: 1,
//     Pointer0_Pos: 2,
//     Pointer0_Scoll: 3,

//     Pointer1: 4,
//     Pointer1_Move: 5,
//     Pointer1_Pos: 6,
//     Pointer1_Scoll: 7,

//     Pointer2: 8,
//     Pointer2_Move: 9,
//     Pointer2_Pos: 10,
//     Pointer2_Scoll: 11,

//     Group0: 12,
//     Group0_Move: 13,
//     Group0_Pos: 14,
//     Group0_Scoll: 15,

//     Group1: 16,
//     Group1_Move: 17,
//     Group1_Pos: 18,
//     Group1_Scoll: 19,

//     Group2: 20,
//     Group2_Move: 21,
//     Group2_Pos: 22,
//     Group2_Scoll: 23,
// };
// const PointerNum = 3;
// // const GroupNum = 3;
// const PointerControlNum = 4;

// export class PointerDevice extends InputDevice {
//     constructor(world) {
//         super(world);

//         for (let i = 0; i < PointerNum * 2; i++) {
//             this.controlDatas[i * PointerControlNum + 0] = new InputControl(InputControlType.Button);
//             this.controlDatas[i * PointerControlNum + 1] = new InputControl(InputControlType.Axis2D);
//             this.controlDatas[i * PointerControlNum + 2] = new InputControl(InputControlType.Axis2D);
//             this.controlDatas[i * PointerControlNum + 3] = new InputControl(InputControlType.Axis3D);
//         }

//         this._onPointerDownEvent = this._onPointerDownEvent.bind(this);
//         this._onPointerCancelEvent = this._onPointerCancelEvent.bind(this);
//         this._onPointerUpEvent = this._onPointerUpEvent.bind(this);
//         this._onPointerMoveEvent = this._onPointerMoveEvent.bind(this);
//         // this._onWheelEvent = this._onWheelEvent.bind(this);

//         this._onFocus();

//         this.pointers = [];
//         this.pointerNum = 0;
//         // this.pointerPositions = {};
//     }

//     // _getPointerIndex(pointerId){
//     //     return this.pointers.findIndex((value) => pointerId ? value == null : value.pointerId === pointerId);
//     // }
//     _getPointerIndex(evt) {
//         return this.pointers.findIndex((value) => value === evt);
//     }    
//     // _addPointer(evt){
//     //     this.pointers.push(evt);
//     // }
//     // _removePointer(evt){
//     //     delete this.pointerPositions[evt.pointerId];

//     //     for (let i = 0; i < this.pointers.length; i++) {
//     //         if (this.pointers[i].pointerId == evt.pointerId) {
//     //             this.pointers.splice(i, 1);
//     //             return;
//     //         }
//     //     }
//     // }
//     _getGroupControlId(groupId) {
//         return (groupId + PointerNum) * PointerControlNum;
//     }
//     _getPointerControlId(pointerId) {
//         return (pointerId) * PointerControlNum;
//     }
//     _onPointerDownEvent(evt) {
//         const pointerNum = this.pointerNum;//this.pointers.length;
//         if (pointerNum === 0) {
//             this.canvasElement.focus();

//             this.canvasElement.addEventListener('pointermove', onPointerMove);
//             this.canvasElement.addEventListener('pointerup', _onPointerUpEvent);
//         }

//         const lastGroupId = pointerNum - 1;
//         const curGroupId = pointerNum;
//         if (lastGroupId >= 0)
//             this._onButtonUp(this._getGroupControlId(lastGroupId));

//         // this._addPointer();
//         const index = _getPointerIndex();
//         this.pointers[index] = evt;
//         this.canvasElement.setPointerCapture(evt.pointerId);
//         this.pointerNum++;

//         this._onButtonDown(this._getPointerControlId(index));
//         this._onButtonDown(this._getGroupControlId(curGroupId));
//     }
//     _onPointerCancelEvent(evt) {
//         this._removePointer(evt);
//         this.canvasElement.releasePointerCapture(evt.pointerId);
//     }
//     _onPointerUpEvent(evt) {
//         const pointerNum = this.pointers.length;
//         const lastPointerId = pointerNum - 1;
//         const curPointerId = pointerNum - 2;
//         this._onButtonUp(lastPointerId * PointerControlNum);

//         this._removePointer(evt);
//         this.canvasElement.releasePointerCapture(evt.pointerId);

//         if (this.pointers.length === 0) {
//             this.canvasElement.removeEventListener('pointermove', onPointerMove);
//             this.canvasElement.removeEventListener('pointerup', _onPointerUpEvent);
//         }
//         if (curPointerId >= 0)
//             this._onButtonDown(curPointerId * PointerControlNum);
//     }
//     _onPointerMoveEvent(evt) {
//         const pos = this.controlDatas[PointerControl.Pos];
//         const move = this.controlDatas[PointerControl.Move];

//         move.value[0] = evt.pageX - pos.value[0];
//         move.value[1] = evt.pageY - pos.value[1];
//         pos.value[0] = evt.pageX;
//         pos.value[1] = evt.pageY;

//         pos.frame = move.frame = this.timeManager.frameCount;
//     }
//     // _onWheelEvent(evt) {
//     //     evt.preventDefault();
//     //     const data = this.controlDatas[PointerControl.Scroll];
//     //     data.value[0] = evt.deltaX;
//     //     data.value[1] = evt.deltaY;
//     //     data.value[2] = evt.deltaZ;
//     //     data.frame = this.timeManager.frameCount;
//     // }
//     _onContextMenu(evt) {
//         //禁掉鼠标右键菜单
//         evt.preventDefault()
//     }
//     _onFocus() {
//         if (!this._isFocus) {
//             this.canvasElement.addEventListener('contextmenu', this._onContextMenu);

//             // this.canvasElement.addEventListener('wheel', this._onWheelEvent, false);
//             this.canvasElement.addEventListener('pointerdown', this._onPointerDownEvent);
//             this.canvasElement.addEventListener('pointercancel', this._onPointerCancelEvent);
//             // this.canvasElement.addEventListener('mousemove', this._onMouseMoveEvent, false);
//             // this.canvasElement.addEventListener('mouseup', this._onMouseUpEvent, false);
//             this._isFocus = true;
//         }
//     }
//     _onBlur() {
//         if (this._isFocus) {
//             this.canvasElement.removeEventListener('contextmenu', this._onContextMenu);

//             // this.canvasElement.removeEventListener('wheel', this._onWheelEvent, false);
//             this.canvasElement.removeEventListener('pointerdown', this._onPointerDownEvent);
//             this.canvasElement.removeEventListener('pointercancel', this._onPointerCancelEvent);
//             // this.canvasElement.removeEventListener('mousemove', this._onMouseMoveEvent, false);
//             // this.canvasElement.removeEventListener('mouseup', this._onMouseUpEvent, false);
//             this._reset();
//             this._isFocus = false;
//         }
//     }
// }