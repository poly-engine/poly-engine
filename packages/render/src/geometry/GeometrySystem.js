import { System, SystemGroupType } from "@poly-engine/core";
import { VertexBufferConstructors, VertexElementType, VertexElementTypeSize } from "../constants.js";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { GLUtil } from "../webgl/GLUtil.js";
import { BufferUsage } from "./BufferUsage.js";
import { GeometryUtil } from "./GeometryUtil.js";

export class GeometrySystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 450;

        this.com_geometry = this.em.getComponentId('Geometry');
        this.com_geometryState = this.em.getComponentId('GeometryState');

        this.que_geometryStateInit = this.qm.createQuery({
            all: [this.com_geometry],
            none: [this.com_geometryState]
        });
        this.que_geometryStateRelease = this.qm.createQuery({
            all: [this.com_geometryState],
            none: [this.com_geometry]
        });
        // /** @type {ShaderSystem} */
        // this.shaderSystem = this.world.systemManager.getSystem(ShaderSystem);
        // this._baseTextureMacro = this.shaderSystem.getMacro('RENDERER_HAS_UV');
        // this._baseTextureMacro = this.shaderSystem.getMacro('RENDERER_HAS_UV1');
        // this._baseTextureMacro = this.shaderSystem.getMacro('RENDERER_HAS_UV');
        // this._baseTextureMacro = this.shaderSystem.getMacro('RENDERER_HAS_UV');

        this.assetManager = this.world.assetManager;
    }
    init() {
        this.glManager = this.world.glManager;
    }
    createBoxGeometryData(id = null, isAdd = false, width = 1, height = 1, depth = 1, wSegments = 1, hSegments = 1, dSegments = 1) {
        const data = this.assetManager.createAssetData(id, "Geometry", "Geometry");
        // data.Material.shaderRef = 'skybox';
        const geometry = data.Geometry;
        let boxData = GeometryUtil.createBoxData(
            width, height, depth,
            wSegments, hSegments, dSegments);
        // let geometry = em.createComponent(this.com_geometry);

        geometry.vertexBuffers.push({
            data: boxData.vertices,
        });
        geometry.vertexBuffers.push({
            data: boxData.normals,
        });
        geometry.vertexBuffers.push({
            data: boxData.uvs,
        });
        geometry.vertexElements.push({ name: 'POSITION', index: 0, type: VertexElementType.Float, size: 3, offset: 0, normalize: false });
        geometry.vertexElements.push({ name: 'NORMAL', index: 1, type: VertexElementType.Float, size: 3, offset: 0, normalize: false });
        geometry.vertexElements.push({ name: 'TEXCOORD_0', index: 2, type: VertexElementType.Float, size: 2, offset: 0, normalize: false });
        geometry.indexBuffer = { data: boxData.indices };

        if(isAdd)
            this.assetManager.addAssetData(data);
        return data;
    }
    _update() {
        const em = this.em;
        // const com_glState = this.com_glState;
        const com_geometry = this.com_geometry;
        const com_geometryState = this.com_geometryState;

        // let glState = em.getSingletonComponent(com_glState);
        // if (!glState)
        //     return;
        this.que_geometryStateInit.forEach(entity => {
            let geometry = em.getComponent(entity, com_geometry);
            this.que_geometryStateInit.defer(() => {
                let geometryState = em.createComponent(com_geometryState);
                this._initGeometryState(geometry, geometryState);
                em.setComponent(entity, com_geometryState, geometryState);
            });
        })

        this.que_geometryStateRelease.forEach(entity => {
            let geometryState = em.getComponent(entity, com_geometryState);
            this.que_geometryStateRelease.defer(() => {
                this._releaseGeometryState(geometryState);
                em.removeComponent(entity, com_geometryState);
            });
        })
    }

    /**
     * 
     * @param {Geometry} geometry 
     * @param {GeometryState} geometryState 
     */
    _initGeometryState(geometry, geometryState) {
        let gl = this.glManager.gl;
        let vBuffers = geometry.vertexBuffers;
        let vElements = geometry.vertexElements;
        let glBuffers = geometryState.vertexBuffers;
        for (let i = 0, l = vBuffers.length; i < l; i++) {
            let buffer = vBuffers[i];
            // let elements = buffer.elements;

            let data = buffer.data;
            if (Array.isArray(buffer.data)) {
                buffer.type ??= VertexElementType.Float;
                data = new VertexBufferConstructors[buffer.type](buffer.data);
            }
            buffer.bufferUsage ??= BufferUsage.Static;
            let glBufferUsage = GLUtil.getGLBufferUsage(gl, buffer.bufferUsage);
            //init buffer
            let glBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, glBufferUsage);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            glBuffers[i] = glBuffer;

            if (!buffer.stride) {
                let stride = 0;
                for (let j = 0, lj = vElements.length; j < lj; j++) {
                    let element = vElements[j];
                    if (element.index !== i)
                        continue;
                    let typeSize = VertexElementTypeSize[element.type];
                    stride += element.size * typeSize;
                }
                buffer.stride = stride;
            }
        }

        let indexBuffer = geometry.indexBuffer;
        if (indexBuffer) {
            let buffer = indexBuffer;

            let data = buffer.data;
            if (Array.isArray(indexBuffer.data)) {
                buffer.type ??= VertexElementType.UShort;
                data = new VertexBufferConstructors[buffer.type](buffer.data);
            }
            buffer.bufferUsage ??= BufferUsage.Static;
            let glBufferUsage = GLUtil.getGLBufferUsage(gl, buffer.bufferUsage);
            //init buffer
            let glBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glBufferUsage);
            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            geometryState.indexBuffer = glBuffer;
            if (!geometry.count)
                geometry.count = data.length;// / 3;
        }
    }

    _releaseGeometryState(geometryState) {
        let gl = this.glManager.gl;
        let glBuffers = geometryState.vertexBuffers;
        for (let i = 0, l = glBuffers.length; i < l; i++) {
            let glBuffer = glBuffers[i];
            gl.deleteBuffer(glBuffer);
        }
        glBuffers.length = 0;
        if (geometryState.indexBuffer) {
            gl.deleteBuffer(geometryState.indexBuffer);
            geometryState.indexBuffer = null;
        }
    }
}


