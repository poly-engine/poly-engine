import { System, SystemGroupType } from "@poly-engine/core";
import { TextureUtil } from "./TextureUtil.js";
import { TextureFormat } from "./TextureFormat.js";
import { GLUtil } from "../webgl/GLUtil.js";
import { TextureSystem } from "./TextureSystem.js";

export class Texture2DSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 201;

        // this.com_glState = this.em.getComponentId('GlState');
        this.com_texture = this.em.getComponentId('Texture');
        this.com_textureState = this.em.getComponentId('TextureState');
        this.com_texture2D = this.em.getComponentId('Texture2D');
        this.com_texture2DState = this.em.getComponentId('Texture2DState');

        this.que_textureStateInit = this.qm.createQuery({
            all: [this.com_texture, this.com_textureState, this.com_texture2D],
            none: [this.com_texture2DState]
        });
        this.que_textureStateRelease = this.qm.createQuery({
            all: [this.com_texture2DState],
            none: [this.com_texture2D]
        });
    }
    init() {
        this.glManager = this.world.glManager;
        this.textureSystem = this.sm.getSystem(TextureSystem);
    }
    _update() {
        const em = this.em;
        const com_texture = this.com_texture;
        const com_textureState = this.com_textureState;

        // let glState = em.getSingletonComponent(this.com_glState);
        // if (!glState)
        //     return;
        // const isWebGL2 = glState.isWebGL2;
        this.que_textureStateInit.forEach(entity => {
            let texture = em.getComponent(entity, com_texture);
            let textureState = em.getComponent(entity, com_textureState);
            let texture2D = em.getComponent(entity, this.com_texture2D);

            const { format, mipmap, width, height } = texture;
            if (!TextureUtil._supportTextureFormat(this.glManager, format)) {
                throw new Error(`Texture format is not supported:${format}`);
            }
            let texture2DState = em.createComponent(this.com_texture2DState);
            this._initState(texture, textureState, texture2D, texture2DState);

            this.que_textureStateInit.defer(() => {
                em.setComponent(entity, this.com_texture2DState, texture2DState);
            });
        })

        this.que_textureStateRelease.forEach(entity => {
            let textureState = em.getComponent(entity, this.com_texture2DState);
            this.que_textureStateRelease.defer(() => {
                // this._releaseTextureState(glState, textureState);
                em.removeComponent(entity, this.com_texture2DState);
            });
        })
    }

    _initState(texture, textureState, texture2D, texture2DState) {
        const gl = this.glManager.gl;
        const isWebGL2 = this.glManager.isWebGL2;
        const { format, mipmap, width, height } = texture;
        console.log(texture);
        if (mipmap && !isWebGL2 && (!TextureUtil._isPowerOf2(width) || !TextureUtil._isPowerOf2(height))) {
            Logger.warn(
                "non-power-2 texture is not supported for mipmap in WebGL1,and has automatically downgraded to non-mipmap"
            );
            mipmap = texture.mipmap = false;
            // textureState.mipmapCount = TextureUtil._getMipmapCount(texture);
        }
        textureState.target = gl.TEXTURE_2D;
        textureState.formatDetail = TextureUtil._getFormatDetail(gl, format, isWebGL2);
        textureState.isDepthTexture =
            format == TextureFormat.Depth ||
            format == TextureFormat.DepthStencil ||
            format == TextureFormat.Depth16 ||
            format == TextureFormat.Depth24 ||
            format == TextureFormat.Depth32 ||
            format == TextureFormat.Depth24Stencil8 ||
            format == TextureFormat.Depth32Stencil8;

        // textureState.formatDetail = TextureUtil._getFormatDetail(gl, texture.format, isWebGL2);
        // textureState.texture = TextureUtil.createTexture(gl, texture.element);
        // textureState.mipmapCount = TextureUtil._getMipmapCount(texture);
        const mipmapCount = texture.mipmapCount;

        this.glManager.bindTexture(textureState);

        this.textureSystem._updateWrapModeU(texture, textureState);
        this.textureSystem._updateWrapModeV(texture, textureState);

        this.textureSystem._updateFilterMode(texture, textureState);
        this.textureSystem._updateAnisoLevel(texture, textureState);
        this.textureSystem._updateDepthCompareFunction(texture, textureState);

        if (textureState.formatDetail.isCompressed && !isWebGL2)
            return;

        const target = textureState.target;
        const isDepthTexture = textureState.isDepthTexture;
        let { internalFormat, baseFormat, dataType } = textureState.formatDetail;

        if (isWebGL2 && !(baseFormat === gl.LUMINANCE_ALPHA || baseFormat === gl.ALPHA)) {
            gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        } else {
            if (isDepthTexture) {
                gl.texImage2D(target, 0, internalFormat, width, height, 0, baseFormat, dataType, null);
            } else {
                for (let i = 0; i < mipmapCount; i++) {
                    const mipWidth = Math.max(1, width >> i);
                    const mipHeight = Math.max(1, height >> i);
                    gl.texImage2D(target, i, internalFormat, mipWidth, mipHeight, 0, baseFormat, dataType, null);
                }
            }
        }

        this._updateImage(texture, textureState, texture2D, texture2DState);
        // this.textureSystem._generateMipmaps(texture, textureState);
    }

    setImage(entity, imageSource, mipLevel = 0) {
        // const glState = em.getSingletonComponent(this.com_glState);
        // if (!glState) return;

        const texture = this.em.getComponent(entity, this.com_texture);
        const textureState = this.em.getComponent(entity, this.com_textureState);
        const texture2D = this.em.getComponent(entity, this.com_texture2D);
        const texture2DState = this.em.getComponent(entity, this.com_texture2DState);

        if (texture2D.image === imageSource)
            return;
        texture2D.image = imageSource;
        this._updateImage(texture, textureState, texture2D, texture2DState);
    }
    _updateImage(texture, textureState, texture2D, texture2DState) {
        const imageSource = texture2D.image;
        if (imageSource == null) return;

        const gl = this.glManager.gl;
        const target = textureState.target;
        const { baseFormat, dataType } = textureState.formatDetail;

        this.glManager.bindTexture(textureState);
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, +flipY);
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, +premultiplyAlpha);
        gl.texSubImage2D(target, 0, 0, 0, baseFormat, dataType, imageSource);
    }
    setPixelBuffer(entity,
        colorBuffer,
        mipLevel = 0,
        x,
        y,
        width,
        height
    ) {
        const texture = this.em.getComponent(entity, this.com_texture);
        const textureState = this.em.getComponent(entity, this.com_textureState);
        const texture2D = this.em.getComponent(entity, this.com_texture2D);
        const texture2DState = this.em.getComponent(entity, this.com_texture2DState);

        const gl = this.glManager.gl;
        const isWebGL2 = this.glManager.isWebGL2;
        const { internalFormat, baseFormat, dataType, isCompressed } = textureState.formatDetail;
        const mipWidth = Math.max(1, texture.width >> mipLevel);
        const mipHeight = Math.max(1, texture.height >> mipLevel);
        const target = textureState.target;

        width = width || mipWidth - x;
        height = height || mipHeight - y;

        this.glManager.bindTexture(textureState);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

        if (isCompressed) {
            const mipBit = 1 << mipLevel;
            if (isWebGL2 || texture2DState.compressedMipFilled & mipBit) {
                gl.compressedTexSubImage2D(target, mipLevel, x, y, width, height, internalFormat, colorBuffer);
            } else {
                gl.compressedTexImage2D(target, mipLevel, internalFormat, width, height, 0, colorBuffer);
                texture2DState.compressedMipFilled |= mipBit;
            }
        } else {
            gl.texSubImage2D(target, mipLevel, x, y, width, height, baseFormat, dataType, colorBuffer);
        }
    }
    getPixelBuffer(entity,
        face,
        x,
        y,
        width,
        height,
        mipLevel,
        out
    ) {
        // const texture = this.em.getComponent(entity, this.com_texture);
        const textureState = this.em.getComponent(entity, this.com_textureState);
        // const textureCube = this.em.getComponent(entity, this.com_textureCube);

        const gl = this.glManager.gl;
        const isWebGL2 = this.glManager.isWebGL2;
        // const target = textureState.target;
        const { baseFormat, dataType } = textureState.formatDetail;

        if (textureState.formatDetail.isCompressed) {
            throw new Error("Unable to read compressed texture");
        }
        // super._getPixelBuffer(face, x, y, width, height, mipLevel, out);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glManager._getReadFrameBuffer());

        if (mipLevel > 0 && !isWebGL2) {
            mipLevel = 0;
            Logger.error("mipLevel only take effect in WebGL2.0");
        }
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureState.texture, mipLevel);

        gl.readPixels(x, y, width, height, baseFormat, dataType, out);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}

