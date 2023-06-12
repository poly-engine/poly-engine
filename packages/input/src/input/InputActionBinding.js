// import { ButtonState } from "./InputAction.js";
// import { InputControlType } from "./InputControlType.js";

// export class InputActionBinding {
//     constructor(action) {
//         this.action = action;
//     }
// }

// export class BaseControlBinding {
//     constructor(action, device, controlId, phase, ...deviceControls) {
//         this.action = action;

//         this.device = device;
//         this.controlId = controlId;
//         this.buttonState = phase;

//         if (deviceControls.length > 0) {

//             this.controls = [];
//             this.controls.push(...deviceControls);
//         }
//     }
//     init(device, controlId, phase, ...deviceControls){
//         this.device = device;
//         this.controlId = controlId;
//         this.buttonState = phase;

//         if (deviceControls.length > 0) {
//             this.controls = [];
//             this.controls.push(...deviceControls);
//         }
//     }
//     fromJson(json){
//         const manager = this.action.manager;
//         this.device = manager.getDevice(json.device);
//         this.controlId = json.controlId;
//         this.buttonState = json.state;

//         this.controls = json.controls;
//         // const deviceControls = json.controls;
//         // if (deviceControls && deviceControls.length > 0) {
//         //     this.controls = [];

//         //     this.controls.push(...deviceControls);
//         // }
//     }
//     toJson(){

//     }

//     hasValue() {
//         if (this.controls != null) {
//             for (let i = 0; i < this.controls.length; i++) {
//                 const c = this.controls[i];
//                 if (!c.device.hasValue(c.controlId))
//                     return false;
//             }
//         }
//         return this.device.hasValue(this.controlId);
//         // if(!this.device.hasValue(controlId))
//         //     return false;
//     }
//     updateValue() {
//         const value = this.action.value;
//         if (this.controls != null) {
//             for (let i = 0; i < this.controls.length; i++) {
//                 const c = this.controls[i];
//                 if (!c.device.isPerformed(c.controlId, ButtonState.Held))
//                     return false;
//             }
//         }
//         const ok = this.device.isPerformed(this.controlId, this.buttonState);
//         if (ok) {
//             if (this.action.type === InputControlType.Button) {
//                 value[0] = 1;
//             }
//             else
//                 this.action.copyValue(this.device.getValue(this.controlId));
//         }
//         return ok;
//         // if (this.action.type === InputControlType.Button) {
//         //     if (this.buttonState === ButtonState.Down) {
//         //         if (this.device.isButtonDown(this.controlId)) {
//         //             value[0] = 1;
//         //             // this.action.phase = performed;
//         //             return true;
//         //         }
//         //     }
//         //     else if (this.buttonState === ButtonState.Up) {
//         //         if (this.device.isButtonUp(this.controlId)) {
//         //             value[0] = 1;
//         //             return true;
//         //         }
//         //     }
//         //     else if (this.buttonState === ButtonState.Held) {
//         //         if (this.device.isButtonHeld(this.controlId)) {
//         //             value[0] = 1;
//         //             return true;
//         //         }
//         //     }
//         //     value[0] = 0;
//         // } else {
//         //     this.action.copyValue(this.device.getValue(this.controlId));
//         //     return true;
//         // }

//         // return false;
//     }

// }
