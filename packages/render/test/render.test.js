import { World, mat4, vec3 } from "@poly-engine/core";
import { TransformModule } from "@poly-engine/transform";
import { RenderModule, VertexElementType } from "../src/index.js";
require('./webgl-mock/exports');

/** @type {World} */
let world;
let vsSource = `
#version 300 es
  
layout(location=0) in vec4 position;
layout(location=1) in vec3 color;

out vec3 vColor; 
void main() {
    vColor = color;
    gl_Position = position;
}`;
let fsSource = `
#version 300 es
precision highp float;

in vec3 vColor;

out vec4 fragColor;
void main() {
    fragColor = vec4(vColor, 1.0);
}`;

beforeAll(() => {
    world = new World();
    world.moduleManager.addModule('mod_tranform', TransformModule);
    world.moduleManager.addModule('mod_render', RenderModule);
});
afterAll(() => {
    world.destroy();
});

describe('render module', () => {
    it('GlState', () => {
        const em = world.entityManager;
        const com_canvas = em.getComponentId('com_canvas');
        const com_glState = em.getComponentId('com_glState');
        const com_transform = em.getComponentId('com_transform');
        const com_camera = em.getComponentId('com_camera');
        const com_cameraState = em.getComponentId('com_cameraState');
        const com_shader = em.getComponentId('com_shader');
        const com_shaderState =em.getComponentId('com_shaderState');
        const com_material = em.getComponentId('com_material');
        const com_geometry = em.getComponentId('com_geometry');
        const com_geometryState = em.getComponentId('com_geometryState');
        const com_mesh = em.getComponentId('com_mesh');
        const com_meshRenderer = em.getComponentId('com_meshRenderer');

        var canvas = new HTMLCanvasElement(500, 500);
        // var gl = canvas.getContext( 'webgl' );

        //add canvas
        let canvasEntity = em.createEntity();
        em.setComponent(canvasEntity, com_canvas, em.createComponent(com_canvas, 'test', canvas));

        //add camera
        let cameraEntity = em.createEntity();
        let transform = em.setComponent(cameraEntity, com_transform);
        transform.position.z = -3;
        let camera = em.setComponent(cameraEntity, com_camera);

        //add shader
        // let vsSource = document.getElementById("vs").text.trim();
        // let fsSource = document.getElementById("fs").text.trim();
        let shaderEntity = em.createEntity();
        em.setComponent(shaderEntity, com_shader, em.createComponent(com_shader, 'test', vsSource, fsSource));

        //add material 
        let materialEntity = em.createEntity();
        em.setComponent(materialEntity, com_material, em.createComponent(com_material, 'test', shaderEntity));

        //add geometry
        let geometryEntity = em.createEntity();
        let geometry = em.createComponent(com_geometry, 'triangle');
        geometry.vertexBuffers.push({
            type: VertexElementType.Float,
            stride: 3 * 4,
            data: [
                -0.5, -0.5, 0,
                0.5, -0.5, 0,
                0.0, 0.5, 0,
            ]
        });
        geometry.vertexBuffers.push({
            type: VertexElementType.UByte,
            stride: 3 * 1,
            data: [
                255, 0, 0,
                0, 255, 0,
                0, 0, 255
            ]
        });
        geometry.vertexElements.push({
            index: 0,
            name: 'position',
            size: 3,
            offset: 0,
        });
        geometry.vertexElements.push({
            index: 1,
            name: 'color',
            size: 3,
            offset: 0,
            normalize: true
        });
        geometry.count = 3;
        em.setComponent(geometryEntity, com_geometry, geometry);

        //add mesh
        let meshEntity = em.createEntity();
        transform = em.setComponent(meshEntity, com_transform);
        em.setComponentByArgs(meshEntity, com_mesh, geometryEntity, materialEntity);

        world.update(1);

        expect(em.hasComponent(canvasEntity, com_glState)).toBe(true);
        expect(em.hasComponent(cameraEntity, com_cameraState)).toBe(true);
        expect(em.hasComponent(shaderEntity, com_shaderState)).toBe(true);
        expect(em.hasComponent(geometryEntity, com_geometryState)).toBe(true);
        expect(em.hasComponent(meshEntity, com_meshRenderer)).toBe(true);
    })
})