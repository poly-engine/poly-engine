import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { vec4 } from "@poly-engine/math";

export class PhongMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 331;

        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.bpMaterialCom = this.em.getComponentId('PhongMaterial');
        this.bpMaterialStateCom = this.em.getComponentId('PhongMaterialState');
        this.shaderDataCom = this.em.getComponentId('ShaderData');

        this.que_materialStateInit = this.qm.createQuery({
            all: [this.materialCom, this.bpMaterialCom],
            none: [this.bpMaterialStateCom],
        });
        this.que_materialStateRelease = this.qm.createQuery({
            all: [this.bpMaterialStateCom],
            none: [this.bpMaterialCom],
        });
    }
    init() {
        this.glManager = this.world.glManager;

        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._specularColorProp = this.shaderSystem.getProperty('material_SpecularColor');
        this._specularTextureProp = this.shaderSystem.getProperty('material_SpecularTexture');
        this._shininessProp = this.shaderSystem.getProperty('material_Shininess');

        this._specularTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_SPECULAR_TEXTURE');
        this._worldPosMacro = this.shaderSystem.getMacro('MATERIAL_NEED_WORLD_POS');
    }

    _update() {
        const em = this.em;

        this.que_materialStateInit.forEach(entity => {
            const bpMaterial = em.getComponent(entity, this.bpMaterialCom);
            const bpMaterialState = em.createComponent(this.bpMaterialStateCom);
            //get shaderData
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            this.shaderSystem.enableMacro(shaderData, this._worldPosMacro);

            this._updateSpecularColor(bpMaterial, shaderData);
            this._updateSpecularTexture(bpMaterial, shaderData, bpMaterialState);
            this._updateShininess(bpMaterial, shaderData);

            this.que_materialStateInit.defer(() => {
                em.setComponent(entity, this.bpMaterialStateCom, bpMaterialState);
            });
        })

        this.que_materialStateRelease.forEach(entity => {
            this.que_materialStateRelease.defer(() => {
                const bpMaterialState = em.getComponent(entity, this.bpMaterialStateCom);
                this.assetSystem.unloadAssetEntity(bpMaterialState.specularTextureEnt);
                em.removeComponent(entity, this.bpMaterialStateCom);
            });
        })
    }

    setSpecularColor(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
        if (vec4.exactEquals(bpMaterial.specularColor, value))
            return;
        vec4.copy(bpMaterial.specularColor, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateSpecularColor(bpMaterial, shaderData);
    }
    _updateSpecularColor(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._specularColorProp, bpMaterial.specularColor);
    }
    setShininess(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
        if (bpMaterial.shininess === value)
            return;
        bpMaterial.shininess = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateShininess(bpMaterial, shaderData);
    }
    _updateShininess(bpMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._shininessProp, bpMaterial.shininess);
    }
    setSpecularTexture(entity, value) {
        const bpMaterial = this.em.getComponent(entity, this.bpMaterialCom);
        if (bpMaterial.specularTextureRef === value)
            return;
        bpMaterial.specularTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const bpMaterialState = this.em.getComponent(entity, this.bpMaterialStateCom);
        this._updateSpecularTexture(bpMaterial, shaderData, bpMaterialState);
    }
    _updateSpecularTexture(bpMaterial, shaderData, bpMaterialState) {
        let ent = bpMaterialState.specularTextureEnt;
        if (ent !== -1)
            this.assetSystem.unloadAssetEntity(ent);
        ent = bpMaterialState.specularTextureEnt = this.assetSystem.loadAssetEntity(bpMaterial.specularTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._specularTextureProp, ent);
        if (ent === -1) {
            this.shaderSystem.disableMacro(shaderData, this._specularTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._specularTextureMacro);
    }
}
