import { RenderQueueType, VertexElementType } from "../constants.js";
import { System, SystemGroupType, BitSet } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { mat4 } from "@poly-engine/math";
import { MeshRendererSystem } from "../renderer/MeshRendererSystem.js";
import { GLUtil } from "../webgl/GLUtil.js";

export class RenderSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 1000;

        this._macroBitset = new BitSet(1);

        this._mvMatrix = mat4.create();
        this._mvpMatrix = mat4.create();
        this._mvInvMatrix = mat4.create();
        // this._normalMatrix = mat4.create();

        // this.em = this.world.entityManager;
        // // this.compManager = this.world.componentManager;
        // this.qm = this.world.queryManager;
        // this.sm = this.world.systemManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.com_camera = this.em.getComponentId('Camera');
        this.com_cameraState = this.em.getComponentId('CameraState');

        this.com_meshRenderer = this.em.getComponentId('MeshRenderer');
        this.com_meshRendererState = this.em.getComponentId('MeshRendererState');

        this.com_localToWorld = this.em.getComponentId('LocalToWorld');

        this.com_material = this.em.getComponentId('Material');
        this.com_materialState = this.em.getComponentId('MaterialState');

        this.com_texture = this.em.getComponentId('Texture');
        this.com_textureState = this.em.getComponentId('TextureState');
        this.com_geometry = this.em.getComponentId('Geometry');
        this.com_geometryState = this.em.getComponentId('GeometryState');
        this.com_shaderState = this.em.getComponentId('ShaderState');
        this.com_shader = this.em.getComponentId('Shader');
        this.com_shaderData = this.em.getComponentId('ShaderData');

        this.que_cameraState = this.qm.createQuery({
            all: [this.com_camera, this.com_cameraState]
        });
        this.que_meshRenderer = this.qm.createQuery({
            all: [this.com_meshRenderer, this.com_meshRendererState]
        });
    }
    init() {
        this.glManager = this.world.glManager;
        /** @type {ShaderSystem} */
        this.shaderSystem = this.sm.getSystem(ShaderSystem);
        // /** @type {MeshRendererSystem} */
        // this.rendererSystem = this.sm.getSystem(MeshRendererSystem);

        // this._inverseViewMatrixProp = this.shaderSystem.getProperty('camera_ViewInvMat');
        // this._cameraPositionProp = this.shaderSystem.getProperty('camera_Position');

        // // this._receiveShadowMacro = this.shaderSystem.getMacro('RENDERER_IS_RECEIVE_SHADOWS');

        // this._localMatrixProp = this.shaderSystem.getProperty('renderer_LocalMat');
        // this._worldMatrixProp = this.shaderSystem.getProperty('renderer_ModelMat');
        this._mvMatrixProp = this.glManager.getProperty('renderer_MVMat');
        this._mvpMatrixProp = this.glManager.getProperty('renderer_MVPMat');
        this._mvInvMatrixProp = this.glManager.getProperty('renderer_MVInvMat');
        // this._normalMatrixProp = this.shaderSystem.getProperty('renderer_NormalMat');

        // this._rendererLayerProp = this.shaderSystem.getProperty('renderer_Layer');

    }
    _update() {
        const em = this.em;

        // let glEntity = em.getSingletonEntity(this.com_glState);
        // if (glEntity === -1)
        //     return;
        this.que_cameraState.forEach(entity => {
            this.renderCamera(entity);
        })
    }

    renderCamera(cameraEntity) {
        const em = this.em;
        const com_camera = this.com_camera;
        const com_cameraState = this.com_cameraState;
        // const com_mesh = this.com_meshRenderer;
        // const com_meshRenderer = this.com_meshRenderer;
        const com_material = this.com_material;
        const com_localToWorld = this.com_localToWorld;

        const glState = this.glManager;//em.getComponent(glEntity, this.com_glState);
        const glShaderData = this.glManager.shaderData;//em.getComponent(glEntity, this.com_shaderData);
        const gl = glState.gl;

        const camera = em.getComponent(cameraEntity, com_camera);
        const cameraState = em.getComponent(cameraEntity, com_cameraState);
        // let cameraUniformData = cameraState.uniformData;
        // let cameraShaderData = em.getComponentByGroup(cameraEntity, this.com_shader);
        // cameraShaderData ??= em.setComponent(cameraEntity, this.com_shaderData);
        const cameraShaderData = em.getComponent(cameraEntity, this.com_shaderData);
        BitSet.union2(cameraState.macroBitset, cameraShaderData.macros, glShaderData.macros);

        const transparentEntities = [];

        //reset context render state
        glState.materialEntity = -1;
        glState.shaderEntity = -1;
        glState.frontFace = null;
        glState.shanderProgram = null;

        //set render buffer
        let targetEntity = camera.targetEntity;
        if (targetEntity < 0) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, cameraState.viewportWidth, cameraState.viewportHeight);
        }
        else {
            //render to target
        }

        //update camera shader data
        // gl.uniformMatrix4fv(shaderState.uniformMap.pv.location, false, cameraState.pvMat.elements);
        // gl.uniform3f(shaderState.uniformMap.eye, cameraState.position.x, cameraState.position.y, cameraState.position.z);
        // cameraShaderData.uniforms.pv = cameraState.pvMat;
        // cameraShaderData.uniforms.eye = cameraState.position;
        // cameraShaderData.uniforms.camera_ViewInvMat = cameraState.worldMat;
        // this.shaderSystem.setPropertyValue(cameraShaderData, this._inverseViewMatrixProp, cameraState.worldMat);
        // // cameraShaderData.uniforms.camera_Position = cameraState.position;
        // this.shaderSystem.setPropertyValue(cameraShaderData, this._cameraPositionProp, cameraState.position);

        //set camera background
        let glClearFlag = GLUtil.getGlClearFlag(gl, camera.clearFlag);
        // const { r, g, b, a } = camera.clearColor;
        gl.clearColor(...camera.clearColor);
        gl.clear(glClearFlag);

        this.que_meshRenderer.forEach(ent => {
            let mrs = em.getComponent(ent, this.com_meshRendererState);
            // let meshRenderer = com_meshRenderer.get(ent);
            // let geometryEntity = mesh.geometryEntity;
            let matEnt = mrs.matEnt;
            // let geometry = com_material.get(geometryEntity);
            let material = em.getComponent(matEnt, com_material);
            if (material.queue === RenderQueueType.Blend) {
                transparentEntities.push(ent);
                return;
            }
            this.renderEntity(glEntity, cameraEntity, ent);
        });

        // Sort transparent objects by distance to camera, from back to front, to
        // enforce overdraw and blend them in the correct order.
        transparentEntities.sort((a, b) => {
            let transform_a = em.getComponent(a, com_localToWorld);
            let transform_b = em.getComponent(b, com_localToWorld);
            return (
                this._distance_squared_from_point(transform_b.worldMat, cameraState.position) -
                this._distance_squared_from_point(transform_a.worldMat, cameraState.position)
            );
        });

        gl.enable(gl.BLEND);
        for (let i = 0; i < transparentEntities.length; i++) {
            let ent = transparentEntities[i];
            // let renderElement = renderElementStore.getComp(ent);
            this.renderEntity(cameraEntity, ent);
        }
        gl.disable(gl.BLEND);
    }
    _distance_squared_from_point(m, v) {
        let x = m[12] - v[0];
        let y = m[13] - v[1];
        let z = m[14] - v[2];
        return x * x + y * y + z * z;
    }
    renderEntity(cameraEntity, meshEntity) {
        const em = this.em;
        const com_geometry = this.com_geometry;
        const com_material = this.com_material;

        const glState = this.glManager;//em.getComponent(glEntity, this.com_glState);
        const glShaderData = this.glManager.shaderData;//em.getComponent(glEntity, this.com_shaderData);
        const gl = glState.gl;
        let cameraState = em.getComponent(cameraEntity, this.com_cameraState);
        let cameraShaderData = em.getComponent(cameraEntity, this.com_shaderData);

        let mrs = em.getComponent(meshEntity, this.com_meshRendererState);
        let rendererShaderData = em.getComponent(meshEntity, this.com_shaderData);
        let ltw = em.getComponent(meshEntity, this.com_localToWorld);

        let materialEnt = mrs.matEnt;
        let material = em.getComponent(materialEnt, com_material);
        let materialState = em.getComponent(materialEnt, this.com_materialState);
        if (materialState == null)
            return;
        let materialShaderData = em.getComponent(materialEnt, this.com_shaderData);

        // mrs.macroBitset.union2(cameraState.macroBitset, rendererShaderData.macroBitset);
        BitSet.union2(mrs.macroBitset, cameraState.macroBitset, rendererShaderData.macros);

        BitSet.union2(this._macroBitset, mrs.macroBitset, materialShaderData.macros);


        let shaderEnt = materialState.shaderEnt;
        // let shader = em.getComponent(shaderEnt, this.com_shader);

        let shanderProgram = mrs.shanderProgram;
        if (!shanderProgram) {
            shanderProgram = this.shaderSystem.createShaderProgram(shaderEnt, this._macroBitset);
            mrs.shanderProgram = shanderProgram;
        }
        else if (!BitSet.equals2(shanderProgram.macroBitset, this._macroBitset)) {
            this.shaderSystem.destroyShaderProgram(shaderEnt, shanderProgram.macroBitset);
            shanderProgram = this.shaderSystem.createShaderProgram(shaderEnt, this._macroBitset);
            mrs.shanderProgram = shanderProgram;
        }
        if (shanderProgram == null)
            return;

        if (shanderProgram != glState.shanderProgram) {
            glState.shanderProgram = shanderProgram;
            gl.useProgram(shanderProgram.program);

            //upload scene uniform data
            this.uploadUniformData(shanderProgram, glShaderData.uniforms);
            //upload camera uniform data
            this.uploadUniformData(shanderProgram, cameraShaderData.uniforms);

        }
        if (materialEnt !== glState.materialEntity) {
            glState.materialEntity = materialEnt;

            //set material uniform data
            this.uploadUniformData(shanderProgram, materialShaderData.uniforms);
        }

        // let shaderState = em.getComponent(shaderEnt, com_shaderState);
        // if (materialEnt !== glState.materialEntity) {
        //     glState.materialEntity = materialEnt;

        //     //use shader program
        //     if (shaderEnt !== glState.shaderEntity) {
        //         glState.shaderEntity = shaderEnt;
        //         gl.useProgram(shaderState.program);
        //     }

        //     //set scene/world uniforms

        //     let frontFace = material.frontFace;
        //     if (frontFace !== glState.frontFace) {
        //         glState.frontFace = frontFace;
        //         // frontFace ? gl.frontFace(gl.CW) : gl.frontFace(gl.CCW);
        //         frontFace ? gl.frontFace(gl.CCW) : gl.frontFace(gl.CW);
        //     }
        //     // let doubleSided = material.doubleSided;
        //     // if (doubleSided !== glState.doubleSided) {
        //     //     glState.doubleSided = doubleSided;
        //     //     doubleSided ? gl.enable(gl.CULL_FACE) : gl.disable(gl.CULL_FACE);
        //     // }

        //     //upload camera uniform data
        //     this.uploadUniformData(glState, shaderState, cameraShaderData.uniforms);

        //     //set material uniform data
        //     this.uploadUniformData(glState, shaderState, materialShaderData.uniforms);
        // }

        //set element uniform data
        // // rendererShaderData ??= em.setComponent(meshEntity, this.com_shaderData);
        // // rendererShaderData.uniforms.renderer_LocalMat = ltw.localMat;
        // this.shaderSystem.setPropertyValue(rendererShaderData, this._localMatrixProp, ltw.localMat);
        // // rendererShaderData.uniforms.renderer_ModelMat = ltw.worldMat;
        // this.shaderSystem.setPropertyValue(rendererShaderData, this._worldMatrixProp, ltw.worldMat);
        // // rendererShaderData.uniforms.renderer_MVMat = mat4.multiply(this._mvMatrix, cameraState.vMat, ltw.worldMat);
        mat4.multiply(this._mvMatrix, cameraState.vMat, ltw.worldMat);
        this.glManager.setPropertyValue(rendererShaderData, this._mvMatrixProp, this._mvMatrix);
        // rendererShaderData.uniforms.renderer_MVPMat = mat4.multiply(this._mvpMatrix, cameraState.pvMat, ltw.worldMat);
        mat4.multiply(this._mvpMatrix, cameraState.pvMat, ltw.worldMat);
        this.glManager.setPropertyValue(rendererShaderData, this._mvpMatrixProp, this._mvpMatrix);
        // rendererShaderData.uniforms.renderer_MVInvMat = mat4.invert(this._mvInvMatrix, this._mvMatrix);
        mat4.invert(this._mvInvMatrix, this._mvMatrix);
        this.glManager.setPropertyValue(rendererShaderData, this._mvInvMatrixProp, this._mvInvMatrix);
        // // rendererShaderData.uniforms.renderer_NormalMat = mat4.invert(this._normalMatrix, ltw.worldMat);
        // mat4.invert(this._normalMatrix, ltw.worldMat);
        // this.shaderSystem.setPropertyValue(rendererShaderData, this._normalMatrixProp, this._normalMatrix);
        // this.rendererSystem.updateShaderData(meshEntity, cameraEntity);

        this.uploadUniformData(shanderProgram, rendererShaderData.uniforms);
        // game.Gl.uniformMatrix4fv(render.Material.Locations.World, false, transform.World);
        // game.Gl.uniformMatrix4fv(render.Material.Locations.Self, false, transform.Self);

        let geometryEntity = mrs.geoEnt;
        let geometry = em.getComponent(geometryEntity, com_geometry);
        // let geometryState = com_geometryState.get(geometryEntity);

        //bind buffer
        this.bindGeometry(shanderProgram, geometryEntity);

        //draw call
        let mode = geometry.mode;
        let count = geometry.count;
        let offset = geometry.offset;
        if (geometry.indexBuffer) {
            gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
        }
        else {
            gl.drawArrays(mode, offset, count);
        }
    }
    /**
     * 
     * @param {ShaderProgram} shaderProgram 
     * @param {Record<string, object>} uniformData 
     */
    uploadUniformData(shaderProgram, uniformData) {
        const em = this.em;
        let gl = this.glManager.gl;
        // let uniformMap = shaderProgram.uniformMap;
        let uniforms = shaderProgram.uniforms;
        for (let i = 0; i < uniformData.length; i++) {
            // const uniform = uniformMap[name];
            let data = uniformData[i];
            if (data === undefined) continue;

            const uniform = uniforms[i];
            if (uniform && uniform.applyFunc) {
                // let data = uniformData[name];
                if (uniform.isTexture) {
                    data = em.getComponent(data, this.com_textureState)?.texture;
                }
                if (data != null)
                    uniform.applyFunc(gl, uniform, data);
            }
        }
        // for (const name in uniformData) {
        //     const uniform = uniformMap[name];
        //     if (uniform && uniform.applyFunc) {
        //         let data = uniformData[name];
        //         if (uniform.isTexture) {
        //             data = em.getComponent(data, this.com_textureState)?.texture;
        //         }
        //         if (data)
        //             uniform.applyFunc(gl, uniform, data);
        //     }
        // }
    }

    /**
     * 
     * @param {ShaderState} shaderProgram 
     * @param {GeometryState} geometryState 
     */
    bindGeometry(shaderProgram, geometryentity) {
        const em = this.em;
        let gl = this.glManager.gl;
        let geometry = em.getComponent(geometryentity, this.com_geometry);
        let geometryState = em.getComponent(geometryentity, this.com_geometryState);
        let attributeMap = shaderProgram.attributeMap;
        let glBuffers = geometryState.vertexBuffers;
        let buffers = geometry.vertexBuffers;

        // for (let i = 0, l = buffers.length; i < l; i++) {
        //     let buffer = buffers[i];
        //     let glBuffer = glBuffers[i];
        //     let elements = buffer.elements;
        //     let type = GLUtil.getGlVertextElementType(gl, buffer.type);

        //     gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
        //     for (let j = 0, lj = elements.length; j < lj; j++) {
        //         let attr = elements[j];
        //         let loc = attributeMap[attr.name];
        //         if (loc === undefined)
        //             continue;
        //         gl.enableVertexAttribArray(loc);
        //         let normalize = attr.normalize || false;
        //         let stride = buffer.stride || 0;
        //         let offset = attr.offset || 0;
        //         gl.vertexAttribPointer(loc, attr.size, type, normalize, stride, offset);
        //     }
        //     gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // }

        let elements = geometry.vertexElements;
        for (let i = 0, l = elements.length; i < l; i++) {
            let attr = elements[i];
            let buffer = buffers[attr.index];
            let glBuffer = glBuffers[attr.index];
            gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);

            let loc = attributeMap[attr.name];
            if (loc === undefined)
                continue;
            gl.enableVertexAttribArray(loc);
            let type = GLUtil.getGlVertextElementType(gl, attr.type);
            let normalize = attr.normalize || false;
            let stride = buffer.stride || 0;
            let offset = attr.offset || 0;
            gl.vertexAttribPointer(loc, attr.size, type, normalize, stride, offset);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);

        if (geometryState.indexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometryState.indexBuffer);
        }
    }

}


