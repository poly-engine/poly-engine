// import { System, SystemGroupType } from "@poly-engine/core";
// import { AssetSystem } from "@poly-engine/asset";
// import { ShaderSystem } from "../shader/ShaderSystem.js";
// import { vec4 } from "gl-matrix";

// export class BlinnPhongMaterialSystem extends System {
//     constructor(world) {
//         super(world);
//         this.groupId = SystemGroupType.RenderUpdate;
//         this.index = 302;

//         // this.em = this.world.entityManager;
//         // this.qm = this.world.queryManager;
//         this.assetSystem = this.world.assetManager;

//         // this.com_glState = this.em.getComponentId('GlState');
//         this.materialCom = this.em.getComponentId('Material');
//         this.bpMaterialCom = this.em.getComponentId('BlinnPhongMaterial');
//         this.bpMaterialStateCom = this.em.getComponentId('BlinnPhongMaterialState');
//         this.shaderDataCom = this.em.getComponentId('ShaderData');

//         this.que_materialStateInit = this.qm.createQuery({
//             all: [this.materialCom, this.bpMaterialCom],
//             none: [this.bpMaterialStateCom],
//         });
//         this.que_materialStateRelease = this.qm.createQuery({
//             all: [this.bpMaterialStateCom],
//             none: [this.bpMaterialCom],
//         });
//     }
//     init() {
//         // this.assetSystem = this.sm.getSystem(AssetSystem);
//         /** @type {ShaderSystem} */
//         this.shaderSystem = this.sm.getSystem(ShaderSystem);

//         this._baseColorProp = this.shaderSystem.getProperty('material_BaseColor');
//         this._specularColorProp = this.shaderSystem.getProperty('material_SpecularColor');
//         this._emissiveColorProp = this.shaderSystem.getProperty('material_EmissiveColor');

//         this._shininessProp = this.shaderSystem.getProperty('material_Shininess');
//         this._normalIntensityProp = this.shaderSystem.getProperty('material_NormalIntensity');
//         this._tilingOffsetProp = this.shaderSystem.getProperty('material_TilingOffset');

//         this._baseTextureProp = this.shaderSystem.getProperty('material_BaseTexture');
//         this._specularTextureProp = this.shaderSystem.getProperty('material_SpecularTexture');
//         this._emissiveTextureProp = this.shaderSystem.getProperty('material_EmissiveTexture');
//         this._normalTextureProp = this.shaderSystem.getProperty('material_NormalTexture');

//         this._baseTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_BASETEXTURE');
//         this._specularTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_SPECULAR_TEXTURE');
//         this._emissiveTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_EMISSIVETEXTURE');
//         this._normalTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_NORMALTEXTURE');
//         // this._omitNormalMacro = this.shaderSystem.getMacro('MATERIAL_OMIT_NORMAL');

//         this._worldPosMacro = this.shaderSystem.getMacro('MATERIAL_NEED_WORLD_POS');
//         this._tilingOffsetMacro = this.shaderSystem.getMacro('MATERIAL_NEED_TILING_OFFSET');
//     }

//     _update() {
//         const em = this.em;

//         this.que_materialStateInit.forEach(entity => {
//             const bpMaterial = em.getComponent(entity, this.bpMaterialCom);
//             const bpMaterialState = em.createComponent(this.bpMaterialStateCom);
//             //get shaderData
//             const shaderData = em.getComponent(entity, this.shaderDataCom);

//             // this.shaderSystem.enableMacro(shaderData, this._omitNormalMacro);
//             this.shaderSystem.enableMacro(shaderData, this._worldPosMacro);
//             this.shaderSystem.enableMacro(shaderData, this._tilingOffsetMacro);

//             this._updateBaseColor(bpMaterial, shaderData);
//             this._updateSpecularColor(bpMaterial, shaderData);
//             this._updateEmissiveColor(bpMaterial, shaderData);

//             this._updateTilingOffset(bpMaterial, shaderData);
//             this._updateShininess(bpMaterial, shaderData);
//             this._updateNormalIntensity(bpMaterial, shaderData);

//             this._updateBaseTexture(bpMaterial, shaderData, bpMaterialState);
//             this._updateSpecularTexture(bpMaterial, shaderData, bpMaterialState);
//             this._updateEmissiveTexture(bpMaterial, shaderData, bpMaterialState);
//             this._updateNormalTexture(bpMaterial, shaderData, bpMaterialState);

//             this.que_materialStateInit.defer(() => {
//                 em.setComponent(entity, this.bpMaterialStateCom, bpMaterialState);
//             });
//         })

//         this.que_materialStateRelease.forEach(entity => {
//             this.que_materialStateRelease.defer(() => {
//                 const bpMaterialState = em.getComponent(entity, this.bpMaterialStateCom);
//                 this.assetSystem.unloadAssetEntity(bpMaterialState.baseTextureEnt);
//                 em.removeComponent(entity, this.bpMaterialStateCom);
//             });
//         })
//     }

//     setBaseColor(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (vec4.exactEquals(bpMaterial.baseColor, value))
//             return;
//         vec4.copy(bpMaterial.baseColor, value);
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateBaseColor(bpMaterial, shaderData);
//     }
//     _updateBaseColor(bpMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._baseColorProp, bpMaterial.baseColor);
//     }
//     setSpecularColor(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (vec4.exactEquals(bpMaterial.specularColor, value))
//             return;
//         vec4.copy(bpMaterial.specularColor, value);
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateSpecularColor(bpMaterial, shaderData);
//     }
//     _updateSpecularColor(bpMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._specularColorProp, bpMaterial.specularColor);
//     }
//     setEmissiveColor(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (vec4.exactEquals(bpMaterial.emissiveColor, value))
//             return;
//         vec4.copy(bpMaterial.emissiveColor, value);
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateEmissiveColor(bpMaterial, shaderData);
//     }
//     _updateEmissiveColor(bpMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._emissiveColorProp, bpMaterial.emissiveColor);
//     }

//     setTilingOffset(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (vec4.exactEquals(bpMaterial.tilingOffset, value))
//             return;
//         vec4.copy(bpMaterial.tilingOffset, value);
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateTilingOffset(bpMaterial, shaderData);
//     }
//     _updateTilingOffset(bpMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._tilingOffsetProp, bpMaterial.tilingOffset);
//     }
//     setShininess(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (bpMaterial.shininess === value)
//             return;
//         bpMaterial.shininess = value;
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateShininess(bpMaterial, shaderData);
//     }
//     _updateShininess(bpMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._shininessProp, bpMaterial.shininess);
//     }
//     setNormalIntensity(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (bpMaterial.normalIntensity === value)
//             return;
//         bpMaterial.normalIntensity = value;
//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         this._updateNormalIntensity(bpMaterial, shaderData);
//     }
//     _updateNormalIntensity(bpMaterial, shaderData) {
//         this.shaderSystem.setPropertyValue(shaderData, this._normalIntensityProp, bpMaterial.normalIntensity);
//     }

//     setBaseTexture(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (bpMaterial.baseTextureRef === value)
//             return;
//         bpMaterial.baseTextureRef = value;

//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         const bpMaterialState = em.getComponent(entity, this.bpMaterialStateCom);
//         this._updateBaseTexture(bpMaterial, shaderData, bpMaterialState);
//     }
//     _updateBaseTexture(bpMaterial, shaderData, bpMaterialState) {
//         if (bpMaterialState.baseTextureEnt !== -1)
//             this.assetSystem.unloadAssetEntity(bpMaterialState.baseTextureEnt);
//         bpMaterialState.baseTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.baseTextureRef);

//         this.shaderSystem.setPropertyValue(shaderData, this._baseTextureProp, bpMaterialState.baseTextureEnt);
//         if (bpMaterialState.baseTextureEnt === -1) {
//             this.shaderSystem.disableMacro(shaderData, this._baseTextureMacro);
//         } else
//             this.shaderSystem.enableMacro(shaderData, this._baseTextureMacro);
//     }
//     setSpecularTexture(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (bpMaterial.specularTextureRef === value)
//             return;
//         bpMaterial.specularTextureRef = value;

//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         const bpMaterialState = em.getComponent(entity, this.bpMaterialStateCom);
//         this._updateSpecularTexture(bpMaterial, shaderData, bpMaterialState);
//     }
//     _updateSpecularTexture(bpMaterial, shaderData, bpMaterialState) {
//         let ent = bpMaterialState.specularTextureEnt;
//         if (ent !== -1)
//             this.assetSystem.unloadAssetEntity(ent);
//         ent = bpMaterialState.specularTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.specularTextureRef);

//         this.shaderSystem.setPropertyValue(shaderData, this._specularTextureProp, ent);
//         if (ent === -1) {
//             this.shaderSystem.disableMacro(shaderData, this._specularTextureMacro);
//         } else
//             this.shaderSystem.enableMacro(shaderData, this._specularTextureMacro);
//     }
//     setEmissiveTexture(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (bpMaterial.emissiveTextureRef === value)
//             return;
//         bpMaterial.emissiveTextureRef = value;

//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         const bpMaterialState = em.getComponent(entity, this.bpMaterialStateCom);
//         this._updateEmissiveTexture(bpMaterial, shaderData, bpMaterialState);
//     }
//     _updateEmissiveTexture(bpMaterial, shaderData, bpMaterialState) {
//         let ent = bpMaterialState.emissiveTextureEnt;
//         if (ent !== -1)
//             this.assetSystem.unloadAssetEntity(ent);
//         ent = bpMaterialState.emissiveTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.emissiveTextureRef);

//         this.shaderSystem.setPropertyValue(shaderData, this._emissiveTextureProp, ent);
//         if (ent === -1) {
//             this.shaderSystem.disableMacro(shaderData, this._emissiveTextureMacro);
//         } else
//             this.shaderSystem.enableMacro(shaderData, this._emissiveTextureMacro);
//     }
//     setNormalTexture(entity, value) {
//         const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
//         if (bpMaterial.normalTextureRef === value)
//             return;
//         bpMaterial.normalTextureRef = value;

//         const shaderData = this.em.getComponent(entity, this.shaderDataCom);
//         const bpMaterialState = em.getComponent(entity, this.bpMaterialStateCom);
//         this._updateNormalTexture(bpMaterial, shaderData, bpMaterialState);
//     }
//     _updateNormalTexture(bpMaterial, shaderData, bpMaterialState) {
//         let ent = bpMaterialState.normalTextureEnt;
//         if (ent !== -1)
//             this.assetSystem.unloadAssetEntity(ent);
//         ent = bpMaterialState.normalTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.normalTextureRef);

//         this.shaderSystem.setPropertyValue(shaderData, this._normalTextureProp, ent);
//         if (ent === -1) {
//             this.shaderSystem.disableMacro(shaderData, this._normalTextureMacro);
//         } else
//             this.shaderSystem.enableMacro(shaderData, this._normalTextureMacro);
//     }
// }
