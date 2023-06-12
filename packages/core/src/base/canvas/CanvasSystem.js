// import { System } from "../../ecs/System.js";
// import { SystemGroupType } from "../../ecs/SystemGroup.js";

// /**
//  * @class CanvasSystem
//  */
// export class CanvasSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.PreUpdate;
//         this.index = 100;

//         this.canvasCom = this.em.getComponentId('Canvas');
//         this.canvasStateCom = this.em.getComponentId('CanvasState');
//         this.resizedCom = this.em.getComponentId('Resized');

//         this.winFocusCom = this.em.getComponentId('WinFocus');
//         this.winBlurCom = this.em.getComponentId('WinBlur');

//         this.que_canvasState = this.qm.createQuery({
//             all: [this.canvasCom, this.canvasStateCom]
//         });

//         this.que_canvasInit = this.qm.createQuery({
//             all: [this.canvasCom],
//             none: [this.canvasStateCom],
//         });
//         this.que_canvasRelease = this.qm.createQuery({
//             all: [this.canvasStateCom],
//             none: [this.canvasCom],
//         });

//         this.que_canvasResized = this.qm.createQuery({
//             all: [this.canvasCom],
//             none: [this.com_renderState]
//         });

//         this.que_winFocus = this.qm.createQuery({
//             all: [this.canvasCom, this.canvasStateCom]
//         });
//     }
//     init() {
//     }
//     _update() {
//         const em = this.em;
//         // this.que_canvasResized.forEach(entity => {
//         //     this.que_canvasResized.defer(() => {
//         //         em.removeComponent(entity, this.resizedCom);
//         //     });
//         // });

//         this.que_canvasInit.forEach(entity => {
//             let canvas = em.getComponent(entity, this.canvasCom);
//             canvas.element ??= document.querySelector(canvas.id);
//             let element = canvas.element;

//             let canvasState = em.createComponent(this.canvasStateCom, element);
//             canvasState._onBlur = (evt) => {
//                 em.setComponent(entity, this.winBlurCom);
//             }
//             canvasState._onFocus = (evt) => {
//                 em.setComponent(entity, this.winFocusCom);
//             }
//             window.addEventListener("blur", canvasState._onBlur);
//             window.addEventListener("focus", canvasState._onFocus);

//             this.que_canvasInit.defer(() => {
//                 em.setComponent(entity, this.canvasStateCom, canvasState);
//             });
//         });
//         this.que_canvasRelease.forEach(entity => {
//             let canvasState = em.getComponent(entity, this.canvasStateCom);
//             window.removeEventListener("blur", canvasState._onBlur);
//             window.removeEventListener("focus", canvasState._onFocus);
//             canvasState._onBlur = null;
//             canvasState._onFocus = null;

//             this.que_canvasRelease.defer(() => {
//                 em.removeComponent(entity, this.canvasStateCom);
//             });
//         });

//         this.que_canvasState.forEach(entity => {
//             let state = em.getComponent(entity, this.canvasStateCom);
//             let element = state.element;
//             let resized = false;

//             let width = element.clientWidth;
//             let height = element.clientHeight;
//             if (state.width !== width || state.height !== height) {
//                 resized = true;
//                 state.width = element.width = width;
//                 state.height = element.height = height;
//                 this.que_canvasState.defer(() => {
//                     em.setComponent(entity, this.resizedCom);
//                 });
//             }
//         });
//     }
// }
