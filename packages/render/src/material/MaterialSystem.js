import { System, SystemGroupType } from "@poly-engine/core";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { BlendFactor } from "../render/enums/BlendFactor";
import { BlendOperation } from "../render/enums/BlendOperation";
import { CullMode } from "../render/enums/CullMode";
import { BlendMode } from "./enums/BlendMode.js";
import { RenderFace } from "./enums/RenderFace.js";
import { RenderQueueType } from "../render/enums/RenderQueueType.js";

export class MaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 300;

        // this.em = this.world.entityManager;
        // this.qm = this.world.queryManager;
        this.assetManager = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.com_material = this.em.getComponentId('Material');
        this.com_materialState = this.em.getComponentId('MaterialState');
        this.com_shaderData = this.em.getComponentId('ShaderData');
        this.com_renderState = this.em.getComponentId('RenderState');

        this.que_materialStateInit = this.qm.createQuery({
            all: [this.com_material],
            none: [this.com_materialState],
        });
        this.que_materialStateRelease = this.qm.createQuery({
            all: [this.com_materialState],
            none: [this.com_material],
        });
    }
    init() {
        // /** @type {AssetSystem} */
        // this.assetSystem = this.sm.getSystem(AssetSystem);
        this.glManager = this.world.glManager;
        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._alphaCutoffProp = this.shaderSystem.getProperty('material_AlphaCutoff');
        this._alphaCutoffMacro = this.shaderSystem.getMacro('MATERIAL_IS_ALPHA_CUTOFF');
        // this._alphaCutoffId = this._alphaCutoffProp.id;
        this._transparentMacro = this.shaderSystem.getMacro('MATERIAL_IS_TRANSPARENT');

        this.assetManager.addAssetData({
            Asset: { id: 'mat_unlit', type: 'Material', },
            Material: { id: 'mat_unlit', shaderRef: 'sha_unlit' },
            UnlitMaterial: { id: 'mat_unlit', baseColor: [1, 0, 0, 1] }
        });
        this.assetManager.addAssetData({
            Asset: { id: 'mat_phong', type: 'Material', },
            Material: { id: 'mat_phong', shaderRef: 'sha_phong' },
            PhongMaterial: { id: 'mat_phong', baseColor: [1, 0, 0, 1] }
        });
    }

    createUnlitMaterialData(id = null, baseColor, baseTextureRef) {
        const data = this.assetManager.createAssetData(id, "Material", "Material", "BaseMaterial", "UnlitMaterial");
        data.Material.shaderRef = 'sha_unlit';
        if (baseColor != null)
            data.BaseMaterial.baseColor = baseColor;
        if (baseTextureRef != null)
            data.BaseMaterial.baseTextureRef = baseTextureRef;
        return data;
    }
    createPhongMaterialData(id = null) {
        const data = this.assetManager.createAssetData(id, "Material", "Material", "BaseMaterial", "PhongBaseMaterial", "PhongMaterial");
        data.Material.shaderRef = 'sha_phong';
        return data;
    }
    createPBRMaterialData(id = null) {
        const data = this.assetManager.createAssetData(id, "Material", "Material", "BaseMaterial", "PhongBaseMaterial", "PBRBaseMaterial", "PBRMaterial");
        data.Material.shaderRef = 'sha_pbr';
        return data;
    }
    createPBRSpecularMaterialData(id = null) {
        const data = this.assetManager.createAssetData(id, "Material", "Material", "BaseMaterial", "PhongBaseMaterial", "PBRBaseMaterial", "PBRSpecularMaterial");
        data.Material.shaderRef = 'sha_pbr';
        return data;
    }
    createSkyBoxMaterialData(id = null, isAdd = false) {
        const data = this.assetManager.createAssetData(id, "Material", "Material", "SkyBoxMaterial");
        data.Material.shaderRef = 'skybox';
        if(isAdd)
            this.assetManager.addAssetData(data);
        return data;
    }

    _update() {
        const em = this.em;

        this.que_materialStateInit.forEach(entity => {
            const material = em.getComponent(entity, this.com_material);
            this.que_materialStateInit.defer(() => {
                let materialState = em.createComponent(this.com_materialState);
                materialState.shaderEnt = this.assetManager.loadAssetEntity(material.shaderRef);
                em.setComponent(entity, this.com_materialState, materialState);

                //add shaderData
                const shaderData = em.setComponent(entity, this.com_shaderData);
                // shaderData.uniforms[this._alphaCutoffId] = 0;
                // this.shaderSystem.setPropertyValue(shaderData, this._alphaCutoffProp, 0);
                // shaderData.uniforms.material_AlphaCutoff = 0;

                const renderState = em.setComponent(entity, this.com_renderState);

                // this.setIsTransparent(entity, material.isTransparent);
                this._updateIsTransparent(material, shaderData, renderState);
                // this.setBlendMode(entity, material.blendMode);
                this._updateBlendMode(material, shaderData, renderState);
                // this.setRenderFace(entity, material.renderFace);
                this._updateRenderFace(material, shaderData, renderState);
                this._updateAlphaCutoff(material, shaderData, renderState);
            });
        })

        this.que_materialStateRelease.forEach(entity => {
            this.que_materialStateRelease.defer(() => {
                const mrs = em.getComponent(entity, this.com_materialState);
                this.assetManager.unloadAssetEntity(mrs.shaderEnt);
                em.removeComponent(entity, this.com_materialState);
            });
        })
    }

    setIsTransparent(entity, isTransparent) {
        const material = this.em.getComponent(entity, this.com_material);
        if (material.isTransparent === isTransparent)
            return;
        material.isTransparent = isTransparent;
        const renderState = this.em.getComponent(entity, this.com_renderState);
        if (renderState == null)
            return;
        const shaderData = this.em.getComponent(entity, this.com_shaderData);
        this._updateIsTransparent(material, shaderData, renderState);
    }
    /** @private */
    _updateIsTransparent(material, shaderData, renderState) {
        const isTransparent = material.isTransparent;
        const alphaCutoff = material.alphaCutoff;//this.shaderSystem.getPropertyValue(shaderData, this._alphaCutoffProp);

        if (isTransparent) {
            renderState.blendState.enabled = true;
            renderState.depthState.writeEnabled = false;
            renderState.renderQueueType = RenderQueueType.Transparent;
            this.shaderSystem.enableMacro(shaderData, this._transparentMacro);
        } else {
            renderState.blendState.enabled = false;
            renderState.depthState.writeEnabled = true;
            renderState.renderQueueType = alphaCutoff
                ? RenderQueueType.AlphaTest
                : RenderQueueType.Opaque;
            this.shaderSystem.disableMacro(shaderData, this._transparentMacro);
        }

    }
    /**
     * Set the blend mode of shader pass render state.
     */
    setBlendMode(entity, blendMode) {
        const material = this.em.getComponent(entity, this.com_material);
        if (material.blendMode === blendMode)
            return;
        material.blendMode = blendMode;
        const renderState = this.em.getComponent(entity, this.com_renderState);
        this._updateBlendMode(material, shaderData, renderState);
    }
    _updateBlendMode(material, shaderData, renderState) {
        const blendMode = material.blendMode;
        const target = renderState.blendState;

        switch (blendMode) {
            case BlendMode.Normal:
                target.sourceColorBlendFactor = BlendFactor.SourceAlpha;
                target.destinationColorBlendFactor = BlendFactor.OneMinusSourceAlpha;
                target.sourceAlphaBlendFactor = BlendFactor.One;
                target.destinationAlphaBlendFactor = BlendFactor.OneMinusSourceAlpha;
                target.colorBlendOperation = target.alphaBlendOperation = BlendOperation.Add;
                break;
            case BlendMode.Additive:
                target.sourceColorBlendFactor = BlendFactor.SourceAlpha;
                target.destinationColorBlendFactor = BlendFactor.One;
                target.sourceAlphaBlendFactor = BlendFactor.One;
                target.destinationAlphaBlendFactor = BlendFactor.OneMinusSourceAlpha;
                target.colorBlendOperation = target.alphaBlendOperation = BlendOperation.Add;
                break;
        }
    }

    /**
     * Set the render face of shader pass render state.
     */
    setRenderFace(entity, renderFace) {
        const material = this.em.getComponent(entity, this.com_material);
        if (material.renderFace === renderFace)
            return;
        material.renderFace = renderFace;
        const renderState = this.em.getComponent(entity, this.com_renderState);
        this._updateRenderFace(material, shaderData, renderState);
    }
    _updateRenderFace(material, shaderData, renderState) {
        const renderFace = material.renderFace;
        const rasterState = renderState.rasterState;

        switch (renderFace) {
            case RenderFace.Front:
                rasterState.cullMode = CullMode.Back;
                break;
            case RenderFace.Back:
                rasterState.cullMode = CullMode.Front;
                break;
            case RenderFace.Double:
                rasterState.cullMode = CullMode.Off;
                break;
        }
    }

    /**
     * Set the render face of shader pass render state.
     */
    setAlphaCutoff(entity, alphaCutoff) {
        const material = this.em.getComponent(entity, this.com_material);
        if (material.alphaCutoff === alphaCutoff)
            return;
        material.alphaCutoff = alphaCutoff;
        const renderState = this.em.getComponent(entity, this.com_renderState);

        this._updateAlphaCutoff(material, shaderData, renderState);
    }
    _updateAlphaCutoff(material, shaderData, renderState) {
        const alphaCutoff = material.alphaCutoff;

        if (alphaCutoff)
            this.shaderSystem.enableMacro(shaderData, this._alphaCutoffMacro);
        else
            this.shaderSystem.disableMacro(shaderData, this._alphaCutoffMacro);

        if (alphaCutoff > 0) {
            renderState.renderQueueType = renderState.blendState.enabled
                ? RenderQueueType.Transparent
                : RenderQueueType.AlphaTest;
        } else {
            renderState.renderQueueType = renderState.blendState.enabled
                ? RenderQueueType.Transparent
                : RenderQueueType.Opaque;
        }
        this.shaderSystem.setPropertyValue(shaderData, this._alphaCutoffProp, alphaCutoff);
    }

}
