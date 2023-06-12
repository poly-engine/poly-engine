import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";

export class UnlitMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 330;

        this.assetSystem = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.unlitMaterialCom = this.em.getComponentId('UnlitMaterial');
        this.unlitMaterialStateCom = this.em.getComponentId('UnlitMaterialState');
        this.shaderDataCom = this.em.getComponentId('ShaderData');

        this.que_materialStateInit = this.qm.createQuery({
            all: [this.materialCom, this.unlitMaterialCom],
            none: [this.unlitMaterialStateCom],
        });
        this.que_materialStateRelease = this.qm.createQuery({
            all: [this.unlitMaterialStateCom],
            none: [this.unlitMaterialCom],
        });
    }
    init() {
        this.glManager = this.world.glManager;

        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        // this._baseColorProp = this.shaderSystem.getProperty('material_BaseColor');
        // this._baseTextureProp = this.shaderSystem.getProperty('material_BaseTexture');
        // this._tilingOffsetProp = this.shaderSystem.getProperty('material_TilingOffset');

        // this._baseTextureMacro = this.shaderSystem.getMacro('MATERIAL_HAS_BASETEXTURE');
        this._omitNormalMacro = this.shaderSystem.getMacro('MATERIAL_OMIT_NORMAL');
        // this._tilingOffsetMacro = this.shaderSystem.getMacro('MATERIAL_NEED_TILING_OFFSET');
    }

    _update() {
        const em = this.em;

        this.que_materialStateInit.forEach(entity => {
            const unlitMaterial = em.getComponent(entity, this.unlitMaterialCom);
            const unlitMaterialState = em.createComponent(this.unlitMaterialStateCom);
            //get shaderData
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            this.shaderSystem.enableMacro(shaderData, this._omitNormalMacro);
            // this.shaderSystem.enableMacro(shaderData, this._tilingOffsetMacro);

            this.que_materialStateInit.defer(() => {
                em.setComponent(entity, this.unlitMaterialStateCom, unlitMaterialState);
            });
        })

        this.que_materialStateRelease.forEach(entity => {
            this.que_materialStateRelease.defer(() => {
                const unlitMaterialState = em.getComponent(entity, this.unlitMaterialStateCom);
                // this.assetSystem.unloadAssetEntity(unlitMaterialState.baseTextureEnt);
                em.removeComponent(entity, this.unlitMaterialStateCom);
            });
        })
    }
}
