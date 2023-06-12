// import { BlendFactor, BlendOperation, CameraClearFlags, PIXEL_FORMAT, PIXEL_TYPE, TEXTURE_FILTER, TEXTURE_WRAP, VertexElementType } from "../constants.js";

// const vendorPrefixes = ['', 'WEBKIT_', 'MOZ_'];
// export class WebGLUtil {

//     static getExtension(gl, name) {
//         let ext = null;
//         for (let i in vendorPrefixes) {
//             ext = gl.getExtension(vendorPrefixes[i] + name);
//             if (ext) {
//                 break;
//             }
//         }
//         return ext;
//     }

//     static getMaxPrecision(gl, precision) {
//         if (precision === 'highp') {
//             if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
//                 gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
//                 return 'highp';
//             }
//             precision = 'mediump';
//         }
//         if (precision === 'mediump') {
//             if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
//                 gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
//                 return 'mediump';
//             }
//         }
//         return 'lowp';
//     }
//     static getVersion(gl) {
//         const version = parseFloat(/^WebGL\ (\d)/.exec(gl.getParameter(gl.VERSION))[1]);
//         return version;
//     }
//     static getCapabilities(gl) {
//         const caps = Object.create(null);

//         // webgl version

//         caps.version = parseFloat(/^WebGL\ (\d)/.exec(gl.getParameter(gl.VERSION))[1]);

//         // texture filter anisotropic extension
//         // this extension is available to both, WebGL1 and WebGL2 contexts.

//         const anisotropyExt = WebGLUtil.getExtension(gl, 'EXT_texture_filter_anisotropic');
//         caps.anisotropyExt = anisotropyExt;
//         caps.maxAnisotropy = (anisotropyExt !== null) ? gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;

//         // query extension

//         let timerQuery = null, canUseTimestamp = false;
//         try {
//             if (caps.version > 1) {
//                 timerQuery = WebGLUtil.getExtension(gl, 'EXT_disjoint_timer_query_webgl2');
//                 if (timerQuery) {
//                     canUseTimestamp = (gl.getQuery(timerQuery.TIMESTAMP_EXT, timerQuery.QUERY_COUNTER_BITS_EXT) ?? 0) > 0;
//                 }
//             } else {
//                 timerQuery = WebGLUtil.getExtension(gl, 'EXT_disjoint_timer_query');
//                 if (timerQuery) {
//                     canUseTimestamp = (timerQuery.getQueryEXT(timerQuery.TIMESTAMP_EXT, timerQuery.QUERY_COUNTER_BITS_EXT) ?? 0) > 0;
//                 }
//             }
//         } catch (err) {
//             console.warn(err);
//         }
//         caps.timerQuery = timerQuery;
//         caps.canUseTimestamp = canUseTimestamp;

//         // others

//         caps.maxPrecision = this.getMaxPrecision(gl, 'highp');
//         caps.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
//         caps.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
//         caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
//         caps.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
//         caps.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
//         caps.maxSamples = caps.version > 1 ? gl.getParameter(gl.MAX_SAMPLES) : 1;
//         caps.lineWidthRange = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);

//         return caps;
//     }

//     //#region consts
//     static getGlClearFlag(gl, clearFlag) {
//         let result = 0;
//         if (clearFlag & CameraClearFlags.Color) {
//             result |= gl.COLOR_BUFFER_BIT;
//         }
//         if (clearFlag & CameraClearFlags.Depth) {
//             result |= gl.DEPTH_BUFFER_BIT;
//         }
//         if (clearFlag & CameraClearFlags.Stencil) {
//             result |= gl.STENCIL_BUFFER_BIT;
//         }
//         return result;
//     }
//     /**
//      * 
//      * @param {WebGL2RenderingContext} gl 
//      * @param {number} format 
//      * @returns {number}
//      */
//     static getGlVertextElementType(gl, format) {
//         switch (format) {
//             case VertexElementType.Float: return gl.FLOAT;
//             case VertexElementType.Byte: return gl.BYTE;
//             case VertexElementType.UByte: return gl.UNSIGNED_BYTE;
//             case VertexElementType.Short: return gl.SHORT;
//             case VertexElementType.UShort: return gl.UNSIGNED_SHORT;
//         }
//     }

//     static getGLType(gl, type) {
//         const isWebGL2 = WebGLUtil.getVersion(gl) >= 2;

//         if (type === PIXEL_TYPE.UNSIGNED_BYTE) return gl.UNSIGNED_BYTE;
//         if (type === PIXEL_TYPE.UNSIGNED_SHORT_5_6_5) return gl.UNSIGNED_SHORT_5_6_5;
//         if (type === PIXEL_TYPE.UNSIGNED_SHORT_4_4_4_4) return gl.UNSIGNED_SHORT_4_4_4_4;
//         if (type === PIXEL_TYPE.UNSIGNED_SHORT_5_5_5_1) return gl.UNSIGNED_SHORT_5_5_5_1;

//         let extension;

//         if (!isWebGL2) {
//             if (type === PIXEL_TYPE.UNSIGNED_SHORT || type === PIXEL_TYPE.UNSIGNED_INT ||
//                 type === PIXEL_TYPE.UNSIGNED_INT_24_8) {
//                 extension = WebGLUtil.getExtension(gl, 'WEBGL_depth_texture');
//                 if (extension) {
//                     if (type === PIXEL_TYPE.UNSIGNED_SHORT) return gl.UNSIGNED_SHORT;
//                     if (type === PIXEL_TYPE.UNSIGNED_INT) return gl.UNSIGNED_INT;
//                     if (type === PIXEL_TYPE.UNSIGNED_INT_24_8) return extension.UNSIGNED_INT_24_8_WEBGL;
//                 } else {
//                     console.warn('extension WEBGL_depth_texture is not support.');
//                     return null;
//                 }
//             }

//             if (type === PIXEL_TYPE.FLOAT) {
//                 extension = WebGLUtil.getExtension(gl, 'OES_texture_float');
//                 if (extension) {
//                     return gl.FLOAT;
//                 } else {
//                     console.warn('extension OES_texture_float is not support.');
//                     return null;
//                 }
//             }

//             if (type === PIXEL_TYPE.HALF_FLOAT) {
//                 extension = WebGLUtil.getExtension(gl, 'OES_texture_half_float');
//                 if (extension) {
//                     return extension.HALF_FLOAT_OES;
//                 } else {
//                     console.warn('extension OES_texture_half_float is not support.');
//                     return null;
//                 }
//             }
//         } else {
//             if (type === PIXEL_TYPE.UNSIGNED_SHORT) return gl.UNSIGNED_SHORT;
//             if (type === PIXEL_TYPE.UNSIGNED_INT) return gl.UNSIGNED_INT;
//             if (type === PIXEL_TYPE.UNSIGNED_INT_24_8) return gl.UNSIGNED_INT_24_8;
//             if (type === PIXEL_TYPE.FLOAT) return gl.FLOAT;
//             if (type === PIXEL_TYPE.HALF_FLOAT) return gl.HALF_FLOAT;
//             if (type === PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV) return gl.FLOAT_32_UNSIGNED_INT_24_8_REV;

//             if (type === PIXEL_TYPE.BYTE) return gl.BYTE;
//             if (type === PIXEL_TYPE.SHORT) return gl.SHORT;
//             if (type === PIXEL_TYPE.INT) return gl.INT;

//             // does not include:
//             // UNSIGNED_INT_2_10_10_10_REV
//             // UNSIGNED_INT_10F_11F_11F_REV
//             // UNSIGNED_INT_5_9_9_9_REV
//         }

//         return (gl[type] !== undefined) ? gl[type] : type;
//     }

//     static getGLFormat(gl, format) {

//         if (format === PIXEL_FORMAT.RGB) return gl.RGB;
//         if (format === PIXEL_FORMAT.RGBA) return gl.RGBA;
//         if (format === PIXEL_FORMAT.ALPHA) return gl.ALPHA;
//         if (format === PIXEL_FORMAT.LUMINANCE) return gl.LUMINANCE;
//         if (format === PIXEL_FORMAT.LUMINANCE_ALPHA) return gl.LUMINANCE_ALPHA;
//         if (format === PIXEL_FORMAT.DEPTH_COMPONENT) return gl.DEPTH_COMPONENT;
//         if (format === PIXEL_FORMAT.DEPTH_STENCIL) return gl.DEPTH_STENCIL;
//         if (format === PIXEL_FORMAT.RED) return gl.RED;

//         if (format === PIXEL_FORMAT.RED_INTEGER) return gl.RED_INTEGER;
//         if (format === PIXEL_FORMAT.RG) return gl.RG;
//         if (format === PIXEL_FORMAT.RG_INTEGER) return gl.RG_INTEGER;
//         if (format === PIXEL_FORMAT.RGB_INTEGER) return gl.RGB_INTEGER;
//         if (format === PIXEL_FORMAT.RGBA_INTEGER) return gl.RGBA_INTEGER;

//         let extension;

//         // S3TC
//         if (format === PIXEL_FORMAT.RGB_S3TC_DXT1 || format === PIXEL_FORMAT.RGBA_S3TC_DXT1 ||
//             format === PIXEL_FORMAT.RGBA_S3TC_DXT3 || format === PIXEL_FORMAT.RGBA_S3TC_DXT5) {
//             extension = WebGLUtil.getExtension(gl, 'WEBGL_compressed_texture_s3tc');
//             if (extension) {
//                 if (format === PIXEL_FORMAT.RGB_S3TC_DXT1) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
//                 if (format === PIXEL_FORMAT.RGBA_S3TC_DXT1) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
//                 if (format === PIXEL_FORMAT.RGBA_S3TC_DXT3) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
//                 if (format === PIXEL_FORMAT.RGBA_S3TC_DXT5) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
//             } else {
//                 console.warn('extension WEBGL_compressed_texture_s3tc is not support.');
//                 return null;
//             }
//         }

//         // PVRTC
//         if (format === PIXEL_FORMAT.RGB_PVRTC_4BPPV1 || format === PIXEL_FORMAT.RGB_PVRTC_2BPPV1 ||
//             format === PIXEL_FORMAT.RGBA_PVRTC_4BPPV1 || format === PIXEL_FORMAT.RGBA_PVRTC_2BPPV1) {
//             extension = WebGLUtil.getExtension(gl, 'WEBGL_compressed_texture_pvrtc');
//             if (extension) {
//                 if (format === PIXEL_FORMAT.RGB_PVRTC_4BPPV1) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
//                 if (format === PIXEL_FORMAT.RGB_PVRTC_2BPPV1) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
//                 if (format === PIXEL_FORMAT.RGBA_PVRTC_4BPPV1) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
//                 if (format === PIXEL_FORMAT.RGBA_PVRTC_2BPPV1) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
//             } else {
//                 console.warn('extension WEBGL_compressed_texture_pvrtc is not support.');
//                 return null;
//             }
//         }

//         // ETC1
//         if (format === PIXEL_FORMAT.RGB_ETC1) {
//             extension = WebGLUtil.getExtension(gl, 'WEBGL_compressed_texture_etc1');
//             if (extension) {
//                 return extension.COMPRESSED_RGB_ETC1_WEBGL;
//             } else {
//                 console.warn('extension WEBGL_compressed_texture_etc1 is not support.');
//                 return null;
//             }
//         }

//         // ASTC
//         if (format === PIXEL_FORMAT.RGBA_ASTC_4x4) {
//             extension = WebGLUtil.getExtension(gl, 'WEBGL_compressed_texture_astc');
//             if (extension) {
//                 return extension.COMPRESSED_RGBA_ASTC_4x4_KHR;
//             } else {
//                 console.warn('extension WEBGL_compressed_texture_astc is not support.');
//                 return null;
//             }
//         }

//         // BPTC
//         if (format === PIXEL_FORMAT.RGBA_BPTC) {
//             extension = WebGLUtil.getExtension(gl, 'EXT_texture_compression_bptc');
//             if (extension) {
//                 return extension.COMPRESSED_RGBA_BPTC_UNORM_EXT;
//             } else {
//                 console.warn('extension EXT_texture_compression_bptc is not support.');
//                 return null;
//             }
//         }

//         return (gl[format] !== undefined) ? gl[format] : format;
//     }

//     static getGLInternalFormat(gl, internalFormat) {
//         const isWebGL2 = WebGLUtil.getVersion(gl) >= 2;

//         if (internalFormat === PIXEL_FORMAT.RGBA4) return gl.RGBA4;
//         if (internalFormat === PIXEL_FORMAT.RGB5_A1) return gl.RGB5_A1;
//         if (internalFormat === PIXEL_FORMAT.DEPTH_COMPONENT16) return gl.DEPTH_COMPONENT16;
//         if (internalFormat === PIXEL_FORMAT.STENCIL_INDEX8) return gl.STENCIL_INDEX8;
//         if (internalFormat === PIXEL_FORMAT.DEPTH_STENCIL) return gl.DEPTH_STENCIL;

//         // does not include:
//         // RGB565

//         let extension;

//         if (!isWebGL2) {
//             if (internalFormat === PIXEL_FORMAT.RGBA32F || internalFormat === PIXEL_FORMAT.RGB32F) {
//                 extension = WebGLUtil.getExtension(gl, 'WEBGL_color_buffer_float');
//                 if (extension) {
//                     if (internalFormat === PIXEL_FORMAT.RGBA32F) return extension.RGBA32F_EXT;
//                     if (internalFormat === PIXEL_FORMAT.RGB32F) return extension.RGB32F_EXT;
//                 } else {
//                     console.warn('extension WEBGL_color_buffer_float is not support.');
//                     return null;
//                 }
//             }
//         } else {
//             if (internalFormat === PIXEL_FORMAT.R8) return gl.R8;
//             if (internalFormat === PIXEL_FORMAT.RG8) return gl.RG8;
//             if (internalFormat === PIXEL_FORMAT.RGB8) return gl.RGB8;
//             if (internalFormat === PIXEL_FORMAT.RGBA8) return gl.RGBA8;
//             if (internalFormat === PIXEL_FORMAT.DEPTH_COMPONENT24) return gl.DEPTH_COMPONENT24;
//             if (internalFormat === PIXEL_FORMAT.DEPTH_COMPONENT32F) return gl.DEPTH_COMPONENT32F;
//             if (internalFormat === PIXEL_FORMAT.DEPTH24_STENCIL8) return gl.DEPTH24_STENCIL8;
//             if (internalFormat === PIXEL_FORMAT.DEPTH32F_STENCIL8) return gl.DEPTH32F_STENCIL8;

//             // does not include:
//             // R8UI R8I R16UI R16I R32UI R32I RG8UI RG8I RG16UI RG16I RG32UI RG32I SRGB8_ALPHA8
//             // RGB10_A2 RGBA8UI RGBA8I RGB10_A2UI RGBA16UI RGBA16I RGBA32I RGBA32UI

//             if (internalFormat === PIXEL_FORMAT.R16F || internalFormat === PIXEL_FORMAT.RG16F ||
//                 internalFormat === PIXEL_FORMAT.RGB16F || internalFormat === PIXEL_FORMAT.RGBA16F ||
//                 internalFormat === PIXEL_FORMAT.R32F || internalFormat === PIXEL_FORMAT.RG32F ||
//                 internalFormat === PIXEL_FORMAT.RGB32F || internalFormat === PIXEL_FORMAT.RGBA32F) {
//                 extension = WebGLUtil.getExtension(gl, 'EXT_color_buffer_float');
//                 if (extension) {
//                     if (internalFormat === PIXEL_FORMAT.R16F) return gl.R16F;
//                     if (internalFormat === PIXEL_FORMAT.RG16F) return gl.RG16F;
//                     if (internalFormat === PIXEL_FORMAT.RGB16F) return gl.RGB16F;
//                     if (internalFormat === PIXEL_FORMAT.RGBA16F) return gl.RGBA16F;
//                     if (internalFormat === PIXEL_FORMAT.R32F) return gl.R32F;
//                     if (internalFormat === PIXEL_FORMAT.RG32F) return gl.RG32F;
//                     if (internalFormat === PIXEL_FORMAT.RGB32F) return gl.RGB32F;
//                     if (internalFormat === PIXEL_FORMAT.RGBA32F) return gl.RGBA32F;
//                     // does not include:
//                     // R11F_G11F_B10F
//                 } else {
//                     console.warn('extension EXT_color_buffer_float is not support.');
//                     return null;
//                 }
//             }
//         }

//         return (gl[internalFormat] !== undefined) ? gl[internalFormat] : internalFormat;
//     }

//     static getGlWrapping(gl, wrap) {
//         switch (wrap) {
//             case TEXTURE_WRAP.REPEAT: return gl.REPEAT;
//             case TEXTURE_WRAP.CLAMP_TO_EDGE: return gl.CLAMP_TO_EDGE;
//             case TEXTURE_WRAP.MIRRORED_REPEAT: return gl.MIRRORED_REPEAT;
//         }
//     }
//     static getGlFilter(gl, filter) {
//         switch (filter) {
//             case TEXTURE_FILTER.NEAREST: return gl.NEAREST;
//             case TEXTURE_FILTER.LINEAR: return gl.LINEAR;
//             case TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST: return gl.NEAREST_MIPMAP_NEAREST;
//             case TEXTURE_FILTER.LINEAR_MIPMAP_NEAREST: return gl.LINEAR_MIPMAP_NEAREST;
//             case TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR: return gl.NEAREST_MIPMAP_LINEAR;
//             case TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR: return gl.LINEAR_MIPMAP_LINEAR;
//         }
//     }

//     static getGLBlendFactor(gl, blendFactor) {
//         switch (blendFactor) {
//             case BlendFactor.Zero:
//                 return gl.ZERO;
//             case BlendFactor.One:
//                 return gl.ONE;
//             case BlendFactor.SourceColor:
//                 return gl.SRC_COLOR;
//             case BlendFactor.OneMinusSourceColor:
//                 return gl.ONE_MINUS_SRC_COLOR;
//             case BlendFactor.DestinationColor:
//                 return gl.DST_COLOR;
//             case BlendFactor.OneMinusDestinationColor:
//                 return gl.ONE_MINUS_DST_COLOR;
//             case BlendFactor.SourceAlpha:
//                 return gl.SRC_ALPHA;
//             case BlendFactor.OneMinusSourceAlpha:
//                 return gl.ONE_MINUS_SRC_ALPHA;
//             case BlendFactor.DestinationAlpha:
//                 return gl.DST_ALPHA;
//             case BlendFactor.OneMinusDestinationAlpha:
//                 return gl.ONE_MINUS_DST_ALPHA;
//             case BlendFactor.SourceAlphaSaturate:
//                 return gl.SRC_ALPHA_SATURATE;
//             case BlendFactor.BlendColor:
//                 return gl.CONSTANT_COLOR;
//             case BlendFactor.OneMinusBlendColor:
//                 return gl.ONE_MINUS_CONSTANT_COLOR;
//         }
//     }


//     static getGLBlendOperation(gl, blendOperation) {
//         switch (blendOperation) {
//             case BlendOperation.Add:
//                 return gl.FUNC_ADD;
//             case BlendOperation.Subtract:
//                 return gl.FUNC_SUBTRACT;
//             case BlendOperation.ReverseSubtract:
//                 return gl.FUNC_REVERSE_SUBTRACT;
//             case BlendOperation.Min:
//                 // if (!rhi.canIUse(GLCapabilityType.blendMinMax)) {
//                 //     throw new Error("BlendOperation.Min is not supported in this context");
//                 // }
//                 return gl.MIN; // in webgl1.0 is an extension
//             case BlendOperation.Max:
//                 // if (!rhi.canIUse(GLCapabilityType.blendMinMax)) {
//                 //     throw new Error("BlendOperation.Max is not supported in this context");
//                 // }
//                 return gl.MAX; // in webgl1.0 is an extension
//         }
//     }

//     //#endregion    
// }