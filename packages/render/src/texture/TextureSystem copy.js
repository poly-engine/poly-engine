// import { System, SystemGroupType } from "@poly-engine/core";
// import { TextureUtil } from "./TextureUtil.js";

// export class TextureSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.RenderUpdate;
//         this.index = 200;

//         // this.em = this.world.entityManager;
//         // // this.compManager = this.world.componentManager;
//         // this.qm = this.world.queryManager;

//         this.com_glState = this.em.getComponentId('GlState');
//         this.com_texture = this.em.getComponentId('Texture');
//         this.com_textureState = this.em.getComponentId('TextureState');

//         // this.que_textureStateInit = this.qm.createQuery({
//         //     all: [this.com_texture],
//         //     none: [this.com_textureState]
//         // });
//         this.que_textureStateRelease = this.qm.createQuery({
//             all: [this.com_textureState],
//             none: [this.com_texture]
//         });
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
//         // this.que_textureStateInit.forEach(entity => {
//         //     let texture = em.getComponent(entity, com_texture);
//         //     this.que_textureStateInit.defer(() => {
//         //         let textureState = em.createComponent(com_textureState);
//         //         this._initTextureState(glState, texture, textureState);
//         //         em.setComponent(entity, com_textureState, textureState);
//         //     });
//         // })

//         this.que_textureStateRelease.forEach(entity => {
//             let textureState = em.getComponent(entity, com_textureState);
//             this.que_textureStateRelease.defer(() => {
//                 this._releaseTextureState(glState, textureState);
//                 em.removeComponent(entity, com_textureState);
//             });
//         })
//     }

//     // /**
//     //  * 
//     //  * @param {GlState} glState 
//     //  * @param {Texture} texture 
//     //  * @param {TextureState} textureState 
//     //  */
//     // _initTextureState(glState, texture, textureState) {
//     //     let gl = glState.gl;

//     //     textureState.texture = gl.createTexture();

//     //     // textureState.texture = TextureUtil.createTexture(gl, texture.element);
//     // }

//     _releaseTextureState(glState, textureState) {
//         let gl = glState.gl;
//         gl.deleteTexture(textureState.texture);
//     }
// }


