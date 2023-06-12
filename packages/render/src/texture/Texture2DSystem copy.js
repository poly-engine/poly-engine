// import { System, SystemGroupType } from "@poly-engine/core";
// import { TextureUtil } from "./TextureUtil.js";
// import { WebGLUtil } from "../webgl/WebGLUtil.js";

// export class Texture2DSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.RenderUpdate;
//         this.index = 201;

//         this.com_glState = this.em.getComponentId('GlState');
//         this.com_texture = this.em.getComponentId('Texture');
//         this.com_textureState = this.em.getComponentId('TextureState');
//         this.com_texture2D = this.em.getComponentId('Texture2D');

//         this.que_textureStateInit = this.qm.createQuery({
//             all: [this.com_texture, this.com_texture2D],
//             none: [this.com_textureState]
//         });
//         // this.que_textureStateRelease = this.qm.createQuery({
//         //     all: [this.com_textureState],
//         //     none: [this.com_texture]
//         // });
//     }
//     init() {

//     }
//     _update() {
//         const em = this.em;
//         const com_glState = this.com_glState;
//         const com_texture = this.com_texture;
//         const com_textureState = this.com_textureState;

//         let glState = em.getSingletonComponent(com_glState);
//         if (!glState)
//             return;
//         this.que_textureStateInit.forEach(entity => {
//             let texture = em.getComponent(entity, com_texture);
//             let texture2D = em.getComponent(entity, this.com_texture2D);
//             this.que_textureStateInit.defer(() => {
//                 let textureState = em.createComponent(com_textureState);
//                 // textureState.texture = TextureUtil.createTexture(glState.gl, texture2D.image);
//                 this._initTextureState(glState, texture, textureState, texture2D);
//                 em.setComponent(entity, com_textureState, textureState);
//             });
//         })

//         // this.que_textureStateRelease.forEach(entity => {
//         //     let textureState = em.getComponent(entity, com_textureState);
//         //     this.que_textureStateRelease.defer(() => {
//         //         this._releaseTextureState(glState, textureState);
//         //         em.removeComponent(entity, com_textureState);
//         //     });
//         // })
//     }

//     /**
//      * 
//      * @param {GlState} glState 
//      * @param {Texture} texture 
//      * @param {TextureState} textureState 
//      */
//     _initTextureState(glState, texture, textureState, texture2D) {
//         const gl = glState.gl;
//         const capabilities = glState.capabilities;

//         // textureState.texture = TextureUtil.createTexture(gl, texture.element);

//         let glTexture = gl.createTexture();
//         gl.bindTexture(gl.TEXTURE_2D, glTexture);
//         // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

//         let image = texture2D.image;
//         const isDom = TextureUtil.domCheck(image);

//         if (isDom) {
//             image = TextureUtil.clampToMaxSize(image, capabilities.maxTextureSize);

//             if (TextureUtil.textureNeedsPowerOfTwo(texture) && TextureUtil._isPowerOfTwo(image) === false && capabilities.version < 2) {
//                 image = TextureUtil.makePowerOf2(image);
//             }
//         }

//         const needFallback = !TextureUtil._isPowerOfTwo(image) && capabilities.version < 2;

//         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);
//         gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha);
//         gl.pixelStorei(gl.UNPACK_ALIGNMENT, texture.unpackAlignment);
//         gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
//         TextureUtil._setTextureParameters(glState, texture, needFallback);

//         const glFormat = WebGLUtil.getGLFormat(gl, texture.format),
//             glType = WebGLUtil.getGLType(gl, texture.type),
//             glInternalFormat = (texture.internalformat !== null) ? WebGLUtil.getGLInternalFormat(gl, texture.internalformat) :
//                 TextureUtil.getGLInternalFormat(gl, glFormat, glType);

//         const mipmaps = texture.mipmaps;
//         let mipmap;

//         if (isDom) {
//             if (mipmaps.length > 0 && !needFallback) {
//                 for (let i = 0, il = mipmaps.length; i < il; i++) {
//                     mipmap = mipmaps[i];
//                     gl.texImage2D(gl.TEXTURE_2D, i, glInternalFormat, glFormat, glType, mipmap);
//                 }

//                 texture.generateMipmaps = false;
//                 textureState.__maxMipLevel = mipmaps.length - 1;
//             } else {
//                 gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, glFormat, glType, image);
//                 textureState.__maxMipLevel = 0;
//             }
//         } else {
//             if (mipmaps.length > 0 && !needFallback) {
//                 const isCompressed = image.isCompressed;

//                 for (let i = 0, il = mipmaps.length; i < il; i++) {
//                     mipmap = mipmaps[i];
//                     isCompressed ? gl.compressedTexImage2D(gl.TEXTURE_2D, i, glInternalFormat, mipmap.width, mipmap.height, 0, mipmap.data)
//                         : gl.texImage2D(gl.TEXTURE_2D, i, glInternalFormat, mipmap.width, mipmap.height, texture.border, glFormat, glType, mipmap.data);
//                 }

//                 texture.generateMipmaps = false;
//                 textureState.__maxMipLevel = mipmaps.length - 1;
//             } else {
//                 gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, image.width, image.height, texture.border, glFormat, glType, image.data);
//                 textureState.__maxMipLevel = 0;
//             }
//         }

//         if (texture.generateMipmaps && !needFallback) {
//             gl.generateMipmap(gl.TEXTURE_2D);
//             // Note: Math.log( x ) * Math.LOG2E used instead of Math.log2( x ) which is not supported by IE11
//             textureState.__maxMipLevel = Math.log(Math.max(image.width, image.height)) * Math.LOG2E;
//         }   
        
//         textureState.texture = glTexture;
//     }

//     // _releaseTextureState(glState, textureState) {
//     //     let gl = glState.gl;
//     //     gl.deleteTexture(textureState.texture);
//     // }
// }

