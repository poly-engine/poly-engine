import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { vec4 } from "@poly-engine/math";

export class PBRSpecularMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 333;

        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.pbrMaterialCom = this.em.getComponentId('PBRSpecularMaterial');
        this.pbrMaterialStateCom = this.em.getComponentId('PBRSpecularMaterialState');
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

        this._specularColorProp = this.shaderSystem.getProperty('material_PBRSpecularColor');
        this._glossinessProp = this.shaderSystem.getProperty('material_Glossiness');
        this._specularGlossinessTextureProp = this.shaderSystem.getProperty('material_SpecularGlossinessTexture');

        this._specularGlossinessTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_SPECULAR_GLOSSINESS_TEXTURE');
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
    setSpecularColor(entity, value) {
        const baseMaterial = em.getComponent(entity, this.baseMaterialCom);
        if (vec4.exactEquals(baseMaterial.specularColor, value))
            return;
        vec4.copy(baseMaterial.specularColor, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateSpecularColor(baseMaterial, shaderData);
    }
    _updateSpecularColor(baseMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._specularColorProp, baseMaterial.specularColor);
    }    
    setGlossiness(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrMaterialCom);
        if (bpMaterial.glossiness === value)
            return;
        bpMaterial.glossiness = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateGlossiness(bpMaterial, shaderData);
    }
    _updateGlossiness(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._glossinessProp, bpMaterial.glossiness);
    }
    setSpecularGlossinessTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.pbrMaterialCom);
        if (bpMaterial.specularGlossinessTextureRef === value)
            return;
        bpMaterial.specularGlossinessTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = this.em.getComponent(entity, this.pbrMaterialStateCom);
        this._updateSpecularGlossinessTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateSpecularGlossinessTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.specularGlossinessTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.specularGlossinessTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.roughnessMetallicTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._specularGlossinessTextureProp, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._specularGlossinessTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._specularGlossinessTextureMacro);
    }
}
