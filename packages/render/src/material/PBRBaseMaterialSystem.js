import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";

export class PBRBaseMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 303;

        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.pbrBaseMaterialCom = this.em.getComponentId('PBRBaseMaterial');
        this.pbrBaseMaterialStateCom = this.em.getComponentId('PBRBaseMaterialState');
        this.shaderDataCom = this.em.getComponentId('ShaderData');

        this.que_materialStateInit = this.qm.createQuery({
            all: [this.materialCom, this.pbrBaseMaterialCom],
            none: [this.pbrBaseMaterialStateCom],
        });
        this.que_materialStateRelease = this.qm.createQuery({
            all: [this.pbrBaseMaterialStateCom],
            none: [this.pbrBaseMaterialCom],
        });
    }
    init() {
        this.glManager = this.world.glManager;

        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._occlusionIntensityProp = this.shaderSystem.getProperty('material_OcclusionIntensity');
        this._occlusionTextureCoordProp = this.shaderSystem.getProperty('material_OcclusionTextureCoord');
        this._occlusionTextureProp = this.shaderSystem.getProperty('material_OcclusionTexture');

        this._occlusionTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_OCCLUSION_TEXTURE');

        this._clearCoatProp = this.shaderSystem.getProperty('material_ClearCoat');
        this._clearCoatTextureProp = this.shaderSystem.getProperty('material_ClearCoatTexture');
        this._clearCoatRoughnessProp = this.shaderSystem.getProperty('material_ClearCoatRoughness');
        this._clearCoatRoughnessTextureProp = this.shaderSystem.getProperty('material_ClearCoatRoughnessTexture');
        this._clearCoatNormalTextureProp = this.shaderSystem.getProperty('material_ClearCoatNormalTexture');

        this._clearCoatMacro = this.shaderSystem.getMacro('MATERIAL_ENABLE_CLEAR_COAT');
        this._clearCoatTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_CLEAR_COAT_TEXTURE');
        this._clearCoatRoughnessTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_CLEAR_COAT_ROUGHNESS_TEXTURE');
        this._clearCoatNormalTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_CLEAR_COAT_NORMAL_TEXTURE');
    }

    _update() {
        const em = this.em;

        this.que_materialStateInit.forEach(entity => {
            const bpMaterial = em.getComponent(entity, this.pbrBaseMaterialCom);
            const bpMaterialState = em.createComponent(this.pbrBaseMaterialStateCom);
            //get shaderData
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            this._updateOcclusionIntensity(bpMaterial, shaderData);
            this._updateOcclusionTextureCoord(bpMaterial, shaderData);
            this._updateOcclusionTexture(bpMaterial, shaderData, bpMaterialState);

            //clear coat
            this._updateClearCoat(bpMaterial, shaderData);
            this._updateClearCoatTexture(bpMaterial, shaderData, bpMaterialState);
            this._updateClearCoatRoughness(bpMaterial, shaderData);
            this._updateClearCoatRoughnessTexture(bpMaterial, shaderData, bpMaterialState);
            this._updateClearCoatNormalTexture(bpMaterial, shaderData, bpMaterialState);

            this.que_materialStateInit.defer(() => {
                em.setComponent(entity, this.pbrBaseMaterialStateCom, bpMaterialState);
            });
        })

        this.que_materialStateRelease.forEach(entity => {
            this.que_materialStateRelease.defer(() => {
                const bpMaterialState = em.getComponent(entity, this.pbrBaseMaterialStateCom);
                this.assetSystem.unloadAssetEntity(bpMaterialState.occlusionTexture);
                this.assetSystem.unloadAssetEntity(bpMaterialState.clearCoatTexture);
                this.assetSystem.unloadAssetEntity(bpMaterialState.clearCoatRoughnessTexture);
                this.assetSystem.unloadAssetEntity(bpMaterialState.clearCoatNormalTexture);
                em.removeComponent(entity, this.pbrBaseMaterialStateCom);
            });
        })
    }
    setOcclusionIntensity(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.occlusionIntensity === value)
            return;
        bpMaterial.occlusionIntensity = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateOcclusionIntensity(bpMaterial, shaderData);
    }
    _updateOcclusionIntensity(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._occlusionIntensityProp, bpMaterial.occlusionIntensity);
    }
    setOcclusionTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.occlusionTextureRef === value)
            return;
        bpMaterial.occlusionTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = em.getComponent(entity, this.pbrBaseMaterialStateCom);
        this._updateOcclusionTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateOcclusionTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.occlusionTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.occlusionTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.occlusionTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._occlusionTextureProp, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._occlusionTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._occlusionTextureMacro);
    }
    setOcclusionTextureCoord(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.occlusionTextureCoord === value)
            return;
        bpMaterial.occlusionTextureCoord = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateOcclusionTextureCoord(bpMaterial, shaderData);
    }
    _updateOcclusionTextureCoord(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._occlusionTextureCoordProp, bpMaterial.occlusionTextureCoord);
    }

    setClearCoat(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.clearCoat === value)
            return;
        bpMaterial.clearCoat = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateClearCoat(bpMaterial, shaderData);
    }
    _updateClearCoat(bpMaterial, shaderData) {
        const value = bpMaterial.clearCoat;
        if (value === 0)
            this.shaderSystem.disableMacro(shaderData, this._clearCoatMacro);
        else
            this.shaderSystem.enableMacro(shaderData, this._clearCoatMacro);

        this.shaderSystem.setPropertyValue(shaderData, this._clearCoatProp, value);
    }
    setClearCoatTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.clearCoatTextureRef === value)
            return;
        bpMaterial.clearCoatTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = em.getComponent(entity, this.pbrBaseMaterialStateCom);
        this._updateClearCoatTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateClearCoatTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.clearCoatTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.clearCoatTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.clearCoatTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._clearCoatTextureProp, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._clearCoatTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._clearCoatTextureMacro);
    }
    setClearCoatRoughness(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.clearCoatRoughness === value)
            return;
        bpMaterial.clearCoatRoughness = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateClearCoatRoughness(bpMaterial, shaderData);
    }
    _updateClearCoatRoughness(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._clearCoatRoughnessProp, bpMaterial.clearCoatRoughness);
    }
    setClearCoatRoughnessTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.clearCoatRoughnessTextureRef === value)
            return;
        bpMaterial.clearCoatRoughnessTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = em.getComponent(entity, this.pbrBaseMaterialStateCom);
        this._updateClearCoatRoughnessTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateClearCoatRoughnessTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.clearCoatRoughnessTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.clearCoatRoughnessTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.clearCoatRoughnessTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._clearCoatRoughnessTextureProp, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._clearCoatRoughnessTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._clearCoatRoughnessTextureMacro);
    }
    setClearCoatNormalTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrBaseMaterialCom);
        if (bpMaterial.clearCoatNormalTextureRef === value)
            return;
        bpMaterial.clearCoatNormalTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = em.getComponent(entity, this.pbrBaseMaterialStateCom);
        this._updateClearCoatNormalTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateClearCoatNormalTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.clearCoatNormalTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.clearCoatNormalTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.clearCoatRoughnessTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this.clearCoatNormalTextureRef, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._clearCoatNormalTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._clearCoatNormalTextureMacro);
    }

}
