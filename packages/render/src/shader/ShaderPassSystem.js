// import { System, SystemGroupType } from "@poly-engine/core";
// import { RenderUtil } from "../RenderUtil.js";

// export class ShaderPassSystem extends System {
//     constructor() {
//         super();
//         this.groupId = SystemGroupType.RenderUpdate;
//         this.index = 100;

//     }
//     init() {
//         this.em = this.world.entityManager;
//         this.qm = this.world.queryManager;

//         this.com_glState = this.em.getComponentId('GlState');
//         this.com_shader = this.em.getComponentId('ShaderPass');
//         this.com_shaderState = this.em.getComponentId('ShaderPassState');
//         this.com_texture = this.em.getComponentId('Texture');

//         this.que_shaderStateInit = this.qm.createQuery({
//             all: [this.com_shader],
//             none: [this.com_shaderState]
//         });
//         this.que_shaderStateReleae = this.qm.createQuery({
//             all: [this.com_shaderState],
//             none: [this.com_shader]
//         });
//     }
//     _update() {
//         const em = this.em;
//         const com_glState = this.com_glState;
//         const com_shader = this.com_shader;
//         const com_shaderState = this.com_shaderState;

//         let glState = em.getSingletonComponent(com_glState);
//         if (!glState)
//             return;
//         this.que_shaderStateInit.forEach(entity => {
//             let shader = em.getComponent(entity, com_shader);
//             this.que_shaderStateInit.defer(() => {
//                 let shaderState = em.createComponent(com_shaderState);
//                 this._initShaderState(glState, shader, shaderState);
//                 em.setComponent(entity, com_shaderState, shaderState);
//             });
//         });
//         this.que_shaderStateReleae.forEach(entity => {
//             this.que_shaderStateReleae.defer(() => {
//                 let shaderState = em.getComponent(entity, com_shaderState);
//                 this._releaseShaderState(glState, shaderState);
//                 em.removeComponent(entity, com_shaderState);
//             });
//         })
//     }
//     _initShaderState(glState, shader, shaderState) {
//         let gl = glState.gl;
//         let vertexSource = shader.vertexSource;
//         let fragmentSource = shader.fragmentSource;

//         // create and compile shader
//         const vertexShader = RenderUtil.createShader(gl, gl.VERTEX_SHADER, vertexSource);
//         if (!vertexShader)
//             return false;
//         const fragmentShader = RenderUtil.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
//         if (!fragmentShader)
//             return false;
//         let program = RenderUtil.createProgram(gl, vertexShader, fragmentShader);
//         if (!program) {
//             return false;
//         }
//         shaderState.vertexShader = vertexShader;
//         shaderState.fragmentShader = fragmentShader;
//         shaderState.program = program;

//         let attributes = RenderUtil.pickupActiveAttributes(gl, program);
//         let uniforms = RenderUtil.pickupActiveUniforms(gl, program);

//         shaderState.attributeMap = attributes;
//         shaderState.uniformMap = uniforms;

//         //add shaderData{macros, uniforms}

//         return true;
//     }
//     _releaseShaderState(glState, shaderState) {
//         let gl = glState.gl;
//         shaderState.vertexShader && gl.deleteShader(shaderState.vertexShader);
//         shaderState.fragmentShader && gl.deleteShader(shaderState.fragmentShader);
//         shaderState.program && gl.deleteProgram(shaderState.program);
//         shaderState.vertexShader = null;
//         shaderState.fragmentShader = null;
//         shaderState.program = null;
//         shaderState.attributeMap = null;
//         shaderState.uniformMap = null;
//     }

// }

