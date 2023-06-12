import { mat4 } from "@poly-engine/math";
import { BitSet, System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";

export class CameraSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 200;

        // this.com_glState = this.em.getComponentId('GlState');
        // this.canvasStateCom = this.em.getComponentId('CanvasState');
        this.com_camera = this.em.getComponentId('Camera');
        this.com_localToWorld = this.em.getComponentId('LocalToWorld');
        // this.com_resized = this.em.getComponentId('Resized');
        this.com_cameraState = this.em.getComponentId('CameraState');
        this.com_shaderData = this.em.getComponentId('ShaderData');
        this.com_ltwChanged = this.em.getComponentId('LtwChanged');

        this.que_cameraState = this.qm.createQuery({
            all: [this.com_camera, this.com_cameraState]
        });
        this.que_cameraStateInit = this.qm.createQuery({
            all: [this.com_camera],
            none: [this.com_cameraState]
        });
        this.que_cameraStateRelease = this.qm.createQuery({
            all: [this.com_cameraState],
            none: [this.com_camera]
        });
        this.que_cameraLtwChanged = this.qm.createQuery({
            all: [this.com_cameraState, this.com_ltwChanged]
        });
        this.que_cameraShaderData = this.qm.createQuery({
            all: [this.com_cameraState, this.com_shaderData, this.com_localToWorld]
        });
    }
    init() {
        this.htmlManager = this.world.htmlManager;
        this.glManager = this.world.glManager;
        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._inverseViewMatrixProp = this.shaderSystem.getProperty('camera_ViewInvMat');
        this._cameraPositionProp = this.shaderSystem.getProperty('camera_Position');

    }
    _update(delta) {
        const em = this.em;
        // const com_glState = this.com_glState;
        // let canvasEntity = em.getSingletonEntity(com_glState);
        // if (canvasEntity < 0)
        //     return;
        const com_camera = this.com_camera;
        const com_localToWorld = this.com_localToWorld;
        // const com_resized = this.com_resized;
        const com_cameraState = this.com_cameraState;

        // let canvasState = em.getComponent(canvasEntity, this.canvasStateCom);
        // let glState = em.getComponent(canvasEntity, com_glState);
        // let gl = glState.gl;

        //update camera viewport size
        // if (em.hasComponent(canvasEntity, com_resized)) 
        if (this.htmlManager.isResized) {
            this.que_cameraState.forEach(entity => {
                let camera = em.getComponent(entity, com_camera);
                let ltw = em.getComponent(entity, com_localToWorld);
                let cameraState = em.getComponent(entity, com_cameraState);
                cameraState.viewportWidth = this.htmlManager.width;
                cameraState.viewportHeight = this.htmlManager.height;
                this.updateProjection(camera, cameraState);
                this._updatePV(cameraState, ltw);
            });
        }
        this.que_cameraStateInit.forEach(entity => {
            let camera = em.getComponent(entity, com_camera);
            let ltw = em.getComponent(entity, com_localToWorld);

            let cameraState = em.createComponent(com_cameraState);
            cameraState.viewportWidth = this.htmlManager.width;
            cameraState.viewportHeight = this.htmlManager.height;
            cameraState.macroBitset = new BitSet();

            // cameraState.clearFlag = getGlClearFlag(gl, camera.clearFlag);

            this.updateProjection(camera, cameraState);
            this._updatePV(cameraState, ltw);

            this.que_cameraStateInit.defer(() => {
                em.setComponent(entity, com_cameraState, cameraState);
                em.setComponent(entity, this.com_shaderData);
                // let compId = em.getComponentIdByGroup(entity, 'ShaderData');
                // if(compId === undefined)
                //     em.setComponent(entity, this.com_shaderData);
            });
        });
        this.que_cameraStateRelease.forEach(entity => {
            this.que_cameraStateRelease.defer(() => {
                em.removeComponent(entity, com_cameraState);
            });
        });
        //update pv when transform changed
        this.que_cameraLtwChanged.forEach(entity => {
            let ltw = em.getComponent(entity, com_localToWorld);
            let cameraState = em.getComponent(entity, com_cameraState);
            this._updatePV(cameraState, ltw);
        })
        this.que_cameraShaderData.forEach(entity => {
            let ltw = em.getComponent(entity, com_localToWorld);
            let cameraState = em.getComponent(entity, com_cameraState);
            let shaderData = em.getComponent(entity, this.com_shaderData);

            this.shaderSystem.setPropertyValue(shaderData, this._inverseViewMatrixProp, cameraState.worldMat);
            this.shaderSystem.setPropertyValue(shaderData, this._cameraPositionProp, cameraState.position);
        })
    }
    _updatePV(cameraState, ltw) {
        mat4.multiply(cameraState.pvMat, cameraState.pMat, ltw.worldInvMat);
        mat4.getTranslation(cameraState.position, ltw.worldMat);
        cameraState.worldMat = ltw.worldMat;
        cameraState.vMat = ltw.worldInvMat;
    }
    updateProjection(camera, cameraState) {
        let width = cameraState.viewportWidth;
        let height = cameraState.viewportHeight;
        let aspect = width / height;
        if (camera.perspective) {
            if (aspect < 1) {
                // Portrait orientation.
                mat4.perspective(
                    cameraState.pMat,
                    camera.fovY / aspect,
                    aspect,
                    camera.near,
                    camera.far
                );
            } else {
                // Landscape orientation.
                mat4.perspective(
                    cameraState.pMat,
                    camera.fovY,
                    aspect,
                    camera.near,
                    camera.far
                );
            }
        }
        else {
            let target_aspect = camera.fovX / camera.fovY;
            if (aspect < target_aspect) {
                // Portrait orientation.
                mat4.ortho(
                    cameraState.pMat,
                    camera.fovX / aspect,
                    camera.fovX,
                    -camera.fovX / aspect,
                    -camera.fovX,
                    camera.near,
                    camera.far
                );
            } else {
                // Landscape orientation.
                mat4.ortho(
                    cameraState.pMat,
                    camera.fovY,
                    camera.fovY * aspect,
                    -camera.fovY,
                    -camera.fovY * aspect,
                    camera.near,
                    camera.far
                );
            }
        }
        mat4.invert(cameraState.pMatInv, cameraState.pMat);
    }
}

