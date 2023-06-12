// import { CompMode } from "@poly-engine/core";

// export const GlContextDef = {
//     mode: CompMode.State,
//     schema: {
//         element: { type: 'object', default: null },
//         gl: { type: 'object', default: null },
//         // width: { type: 'number', default: 0 },
//         // height: { type: 'number', default: 0 },

//         isWebGL2: { type: 'boolean', default: false },

//         activeTextureID: { type: 'number', default: 0 },
//         activeTextures: { type: "array", default: [] },

//         capabilities: { type: "object", default: {} },
//         extensions: { type: "object", default: {} },
//         parameters: { type: 'object', default: {} },

//         materialEntity: { type: 'entity', default: -1 },
//         shaderEntity: { type: 'entity', default: -1 },
//         frontFace: { type: 'number', default: 0 },
//         doubleSided: { type: 'boolean', default: false },
//     }
// };

// // export const GlCapabilityDef = {
// //     // mode: CompMode.State,
// //     schema: {
// //         parameters: { type: 'object', default: {} },

// //         maxTextureSize: { type: 'number', default: 0 },
// //         maxAnisoLevel: { type: 'number', default: 0 },
// //         maxAntiAliasing: { type: 'number', default: 0 },

// //         shaderVertexID: { type: 'boolean', default: false },
// //         standardDerivatives: { type: 'boolean', default: false },
// //         shaderTextureLod: { type: 'boolean', default: false },
// //         elementIndexUint: { type: 'boolean', default: false },
// //         depthTexture: { type: 'boolean', default: false },
// //         vertexArrayObject: { type: 'boolean', default: false },
// //         instancedArrays: { type: 'boolean', default: false },
// //         multipleSample: { type: 'boolean', default: false },
// //         drawBuffers: { type: 'boolean', default: false },
  
// //         astc: { type: 'boolean', default: false },
// //         astc_webkit: { type: 'boolean', default: false },
// //         etc: { type: 'boolean', default: false },
// //         etc_webkit: { type: 'boolean', default: false },
// //         etc1: { type: 'boolean', default: false },
// //         etc1_webkit: { type: 'boolean', default: false },
// //         pvrtc: { type: 'boolean', default: false },
// //         pvrtc_webkit: { type: 'boolean', default: false },
// //         s3tc: { type: 'boolean', default: false },
// //         s3tc_webkit: { type: 'boolean', default: false },
  
// //         textureFloat: { type: 'boolean', default: false },
// //         textureHalfFloat: { type: 'boolean', default: false },
// //         textureFloatLinear: { type: 'boolean', default: false },
// //         textureHalfFloatLinear: { type: 'boolean', default: false },
// //         WEBGL_colorBufferFloat: { type: 'boolean', default: false },
// //         colorBufferFloat: { type: 'boolean', default: false },
// //         colorBufferHalfFloat: { type: 'boolean', default: false },
// //         textureFilterAnisotropic: { type: 'boolean', default: false },

// //     }
// // };

// // export const GlExtensionsDef = {
// //     // mode: CompMode.State,
// //     schema: {
// //         maxTextureSize: { type: 'number', default: 0 },
// //         maxAnisoLevel: { type: 'number', default: 0 },
// //         maxAntiAliasing: { type: 'number', default: 0 },

// //         shaderVertexID: { type: 'boolean', default: false },
// //         standardDerivatives: { type: 'boolean', default: false },
// //         shaderTextureLod: { type: 'boolean', default: false },
// //         elementIndexUint: { type: 'boolean', default: false },
// //         depthTexture: { type: 'boolean', default: false },
// //         vertexArrayObject: { type: 'boolean', default: false },
// //         instancedArrays: { type: 'boolean', default: false },
// //         multipleSample: { type: 'boolean', default: false },
// //         drawBuffers: { type: 'boolean', default: false },
  
// //         astc: { type: 'boolean', default: false },
// //         astc_webkit: { type: 'boolean', default: false },
// //         etc: { type: 'boolean', default: false },
// //         etc_webkit: { type: 'boolean', default: false },
// //         etc1: { type: 'boolean', default: false },
// //         etc1_webkit: { type: 'boolean', default: false },
// //         pvrtc: { type: 'boolean', default: false },
// //         pvrtc_webkit: { type: 'boolean', default: false },
// //         s3tc: { type: 'boolean', default: false },
// //         s3tc_webkit: { type: 'boolean', default: false },
  
// //         textureFloat: { type: 'boolean', default: false },
// //         textureHalfFloat: { type: 'boolean', default: false },
// //         textureFloatLinear: { type: 'boolean', default: false },
// //         textureHalfFloatLinear: { type: 'boolean', default: false },
// //         WEBGL_colorBufferFloat: { type: 'boolean', default: false },
// //         colorBufferFloat: { type: 'boolean', default: false },
// //         colorBufferHalfFloat: { type: 'boolean', default: false },
// //         textureFilterAnisotropic: { type: 'boolean', default: false },

// //     }
// // };