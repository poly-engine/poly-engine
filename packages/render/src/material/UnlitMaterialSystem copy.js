// import { System, SystemGroupType } from "@poly-engine/core";
// import { AssetSystem } from "@poly-engine/asset";
// import { ShaderSystem } from "../shader/ShaderSystem.js";
// import { vec4 } from "gl-matrix";

// export class UnlitMaterialSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.RenderUpdate;
//         this.index = 301;

//         // this.em = this.world.entityManager;
//         // this.qm = this.world.queryManager;
//         this.assetSystem = this.world.assetManager;

//         // this.com_glState = this.em.getComponentId('GlState');
//         this.materialCom = this.em.getComponentId('Material');
//         this.unlitMaterialCom = this.em.getComponentId('UnlitMaterial');
//         this.unlitMaterialStateCom = this.em.getComponentId('UnlitMaterialState');
//         this.shaderDataCom = this.em.getComponentId('ShaderData');

//         this.que_materialStateInit = this.qm.createQuery({
//             all: [this.materialCom, this.unlitMaterialCom],
//             none: [this.unlitMaterialStateCom],
//         });
//         this.que_materialStateRelease = this.qm.createQuery({
//             all: [this.unlitMaterialStateCom],
//             none: [this.unlitMaterialCom],
//         });
//     }
//     init() {
//         // this.assetSystem = this.sm.getSystem(AssetSystem);
//         /** @type {ShaderSystem} */
//         this.shaderSystem = this.sm.getSystem(ShaderSystem);

//         this._baseColorProp = this.shaderSystem.getProperty('material_BaseColor');
//         this._baseTextureProp = this.shaderSystem.getProperty('material_BaseTexture');
//         this._tilingOffsetProp = this.shaderSystem.getProperty('material_TilingOffset');

//         this._baseTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_BASETEXTURE');
//         this._omitNormalMacro = this.shaderSystem.getMacro('MATERIAL_OMIT_NORMAL');
//         this._tilingOffsetMacro = this.shaderSystem.getMacro('MATERIAL_NEED_TILING_OFFSET');
//     }

//     _update() {
//         const em = this.em;

//         // let glState = em.getSingletonComponent(this.com_glState);
//         // if (!glState)
//         //     return;

//         this.que_materialStateInit.forEach(entity => {
//             const unlitMaterial = em.getComponent(entity, this.unlitMaterialCom);
//             const unlitMaterialState = em.createComponent(this.unlitMaterialStateCom);
//             //get shaderData
//             const shaderData = em.getComponent(entity, this.shaderDataCom);
//             // this.shaderSystem.setPropertyValue(shaderData, this._baseColorProp, unlitMaterial.baseColor);
//             // this.shaderSystem.setPropertyValue(shaderData, this._tilingOffsetProp, unlitMaterial.tilingOffset);

//             this.shaderSystem.enableMacro(shaderData, this._omitNormalMacro);
//             this.shaderSystem.enableMacro(shaderData, this._tilingOffsetMacro);

//             // unlitMaterialState.baseTextureEnt = this.assetSystem.loadAssetEntity(unlitMaterial.baseTextureRef);
//             // this.shaderSystem.setPropertyValue(shaderData, this._baseTextureProp, unlitMaterialState.baseTextureEnt);
//             // if (unlitMaterialState.baseTextureEnt === -1) {
//             //     this.shaderSystem.disableMacro(shaderData, this._baseTextureMacro);
//             // } else
//             //     this.shaderSystem.enableMacro(shaderData, this._baseTextureMacro);

//             this._updateBaseColor(unlitMaterial, shaderData);
//             this._updateTilingOffset(unlitMaterial, shaderData);
//             this._updateBaseTexture(unlitMaterial, shaderData, unlitMaterialState);

//             this.que_materialStateInit.defer(() => {
//                 em.setComponent(entity, this.unlitMaterialStateCom, unlitMaterialState);
//             });
//         })

//         this.que_materialStateRelease.forEach(entity => {
//             this.que_materialStateRelease.defer(() => {
//                 const unlitMaterialState = em.getComponent(entity, this.unlitMaterialStateCom);
//                 this.assetSystem.unloadAssetEntity(unlitMaterialState.baseTextureEnt);
//                 em.removeComponent(entity, this.unlitMaterialStateCom);
//             });
//         })
//     }

//     setBaseColor(entity, value) {
//         const unlitMaterial = em.getComponent(entity, this.unlitMaterialCom);
//         if (vec4.exactEquals(unlitMaterial.baseColor, value))
//             return;
//         vec4.copy(unlitMaterial.baseColor, value);
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateBaseColor(unlitMaterial, shaderData);
//     }
//     _updateBaseColor(unlitMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._baseColorProp, unlitMaterial.baseColor);
//     }
//     setTilingOffset(entity, value) {
//         const unlitMaterial = em.getComponent(entity, this.unlitMaterialCom);
//         if (vec4.exactEquals(unlitMaterial.tilingOffset, value))
//             return;
//         vec4.copy(unlitMaterial.tilingOffset, value);
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateTilingOffset(unlitMaterial, shaderData);
//     }
//     _updateTilingOffset(unlitMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._tilingOffsetProp, unlitMaterial.tilingOffset);
//     }
//     setBaseTexture(entity, value) {
//         const unlitMaterial = em.getComponent(entity, this.unlitMaterialCom);
//         if (unlitMaterial.baseTextureRef === value)
//             return;
//         unlitMaterial.baseTextureRef = value;

//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         const unlitMaterialState = em.getComponent(entity, this.unlitMaterialStateCom);
//         this._updateBaseTexture(unlitMaterial, shaderData, unlitMaterialState);
//     }
//     _updateBaseTexture(unlitMaterial, shaderData, unlitMaterialState) {
//         if(unlitMaterialState.baseTextureEnt !== -1)
//             this.assetSystem.unloadAssetEntity(unlitMaterialState.baseTextureEnt);
//         unlitMaterialState.baseTextureEnt = this.assetSystem.loadAssetEntity(unlitMaterial.baseTextureRef);

//         this.shaderSystem.setPropertyValue(shaderData, this._baseTextureProp, unlitMaterialState.baseTextureEnt);
//         if (unlitMaterialState.baseTextureEnt === -1) {
//             this.shaderSystem.disableMacro(shaderData, this._baseTextureMacro);
//         } else
//             this.shaderSystem.enableMacro(shaderData, this._baseTextureMacro);
//     }
// }
