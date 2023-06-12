// import { InputControl } from "./InputControl.js";
// import { InputControlType } from "./InputControlType.js";

// /**
//  * @enum {number}
//  */
// export const ButtonState = {
//     None: 0,
//     Down: 1,
//     Up: 2,
//     Held: 3,
// }
// /**
//  * @enum {number}
//  */
// export const InputActionPhase = {
//     Waiting: 0,
//     Started: 1,
//     Performed: 2,
//     Canceled: 3,
// }
// export class InputAction extends InputControl {
//     constructor(manager, name, type, defaulValue) {
//         super(type, defaulValue);

//         this.manager = manager;
//         this.timeManager = this.manager.world.timeManager;

//         this.name = name;
//         this.bindings = [];

//         // this.controlData;
//         this.phase = InputActionPhase.Waiting;
//     }
//     fromJson(json, context) {
//         this.type = json.type;
//         this.defaultValue = json.defaulValue;

//         const bindingDatas = json.bindings;
//         for (let i = 0; i < bindingDatas.length; i++) {
//             const bindingData = bindingDatas[i];
//             let bindingType = context.classMap[bindingData._type];
//             let binding = new bindingType(this);
//             binding.fromJson(bindingData, context);
//             this.addBinding(binding);
//         }
//     }
//     toJson(context) {

//     }
//     addBinding(binding) {
//         this.bindings.push(binding);
//     }
//     _update() {
//         let result = false;
//         for (let i = 0; i < this.bindings.length; i++) {
//             const binding = this.bindings[i];
//             if (!binding.hasValue())
//                 continue;
//             result = binding.updateValue(this.controlData);
//             break;
//         }
//         if (result) {
//             if (this.phase !== InputActionPhase.Performed) {
//                 this.phase = InputActionPhase.Performed;
//                 this.frame = this.timeManager.frameCount;
//             }
//         }
//         else {
//             if (this.phase === InputActionPhase.Performed) {
//                 this.phase = InputActionPhase.Canceled;
//                 this.frame = this.timeManager.frameCount;
//             }
//             if (this.phase === InputActionPhase.Canceled) {
//                 this.phase = InputActionPhase.Waiting;
//                 this.reset();
//                 // frame = this.timeManager.frameCount;
//             }
//         }
//     }
//     hasValue() {
//         // if (frame === this.timeManager.frameCount)
//         //     return true;
//         // return !isDefault();
//         return this.phase !== InputActionPhase.Waiting;
//     }
//     getValue() {
//         return this.value;
//     }
//     isPerformed() {
//         return this.phase === InputActionPhase.Performed && this.frame === this.timeManager.frameCount;
//     }
// }