import { System, SystemGroupType } from "@poly-engine/core";
import { mat4, vec3 } from "@poly-engine/math";
import { ControlHandlerType } from "./ControlHandlerType";
import { Spherical } from "./Spherical";
import { InputDeviceType, MouseControl, MouseDevice } from "@poly-engine/input";

const STATE = {
    NONE: -1,
    MOVE: 0,
    ZOOM: 1,
    PAN: 2
}
/**
 * @class OrbitControlSystem
 */
export class OrbitControlSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 10;

        this.orbitControlCom = this.em.getComponentId('OrbitControl');
        this.orbitControlStateCom = this.em.getComponentId('OrbitControlState');

        this.transformCom = this.em.getComponentId("Transform");
        this.ltwCom = this.em.getComponentId("LocalToWorld");
        this.cameraCom = this.em.getComponentId("Camera");

        this.que_orbitControl = this.qm.createQuery({
            all: [this.orbitControlCom, this.orbitControlStateCom, this.cameraCom]
        });

        this.que_initState = this.qm.createQuery({
            all: [this.orbitControlCom],
            none: [this.orbitControlStateCom],
        });
        this.que_releaseState = this.qm.createQuery({
            all: [this.orbitControlStateCom],
            none: [this.orbitControlCom],
        });

        this.timeManager = world.timeManager;
        this.inputManager = world.inputManager;
        this.transformManager = world.transformManager;
        this.mouseDevice = this.inputManager.getDevice(InputDeviceType.Mouse);

        this._tempVec3 = [0, 0, 0];
        this._tempVec31 = [0, 0, 0];
        this.tempMat4 = mat4.create();
        this._panOffset = [0, 0, 0];
        this._sphericalDelta = new Spherical();
        this._zoomFrag = 0;
        this._scale = 1;
    }
    init() {
    }
    _update(delta) {
        const em = this.em;

        this.que_initState.forEach(entity => {
            let orbitControl = em.getComponent(entity, this.orbitControlCom);
            let orbitControlState = em.createComponent(this.orbitControlStateCom);

            orbitControlState.spherical.setYAxis(orbitControl.up);

            this.que_initState.defer(() => {
                em.setComponent(entity, this.orbitControlStateCom, orbitControlState);
            });
        });
        // this.que_releaseState.forEach(entity => {
        //     let canvasState = em.getComponent(entity, this.orbitControlStateCom);

        //     this.que_releaseState.defer(() => {
        //         em.removeComponent(entity, this.orbitControlStateCom);
        //     });
        // });

        this.que_orbitControl.forEach(entity => {
            let control = em.getComponent(entity, this.orbitControlCom);
            let controlState = em.getComponent(entity, this.orbitControlStateCom);

            /** Update this._sphericalDelta, this._scale and this._panOffset. */
            this._updateInputDelta(entity, control, controlState, delta);
            this.que_orbitControl.defer(() => {
                /** Update camera's transform. */
                this._updateTransform(entity, control, controlState, delta);
            });
        });
    }

    _updateInputDelta(entity, control, controlState, deltaTime) {
        const em = this.em;
        let curHandlerType = ControlHandlerType.None;
        // const { _tempVec3: delta, _enableHandler: enableHandler } = this;
        const enableHandler = control.enableHandler;
        let dirty = false;

        const mouseDevice = this.mouseDevice;
        // this.inputManager.isActionPerformed(this.moveAction);
        let pos = mouseDevice.getValue(MouseControl.Pos);

        if (mouseDevice.isButtonDown(MouseControl.Left)) {
            controlState.state |= ControlHandlerType.ROTATE;
            controlState.startX = pos[0];
            controlState.startY = pos[1];
            // controlState.state = STATE.MOVE;
        }
        else if (mouseDevice.isButtonUp(MouseControl.Left)){
            controlState.state &= ~ControlHandlerType.ROTATE;
        }
        if (mouseDevice.isButtonDown(MouseControl.Right)) {
            controlState.state |= ControlHandlerType.PAN;
            controlState.startPanX = pos[0];
            controlState.startPanY = pos[1];
            // controlState.state = STATE.PAN;
        }
        else if (mouseDevice.isButtonUp(MouseControl.Right)){
            controlState.state &= ~ControlHandlerType.PAN;
        }
        if (mouseDevice.hasValue(MouseControl.Scroll, true)) {
            controlState.state |= ControlHandlerType.ZOOM;
            let scroll = mouseDevice.getValue(MouseControl.Scroll);
            dirty = this._zoom(entity, control, controlState, scroll);
        }
        else{
            controlState.state &= ~ControlHandlerType.ZOOM;
        }

        curHandlerType = controlState.state;

        if (controlState.state & ControlHandlerType.ROTATE) {
            let deltaX = pos[0] - controlState.startX;
            let deltaY = pos[1] - controlState.startY;
            controlState.startX = pos[0];
            controlState.startY = pos[1];
            dirty = this._rotate(entity, control, controlState, deltaX, deltaY);
        }
        if (controlState.state & ControlHandlerType.PAN) {
            let deltaX = pos[0] - controlState.startPanX;
            let deltaY = pos[1] - controlState.startPanY;
            controlState.startPanX = pos[0];
            controlState.startPanY = pos[1];
            dirty = this._pan(entity, control, controlState, deltaX, deltaY);
        }

        // if (mouseDevice.isButtonDown(MouseControl.Left)) {
        //     controlState.startX = pos[0];
        //     controlState.startY = pos[1];
        //     controlState.state = STATE.MOVE;
        // }
        // else if (mouseDevice.isButtonDown(MouseControl.Right)) {
        //     controlState.startX = pos[0];
        //     controlState.startY = pos[1];
        //     controlState.state = STATE.PAN;
        // }
        // if (mouseDevice.isButtonUp()) {
        //     controlState.state = STATE.NONE;
        // }

        // if (controlState.state !== STATE.NONE) {

        //     if (controlState.state === STATE.MOVE) {
        //         curHandlerType |= ControlHandlerType.ROTATE;

        //         let deltaX = pos[0] - controlState.startX;
        //         let deltaY = pos[1] - controlState.startY;
        //         controlState.startX = pos[0];
        //         controlState.startY = pos[1];

        //         dirty = this._rotate(entity, control, controlState, deltaX, deltaY);
        //     }
        //     else if (controlState.state === STATE.PAN) {
        //         curHandlerType |= ControlHandlerType.PAN;

        //         let deltaX = pos[0] - controlState.startX;
        //         let deltaY = pos[1] - controlState.startY;
        //         controlState.startX = pos[0];
        //         controlState.startY = pos[1];

        //         dirty = this._pan(entity, control, controlState, deltaX, deltaY);
        //         // mat4.getScaling(this.tempVector, ltw.worldMat);
        //         // this.tempVector[0] *= deltaX * delta * 2;
        //         // this.tempVector[1] *= -deltaY * delta * 2;
        //         // dirty = this.move(entity, control, this.tempVector[0], this.tempVector[1]);
        //     }

        // }
        // if (mouseDevice.hasValue(MouseControl.Scroll, true)) {
        //     curHandlerType |= ControlHandlerType.ZOOM;
        //     let scroll = mouseDevice.getValue(MouseControl.Scroll);
        //     // var _deltaY = scroll[1];
        //     // if (_deltaY < -100) {
        //     //     _deltaY = -90
        //     // } else if (_deltaY > 100) {
        //     //     _deltaY = 90
        //     // }
        //     // var s = 1 + _deltaY * 0.001;
        //     dirty = this._zoom(entity, control, controlState, scroll);
        // }

        // const { sphericalDump, sphericalDelta } = controlState;
        const sphericalDelta = this._sphericalDelta;
        const sphericalDump = controlState.sphericalDump;
        if (control.enableDamping) {
            if (enableHandler & ControlHandlerType.ZOOM && curHandlerType ^ ControlHandlerType.ZOOM) {
                this._zoomFrag *= 1 - control.zoomFactor;
            }
            if (enableHandler & ControlHandlerType.ROTATE && curHandlerType ^ ControlHandlerType.ROTATE) {
                sphericalDelta.theta = sphericalDump.theta *= 1 - control.dampingFactor;
                sphericalDelta.phi = sphericalDump.phi *= 1 - control.dampingFactor;
            }
        }
        if (curHandlerType === ControlHandlerType.None && control.autoRotate) {
            const rotateAngle = control.autoRotateSpeed * deltaTime;
            sphericalDelta.theta -= rotateAngle;
        }
        return dirty;
    }
    _zoom(entity, control, controlState, delta) {
        const deltaY = delta[1];
        if (deltaY > 0) {
            this._scale /= Math.pow(0.95, control.zoomSpeed);
        } else if (deltaY < 0) {
            this._scale *= Math.pow(0.95, control.zoomSpeed);
        }
    }
    _rotate(entity, control, controlState, deltaX, deltaY) {
        const em = this.em;
        const width = 400;//this.canvas.width
        const height = 400;//this.canvas.height
        const radianLeft = ((2 * Math.PI * deltaX) / width) * control.rotateSpeed;
        this._sphericalDelta.theta -= radianLeft;
        const radianUp = ((2 * Math.PI * deltaY) / height) * control.rotateSpeed;
        this._sphericalDelta.phi -= radianUp;
        if (control.enableDamping) {
            controlState.sphericalDump.theta = -radianLeft;
            controlState.sphericalDump.phi = -radianUp;
        }
    }
    _pan(entity, control, controlState, deltaX, deltaY) {
        const em = this.em;
        const transform = em.getComponent(entity, this.transformCom);
        const ltw = em.getComponent(entity, this.ltwCom);
        const camera = em.getComponent(entity, this.cameraCom);

        // const { cameraTransform } = this;
        // const { elements } = cameraTransform.worldMatrix;
        const elements = ltw.worldMat;
        // const { height } = this.canvas;
        const height = 6;
        const targetDistance =
            vec3.distance(transform.position, control.target) * (camera.fovY / 2) * (Math.PI / 180);
        const distanceLeft = -2 * deltaX * (targetDistance / height);
        const distanceUp = 2 * deltaY * (targetDistance / height);
        this._panOffset[0] += elements[0] * distanceLeft + elements[4] * distanceUp;
        this._panOffset[1] += elements[1] * distanceLeft + elements[5] * distanceUp;
        this._panOffset[2] += elements[2] * distanceLeft + elements[6] * distanceUp;
    }

    _updateTransform(entity, control, controlState) {
        const em = this.em;
        // const { cameraTransform, target, _tempVec3, _spherical, _sphericalDelta, _panOffset } = this;
        const transform = em.getComponent(entity, this.transformCom);
        const ltw = em.getComponent(entity, this.ltwCom);
        if (ltw == null)
            return;

        const target = control.target;
        const _tempVec3 = this._tempVec3;
        const _tempVec31 = this._tempVec31;
        const _spherical = controlState.spherical;
        const _sphericalDelta = this._sphericalDelta;
        const _panOffset = this._panOffset;

        // _tempVec3.copyFrom(cameraTransform.worldUp);
        mat4.worldUp(_tempVec3, ltw.worldMat);
        controlState._atTheBack = _tempVec3[1] <= 0;
        vec3.subtract(_tempVec3, transform.position, target);
        _spherical.setFromVec3(_tempVec3, controlState._atTheBack);
        _spherical.theta += _sphericalDelta.theta;
        _spherical.phi += _sphericalDelta.phi;
        _spherical.theta = Math.max(control.minAzimuthAngle, Math.min(control.maxAzimuthAngle, _spherical.theta));
        _spherical.phi = Math.max(control.minPolarAngle, Math.min(control.maxPolarAngle, _spherical.phi));
        _spherical.makeSafe();
        if (this._scale !== 1) {
            this._zoomFrag = _spherical.radius * (this._scale - 1);
        }
        _spherical.radius += this._zoomFrag;
        _spherical.radius = Math.max(control.minDistance, Math.min(control.maxDistance, _spherical.radius));
        controlState._atTheBack = _spherical.setToVec3(_tempVec3);
        // Vector3.add(target.add(_panOffset), _tempVec3, cameraTransform.worldPosition);
        vec3.add(target, target, _panOffset);
        vec3.add(_tempVec3, target, _tempVec3);
        // this.transformManager.setWorldPosition(entity, _tempVec3);
        vec3.copy(_tempVec31, control.up);
        vec3.scale(_tempVec31, _tempVec31, controlState._atTheBack ? -1 : 1);
        // mat4.lookAt(this.tempMat4, _tempVec3, target, _tempVec31);
        mat4.targetTo(this.tempMat4, _tempVec3, target, _tempVec31);
        this.transformManager.setWorldMatrix(entity, this.tempMat4);
        // cameraTransform.lookAt(target, _tempVec3.copyFrom(this.up).scale(controlState._atTheBack ? -1 : 1));
        /** Reset cache value. */
        this._zoomFrag = 0;
        this._scale = 1;
        _sphericalDelta.set(0, 0, 0);
        // _panOffset.set(0, 0, 0);
        vec3.set(_panOffset, 0, 0, 0);
    }
}
