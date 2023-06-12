// import { System, SystemGroupType } from "@poly-engine/core";
// import { FogMode, ShadowCascadesMode } from "../constants.js";
// import { ShaderSystem } from "../shader/ShaderSystem.js";
// import { GLCapabilityType } from "./GLCapabilityType.js";
// import { GLUtil } from "./GLUtil.js";

// export class GlStateInitSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.LateUpdate;
//         this.index = 100;

//         // this.em = this.world.entityManager;
//         // // this.compManager = this.world.componentManager;
//         // this.qm = this.world.queryManager;

//         this.com_canvas = this.em.getComponentId('Canvas');
//         this.com_canvasState = this.em.getComponentId('CanvasState');
//         this.com_glState = this.em.getComponentId('GlState');
//         this.com_resized = this.em.getComponentId('Resized');
//         this.com_shaderData = this.em.getComponentId('ShaderData');
//         // this.com_glState = this.em.getComponentId('GLCapabilities');
//         this.renderStateCom = this.em.getComponentId('RenderState');

//         this.que_glState = this.qm.createQuery({
//             all: [this.com_canvas, this.com_glState]
//         });
//         this.que_glStateInit = this.qm.createQuery({
//             all: [this.com_canvas, this.com_canvasState],
//             none: [this.com_glState]
//         });
//         this.que_glStateResize = this.qm.createQuery({
//             all: [this.com_glState, this.com_resized]
//         });

//     }
//     init() {
//         /** @type {ShaderSystem} */
//         this.shaderSystem = this.sm.getSystem(ShaderSystem);

//         this._fogModeMacro = this.shaderSystem.getMacro('SCENE_FOG_MODE', FogMode.None);
//         this._shadowCCMacro = this.shaderSystem.getMacro('SCENE_SHADOW_CASCADED_COUNT', ShadowCascadesMode.NoCascades);

//         this._fogColorProp = this.shaderSystem.getProperty('scene_FogColor');
//         this._fogParamsProp = this.shaderSystem.getProperty('scene_FogParams');

//     }
//     _update() {
//         const em = this.em;
//         const com_resized = this.com_resized;

//         // this.que_glStateResize.forEach(entity => {
//         //     this.que_glStateResize.defer(() => {
//         //         em.removeComponent(entity, com_resized);
//         //     });
//         // });
//         this.que_glStateInit.forEach(entity => {
//             let canvas = em.getComponent(entity, this.com_canvas);
//             let canvasState = em.getComponent(entity, this.com_canvasState);
//             // let canvasElement = canvas.element || document.querySelector(canvas.id);

//             let canvasElement = canvasState.element;
//             let gl = canvasElement.getContext("webgl2");
//             let glState = em.createComponent(this.com_glState, canvasElement, gl);
//             glState.isWebGL2 = true;
//             this._updateGLRenderState(glState);
//             this._updateGLCapabilities(glState);
//             this._updateGLParameters(glState);
//             // glState.isWebGL2 = WebGLUtil.getVersion(gl) >= 2;
//             // glState.capabilities = WebGLUtil.getCapabilities(gl);

//             this.que_glStateInit.defer(() => {
//                 em.setComponent(entity, this.com_glState, glState);

//                 const shaderData = em.setComponent(entity, this.com_shaderData);
//                 this.shaderSystem.enableMacro(shaderData, this._fogModeMacro, FogMode.None);
//                 this.shaderSystem.enableMacro(shaderData, this._shadowCCMacro, ShadowCascadesMode.NoCascades);
//                 // shaderData.enableMacro("SCENE_FOG_MODE", this._fogMode.toString());
//                 // shaderData.enableMacro("SCENE_SHADOW_CASCADED_COUNT", this.shadowCascades.toString());
//                 // shaderData.setColor(Scene._fogColorProperty, this._fogColor);
//                 // shaderData.setVector4(Scene._fogParamsProperty, this._fogParams);

//                 const renderState = em.setComponent(entity, this.renderStateCom);
//                 console.log(renderState);

//             });
//         });
//         // this.que_glState.forEach(entity => {
//         //     let glState = em.getComponent(entity, com_glState);
//         //     let canvasElement = glState.element;
//         //     let resized = false;

//         //     let width = canvasElement.clientWidth;
//         //     let height = canvasElement.clientHeight;
//         //     if (glState.width !== width || glState.height !== height) {
//         //         resized = true;
//         //         glState.width = canvasElement.width = width;
//         //         glState.height = canvasElement.height = height;
//         //         this.que_glState.defer(() => {
//         //             em.setComponent(entity, com_resized);
//         //         });
//         //     }
//         // });
//     }

//     _updateGLRenderState(glState) {
//         const gl = glState.gl;

//         // init blend state same as BlendState default value.
//         gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
//         gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
//         gl.colorMask(true, true, true, true);
//         gl.blendColor(0, 0, 0, 0);
//         gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);

//         // init depth state same as DepthState default value.
//         gl.enable(gl.DEPTH_TEST);
//         gl.depthFunc(gl.LESS);
//         gl.depthMask(true);

//         // init stencil state same as StencilState default value.
//         gl.disable(gl.STENCIL_TEST);
//         gl.stencilFuncSeparate(gl.FRONT, gl.ALWAYS, 0, 0xff);
//         gl.stencilFuncSeparate(gl.BACK, gl.ALWAYS, 0, 0xff);
//         gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
//         gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
//         gl.stencilMask(0xff);

//         // init raster state same as RasterState default value.
//         gl.enable(gl.CULL_FACE);
//         gl.cullFace(gl.BACK);
//         gl.disable(gl.POLYGON_OFFSET_FILL);
//         gl.polygonOffset(0, 0);

//         glState.activeTextureID = gl.TEXTURE0;
//         gl.activeTexture(gl.TEXTURE0);
//     }
//     _updateGLParameters(glState) {
//         const gl = glState.gl;
//         const params = glState.parameters;
//         params.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
//         params.maxDrawBuffers = GLUtil.canIUse(glState, GLCapabilityType.drawBuffers) ? gl.getParameter(gl.MAX_DRAW_BUFFERS) : 1;
//         const ext = GLUtil.requireExtension(glState, GLCapabilityType.textureFilterAnisotropic);
//         params.maxAnisoLevel = ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
//         params.maxAntiAliasing = GLUtil.canIUse(glState, GLCapabilityType.multipleSample) ? gl.getParameter(gl.MAX_SAMPLES) : 1;
//     }
//     _updateGLCapabilities(glState) {
//         const isWebGL2 = glState.isWebGL2;
//         const requireExtension = (ext) => GLUtil.requireExtension(glState, ext);
//         const cap = glState.capabilities;

//         const {
//             shaderVertexID,
//             standardDerivatives,
//             shaderTextureLod,
//             elementIndexUint,
//             depthTexture,
//             vertexArrayObject,
//             instancedArrays,
//             multipleSample,
//             drawBuffers,

//             astc,
//             astc_webkit,
//             etc,
//             etc_webkit,
//             etc1,
//             etc1_webkit,
//             pvrtc,
//             pvrtc_webkit,
//             s3tc,
//             s3tc_webkit,

//             textureFloat,
//             textureHalfFloat,
//             textureFloatLinear,
//             textureHalfFloatLinear,
//             WEBGL_colorBufferFloat,
//             colorBufferFloat,
//             colorBufferHalfFloat,
//             textureFilterAnisotropic
//         } = GLCapabilityType;
//         cap[shaderVertexID] = isWebGL2;
//         cap[standardDerivatives] = isWebGL2 || !!requireExtension(standardDerivatives);
//         cap[shaderTextureLod] = isWebGL2 || !!requireExtension(shaderTextureLod);
//         cap[elementIndexUint] = isWebGL2 || !!requireExtension(elementIndexUint);
//         cap[depthTexture] = isWebGL2 || !!requireExtension(depthTexture);
//         cap[vertexArrayObject] = isWebGL2 || !!requireExtension(vertexArrayObject);
//         cap[instancedArrays] = isWebGL2 || !!requireExtension(instancedArrays);
//         cap[multipleSample] = isWebGL2;
//         cap[drawBuffers] = isWebGL2 || !!requireExtension(drawBuffers);
//         cap[textureFloat] = isWebGL2 || !!requireExtension(textureFloat);
//         cap[textureHalfFloat] = isWebGL2 || !!requireExtension(textureHalfFloat);
//         cap[textureFloatLinear] = !!requireExtension(textureFloatLinear);
//         cap[textureHalfFloatLinear] = isWebGL2 || !!requireExtension(textureHalfFloatLinear);
//         cap[colorBufferFloat] = (isWebGL2 && !!requireExtension(colorBufferFloat)) || !!requireExtension(WEBGL_colorBufferFloat);
//         cap[colorBufferHalfFloat] = (isWebGL2 && !!requireExtension(colorBufferFloat)) || !!requireExtension(colorBufferHalfFloat);
//         cap[textureFilterAnisotropic] = !!requireExtension(textureFilterAnisotropic);

//         cap[astc] = !!(requireExtension(astc) || requireExtension(astc_webkit));
//         cap[etc] = !!(requireExtension(etc) || requireExtension(etc_webkit));
//         cap[etc1] = !!(requireExtension(etc1) || requireExtension(etc1_webkit));
//         cap[pvrtc] = !!(requireExtension(pvrtc) || requireExtension(pvrtc_webkit));
//         cap[s3tc] = !!(requireExtension(s3tc) || requireExtension(s3tc_webkit));

//         cap.canIUseMoreJoints = cap.textureFloat && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
//         cap.canUseFloatTextureBlendShape = cap.shaderVertexID && cap.textureFloat && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
//     }

//     // _getGLExtension(glState, ext) {
//     //     const gl = glState.gl;
//     //     const exts = glState.extensions;
//     //     let result = exts[ext];
//     //     if (result !== undefined) {
//     //         return result;
//     //     }
//     //     result = exts[ext] = gl.getExtension(ext);
//     //     return result;
//     // }
// }

