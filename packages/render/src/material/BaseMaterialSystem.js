import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { vec4 } from "@poly-engine/math";

export class BaseMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 301;

        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.baseMaterialCom = this.em.getComponentId('BaseMaterial');
        this.baseMaterialStateCom = this.em.getComponentId('BaseMaterialState');
        this.shaderDataCom = this.em.getComponentId('ShaderData');

        this.que_materialStateInit = this.qm.createQuery({
            all: [this.materialCom, this.baseMaterialCom],
            none: [this.baseMaterialStateCom],
        });
        this.que_materialStateRelease = this.qm.createQuery({
            all: [this.baseMaterialStateCom],
            none: [this.baseMaterialCom],
        });
    }
    init() {
        this.glManager = this.world.glManager;

        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._baseColorProp = this.shaderSystem.getProperty('material_BaseColor');
        this._baseTextureProp = this.shaderSystem.getProperty('material_BaseTexture');
        this._tilingOffsetProp = this.shaderSystem.getProperty('material_TilingOffset');

        this._baseTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_BASETEXTURE');
        this._omitNormalMacro = this.shaderSystem.getMacro('MATERIAL_OMIT_NORMAL');
        this._tilingOffsetMacro = this.shaderSystem.getMacro('MATERIAL_NEED_TILING_OFFSET');
    }

    _update() {
        const em = this.em;

        this.que_materialStateInit.forEach(entity => {
            const baseMaterial = em.getComponent(entity, this.baseMaterialCom);
            const unlitMaterialState = em.createComponent(this.baseMaterialStateCom);
            //get shaderData
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            // this.shaderSystem.enableMacro(shaderData, this._omitNormalMacro);
            this.shaderSystem.enableMacro(shaderData, this._tilingOffsetMacro);

            this._updateBaseColor(baseMaterial, shaderData);
            this._updateTilingOffset(baseMaterial, shaderData);
            this._updateBaseTexture(baseMaterial, shaderData, unlitMaterialState);

            this.que_materialStateInit.defer(() => {
                em.setComponent(entity, this.baseMaterialStateCom, unlitMaterialState);
            });
        })

        this.que_materialStateRelease.forEach(entity => {
            this.que_materialStateRelease.defer(() => {
                const unlitMaterialState = em.getComponent(entity, this.baseMaterialStateCom);
                this.assetSystem.unloadAssetEntity(unlitMaterialState.baseTextureEnt);
                em.removeComponent(entity, this.baseMaterialStateCom);
            });
        })
    }

    setBaseColor(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.baseMaterialCom);
        if (vec4.exactEquals(baseMaterial.baseColor, value))
            return;
        vec4.copy(baseMaterial.baseColor, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateBaseColor(baseMaterial, shaderData);
    }
    _updateBaseColor(baseMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._baseColorProp, baseMaterial.baseColor);
    }
    setTilingOffset(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.baseMaterialCom);
        if (vec4.exactEquals(baseMaterial.tilingOffset, value))
            return;
        vec4.copy(baseMaterial.tilingOffset, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateTilingOffset(baseMaterial, shaderData);
    }
    _updateTilingOffset(baseMaterial, shaderData) {
        this.shaderSystem.setPropertyValue(shaderData, this._tilingOffsetProp, baseMaterial.tilingOffset);
    }
    setBaseTexture(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.baseMaterialCom);
        if (baseMaterial.baseTextureRef === value)
            return;
        baseMaterial.baseTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const unlitMaterialState = em.getComponent(entity, this.baseMaterialStateCom);
        this._updateBaseTexture(baseMaterial, shaderData, unlitMaterialState);
    }
    _updateBaseTexture(baseMaterial, shaderData, unlitMaterialState) {
        if(unlitMaterialState.baseTextureEnt !== -1)
            this.assetSystem.unloadAssetEntity(unlitMaterialState.baseTextureEnt);
        unlitMaterialState.baseTextureEnt = this.assetSystem.loadAssetEntity(baseMaterial.baseTextureRef);

        this.shaderSystem.setPropertyValue(shaderData, this._baseTextureProp, unlitMaterialState.baseTextureEnt);
        if (unlitMaterialState.baseTextureEnt === -1) {
            this.shaderSystem.disableMacro(shaderData, this._baseTextureMacro);
        } else
            this.shaderSystem.enableMacro(shaderData, this._baseTextureMacro);
    }
}
