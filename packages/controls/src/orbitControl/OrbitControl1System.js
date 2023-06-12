import { System, SystemGroupType } from "@poly-engine/core";
import { InputDeviceType, MouseControl, MouseDevice } from "@poly-engine/input";
import { mat4, quat, vec3 } from "@poly-engine/math";

const STATE = {
    NONE: -1,
    MOVE: 0,
    ZOOM: 1,
    PAN: 2
}

/**
 * @class OrbitControl1System
 */
export class OrbitControl1System extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 10;

        this.orbitControlCom = this.em.getComponentId('OrbitControl');
        this.orbitControlStateCom = this.em.getComponentId('OrbitControlState');
        this.transformCom = this.em.getComponentId('Transform');
        this.transformDirtyCom = this.em.getComponentId('TransformDirty');
        this.ltwCom = this.em.getComponentId('LocalToWorld');

        this.que_canvasInit = this.qm.createQuery({
            all: [this.orbitControlCom],
            none: [this.orbitControlStateCom],
        });
        // this.que_canvasRelease = this.qm.createQuery({
        //     all: [this.inputActionStateCom],
        //     none: [this.inputActionCom],
        // });
        this.que_orbitState = this.qm.createQuery({
            all: [this.orbitControlCom, this.orbitControlStateCom],
        });
        this.timeManager = world.timeManager;
        this.inputManager = world.inputManager;

        this.mouseDevice = this.inputManager.getDevice(InputDeviceType.Mouse);

        this.tempEuler = [0, 0, 0];
        this.tempQuat = [0, 0, 0, 1];
        this.tempVector = [0, 0, 0];
        // this.moveAction = this.inputManager.getActionEntity("orbitMove");
        // this.zoomAction = this.inputManager.getActionEntity("orbitZoom");
        // this.panAction = this.inputManager.getActionEntity("orbitPan");
    }
    init() {
    }
    _update(delta) {
        const em = this.em;

        this.que_canvasInit.forEach(entity => {
            let canvas = em.getComponent(entity, this.orbitControlCom);

            let canvasState = em.createComponent(this.orbitControlStateCom);
            // canvasState.value = [...canvas.defaultValue];

            this.que_canvasInit.defer(() => {
                em.setComponent(entity, this.orbitControlStateCom, canvasState);
            });
        });
        // this.que_canvasRelease.forEach(entity => {
        //     let canvasState = em.getComponent(entity, this.inputActionStateCom);
        //     window.removeEventListener("blur", canvasState._onBlur);
        //     window.removeEventListener("focus", canvasState._onFocus);
        //     canvasState._onBlur = null;
        //     canvasState._onFocus = null;

        //     this.que_canvasRelease.defer(() => {
        //         em.removeComponent(entity, this.inputActionStateCom);
        //     });
        // });

        this.que_orbitState.forEach(entity => {
            let control = em.getComponent(entity, this.orbitControlCom);
            let controlState = em.getComponent(entity, this.orbitControlStateCom);
            let ltw = em.getComponent(entity, this.ltwCom);

            const mouseDevice = this.mouseDevice;
            // this.inputManager.isActionPerformed(this.moveAction);
            let pos = mouseDevice.getValue(MouseControl.Pos);
            if (mouseDevice.isButtonDown(MouseControl.Left)) {
                controlState.startX = pos[0];
                controlState.startY = pos[1];
                controlState.state = STATE.MOVE;
            }
            else if (mouseDevice.isButtonDown(MouseControl.Right)) {
                controlState.startX = pos[0];
                controlState.startY = pos[1];
                controlState.state = STATE.PAN;
            }

            if (mouseDevice.isButtonUp()) {
                controlState.state = STATE.NONE;
            }

            let dirty = false;
            if (controlState.state !== STATE.NONE) {

                if (controlState.state === STATE.MOVE) {
                    let distanceX = pos[0] - controlState.startX;
                    let distanceY = pos[1] - controlState.startY;
                    controlState.startX = pos[0];
                    controlState.startY = pos[1];

                    dirty = this.rotate(entity, control, distanceX, distanceY);
                }
                else if (controlState.state === STATE.PAN) {
                    let distanceX = pos[0] - controlState.startX;
                    let distanceY = pos[1] - controlState.startY;
                    controlState.startX = pos[0];
                    controlState.startY = pos[1];

                    mat4.getScaling(this.tempVector, ltw.worldMat);
                    this.tempVector[0] *= distanceX * delta * 2;
                    this.tempVector[1] *= -distanceY * delta * 2;
                    dirty = this.move(entity, control, this.tempVector[0], this.tempVector[1]);
                    // console.log(this.tempVector);
                }

            }
            if(mouseDevice.hasValue(MouseControl.Scroll, true)){
                let scroll = mouseDevice.getValue(MouseControl.Scroll);
                var _deltaY = scroll[1];
                if (_deltaY < -100) {
                    _deltaY = -90
                } else if (_deltaY > 100) {
                    _deltaY = 90
                }
                var s = 1 + _deltaY * 0.001;
                dirty = this.scale(entity, control, s);
            }
            if (dirty) {
                this.que_orbitState.defer(() => {
                    em.setComponent(entity, this.transformDirtyCom);
                });
            }
        });
    }
    scale(entity, control, s) {
        const em = this.em;
        if (control.isLockScale) {
            return false;
        }
        let transform = em.getComponent(entity, this.transformCom);
        vec3.scale(transform.scale, transform.scale, s);
        return true;
    }
    move(entity, control, x, y) {
        const em = this.em;

        if (control.isLockMove) {
            return false;
        }
        let transform = em.getComponent(entity, this.transformCom);

        transform.position[0] += x;
        transform.position[1] += y;
        return true;
    }
    rotate(entity, control, distanceX, distanceY) {
        const em = this.em;

        let transform = em.getComponent(entity, this.transformCom);
        // let transform = em.getComponent(entity, this.transformCom);
        if (control.isLockRotate) {
            return false;
        }
        const tempEuler = this.tempEuler;
        var x = distanceY / 3;
        var y = distanceX / 3;
        if (control.isLockZ) {
            tempEuler[0] += x;
            tempEuler[1] += y;
            // if (control.rotationXLimit) {
            //     if (tempEuler[0] > control.rotationXLimit) {
            //         tempEuler[0] = control.rotationXLimit;
            //     } else if (tempEuler[0] < -this.rotationXLimit) {
            //         tempEuler[0] = -control.rotationXLimit;
            //     }
            // }
            quat.fromEuler(transform.rotation, tempEuler[0], tempEuler[1], tempEuler[2], "xyz");
        } else {
            vec3.set(tempEuler, x, y, 0);
            quat.fromEuler(this.tempQuat, tempEuler[0], tempEuler[1], tempEuler[2], "xyz");
            // tempQuat.fromEuler(tempEuler);
            quat.multiply(transform.rotation, this.tempQuat, transform.rotation);
            // this.model.quaternion.premultiply(tempQuat);
        }
        return true;
    }
}
