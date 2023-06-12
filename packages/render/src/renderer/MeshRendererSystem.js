import { BitSet, System, SystemGroupType } from "@poly-engine/core";
import { AssetSystem } from "@poly-engine/asset";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { mat4, vec4 } from "@poly-engine/math";
import { Layer } from "../constants/Layer.js";

export class MeshRendererSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 500;

        this._mvMatrix = mat4.create();
        this._mvpMatrix = mat4.create();
        this._mvInvMatrix = mat4.create();
        this._normalMatrix = mat4.create();

        // this.em = this.world.entityManager;
        // this.qm = this.world.queryManager;
        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.com_meshRenderer = this.em.getComponentId('MeshRenderer');
        this.com_meshRendererState = this.em.getComponentId('MeshRendererState');
        this.com_shaderData = this.em.getComponentId('ShaderData');
        this.com_geometry = this.em.getComponentId('Geometry');
        this.com_localToWorld = this.em.getComponentId('LocalToWorld');
        this.com_cameraState = this.em.getComponentId('CameraState');

        this.que_meshRendererStateInit = this.qm.createQuery({
            all: [this.com_meshRenderer],
            none: [this.com_meshRendererState],
        });
        this.que_meshRendererStateRelease = this.qm.createQuery({
            all: [this.com_meshRendererState],
            none: [this.com_meshRenderer],
        });
        this.que_mrsShaderData = this.qm.createQuery({
            all: [this.com_meshRendererState, this.com_shaderData, this.com_localToWorld]
        });
    }
    init() {
        this.glManager = this.world.glManager;

        // this.assetSystem = this.sm.getSystem(AssetSystem);
        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._uvMacro = this.shaderSystem.getMacro('RENDERER_HAS_UV');
        this._uv1Macro = this.shaderSystem.getMacro('RENDERER_HAS_UV1');
        this._normalMacro = this.shaderSystem.getMacro('RENDERER_HAS_NORMAL');
        this._tangentMacro = this.shaderSystem.getMacro('RENDERER_HAS_TANGENT');
        this._enableVertexColorMacro = this.shaderSystem.getMacro('RENDERER_ENABLE_VERTEXCOLOR');

        // this._receiveShadowMacro = this.shaderSystem.getMacro('RENDERER_IS_RECEIVE_SHADOWS');

        this._localMatrixProp = this.shaderSystem.getProperty('renderer_LocalMat');
        this._worldMatrixProp = this.shaderSystem.getProperty('renderer_ModelMat');
        // this._mvMatrixProp = this.shaderSystem.getProperty('renderer_MVMat');
        // this._mvpMatrixProp = this.shaderSystem.getProperty('renderer_MVPMat');
        // this._mvInvMatrixProp = this.shaderSystem.getProperty('renderer_MVInvMat');
        this._normalMatrixProp = this.shaderSystem.getProperty('renderer_NormalMat');
        
        this._rendererLayerProp = this.shaderSystem.getProperty('renderer_Layer');
    }

    _update() {
        const em = this.em;
        // const com_glState = this.com_glState;
        const com_meshRendererState = this.com_meshRendererState;
        const com_meshRenderer = this.com_meshRenderer;

        // let glState = em.getSingletonComponent(com_glState);
        // if (!glState)
        //     return;

        this.que_meshRendererStateInit.forEach(entity => {
            let mr = em.getComponent(entity, com_meshRenderer);
            this.que_meshRendererStateInit.defer(() => {
                const mrs = em.createComponent(com_meshRendererState);
                const geoEnt = mrs.geoEnt = this.assetSystem.loadAssetEntity(mr.geoRef);
                mrs.matEnt = this.assetSystem.loadAssetEntity(mr.matRef);
                mrs.macroBitset = new BitSet();
                em.setComponent(entity, com_meshRendererState, mrs);

                const shaderData = em.setComponent(entity, this.com_shaderData);
                this.shaderSystem.disableMacro(shaderData, this._uvMacro);
                // shaderData.macros.not(this._uvMacro);
                this.shaderSystem.disableMacro(shaderData, this._uv1Macro);
                // shaderData.macros.not(this._uv1Macro);
                this.shaderSystem.disableMacro(shaderData, this._normalMacro);
                // shaderData.macros.not(this._normalMacro);
                this.shaderSystem.disableMacro(shaderData, this._tangentMacro);
                // shaderData.macros.not(this._tangentMacro);
                this.shaderSystem.disableMacro(shaderData, this._enableVertexColorMacro);
                // shaderData.macros.not(this._enableVertexColorMacro);
                let geometry = em.getComponent(geoEnt, this.com_geometry);
                let buffers = geometry.vertexBuffers;
                // for (let i = 0, l = buffers.length; i < l; i++) {
                //     let buffer = buffers[i];
                //     let elements = buffer.elements;
                //     for (let j = 0, lj = elements.length; j < lj; j++) {
                //         let semantic = elements[j].name;
                //         switch (semantic) {
                //             case "TEXCOORD_0":
                //                 this.shaderSystem.enableMacro(shaderData, this._uvMacro);
                //                 // shaderData.macros.or(this._uvMacro);
                //                 break;
                //             case "TEXCOORD_1":
                //                 this.shaderSystem.enableMacro(shaderData, this._uv1Macro);
                //                 // shaderData.macros.or(this._uv1Macro);
                //                 break;
                //             case "NORMAL":
                //                 this.shaderSystem.enableMacro(shaderData, this._normalMacro);
                //                 // shaderData.macros.or(this._normalMacro);
                //                 break;
                //             case "TANGENT":
                //                 this.shaderSystem.enableMacro(shaderData, this._tangentMacro);
                //                 // shaderData.macros.or(this._tangentMacro);
                //                 break;
                //             case "COLOR_0":
                //                 this.shaderSystem.enableMacro(shaderData, this._enableVertexColorMacro);
                //                 // shaderData.macros.or(this._enableVertexColorMacro);
                //                 break;
                //         }
                //     }
                // }
                let elements = geometry.vertexElements;
                for (let j = 0, lj = elements.length; j < lj; j++) {
                    let semantic = elements[j].name;
                    switch (semantic) {
                        case "TEXCOORD_0":
                            this.shaderSystem.enableMacro(shaderData, this._uvMacro);
                            // shaderData.macros.or(this._uvMacro);
                            break;
                        case "TEXCOORD_1":
                            this.shaderSystem.enableMacro(shaderData, this._uv1Macro);
                            // shaderData.macros.or(this._uv1Macro);
                            break;
                        case "NORMAL":
                            this.shaderSystem.enableMacro(shaderData, this._normalMacro);
                            // shaderData.macros.or(this._normalMacro);
                            break;
                        case "TANGENT":
                            this.shaderSystem.enableMacro(shaderData, this._tangentMacro);
                            // shaderData.macros.or(this._tangentMacro);
                            break;
                        case "COLOR_0":
                            this.shaderSystem.enableMacro(shaderData, this._enableVertexColorMacro);
                            // shaderData.macros.or(this._enableVertexColorMacro);
                            break;
                    }
                }
            // console.log(shaderData.macros.getValues());
                // shaderData.macros.forEachValues((value) => {
                //     console.log(value + ": " +this.shaderSystem.getMacroById(value).key);
                // });
                this.shaderSystem.setPropertyValue(shaderData, this._rendererLayerProp, mrs.layer);

            });
        })

        this.que_meshRendererStateRelease.forEach(entity => {
            this.que_meshRendererStateRelease.defer(() => {
                const mrs = em.getComponent(entity, com_meshRendererState);
                this.assetSystem.unloadAssetEntity(mrs.geoEnt);
                this.assetSystem.unloadAssetEntity(mrs.matEnt);
                //TODO release shader program
                let program = mrs.shaderProgram;
                if (program) {

                }
                em.removeComponent(entity, com_meshRendererState);
            });
        })
        this.que_mrsShaderData.forEach(entity => {
            const mrs = em.getComponent(entity, this.com_meshRendererState);
            const ltw = em.getComponent(entity, this.com_localToWorld);
            const shaderData = em.getComponent(entity, this.com_shaderData);
    
            this.shaderSystem.setPropertyValue(shaderData, this._localMatrixProp, ltw.localMat);
            this.shaderSystem.setPropertyValue(shaderData, this._worldMatrixProp, ltw.worldMat);
            // mat4.multiply(this._mvMatrix, cameraState.vMat, ltw.worldMat);
            // this.shaderSystem.setPropertyValue(shaderData, this._mvMatrixProp, this._mvMatrix);
            // mat4.multiply(this._mvpMatrix, cameraState.pvMat, ltw.worldMat);
            // this.shaderSystem.setPropertyValue(shaderData, this._mvpMatrixProp, this._mvpMatrix);
            // mat4.invert(this._mvInvMatrix, this._mvMatrix);
            // this.shaderSystem.setPropertyValue(shaderData, this._mvInvMatrixProp, this._mvInvMatrix);
            mat4.invert(this._normalMatrix, ltw.worldMat);
            mat4.transpose(this._normalMatrix, this._normalMatrix);
            this.shaderSystem.setPropertyValue(shaderData, this._normalMatrixProp, this._normalMatrix);

            const layer = Layer.Layer0;
            vec4.set(mrs.layer, layer & 65535, (layer >>> 16) & 65535, 0, 0);
            // this.shaderSystem.setPropertyValue(shaderData, this._rendererLayerProp, alphaCutoff);
        })
    }

    // updateShaderData(meshEntity, cameraEntity) {
    //     const em = this.em;
    //     // let cameraShaderData = em.getComponent(cameraEntity, this.com_shaderData);
    //     let mrs = em.getComponent(meshEntity, this.com_meshRendererState);
    //     // let meshRenderer = em.getComponent(meshEntity, com_meshRenderer);
    //     let ltw = em.getComponent(meshEntity, this.com_localToWorld);
    //     let cameraState = em.getComponent(cameraEntity, this.com_cameraState);
    //     let rendererShaderData = em.getComponent(meshEntity, this.com_shaderData);

    //     //set element uniform data
    //     // rendererShaderData ??= em.setComponent(meshEntity, this.com_shaderData);
    //     // rendererShaderData.uniforms.renderer_LocalMat = ltw.localMat;
    //     this.shaderSystem.setPropertyValue(rendererShaderData, this._localMatrixProp, ltw.localMat);
    //     // rendererShaderData.uniforms.renderer_ModelMat = ltw.worldMat;
    //     this.shaderSystem.setPropertyValue(rendererShaderData, this._worldMatrixProp, ltw.worldMat);
    //     // rendererShaderData.uniforms.renderer_MVMat = mat4.multiply(this._mvMatrix, cameraState.vMat, ltw.worldMat);
    //     mat4.multiply(this._mvMatrix, cameraState.vMat, ltw.worldMat);
    //     this.shaderSystem.setPropertyValue(rendererShaderData, this._mvMatrixProp, this._mvMatrix);
    //     // rendererShaderData.uniforms.renderer_MVPMat = mat4.multiply(this._mvpMatrix, cameraState.pvMat, ltw.worldMat);
    //     mat4.multiply(this._mvpMatrix, cameraState.pvMat, ltw.worldMat);
    //     this.shaderSystem.setPropertyValue(rendererShaderData, this._mvpMatrixProp, this._mvpMatrix);
    //     // rendererShaderData.uniforms.renderer_MVInvMat = mat4.invert(this._mvInvMatrix, this._mvMatrix);
    //     mat4.invert(this._mvInvMatrix, this._mvMatrix);
    //     this.shaderSystem.setPropertyValue(rendererShaderData, this._mvInvMatrixProp, this._mvInvMatrix);
    //     // rendererShaderData.uniforms.renderer_NormalMat = mat4.invert(this._normalMatrix, ltw.worldMat);
    //     mat4.invert(this._normalMatrix, ltw.worldMat);
    //     this.shaderSystem.setPropertyValue(rendererShaderData, this._normalMatrixProp, this._normalMatrix);

    // }
}
