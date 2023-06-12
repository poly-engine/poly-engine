// import { SparseSet, System, SystemGroupType, SystemInfo, Platform } from "@poly-engine/core";
// import { Keys } from "./Keys";

// /**
//  * @class KeyboardSystem
//  */
// export class KeyboardSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.LateUpdate;
//         this.index = 50;

//         this.timeManager = world.timeManager;

//         this.canvasCom = this.em.getComponentId('Canvas');
//         this.canvasStateCom = this.em.getComponentId('CanvasState');

//         this.inputDeviceCom = this.em.getComponentId('InputDevice');
//         this.keyboardCom = this.em.getComponentId('Keyboard');
//         this.keyboardStateCom = this.em.getComponentId('KeyboardState');

//         this.winFocusCom = this.em.getComponentId('WinFocus');
//         this.winBlurCom = this.em.getComponentId('WinBlur');

//         this.que_keyboardInit = this.qm.createQuery({
//             all: [this.inputDeviceCom, this.keyboardCom],
//             none: [this.keyboardStateCom]
//         });
//         this.que_keyboardRelease = this.qm.createQuery({
//             all: [this.keyboardStateCom],
//             none: [this.keyboardCom]
//         });
//         this.que_keyboardState = this.qm.createQuery({
//             all: [this.inputDeviceCom, this.keyboardCom, this.keyboardStateCom],
//         });
//         this.que_keyboardFocus = this.qm.createQuery({
//             all: [this.inputDeviceCom, this.keyboardCom, this.keyboardStateCom, this.winFocusCom],
//         });
//         this.que_keyboardBlur = this.qm.createQuery({
//             all: [this.inputDeviceCom, this.keyboardCom, this.keyboardStateCom, this.winBlurCom],
//         });

//         this._activeKeyboardState = null;
//     }
//     init() {
//     }
//     _update() {
//         const em = this.em;
//         const canvasEntity = em.getSingletonEntity(this.canvasStateCom);
//         if (canvasEntity === -1)
//             return;
//         const canvasState = em.getComponent(canvasEntity, this.canvasStateCom);
//         const element = canvasState.element;
//         this.que_keyboardInit.forEach(entity => {
//             let state = em.createComponent(this.keyboardStateCom);
//             let _onKeyEvent = (evt) => {
//                 state.nativeEvents.push(evt);
//             }
//             element.addEventListener("keydown", _onKeyEvent);
//             element.addEventListener("keyup", _onKeyEvent);
//             state.callback = _onKeyEvent;
//             state.hadListener = true;

//             // state.curHeldDownKeyToIndexMap = [];
//             state.upKeyToFrameCountMap = [];
//             state.downKeyToFrameCountMap = [];
//             state.curFrameHeldDownList = new SparseSet();
//             state.curFrameDownList = new SparseSet();
//             state.curFrameUpList = new SparseSet();

//             this.que_keyboardInit.defer(() => {
//                 em.setComponent(entity, this.keyboardStateCom, state);
//             });
//         });
//         this.que_keyboardRelease.forEach(entity => {
//             let state = em.getComponent(entity, this.keyboardStateCom);
//             let _onKeyEvent = state.callback;
//             if (state._hadListener) {
//                 element.removeEventListener("keydown", _onKeyEvent);
//                 element.removeEventListener("keyup", _onKeyEvent);
//                 state.hadListener = false;
//             }
//             state.nativeEvents.length = 0;

//             // state.curHeldDownKeyToIndexMap = null;
//             state.upKeyToFrameCountMap = null;
//             state.downKeyToFrameCountMap = null;
//             state.curFrameHeldDownList = null;
//             state.curFrameDownList = null;
//             state.curFrameUpList = null;

//             this.que_keyboardRelease.defer(() => {
//                 em.removeComponent(entity, this.keyboardStateCom);
//             });
//         });

//         this._activeKeyboardState = null;
//         this.que_keyboardState.forEach(entity => {
//             let state = em.getComponent(entity, this.keyboardStateCom);
//             this._updateState(state);
//             this._activeKeyboardState = state;
//         });

//         //on focus
//         if (em.hasComponent(canvasEntity, this.winFocusCom)) {
//             this.que_keyboardFocus.forEach(entity => {
//                 let state = em.getComponent(entity, this.keyboardStateCom);
//                 let _onKeyEvent = state.callback;
//                 if (!state.hadListener) {
//                     element.addEventListener("keydown", _onKeyEvent);
//                     element.addEventListener("keyup", _onKeyEvent);
//                     state.hadListener = true;
//                 }

//                 this.que_keyboardFocus.defer(() => {
//                     em.removeComponent(entity, this.winFocusCom);
//                 });
//             });
//         }
//         //on blur
//         if (em.hasComponent(canvasEntity, this.winBlurCom)) {
//             this.que_keyboardBlur.forEach(entity => {
//                 let state = em.getComponent(entity, this.keyboardStateCom);
//                 let _onKeyEvent = state.callback;
//                 if (state.hadListener) {
//                     element.removeEventListener("keydown", _onKeyEvent);
//                     element.removeEventListener("keyup", _onKeyEvent);
//                     // state.curHeldDownKeyToIndexMap.length = 0;
//                     state.curFrameHeldDownList.length = 0;
//                     state.curFrameDownList.clear();
//                     state.curFrameUpList.clear();
//                     state.nativeEvents.clear();
//                     state.hadListener = false;
//                 }

//                 this.que_keyboardBlur.defer(() => {
//                     em.removeComponent(entity, this.winBlurCom);
//                 });
//             });
//         }
//     }

//     _updateState(state) {
//         const { nativeEvents, curFrameDownList, curFrameUpList } = state;
//         curFrameDownList.length = 0;
//         curFrameUpList.length = 0;

//         if (nativeEvents.length > 0) {
//             const frameCount = this.timeManager.frameCount;
//             const {
//                 // curHeldDownKeyToIndexMap,
//                 curFrameHeldDownList,
//                 // downKeyToFrameCountMap,
//                 // upKeyToFrameCountMap
//             } = state;
//             for (let i = 0, n = nativeEvents.length; i < n; i++) {
//                 const evt = nativeEvents[i];
//                 const codeKey = Keys[evt.code];
//                 switch (evt.type) {
//                     case "keydown":
//                         // Filter the repeated triggers of the keyboard.
//                         if (!curFrameHeldDownList.has(codeKey)) {
//                             curFrameDownList.add(codeKey);
//                             curFrameHeldDownList.add(codeKey);
//                             // curHeldDownKeyToIndexMap[codeKey] = curFrameHeldDownList.length - 1;
//                             // downKeyToFrameCountMap[codeKey] = frameCount;
//                         }
//                         break;
//                     case "keyup":
//                         if (curFrameHeldDownList.has(codeKey)) {
//                             curFrameHeldDownList.remove(codeKey);
//                         }
//                         // const delIndex = curHeldDownKeyToIndexMap[codeKey];
//                         // if (delIndex != null) {
//                         //     curHeldDownKeyToIndexMap[codeKey] = null;
//                         //     const swapCode = curFrameHeldDownList.deleteByIndex(delIndex);
//                         //     swapCode && (curHeldDownKeyToIndexMap[swapCode] = delIndex);
//                         // }
//                         curFrameUpList.add(codeKey);
//                         // upKeyToFrameCountMap[codeKey] = frameCount;
//                         // Because on the mac, the keyup event is not responded to when the meta key is held down,
//                         // in order to maintain the correct keystroke record, it is necessary to clear the record
//                         // when the meta key is lifted.
//                         // link: https://stackoverflow.com/questions/11818637/why-does-javascript-drop-keyup-events-when-the-metakey-is-pressed-on-mac-browser
//                         if (SystemInfo.platform === Platform.Mac && (codeKey === Keys.MetaLeft || codeKey === Keys.MetaRight)) {
//                             // for (let i = 0, n = curFrameHeldDownList.length; i < n; i++) {
//                             //     curHeldDownKeyToIndexMap[curFrameHeldDownList.get(i)] = null;
//                             // }
//                             // curFrameHeldDownList.length = 0;
//                             curFrameHeldDownList.clear();
//                         }
//                         break;
//                     default:
//                         break;
//                 }
//             }
//             nativeEvents.length = 0;
//         }

//     }

//     isKeyHeldDown(key) {
//         // const entity = this.que_keyboardState.getSingletonEntity();
//         // if (entity === -1)
//         //     return false;
//         // const state = this.em.getComponent(entity, this.keyboardStateCom);
//         const state = this._activeKeyboardState;
//         if(state == null)
//             return false;
//         if (key === undefined) {
//             return state.curFrameHeldDownList.length > 0;
//         } else {
//             return state.curFrameHeldDownList.has(key);
//         }
//     }
//     isKeyDown(key) {
//         const state = this._activeKeyboardState;
//         if(state == null)
//             return false;
//         if (key === undefined) {
//             return state.curFrameDownList.length > 0;
//         } else {
//             return state.curFrameDownList.has(key);
//         }
//     }
//     isKeyUp(key) {
//         const state = this._activeKeyboardState;
//         if(state == null)
//             return false;
//         if (key === undefined) {
//             return state.curFrameUpList.length > 0;
//         } else {
//             return state.curFrameUpList.has(key);
//         }
//     }
// }

// //settings
// //type: button/axis
// //deviceType: keyboard/mouse/torch/xr
// //mapType: 
// //platform/{id,type,maps:[{deviceType, mapType, buttonId, },{}]}