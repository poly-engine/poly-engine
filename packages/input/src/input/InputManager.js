import { KeyboardDevice } from "../keyboard/KeyboardDevice.js";
import { MouseDevice } from "../mouse/MouseDevice.js";
import { InputActionPhase } from "../inputAction/InputActionPhase.js";
import { TouchDevice } from "../touch/TouchDevice.js";

export const InputDeviceType = {
    Keyboard: 0,
    Mouse: 1,
    Touch: 2,
    Gamepad: 3,
    VRHMD: 4,
    VRController: 5
}
/**
 * @class InputManager
 */
export class InputManager {
    constructor(world) {
        this.world = world;
        this.em = world.entityManager;

        this.htmlManager = world.htmlManager;
        this.timeManager = world.timeManager;

        this.inputActionCom = this.em.getComponentId('InputAction');
        this.inputActionStateCom = this.em.getComponentId('InputActionState');

        this.htmlManager.focusEvent.sub(this._onFocus, this);
        this.htmlManager.blurEvent.sub(this._onBlur, this);

        this.devices = [];
        this.devices[InputDeviceType.Keyboard] = new KeyboardDevice(world);
        this.devices[InputDeviceType.Mouse] = new MouseDevice(world);
        this.devices[InputDeviceType.Touch] = new TouchDevice(world);

        this._actions = [];
        this._actionMap = new Map;

        // this._actionMaps = []
        this._actionMapMap = new Map;

        this._classMap = Object.create(null);
    }
    destroy() {
        this.htmlManager.focusEvent.unsub(this._onFocus, this);
        this.htmlManager.blurEvent.unsub(this._onFocus, this);
    }
    //#region  device
    getDevice(type) {
        return this.devices[type];
    }
    // registerDevice(type, device){
    //     this.devices[type] = device;
    // }

    //#endregion

    //#region action map
    // registerBindingClass(classType) {
    //     this._classMap[classType.name] = classType;
    // }

    // createActionMap(name, json) {
    //     const context = { classMap: this._classMap };
    //     const actionMap = Object.create(null);
    //     for (let key in json) {
    //         const actionJson = json[key];
    //         const action = new InputAction(this, key, actionJson.type, actionJson.defaultValue);
    //         // action.fromJson(json[key], context);
    //         const bindings = actionJson.bindings;
    //         for (let i = 0; i < bindings.length; i++) {
    //             const bindingJson = bindings[i];
    //             let classType = context.classMap[bindingJson.type];
    //             let binding = new classType(this);
    //             // binding.fromJson(bindingJson);
    //             Object.assign(binding, bindingJson);
    //             // let binding = this.manager.createBinding(bindingJson.type, bindingJson);
    //             action.addBinding(binding);
    //         }

    //         actionMap[key] = action;
    //     }
    // }
    // addAction(action) {
    //     const name = action.name;
    //     if (this._actionMap.has(name))
    //         return false;
    //     this._actionMap.set(name, action);
    //     this._actions.push(action);
    // }

    createActionEntity(json){
        return this.em.entityFromJson(json);
    }

    hasActionValue(actionId) {
        let entity = actionId;
        if (typeof actionId === "string")
            entity = this.em.getSharedEntity(this.inputActionCom, actionId);
        const comp = this.em.getComponent(entity, this.inputActionStateCom);
        return comp.phase !== InputActionPhase.Waiting;
    }
    getActionValue(actionId) {
        let entity = actionId;
        if (typeof actionId === "string")
            entity = this.em.getSharedEntity(this.inputActionCom, actionId);
        const comp = this.em.getComponent(entity, this.inputActionStateCom);
        return comp?.value;
    }
    isActionPerformed(actionId) {
        let entity = actionId;
        if (typeof actionId === "string")
            entity = this.em.getSharedEntity(this.inputActionCom, actionId);
        const comp = this.em.getComponent(entity, this.inputActionStateCom);
        return comp.phase === InputActionPhase.Performed && comp.frame === this.timeManager.frameCount;
    }
    getActionEntity(actionId){
        entity = this.em.getSharedEntity(this.inputActionCom, actionId);
        return entity;
    }

    //#endregion

    update(delta) {
        //update device
        const devices = this.devices;
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            device?._update();
        }

        //update action map
        const actions = this._actions;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            action._update();
        }
    }
    _onFocus() {
        const devices = this.devices;
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            device?._onFocus();
        }
    }
    _onBlur() {
        const devices = this.devices;
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            device?._onBlur();
        }
    }
}

