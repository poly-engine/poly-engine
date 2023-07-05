import { glMatrix, mat4, vec4 } from "@poly-engine/math";
import { BitSet, System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";

export class CameraSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.LateUpdate;
        this.index = 1200;

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

        this._inverseViewMatrixProp = this.glManager.getProperty('camera_ViewInvMat');
        this._cameraPositionProp = this.glManager.getProperty('camera_Position');

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
                if (camera.aspectRatio === 0)
                    cameraState.aspectRatio = (cameraState.viewportWidth * camera.viewport[2]) / (cameraState.viewportHeight * camera.viewport[3])
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

            cameraState.aspectRatio = camera.aspectRatio;
            if (camera.aspectRatio === 0)
                cameraState.aspectRatio = (cameraState.viewportWidth * camera.viewport[2]) / (cameraState.viewportHeight * camera.viewport[3])

            this.updateProjection(camera, cameraState);
            this._updatePV(cameraState, ltw);

            let shaderData = em.createComponent(this.com_shaderData);
            this.glManager.setPropertyValue(shaderData, this._inverseViewMatrixProp, cameraState.worldMat);
            this.glManager.setPropertyValue(shaderData, this._cameraPositionProp, cameraState.position);

            this.que_cameraStateInit.defer(() => {
                em.setComponent(entity, com_cameraState, cameraState);
                em.setComponent(entity, this.com_shaderData, shaderData);
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
        // this.que_cameraShaderData.forEach(entity => {
        //     let ltw = em.getComponent(entity, com_localToWorld);
        //     let cameraState = em.getComponent(entity, com_cameraState);
        //     let shaderData = em.getComponent(entity, this.com_shaderData);

        //     this.glManager.setPropertyValue(shaderData, this._inverseViewMatrixProp, cameraState.worldMat);
        //     this.glManager.setPropertyValue(shaderData, this._cameraPositionProp, cameraState.position);
        // })
    }
    _updatePV(cameraState, ltw) {
        mat4.multiply(cameraState.pvMat, cameraState.pMat, ltw.worldInvMat);
        mat4.getTranslation(cameraState.position, ltw.worldMat);
        // cameraState.worldMat = ltw.worldMat;
        mat4.copy(cameraState.worldMat, ltw.worldMat);
        // cameraState.viewMat = ltw.worldInvMat;
        mat4.copy(cameraState.viewMat, ltw.worldInvMat);

        // const position = [0,0,0,1];
        // const positionVS = vec4.transformMat4(position, position, cameraState.vMat);
        // // v_positionVS = positionVS.xyz / positionVS.w;
        // console.log(cameraState.worldMat, cameraState.vMat, position);
    }
    updateProjection(camera, cameraState) {
        // let width = cameraState.viewportWidth;
        // let height = cameraState.viewportHeight;
        let aspect = cameraState.aspectRatio;
        if (camera.perspective) {
            mat4.perspective(
                cameraState.pMat,
                glMatrix.degreeToRadian(camera.fieldOfView),
                // camera.fovY / aspect,
                aspect,
                camera.nearClipPlane,
                camera.farClipPlane
            );
            // if (aspect < 1) {
            //     // Portrait orientation.
            //     mat4.perspective(
            //         cameraState.pMat,
            //         camera.fovY / aspect,
            //         aspect,
            //         camera.nearClipPlane,
            //         camera.farClipPlane
            //     );
            // } else {
            //     // Landscape orientation.
            //     mat4.perspective(
            //         cameraState.pMat,
            //         camera.fovY,
            //         aspect,
            //         camera.nearClipPlane,
            //         camera.farClipPlane
            //     );
            // }
        }
        else {
            const width = camera.orthographicSize * aspect;
            const height = camera.orthographicSize;
            // Matrix.ortho(-width, width, -height, height, this._nearClipPlane, this._farClipPlane, projectionMatrix);
            mat4.ortho(
                cameraState.pMat,
                -width, width,
                -height, height,
                camera.nearClipPlane,
                camera.farClipPlane
            );

            // let target_aspect = camera.fovX / camera.fovY;
            // if (aspect < target_aspect) {
            //     // Portrait orientation.
            //     mat4.ortho(
            //         cameraState.pMat,
            //         camera.fovX / aspect,
            //         camera.fovX,
            //         -camera.fovX / aspect,
            //         -camera.fovX,
            //         camera.nearClipPlane,
            //         camera.farClipPlane
            //     );
            // } else {
            //     // Landscape orientation.
            //     mat4.ortho(
            //         cameraState.pMat,
            //         camera.fovY,
            //         camera.fovY * aspect,
            //         -camera.fovY,
            //         -camera.fovY * aspect,
            //         camera.nearClipPlane,
            //         camera.farClipPlane
            //     );
            // }
        }
        mat4.invert(cameraState.pMatInv, cameraState.pMat);
    }
}

