import { System, SystemGroupType } from "@poly-engine/core";
import { GLUtil } from "../webgl/GLUtil.js";
import { TextureDepthCompareFunction } from "./TextureDepthCompareFunction.js";
import { TextureFilterMode } from "./TextureFilterMode.js";
import { TextureUtil } from "./TextureUtil.js";
import { TextureWrapMode } from "./TextureWrapMode.js";

export class TextureSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 200;

        // this.com_glState = this.em.getComponentId('GlState');
        this.com_texture = this.em.getComponentId('Texture');
        this.com_textureState = this.em.getComponentId('TextureState');

        this.que_textureStateInit = this.qm.createQuery({
            all: [this.com_texture],
            none: [this.com_textureState]
        });
        this.que_textureStateRelease = this.qm.createQuery({
            all: [this.com_textureState],
            none: [this.com_texture]
        });
    }
    init() {
        this.glManager = this.world.glManager;

    }
    _update() {
        const em = this.em;
        // const com_glState = this.com_glState;
        const com_texture = this.com_texture;
        const com_textureState = this.com_textureState;

        // let glState = em.getSingletonComponent(com_glState);
        // if (!glState)
        //     return;
        this.que_textureStateInit.forEach(entity => {
            let texture = em.getComponent(entity, com_texture);
            this.que_textureStateInit.defer(() => {
                let textureState = em.createComponent(com_textureState);
                this._initTextureState(texture, textureState);
                em.setComponent(entity, com_textureState, textureState);
            });
        })

        this.que_textureStateRelease.forEach(entity => {
            let textureState = em.getComponent(entity, com_textureState);
            this.que_textureStateRelease.defer(() => {
                this._releaseTextureState(textureState);
                em.removeComponent(entity, com_textureState);
            });
        })
    }

    _initTextureState(texture, textureState) {
        const gl = this.glManager.gl;
        const isWebGL2 = this.glManager.isWebGL2;

        textureState.texture = gl.createTexture();
        // GLUtil.bindTexture(glState, textureState);

        // textureState.formatDetail = TextureUtil._getFormatDetail(gl, texture.format, isWebGL2);
        // // textureState.texture = TextureUtil.createTexture(gl, texture.element);
        // textureState.mipmapCount = TextureUtil._getMipmapCount(texture);

        // this._updateWrapModeU(glState, texture, textureState);
        // this._updateWrapModeV(glState, texture, textureState);

        // this._updateFilterMode(glState, texture, textureState);
        // this._updateAnisoLevel(glState, texture, textureState);
        // this._updateDepthCompareFunction(glState, texture, textureState);
    }

    _releaseTextureState(textureState) {
        let gl = this.glManager.gl;
        gl.deleteTexture(textureState.texture);
    }

    setWrapModeU(glState, texture, textureState, value) {
        const isWebGL2 = glState.isWebGL2;
        if (!isWebGL2 && value !== TextureWrapMode.Clamp &&
            (!TextureUtil._isPowerOf2(texture.width) || !TextureUtil._isPowerOf2(texture.height))) {
            Logger.warn("non-power-2 texture is not supported for REPEAT or MIRRORED_REPEAT in WebGL1,and has automatically downgraded to CLAMP_TO_EDGE");
            value = TextureWrapMode.Clamp;
        }
        if (texture.wrapModeU === value)
            return;
        texture.wrapModeU = value;
        GLUtil.bindTexture(glState, textureState);
        this._updateWrapModeU(glState, texture, textureState);
    }
    _updateWrapModeU(texture, textureState) {
        const gl = this.glManager.gl;
        const target = textureState.target;
        const value = texture.wrapModeU;
        const pname = gl.TEXTURE_WRAP_S;
        switch (value) {
            case TextureWrapMode.Clamp:
                gl.texParameteri(target, pname, gl.CLAMP_TO_EDGE);
                break;
            case TextureWrapMode.Repeat:
                gl.texParameteri(target, pname, gl.REPEAT);
                break;
            case TextureWrapMode.Mirror:
                gl.texParameteri(target, pname, gl.MIRRORED_REPEAT);
                break;
        }
    }
    setWrapModeV(glState, texture, textureState, value) {
        const isWebGL2 = glState.isWebGL2;
        if (!isWebGL2 && value !== TextureWrapMode.Clamp &&
            (!TextureUtil._isPowerOf2(texture.width) || !TextureUtil._isPowerOf2(texture.height))) {
            Logger.warn("non-power-2 texture is not supported for REPEAT or MIRRORED_REPEAT in WebGL1,and has automatically downgraded to CLAMP_TO_EDGE");
            value = TextureWrapMode.Clamp;
        }
        if (texture.wrapModeV === value)
            return;
        texture.wrapModeV = value;
        GLUtil.bindTexture(glState, textureState);
        this._updateWrapModeV(glState, texture, textureState);
    }
    _updateWrapModeV(texture, textureState) {
        const gl = this.glManager.gl;
        const target = textureState.target;
        const value = texture.wrapModeV;
        const pname = gl.TEXTURE_WRAP_T;
        switch (value) {
            case TextureWrapMode.Clamp:
                gl.texParameteri(target, pname, gl.CLAMP_TO_EDGE);
                break;
            case TextureWrapMode.Repeat:
                gl.texParameteri(target, pname, gl.REPEAT);
                break;
            case TextureWrapMode.Mirror:
                gl.texParameteri(target, pname, gl.MIRRORED_REPEAT);
                break;
        }
    }
    setFilterMode(glState, texture, textureState, value) {
        if (texture.filterMode === value)
            return;
        texture.filterMode = value;
        GLUtil.bindTexture(glState, textureState);
        this._updateFilterMode(glState, texture, textureState);
    }
    _updateFilterMode(texture, textureState) {
        const gl = this.glManager.gl;
        const target = textureState.target;
        const value = texture.filterMode;
        const { mipmap } = texture;

        switch (value) {
            case TextureFilterMode.Point:
                gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, mipmap ? gl.NEAREST_MIPMAP_NEAREST : gl.NEAREST);
                break;
            case TextureFilterMode.Bilinear:
                gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, mipmap ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR);
                break;
            case TextureFilterMode.Trilinear:
                gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                break;
        }
    }
    setAnisoLevel(glState, texture, textureState, value) {
        const max = glState.capabilities.maxAnisoLevel;
        if (value > max) {
            Logger.warn(`anisoLevel:${value}, exceeds the limit and is automatically downgraded to:${max}`);
            value = max;
        }
        if (value < 1) {
            Logger.warn(`anisoLevel:${value}, must be greater than 0, and is automatically downgraded to 1`);
            value = 1;
        }
        if (texture.anisoLevel === value)
            return;
        texture.anisoLevel = value;
        GLUtil.bindTexture(glState, textureState);
        this._updateAnisoLevel(glState, texture, textureState);
    }
    _updateAnisoLevel(texture, textureState) {
        const gl = this.glManager.gl;
        const target = textureState.target;
        const value = texture.anisoLevel;
        gl.texParameterf(target, gl.TEXTURE_MAX_ANISOTROPY_EXT, value);
    }
    setDepthCompareFunction(glState, texture, textureState, value) {
        if (!glState.isWebGL2) {
            console.warn("depthCompareFunction only support WebGL2");
            return;
        }
        if (texture.depthCompareFunction === value)
            return;
        texture.depthCompareFunction = value;
        GLUtil.bindTexture(glState, textureState);
        this._updateDepthCompareFunction(glState, texture, textureState);
    }
    _updateDepthCompareFunction(texture, textureState) {
        const gl = this.glManager.gl;
        const target = textureState.target;
        const value = texture.anisoLevel;
        switch (value) {
            case TextureDepthCompareFunction.Never:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.NEVER);
                break;
            case TextureDepthCompareFunction.Less:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.LESS);
                break;
            case TextureDepthCompareFunction.Equal:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.EQUAL);
                break;
            case TextureDepthCompareFunction.LessEqual:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
                break;
            case TextureDepthCompareFunction.Greater:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.GREATER);
                break;
            case TextureDepthCompareFunction.NotEqual:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.NOTEQUAL);
                break;
            case TextureDepthCompareFunction.GreaterEqual:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.GEQUAL);
                break;
            case TextureDepthCompareFunction.Always:
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, gl.ALWAYS);
                break;
        }
    }

    generateMipmaps(texture, textureState) {
        if (!texture.mipmap) return;
        const gl = this.glManager.gl;
        const target = textureState.target;
        // @todo (1x1).generateMipmap() will flash back in uc.
        if (texture.width !== 1 || texture.height !== 1) {
            this.glManager.bindTexture(textureState);
            gl.generateMipmap(target);
        }
    }

    // /**
    //  * Pre-development mipmapping GPU memory.
    //  */
    // _init(glState, texture, textureState, isCube) {
    //     const gl = glState.gl;
    //     const isWebGL2 = glState.isWebGL2;
    //     const target = textureState.target;
    //     const isDepthTexture = textureState.isDepthTexture;
    //     let { internalFormat, baseFormat, dataType } = textureState.formatDetail;
    //     // @ts-ignore
    //     const { mipmapCount, width, height } = texture;

    //     GLUtil.bindTexture(glState, textureState);

    //     if (isWebGL2 && !(baseFormat === gl.LUMINANCE_ALPHA || baseFormat === gl.ALPHA)) {
    //         gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
    //     } else {
    //         if (!isCube) {
    //             if (isDepthTexture) {
    //                 gl.texImage2D(target, 0, internalFormat, width, height, 0, baseFormat, dataType, null);
    //             } else {
    //                 for (let i = 0; i < mipmapCount; i++) {
    //                     const mipWidth = Math.max(1, width >> i);
    //                     const mipHeight = Math.max(1, height >> i);
    //                     gl.texImage2D(target, i, internalFormat, mipWidth, mipHeight, 0, baseFormat, dataType, null);
    //                 }
    //             }
    //         } else {
    //             for (let i = 0; i < mipmapCount; i++) {
    //                 const size = Math.max(1, width >> i);
    //                 for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
    //                     gl.texImage2D(
    //                         gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
    //                         i,
    //                         internalFormat,
    //                         size,
    //                         size,
    //                         0,
    //                         baseFormat,
    //                         dataType,
    //                         null
    //                     );
    //                 }
    //             }
    //         }
    //     }
    // }
}


