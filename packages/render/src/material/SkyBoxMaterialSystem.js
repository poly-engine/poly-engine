import { System, SystemGroupType } from "@poly-engine/core";
import { vec4 } from "@poly-engine/math";
import { CompareFunction } from "../render/enums/CompareFunction.js";
import { CullMode } from "../render/enums/CullMode.js";

export class SkyBoxMaterialSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 301;

        this.assetManager = this.world.assetManager;

        // this.com_glState = this.em.getComponentId('GlState');
        this.materialCom = this.em.getComponentId('Material');
        this.skyMaterialCom = this.em.getComponentId('SkyBoxMaterial');
        this.skyMaterialStateCom = this.em.getComponentId('SkyBoxMaterialState');

        this.shaderDataCom = this.em.getComponentId('ShaderData');
        this.renderStateCom = this.em.getComponentId('RenderState');

        this.que_initState = this.qm.createQuery({
            all: [this.materialCom, this.skyMaterialCom],
            none: [this.skyMaterialStateCom],
        });
        this.que_releaseState = this.qm.createQuery({
            all: [this.skyMaterialStateCom],
            none: [this.skyMaterialCom],
        });
    }
    init() {
        this.glManager = this.world.glManager;

        this._tintColorProp = this.glManager.getProperty('material_TintColor');
        this._textureCubeProp = this.glManager.getProperty('material_CubeTexture');
        this._rotationProp = this.glManager.getProperty('material_Rotation');
        this._exposureProp = this.glManager.getProperty('material_Exposure');

        this._decodeSkyRGBMMacro = this.glManager.getMacro('MATERIAL_IS_DECODE_SKY_RGBM');
    }

    _update() {
        const em = this.em;

        this.que_initState.forEach(entity => {
            const skyMaterial = em.getComponent(entity, this.skyMaterialCom);

            const skyMaterialState = em.createComponent(this.skyMaterialStateCom);
            //get shaderData
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            const renderState = em.getComponent(entity, this.renderStateCom);
            renderState.rasterState.cullMode = CullMode.Off;
            renderState.depthState.compareFunction = CompareFunction.LessEqual;

            this._updateTintColor(skyMaterial, shaderData);
            this._updateRotation(skyMaterial, shaderData);
            this._updateExposure(skyMaterial, shaderData);
            this._updateTexture(skyMaterial, shaderData, skyMaterialState);
            this._updateTextureDecodeRGBM(skyMaterial, shaderData);

            this.que_initState.defer(() => {
                em.setComponent(entity, this.skyMaterialStateCom, skyMaterialState);
            });
        })

        this.que_releaseState.forEach(entity => {
            this.que_releaseState.defer(() => {
                const skyMaterialState = em.getComponent(entity, this.skyMaterialStateCom);
                this.assetManager.unloadAssetEntity(skyMaterialState.textureEnt);
                em.removeComponent(entity, this.skyMaterialStateCom);
            });
        })
    }

    setTintColor(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.skyMaterialCom);
        if (vec4.exactEquals(baseMaterial.tintColor, value))
            return;
        vec4.copy(baseMaterial.tintColor, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateTintColor(baseMaterial, shaderData);
    }
    _updateTintColor(baseMaterial, shaderData) {
        this.glManager.setPropertyValue(shaderData, this._tintColorProp, baseMaterial.tintColor);
    }
    setRotation(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.skyMaterialCom);
        if (baseMaterial.rotation === value)
            return;
        baseMaterial.rotation = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateRotation(baseMaterial, shaderData);
    }
    _updateRotation(baseMaterial, shaderData) {
        this.glManager.setPropertyValue(shaderData, this._rotationProp, baseMaterial.rotation);
    }
    setExposure(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.skyMaterialCom);
        if (baseMaterial.exposure === value)
            return;
        baseMaterial.exposure = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateExposure(baseMaterial, shaderData);
    }
    _updateExposure(baseMaterial, shaderData) {
        this.glManager.setPropertyValue(shaderData, this._exposureProp, baseMaterial.exposure);
    }
    setTexture(entity, value) {
        const skyMaterial = this.em.getComponent(entity, this.skyMaterialCom);
        if (skyMaterial.textureRef === value)
            return;
        skyMaterial.textureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const skyMaterialState = this.em.getComponent(entity, this.skyMaterialStateCom);
        this._updateTexture(skyMaterial, shaderData, skyMaterialState);
    }
    _updateTexture(baseMaterial, shaderData, skyMaterialState) {
        if (skyMaterialState.textureEnt !== -1)
            this.assetManager.unloadAssetEntity(skyMaterialState.textureEnt);
        skyMaterialState.textureEnt = this.assetManager.loadAssetEntity(baseMaterial.textureRef);

        this.glManager.setPropertyValue(shaderData, this._textureCubeProp, skyMaterialState.textureEnt);
        // if (skyMaterialState.textureEnt === -1) {
        //     this.glManager.disableMacro(shaderData, this._baseTextureMacro);
        // } else
        //     this.glManager.enableMacro(shaderData, this._baseTextureMacro);
    }
    setTextureDecodeRGBM(entity, value) {
        const baseMaterial = this.em.getComponent(entity, this.skyMaterialCom);
        if (baseMaterial.textureDecodeRGBM === value)
            return;
        baseMaterial.textureDecodeRGBM = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateTextureDecodeRGBM(baseMaterial, shaderData);
    }
    _updateTextureDecodeRGBM(baseMaterial, shaderData) {
        // this.glManager.setPropertyValue(shaderData, this._exposureProp, baseMaterial.exposure);
        if (!baseMaterial.textureDecodeRGBM) {
            this.glManager.disableMacro(shaderData, this._decodeSkyRGBMMacro);
        } else
            this.glManager.enableMacro(shaderData, this._decodeSkyRGBMMacro);
    }
}
