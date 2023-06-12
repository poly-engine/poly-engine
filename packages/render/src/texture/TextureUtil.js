import { GLCapabilityType } from "../webgl/GLCapabilityType.js";
import { GLUtil } from "../webgl/GLUtil.js";
import { TextureFormat } from "./TextureFormat.js";

export class TextureUtil {
    //#region texture
    static async loadTexture(name) {
        let image = await TextureUtil.loadImage(name);
        return TextureUtil.createTexture(game.Gl, image);
    }
    static loadImage(path) {
        return new Promise((resolve) => {
            let image = new Image();
            image.src = path;
            image.onload = () => resolve(image);
        });
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLImageElement} image 
     * @returns 
     */
    static createTexture(gl, image) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);

        // GL_NEAREST_MIPMAP_LINEAR is the default. Consider switching to
        // GL_LINEAR_MIPMAP_LINEAR for the best quality.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        // GL_LINEAR is the default; make it explicit.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // GL_REPEAT is the default; make it explicit.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        return texture;
    }

    //#endregion

    // static textureNeedsPowerOfTwo(texture) {
    //     return (texture.wrapS !== TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== TEXTURE_WRAP.CLAMP_TO_EDGE) ||
    //         (texture.minFilter !== TEXTURE_FILTER.NEAREST && texture.minFilter !== TEXTURE_FILTER.LINEAR);
    // }

    // static filterFallback(filter) {
    //     if (filter === TEXTURE_FILTER.NEAREST || filter === TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR || filter === TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST) {
    //         return TEXTURE_FILTER.NEAREST;
    //     }

    //     return TEXTURE_FILTER.LINEAR;
    // }

    // static _isPowerOfTwo(image) {
    //     return Util.isPowerOfTwo(image.width) && Util.isPowerOfTwo(image.height);
    // }

    // static makePowerOf2(image) {
    //     if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement) {
    //         const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    //         canvas.width = Util.nearestPowerOfTwo(image.width);
    //         canvas.height = Util.nearestPowerOfTwo(image.height);

    //         const context = canvas.getContext('2d');
    //         context.drawImage(image, 0, 0, canvas.width, canvas.height);

    //         console.warn('image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

    //         return canvas;
    //     }

    //     return image;
    // }

    // static clampToMaxSize(image, maxSize) {
    //     if (image.width > maxSize || image.height > maxSize) {
    //         // console.warn('image is too big (' + image.width + 'x' + image.height + '). max size is ' + maxSize + 'x' + maxSize, image);
    //         // return image;

    //         // Warning: Scaling through the canvas will only work with images that use
    //         // premultiplied alpha.

    //         const scale = maxSize / Math.max(image.width, image.height);

    //         const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    //         canvas.width = Math.floor(image.width * scale);
    //         canvas.height = Math.floor(image.height * scale);

    //         const context = canvas.getContext('2d');
    //         context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

    //         console.warn('image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

    //         return canvas;
    //     }

    //     return image;
    // }

    // static getTextureParameters(texture, needFallback) {
    //     let wrapS = texture.wrapS,
    //         wrapT = texture.wrapT,
    //         wrapR = texture.wrapR,
    //         magFilter = texture.magFilter,
    //         minFilter = texture.minFilter;

    //     const anisotropy = texture.anisotropy,
    //         compare = texture.compare;

    //     // fix for non power of 2 image in WebGL 1.0
    //     if (needFallback) {
    //         wrapS = TEXTURE_WRAP.CLAMP_TO_EDGE;
    //         wrapT = TEXTURE_WRAP.CLAMP_TO_EDGE;

    //         if (texture.isTexture3D) {
    //             wrapR = TEXTURE_WRAP.CLAMP_TO_EDGE;
    //         }

    //         if (texture.wrapS !== TEXTURE_WRAP.CLAMP_TO_EDGE || texture.wrapT !== TEXTURE_WRAP.CLAMP_TO_EDGE) {
    //             console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to t3d.TEXTURE_WRAP.CLAMP_TO_EDGE.', texture);
    //         }

    //         magFilter = this.filterFallback(texture.magFilter);
    //         minFilter = this.filterFallback(texture.minFilter);

    //         if (
    //             (texture.minFilter !== TEXTURE_FILTER.NEAREST && texture.minFilter !== TEXTURE_FILTER.LINEAR) ||
    //             (texture.magFilter !== TEXTURE_FILTER.NEAREST && texture.magFilter !== TEXTURE_FILTER.LINEAR)
    //         ) {
    //             console.warn('Texture is not power of two. Texture.minFilter and Texture.magFilter should be set to t3d.TEXTURE_FILTER.NEAREST or t3d.TEXTURE_FILTER.LINEAR.', texture);
    //         }
    //     }

    //     return [wrapS, wrapT, wrapR, magFilter, minFilter, anisotropy, compare];
    // }

    // static getGLInternalFormat(gl, glFormat, glType) {
    //     const isWebGL2 = WebGLUtil.getVersion(gl) >= 2;

    //     if (isWebGL2 === false) return glFormat;

    //     let glInternalFormat = glFormat;

    //     if (glFormat === gl.RED) {
    //         if (glType === gl.FLOAT) glInternalFormat = gl.R32F;
    //         if (glType === gl.HALF_FLOAT) glInternalFormat = gl.R16F;
    //         if (glType === gl.UNSIGNED_BYTE) glInternalFormat = gl.R8;
    //     }

    //     if (glFormat === gl.RG) {
    //         if (glType === gl.FLOAT) glInternalFormat = gl.RG32F;
    //         if (glType === gl.HALF_FLOAT) glInternalFormat = gl.RG16F;
    //         if (glType === gl.UNSIGNED_BYTE) glInternalFormat = gl.RG8;
    //     }

    //     if (glFormat === gl.RGB) {
    //         if (glType === gl.FLOAT) glInternalFormat = gl.RGB32F;
    //         if (glType === gl.HALF_FLOAT) glInternalFormat = gl.RGB16F;
    //         if (glType === gl.UNSIGNED_BYTE) glInternalFormat = gl.RGB8;
    //     }

    //     if (glFormat === gl.RGBA) {
    //         if (glType === gl.FLOAT) glInternalFormat = gl.RGBA32F;
    //         if (glType === gl.HALF_FLOAT) glInternalFormat = gl.RGBA16F;
    //         if (glType === gl.UNSIGNED_BYTE) glInternalFormat = gl.RGBA8;
    //         if (glType === gl.UNSIGNED_SHORT_4_4_4_4) glInternalFormat = gl.RGBA4;
    //         if (glType === gl.UNSIGNED_SHORT_5_5_5_1) glInternalFormat = gl.RGB5_A1;
    //     }

    //     if (glFormat === gl.DEPTH_COMPONENT || glFormat === gl.DEPTH_STENCIL) {
    //         glInternalFormat = gl.DEPTH_COMPONENT16;
    //         if (glType === gl.FLOAT) glInternalFormat = gl.DEPTH_COMPONENT32F;
    //         if (glType === gl.UNSIGNED_INT) glInternalFormat = gl.DEPTH_COMPONENT24;
    //         if (glType === gl.UNSIGNED_INT_24_8) glInternalFormat = gl.DEPTH24_STENCIL8;
    //         if (glType === gl.FLOAT_32_UNSIGNED_INT_24_8_REV) glInternalFormat = gl.DEPTH32F_STENCIL8;
    //     }

    //     if (glInternalFormat === gl.R16F || glInternalFormat === gl.R32F ||
    //         glInternalFormat === gl.RG16F || glInternalFormat === gl.RG32F ||
    //         glInternalFormat === gl.RGB16F || glInternalFormat === gl.RGB32F ||
    //         glInternalFormat === gl.RGBA16F || glInternalFormat === gl.RGBA32F) {
    //         WebGLUtil.getExtension(gl, 'EXT_color_buffer_float');
    //     }

    //     return glInternalFormat;
    // }

    // static domCheck(image) {
    //     return (typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement)
    //         || (typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement)
    //         || (typeof HTMLVideoElement !== 'undefined' && image instanceof HTMLVideoElement)
    //         || (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap);
    // }

    // // static _wrappingToGL = {
    // //     [TEXTURE_WRAP.REPEAT]: gl.REPEAT,
    // //     [TEXTURE_WRAP.CLAMP_TO_EDGE]: gl.CLAMP_TO_EDGE,
    // //     [TEXTURE_WRAP.MIRRORED_REPEAT]: gl.MIRRORED_REPEAT
    // // };

    // // static _filterToGL = {
    // //     [TEXTURE_FILTER.NEAREST]: gl.NEAREST,
    // //     [TEXTURE_FILTER.LINEAR]: gl.LINEAR,
    // //     [TEXTURE_FILTER.NEAREST_MIPMAP_NEAREST]: gl.NEAREST_MIPMAP_NEAREST,
    // //     [TEXTURE_FILTER.LINEAR_MIPMAP_NEAREST]: gl.LINEAR_MIPMAP_NEAREST,
    // //     [TEXTURE_FILTER.NEAREST_MIPMAP_LINEAR]: gl.NEAREST_MIPMAP_LINEAR,
    // //     [TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR]: gl.LINEAR_MIPMAP_LINEAR
    // // };

    // static _setTextureParameters(glState, texture, needFallback) {
    //     const gl = glState.gl;
    //     const capabilities = glState.capabilities;

    //     // // GL_NEAREST_MIPMAP_LINEAR is the default. Consider switching to
    //     // // GL_LINEAR_MIPMAP_LINEAR for the best quality.
    //     // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    //     // // GL_LINEAR is the default; make it explicit.
    //     // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    //     // // GL_REPEAT is the default; make it explicit.
    //     // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    //     // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    //     const wrappingToGL = WebGLUtil.getGlWrapping;
    //     const filterToGL = WebGLUtil.getGlFilter;

    //     let textureType = gl.TEXTURE_2D;
    //     if (texture.isTextureCube) textureType = gl.TEXTURE_CUBE_MAP;
    //     if (texture.isTexture3D) textureType = gl.TEXTURE_3D;

    //     const parameters = this.getTextureParameters(texture, needFallback);

    //     gl.texParameteri(textureType, gl.TEXTURE_WRAP_S, wrappingToGL(gl, parameters[0]));
    //     gl.texParameteri(textureType, gl.TEXTURE_WRAP_T, wrappingToGL(gl, parameters[1]));

    //     if (texture.isTexture3D) {
    //         gl.texParameteri(textureType, gl.TEXTURE_WRAP_R, wrappingToGL(gl, parameters[2]));
    //     }

    //     gl.texParameteri(textureType, gl.TEXTURE_MAG_FILTER, filterToGL(gl, parameters[3]));
    //     gl.texParameteri(textureType, gl.TEXTURE_MIN_FILTER, filterToGL(gl, parameters[4]));

    //     // anisotropy if EXT_texture_filter_anisotropic exist
    //     const extension = capabilities.anisotropyExt;
    //     if (extension) {
    //         gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(parameters[5], capabilities.maxAnisotropy));
    //     }

    //     if (capabilities.version >= 2) {
    //         if (parameters[6] !== undefined) {
    //             gl.texParameteri(textureType, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    //             gl.texParameteri(textureType, gl.TEXTURE_COMPARE_FUNC, parameters[6]);
    //         } else {
    //             gl.texParameteri(textureType, gl.TEXTURE_COMPARE_MODE, gl.NONE);
    //         }
    //     }
    // }

    //#region galacean
    /**
     * Get more texture info from TextureFormat.
     * @internal
     */
    static _getFormatDetail(gl, format, isWebGL2) {
        switch (format) {
            case TextureFormat.R8G8B8:
                return {
                    internalFormat: isWebGL2 ? gl.RGB8 : gl.RGB,
                    baseFormat: gl.RGB,
                    dataType: gl.UNSIGNED_BYTE,
                    isCompressed: false
                };
            case TextureFormat.R8G8B8A8:
                return {
                    internalFormat: isWebGL2 ? gl.RGBA8 : gl.RGBA,
                    baseFormat: gl.RGBA,
                    dataType: gl.UNSIGNED_BYTE,
                    isCompressed: false
                };
            case TextureFormat.R4G4B4A4:
                return {
                    internalFormat: isWebGL2 ? gl.RGBA4 : gl.RGBA,
                    baseFormat: gl.RGBA,
                    dataType: gl.UNSIGNED_SHORT_4_4_4_4,
                    isCompressed: false
                };
            case TextureFormat.R5G5B5A1:
                return {
                    internalFormat: isWebGL2 ? gl.RGB5_A1 : gl.RGBA,
                    baseFormat: gl.RGBA,
                    dataType: gl.UNSIGNED_SHORT_5_5_5_1,
                    isCompressed: false
                };
            case TextureFormat.R5G6B5:
                return {
                    internalFormat: isWebGL2 ? gl.RGB565 : gl.RGB,
                    baseFormat: gl.RGB,
                    dataType: gl.UNSIGNED_SHORT_5_6_5,
                    isCompressed: false
                };
            case TextureFormat.Alpha8:
                return {
                    internalFormat: gl.ALPHA,
                    baseFormat: gl.ALPHA,
                    dataType: gl.UNSIGNED_BYTE,
                    isCompressed: false
                };
            case TextureFormat.LuminanceAlpha:
                return {
                    internalFormat: gl.LUMINANCE_ALPHA,
                    baseFormat: gl.LUMINANCE_ALPHA,
                    dataType: gl.UNSIGNED_BYTE,
                    isCompressed: false
                };
            case TextureFormat.R16G16B16A16:
                return {
                    internalFormat: isWebGL2 ? gl.RGBA16F : gl.RGBA,
                    baseFormat: gl.RGBA,
                    dataType: gl.HALF_FLOAT,
                    isCompressed: false
                };
            case TextureFormat.R32G32B32A32:
                return {
                    internalFormat: isWebGL2 ? gl.RGBA32F : gl.RGBA,
                    baseFormat: gl.RGBA,
                    dataType: gl.FLOAT,
                    isCompressed: false
                };
            case TextureFormat.DXT1:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGB_S3TC_DXT1_EXT,
                    isCompressed: true
                };
            case TextureFormat.DXT5:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_S3TC_DXT5_EXT,
                    isCompressed: true
                };
            case TextureFormat.ETC1_RGB:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGB_ETC1_WEBGL,
                    isCompressed: true
                };
            case TextureFormat.ETC2_RGB:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGB8_ETC2,
                    isCompressed: true
                };
            case TextureFormat.ETC2_RGBA5:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
                    isCompressed: true
                };
            case TextureFormat.ETC2_RGBA8:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA8_ETC2_EAC,
                    isCompressed: true
                };
            case TextureFormat.PVRTC_RGB2:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGB_PVRTC_2BPPV1_IMG,
                    isCompressed: true
                };
            case TextureFormat.PVRTC_RGBA2:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_PVRTC_2BPPV1_IMG,
                    isCompressed: true
                };
            case TextureFormat.PVRTC_RGB4:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGB_PVRTC_4BPPV1_IMG,
                    isCompressed: true
                };
            case TextureFormat.PVRTC_RGBA4:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_PVRTC_4BPPV1_IMG,
                    isCompressed: true
                };
            case TextureFormat.ASTC_4x4:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_ASTC_4X4_KHR,
                    isCompressed: true
                };
            case TextureFormat.ASTC_5x5:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_ASTC_5X5_KHR,
                    isCompressed: true
                };
            case TextureFormat.ASTC_6x6:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_ASTC_6X6_KHR,
                    isCompressed: true
                };
            case TextureFormat.ASTC_8x8:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_ASTC_8X8_KHR,
                    isCompressed: true
                };
            case TextureFormat.ASTC_10x10:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_ASTC_10X10_KHR,
                    isCompressed: true
                };
            case TextureFormat.ASTC_12x12:
                return {
                    internalFormat: GLCompressedTextureInternalFormat.RGBA_ASTC_12X12_KHR,
                    isCompressed: true
                };

            case TextureFormat.Depth:
                return {
                    internalFormat: isWebGL2 ? gl.DEPTH_COMPONENT32F : gl.DEPTH_COMPONENT,
                    baseFormat: gl.DEPTH_COMPONENT,
                    dataType: isWebGL2 ? gl.FLOAT : gl.UNSIGNED_SHORT,
                    isCompressed: false,
                    attachment: gl.DEPTH_ATTACHMENT
                };
            case TextureFormat.DepthStencil:
                return {
                    internalFormat: isWebGL2 ? gl.DEPTH32F_STENCIL8 : gl.DEPTH_STENCIL,
                    baseFormat: gl.DEPTH_STENCIL,
                    dataType: isWebGL2 ? gl.FLOAT_32_UNSIGNED_INT_24_8_REV : gl.UNSIGNED_INT_24_8,
                    isCompressed: false,
                    attachment: gl.DEPTH_STENCIL_ATTACHMENT
                };
            case TextureFormat.Depth16:
                return {
                    internalFormat: isWebGL2 ? gl.DEPTH_COMPONENT16 : gl.DEPTH_COMPONENT,
                    baseFormat: gl.DEPTH_COMPONENT,
                    dataType: gl.UNSIGNED_SHORT,
                    isCompressed: false,
                    attachment: gl.DEPTH_ATTACHMENT
                };
            case TextureFormat.Depth24Stencil8:
                return {
                    internalFormat: isWebGL2 ? gl.DEPTH24_STENCIL8 : gl.DEPTH_STENCIL,
                    baseFormat: gl.DEPTH_STENCIL,
                    dataType: gl.UNSIGNED_INT_24_8,
                    isCompressed: false,
                    attachment: gl.DEPTH_STENCIL_ATTACHMENT
                };
            case TextureFormat.Depth24:
                return {
                    internalFormat: gl.DEPTH_COMPONENT24,
                    baseFormat: gl.DEPTH_COMPONENT,
                    dataType: gl.UNSIGNED_INT,
                    isCompressed: false,
                    attachment: gl.DEPTH_ATTACHMENT
                };
            case TextureFormat.Depth32:
                return {
                    internalFormat: gl.DEPTH_COMPONENT32F,
                    baseFormat: gl.DEPTH_COMPONENT,
                    dataType: gl.FLOAT,
                    isCompressed: false,
                    attachment: gl.DEPTH_ATTACHMENT
                };
            case TextureFormat.Depth32Stencil8:
                return {
                    internalFormat: gl.DEPTH32F_STENCIL8,
                    baseFormat: gl.DEPTH_STENCIL,
                    dataType: gl.FLOAT_32_UNSIGNED_INT_24_8_REV,
                    isCompressed: false,
                    attachment: gl.DEPTH_STENCIL_ATTACHMENT
                };
            default:
                throw new Error(`this TextureFormat is not supported in Galacean Engine: ${format}`);
        }
    }

    /**
     * Check whether the corresponding texture format is supported.
     * @internal
     */
    static _supportTextureFormat(glState, format) {
        const capabilities = glState.capabilities;
        switch (format) {
            case TextureFormat.R16G16B16A16:
                if (!GLUtil.canIUse(glState, GLCapabilityType.textureHalfFloat)) {
                    return false;
                }
                break;
            case TextureFormat.R32G32B32A32:
                if (!GLUtil.canIUse(glState, GLCapabilityType.textureFloat)) {
                    return false;
                }
                break;
            case TextureFormat.Depth16:
            case TextureFormat.Depth24Stencil8:
            case TextureFormat.Depth:
            case TextureFormat.DepthStencil:
                if (!GLUtil.canIUse(glState, GLCapabilityType.depthTexture)) {
                    return false;
                }
                break;
            case TextureFormat.Depth24:
            case TextureFormat.Depth32:
            case TextureFormat.Depth32Stencil8:
                return glState.isWebGL2;
        }
        return true;
    }

    /**
     * Get the maximum mip level of the corresponding size:rounding down.
     * @remarks http://download.nvidia.com/developer/Papers/2005/NP2_Mipmapping/NP2_Mipmap_Creation.pdf
     */
    static _getMaxMiplevel(size) {
        return Math.floor(Math.log2(size));
    }

    static _getMipmapCount(texture) {
        return texture.mipmap ? Math.floor(Math.log2(Math.max(texture.width, texture.height))) + 1 : 1;
    }

    /** @internal */
    static _isPowerOf2(v) {
        return (v & (v - 1)) === 0;
    }
    //#endregion
}