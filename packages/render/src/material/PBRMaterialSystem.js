import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";

export class PBRMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 332;

        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.pbrMaterialCom = this.em.getComponentId('PBRMaterial');
        this.pbrMaterialStateCom = this.em.getComponentId('PBRMaterialState');
        this.shaderDataCom = this.em.getComponentId('ShaderData');

        this.que_materialStateInit = this.qm.createQuery({
            all: [this.materialCom, this.pbrMaterialCom],
            none: [this.pbrMaterialStateCom],
        });
        this.que_materialStateRelease = this.qm.createQuery({
            all: [this.pbrMaterialStateCom],
            none: [this.pbrMaterialCom],
        });
    }
    init() {
        this.glManager = this.world.glManager;

        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._iorProp = this.shaderSystem.getProperty('material_IOR');
        this._metallicProp = this.shaderSystem.getProperty('material_Metal');
        this._roughnessProp = this.shaderSystem.getProperty('material_Roughness');
        this._roughnessMetallicTextureProp = this.shaderSystem.getProperty('material_RoughnessMetallicTexture');

        this._roughnessMetallicTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_ROUGHNESS_METALLIC_TEXTURE');
    }

    _update() {
        const em = this.em;

        this.que_materialStateInit.forEach(entity => {
            const bpMaterial = em.getComponent(entity, this.pbrMaterialCom);
            const bpMaterialState = em.createComponent(this.pbrMaterialStateCom);
            //get shaderData
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            this._updateIor(bpMaterial, shaderData);
            this._updateMetallic(bpMaterial, shaderData);
            this._updateRoughness(bpMaterial, shaderData);
            this._updateRoughnessMetallicTexture(bpMaterial, shaderData, bpMaterialState);

            this.que_materialStateInit.defer(() => {
                em.setComponent(entity, this.pbrMaterialStateCom, bpMaterialState);
            });
        })

        this.que_materialStateRelease.forEach(entity => {
            this.que_materialStateRelease.defer(() => {
                const bpMaterialState = em.getComponent(entity, this.pbrMaterialStateCom);
                this.assetSystem.unloadAssetEntity(bpMaterialState.roughnessMetallicTextureEnt);
                em.removeComponent(entity, this.pbrMaterialStateCom);
            });
        })
    }
    setIor(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrMaterialCom);
        if (bpMaterial.ior === value)
            return;
        bpMaterial.ior = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateIor(bpMaterial, shaderData);
    }
    _updateIor(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._iorProp, bpMaterial.ior);
    }
    setMetallic(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrMaterialCom);
        if (bpMaterial.metallic === value)
            return;
        bpMaterial.metallic = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateMetallic(bpMaterial, shaderData);
    }
    _updateMetallic(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._metallicProp, bpMaterial.metallic);
    }
    setRoughness(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrMaterialCom);
        if (bpMaterial.roughness === value)
            return;
        bpMaterial.roughness = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateRoughness(bpMaterial, shaderData);
    }
    _updateRoughness(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._roughnessProp, bpMaterial.roughness);
    }
    setRoughnessMetallicTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrMaterialCom);
        if (bpMaterial.roughnessMetallicTextureRef === value)
            return;
        bpMaterial.roughnessMetallicTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = em.getComponent(entity, this.pbrMaterialStateCom);
        this._updateRoughnessMetallicTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateRoughnessMetallicTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.roughnessMetallicTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.roughnessMetallicTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.roughnessMetallicTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._roughnessMetallicTextureProp, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._roughnessMetallicTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._roughnessMetallicTextureMacro);
    }
}
