import { System, SystemGroupType } from "@poly-engine/core";
import { TextureUtil } from "./TextureUtil.js";
import { TextureFormat } from "./TextureFormat.js";
import { GLUtil } from "../webgl/GLUtil.js";
import { TextureSystem } from "./TextureSystem.js";
import { TextureCubeFace } from "./TextureCubeFace.js";

export class TextureCubeSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 202;

        // this.com_glState = this.em.getComponentId('GlState');
        this.com_texture = this.em.getComponentId('Texture');
        this.com_textureState = this.em.getComponentId('TextureState');
        this.com_textureCube = this.em.getComponentId('TextureCube');
        this.com_textureCubeState = this.em.getComponentId('TextureCubeState');

        this.que_textureStateInit = this.qm.createQuery({
            all: [this.com_texture, this.com_textureState, this.com_textureCube],
            none: [this.com_textureCubeState]
        });
        this.que_textureStateRelease = this.qm.createQuery({
            all: [this.com_textureCubeState],
            none: [this.com_textureCube]
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

        this.que_textureStateInit.forEach(entity => {
            let texture = em.getComponent(entity, com_texture);
            let textureState = em.getComponent(entity, com_textureState);
            let texture2D = em.getComponent(entity, this.com_textureCube);

            const { format, mipmap, width, height } = texture;
            if (!TextureUtil._supportTextureFormat(this.glManager, format)) {
                throw new Error(`Texture format is not supported:${format}`);
            }
            let texture2DState = em.createComponent(this.com_textureCubeState);
            this._initState(texture, textureState, texture2D, texture2DState);

            this.que_textureStateInit.defer(() => {
                em.setComponent(entity, this.com_textureCubeState, texture2DState);
            });
        })

        this.que_textureStateRelease.forEach(entity => {
            let textureState = em.getComponent(entity, this.com_textureCubeState);
            this.que_textureStateRelease.defer(() => {
                // this._releaseTextureState(glState, textureState);
                em.removeComponent(entity, this.com_textureCubeState);
            });
        })
    }

    _initState(texture, textureState, textureCube, textureCubeState) {
        const gl = this.glManager.gl;
        const isWebGL2 = this.glManager.isWebGL2;
        const { format, mipmap, width, height } = texture;
        if (mipmap && !isWebGL2 && (!TextureUtil._isPowerOf2(width))) {
            Logger.warn(
                "non-power-2 texture is not supported for mipmap in WebGL1,and has automatically downgraded to non-mipmap"
            );
            mipmap = texture.mipmap = false;
            // textureState.mipmapCount = TextureUtil._getMipmapCount(texture);
        }
        textureState.target = gl.TEXTURE_CUBE_MAP;
        textureState.formatDetail = TextureUtil._getFormatDetail(gl, format, isWebGL2);

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
        // const isDepthTexture = textureState.isDepthTexture;
        let { internalFormat, baseFormat, dataType } = textureState.formatDetail;

        if (isWebGL2 && !(baseFormat === gl.LUMINANCE_ALPHA || baseFormat === gl.ALPHA)) {
            gl.texStorage2D(target, mipmapCount, internalFormat, width, height);
        } else {
            for (let i = 0; i < mipmapCount; i++) {
                const size = Math.max(1, width >> i);
                for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
                    gl.texImage2D(
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex,
                        i,
                        internalFormat,
                        size,
                        size,
                        0,
                        baseFormat,
                        dataType,
                        null
                    );
                }
            }
        }

        //update all faces
        if (textureCube.images != null)
            for (let i = 0; i < 6; i++) {
                this._updateImage(texture, textureState, textureCube, textureCubeState, i);
            }
        else if (textureCube.pixelBuffers != null)
            for (let i = 0; i < 6; i++) {
                this._updatePixelBuffer(texture, textureState, textureCube, textureCubeState, i);
            }
        this.textureSystem._generateMipmaps(texture, textureState);
    }

    setImage(entity, face, imageSource, mipLevel = 0) {
        const texture = this.em.getComponent(entity, this.com_texture);
        const textureState = this.em.getComponent(entity, this.com_textureState);
        const textureCube = this.em.getComponent(entity, this.com_textureCube);
        const textureCubeState = this.em.getComponent(entity, this.com_textureCubeState);

        if (textureCube.images[face] === imageSource)
            return;
        textureCube.images[face] = imageSource;
        this._updateImage(texture, textureState, textureCube, textureCubeState, face);
    }
    _updateImage(texture, textureState, textureCube, textureCubeState, face) {
        const images = textureCube.images;
        const imageSource = images[face];
        if (imageSource == null) return;

        const gl = this.glManager.gl;
        // const target = textureState.target;
        const { baseFormat, dataType } = textureState.formatDetail;
        let mipLevel = 0;
        let x = 0;
        let y = 0;

        this.glManager.bindTexture(textureState);
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, +flipY);
        // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, +premultiplyAlpha);
        // gl.texSubImage2D(target, 0, 0, 0, baseFormat, dataType, imageSource);
        gl.texSubImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
            mipLevel,
            x || 0,
            y || 0,
            baseFormat,
            dataType,
            imageSource
        );
    }
    setPixelBuffer(entity, face, colorBuffer, mipLevel = 0, x = 0, y = 0, width = 0, height = 0) {
        const texture = this.em.getComponent(entity, this.com_texture);
        const textureState = this.em.getComponent(entity, this.com_textureState);
        const textureCube = this.em.getComponent(entity, this.com_textureCube);
        const textureCubeState = this.em.getComponent(entity, this.com_textureCubeState);

        const buffers = textureCube.pixelBuffers;
        buffers ??= [];
        buffers[face] = colorBuffer;
        this._updatePixelBuffer(texture, textureState, textureCube, textureCubeState, face, mipLevel, x, y, width, height);


    }
    _updatePixelBuffer(texture, textureState, textureCube, textureCubeState, face, mipLevel = 0, x = 0, y = 0, width = 0, height = 0) {
        const images = textureCube.pixelBuffers;
        if (images == null)
            return;
        const colorBuffer = images[face];
        if (colorBuffer == null) return;

        const gl = this.glManager.gl;
        const isWebGL2 = this.glManager.isWebGL2;
        const { internalFormat, baseFormat, dataType, isCompressed } = textureState.formatDetail;
        const mipSize = Math.max(1, texture.width >> mipLevel);

        width = width || mipSize - x;
        height = height || mipSize - y;

        this.glManager.bindTexture(textureState);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

        if (isCompressed) {
            const mipBit = 1 << mipLevel;
            if (isWebGL2 || textureCubeState.compressedFaceFilled[face] & mipBit) {
                gl.compressedTexSubImage2D(
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                    mipLevel,
                    x,
                    y,
                    width,
                    height,
                    internalFormat,
                    colorBuffer
                );
            } else {
                gl.compressedTexImage2D(
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                    mipLevel,
                    internalFormat,
                    width,
                    height,
                    0,
                    colorBuffer
                );
                textureCubeState.compressedFaceFilled[face] |= mipBit;
            }
        } else {
            gl.texSubImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                mipLevel,
                x,
                y,
                width,
                height,
                baseFormat,
                dataType,
                colorBuffer
            );
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
        const texture = this.em.getComponent(entity, this.com_texture);
        const textureState = this.em.getComponent(entity, this.com_textureState);
        const textureCube = this.em.getComponent(entity, this.com_textureCube);

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
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
            textureState.texture,
            mipLevel
        );

        gl.readPixels(x, y, width, height, baseFormat, dataType, out);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

}

