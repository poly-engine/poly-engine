// import { SparseSet } from "@poly-engine/core";

// export class KeyboardDevice {
//     constructor(canvasElement) {
//         this.canvasElement = canvasElement;

//         this.nativeEvents = [];

//         this.curFrameHeldDownList = new SparseSet();
//         this.curFrameDownList = new SparseSet();
//         this.curFrameUpList = new SparseSet();

//         this._onKeyEvent = this._onKeyEvent.bind(this);
//         canvasElement.addEventListener("keydown", this._onKeyEvent);
//         canvasElement.addEventListener("keyup", this._onKeyEvent);
//         this._hadListener = false;
//     }

//     isButtonHeld(key) {
//         if (key === undefined) {
//             return this.curFrameHeldDownList.length > 0;
//         } else {
//             return this.curFrameHeldDownList.has(key);
//         }
//     }
//     isButtonDown(key) {
//         if (key === undefined) {
//             return this.curFrameDownList.length > 0;
//         } else {
//             return this.curFrameDownList.has(key);
//         }
//     }
//     isButtonUp(key) {
//         if (key === undefined) {
//             return this.curFrameUpList.length > 0;
//         } else {
//             return this.curFrameUpList.has(key);
//         }
//     }
//     getValue(buttonId) {
//         return this.curFrameHeldDownList.has(buttonId);
//     }

//     _update() {
//         const { nativeEvents, curFrameDownList, curFrameUpList, curFrameHeldDownList } = this;
//         curFrameDownList.length = 0;
//         curFrameUpList.length = 0;

//         if (nativeEvents.length > 0) {
//             // const frameCount = this.timeManager.frameCount;
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
//                         curFrameUpList.add(codeKey);
//                         // link: https://stackoverflow.com/questions/11818637/why-does-javascript-drop-keyup-events-when-the-metakey-is-pressed-on-mac-browser
//                         if (SystemInfo.platform === Platform.Mac && (codeKey === Keys.MetaLeft || codeKey === Keys.MetaRight)) {
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

//     _onKeyEvent(evt) {
//         this.nativeEvents.push(evt);
//     }

//     _onFocus() {
//         if (!this._hadListener) {
//             this.canvasElement.addEventListener("keydown", _onKeyEvent);
//             this.canvasElement.addEventListener("keyup", _onKeyEvent);
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