import { System, SystemGroupType } from "@poly-engine/core";
import { sh3 } from "@poly-engine/math";
import { DiffuseMode } from "./DiffuseMode.js";

export class AmbientLightSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 630;

        this.ambientLightCom = this.em.getComponentId('AmbientLight');
        this.ambientLightStateCom = this.em.getComponentId('AmbientLightState');

        this.shaderDataCom = this.em.getComponentId('ShaderData');
        this.textureCom = this.em.getComponentId('Texture');
        this.textureStateCom = this.em.getComponentId('TextureState');

        this.que_initAmbientLight = this.qm.createQuery({
            all: [this.ambientLightCom],
            none: [this.ambientLightStateCom]
        });
        this.que_releaseAmbientLight = this.qm.createQuery({
            all: [this.ambientLightStateCom],
            none: [this.ambientLightCom]
        });

        this.assetManager = this.world.assetManager;

        // this._shArray = new Float32Array(27);
    }

    init() {
        this.glManager = this.world.glManager;

        // this._baseTextureProp = this.glManager.getProperty('material_BaseTexture');

        this._shMacro = this.glManager.getMacro('SCENE_USE_SH');
        this._specularMacro = this.glManager.getMacro('SCENE_USE_SPECULAR_ENV');
        this._decodeRGBMMacro = this.glManager.getMacro('SCENE_IS_DECODE_ENV_RGBM');

        this._diffuseColorProp = this.glManager.getProperty('scene_EnvMapLight.diffuse');
        this._diffuseSHProp = this.glManager.getProperty('scene_EnvSH');
        this._diffuseIntensityProp = this.glManager.getProperty('scene_EnvMapLight.diffuseIntensity');
        this._specularTextureProp = this.glManager.getProperty('scene_EnvSpecularSampler');
        this._specularIntensityProp = this.glManager.getProperty('scene_EnvMapLight.specularIntensity');
        this._mipLevelProp = this.glManager.getProperty('scene_EnvMapLight.mipMapLevel');
    }

    _update() {
        const em = this.em;

        this.que_initAmbientLight.forEach(entity => {
            const ambientLight = em.getComponent(entity, this.ambientLightCom);

            const ambientLightState = em.createComponent(this.ambientLightStateCom);
            const shaderData = em.createComponent(this.shaderDataCom);

            this._updateDiffuseMode(ambientLight, shaderData);
            this._updateDiffuseSH(ambientLight, shaderData, ambientLightState);
            // this._updateTexture(ambientLight, shaderData, ambientLightState);
            this._updateDiffuseSolidColor(ambientLight, shaderData);
            this._updateDiffuseIntensity(ambientLight, shaderData);

            this._updateSpecularTexture(ambientLight, shaderData, ambientLightState);
            this._updateSpecularTextureDecodeRGBM(ambientLight, shaderData);
            this._updateSpecularIntensity(ambientLight, shaderData);

            this.que_initAmbientLight.defer(() => {
                em.setComponent(entity, this.ambientLightStateCom, ambientLightState);
                em.setComponent(entity, this.shaderDataCom, shaderData);
            });
        });

        this.que_releaseAmbientLight.forEach(entity => {
            this.que_releaseAmbientLight.defer(() => {
                const ambientLightState = em.getComponent(entity, this.ambientLightStateCom);
                this.assetManager.unloadAssetEntity(ambientLightState.specularTextureEnt);
                em.removeComponent(entity, this.ambientLightStateCom);
            });
        });
    }

    setDiffuseMode(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (ambientLight.diffuseMode === value)
            return;
        ambientLight.diffuseMode = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateDiffuseMode(ambientLight, shaderData);
    }
    _updateDiffuseMode(ambientLight, shaderData) {
        if (ambientLight.diffuseMode === DiffuseMode.SphericalHarmonics) {
            this.glManager.enableMacro(shaderData, this._shMacro);
        } else
            this.glManager.disableMacro(shaderData, this._shMacro);
    }

    setDiffuseSH(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (sh3.equals(ambientLight.diffuseSH, value))
            return;
        sh3.copy(ambientLight.diffuseSH, value);

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const ambientLightState = this.em.getComponent(entity, this.ambientLightStateCom);
        this._updateDiffuseSH(ambientLight, shaderData, ambientLightState);
    }
    _updateDiffuseSH(ambientLight, shaderData, ambientLightState) {
        if (shaderData == null)
            return;

        const value = ambientLight.diffuseSH;
        this._preComputeSH(value, ambientLightState.shArray);
        this.glManager.setPropertyValue(shaderData, this._diffuseSHProp, ambientLightState.shArray);
    }
    setDiffuseSolidColor(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (vec4.exactEquals(ambientLight.diffuseSolidColor, value))
            return;
        vec4.copy(ambientLight.diffuseSolidColor, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateDiffuseSolidColor(ambientLight, shaderData);
    }
    _updateDiffuseSolidColor(ambientLight, shaderData) {
        this.glManager.setPropertyValue(shaderData, this._diffuseColorProp, ambientLight.diffuseSolidColor);
    }
    setDiffuseIntensity(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (ambientLight.diffuseIntensity === value)
            return;
        ambientLight.diffuseIntensity = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateDiffuseIntensity(ambientLight, shaderData);
    }
    _updateDiffuseIntensity(ambientLight, shaderData) {
        this.glManager.setPropertyValue(shaderData, this._diffuseIntensityProp, ambientLight.diffuseIntensity);
    }

    setSpecularTexture(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (ambientLight.specularTextureRef === value)
            return;
        ambientLight.specularTextureRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const ambientLightState = this.em.getComponent(entity, this.ambientLightStateCom);
        this._updateSpecularTexture(ambientLight, shaderData, ambientLightState);
    }
    _updateSpecularTexture(ambientLight, shaderData, ambientLightState) {
        let ent = ambientLightState.specularTextureEnt;
        if (ent !== -1)
            this.assetManager.unloadAssetEntity(ent);
        ent = ambientLightState.specularTextureEnt = this.assetManager.loadAssetEntity(ambientLight.specularTextureRef);

        this.glManager.setPropertyValue(shaderData, this._specularTextureProp, ent);
        if (ent === -1) {
            this.glManager.disableMacro(shaderData, this._specularMacro);
        } else {
            this.glManager.enableMacro(shaderData, this._specularMacro);
            // const textureState = this.em.getComponent(ent, this.textureStateCom);
            const texture = this.em.getComponent(ent, this.textureCom);
            this.glManager.setPropertyValue(shaderData, this._mipLevelProp, texture.mipmapCount - 1);
        }
    }
    setSpecularTextureDecodeRGBM(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (ambientLight.specularTextureDecodeRGBM === value)
            return;
        ambientLight.specularTextureDecodeRGBM = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateSpecularTextureDecodeRGBM(ambientLight, shaderData);
    }
    _updateSpecularTextureDecodeRGBM(ambientLight, shaderData) {
        if (ambientLight.specularTextureDecodeRGBM) {
            this.glManager.enableMacro(shaderData, this._decodeRGBMMacro);
        } else
            this.glManager.disableMacro(shaderData, this._decodeRGBMMacro);
    }
    setSpecularIntensity(entity, value) {
        const ambientLight = this.em.getComponent(entity, this.ambientLightCom);
        if (ambientLight.specularIntensity === value)
            return;
        ambientLight.specularIntensity = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateSpecularIntensity(ambientLight, shaderData);
    }
    _updateSpecularIntensity(ambientLight, shaderData) {
        this.glManager.setPropertyValue(shaderData, this._specularIntensityProp, ambientLight.specularIntensity);
    }

    _preComputeSH(sh, out) {
        /**
         * Basis constants
         *
         * 0: 1/2 * Math.sqrt(1 / Math.PI)
         *
         * 1: -1/2 * Math.sqrt(3 / Math.PI)
         * 2: 1/2 * Math.sqrt(3 / Math.PI)
         * 3: -1/2 * Math.sqrt(3 / Math.PI)
         *
         * 4: 1/2 * Math.sqrt(15 / Math.PI)
         * 5: -1/2 * Math.sqrt(15 / Math.PI)
         * 6: 1/4 * Math.sqrt(5 / Math.PI)
         * 7: -1/2 * Math.sqrt(15 / Math.PI)
         * 8: 1/4 * Math.sqrt(15 / Math.PI)
         */

        /**
         * Convolution kernel
         *
         * 0: Math.PI
         * 1: (2 * Math.PI) / 3
         * 2: Math.PI / 4
         */

        const src = sh;

        // l0
        out[0] = src[0] * 0.886227; // kernel0 * basis0 = 0.886227
        out[1] = src[1] * 0.886227;
        out[2] = src[2] * 0.886227;

        // l1
        out[3] = src[3] * -1.023327; // kernel1 * basis1 = -1.023327;
        out[4] = src[4] * -1.023327;
        out[5] = src[5] * -1.023327;
        out[6] = src[6] * 1.023327; // kernel1 * basis2 = 1.023327
        out[7] = src[7] * 1.023327;
        out[8] = src[8] * 1.023327;
        out[9] = src[9] * -1.023327; // kernel1 * basis3 = -1.023327
        out[10] = src[10] * -1.023327;
        out[11] = src[11] * -1.023327;

        // l2
        out[12] = src[12] * 0.858086; // kernel2 * basis4 = 0.858086
        out[13] = src[13] * 0.858086;
        out[14] = src[14] * 0.858086;
        out[15] = src[15] * -0.858086; // kernel2 * basis5 = -0.858086
        out[16] = src[16] * -0.858086;
        out[17] = src[17] * -0.858086;
        out[18] = src[18] * 0.247708; // kernel2 * basis6 = 0.247708
        out[19] = src[19] * 0.247708;
        out[20] = src[20] * 0.247708;
        out[21] = src[21] * -0.858086; // kernel2 * basis7 = -0.858086
        out[22] = src[22] * -0.858086;
        out[23] = src[23] * -0.858086;
        out[24] = src[24] * 0.429042; // kernel2 * basis8 = 0.429042
        out[25] = src[25] * 0.429042;
        out[26] = src[26] * 0.429042;
    }
}
