import { System, SystemGroupType } from "@poly-engine/core";
import { vec4 } from "@poly-engine/math";
import { FogMode } from "./FogMode.js";
import { ShadowCascadesMode } from "./ShadowCascadesMode.js";

export class SceneFogSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 610;

        this.sceneCom = this.em.getComponentId('Scene');
        this.fogCom = this.em.getComponentId('Fog');
        this.fogStateCom = this.em.getComponentId('FogState');

        this.shaderDataCom = this.em.getComponentId('ShaderData');
        // this.ltwCom = this.em.getComponentId('LocalToWorld');
        this.sceneDirectLightCom = this.em.getComponentId('SceneDirectLight');
        this.scenePointLightCom = this.em.getComponentId('ScenePointLight');
        this.sceneSpotLightCom = this.em.getComponentId('SceneSpotLight');

        this.que_initShaderData = this.qm.createQuery({
            all: [this.sceneCom],
            none: [this.shaderDataCom]
        });

        this.que_initFog = this.qm.createQuery({
            all: [this.sceneCom, this.fogCom],
            none: [this.fogStateCom]
        });
    }

    init() {
        this.glManager = this.world.glManager;

        this._fogModeMacro = this.glManager.getMacro('SCENE_FOG_MODE', FogMode.None);
        this._shadowCCMacro = this.glManager.getMacro('SCENE_SHADOW_CASCADED_COUNT', ShadowCascadesMode.NoCascades);

        this._fogColorProp = this.glManager.getProperty('scene_FogColor');
        this._fogParamsProp = this.glManager.getProperty('scene_FogParams');

        this._sunlightColorProp = this.glManager.getProperty('scene_SunlightColor');
        this._sunlightDirectionProp = this.glManager.getProperty('scene_SunlightDirection');
        // private static _sunlightColorProperty = ShaderProperty.getByName("scene_SunlightColor");
        // private static _sunlightDirectionProperty = ShaderProperty.getByName("scene_SunlightDirection");

    }

    _update() {
        const em = this.em;

        this.que_initShaderData.forEach(entity => {
            const scene = em.getComponent(entity, this.sceneCom);

            const shaderData = em.createComponent(this.shaderDataCom);
            this.glManager.enableMacro(shaderData, this._fogModeMacro, FogMode.None);
            this.glManager.enableMacro(shaderData, this._shadowCCMacro, ShadowCascadesMode.NoCascades);

            this.glManager.setPropertyValue(shaderData, this._sunlightColorProp, [1, 1, 1, 1]);
            this.glManager.setPropertyValue(shaderData, this._sunlightDirectionProp, [1, 1, 1]);
            // shaderData.setColor(Scene._sunlightColorProperty, sunlight.color);
            // shaderData.setVector3(Scene._sunlightDirectionProperty, sunlight.direction);

            this.que_initShaderData.defer(() => {
                em.setComponent(entity, this.shaderDataCom, shaderData);
                em.setComponent(entity, this.sceneDirectLightCom);
                em.setComponent(entity, this.scenePointLightCom);
                em.setComponent(entity, this.sceneSpotLightCom);
            });
        });

        this.que_initFog.forEach(entity => {
            // const scene = em.getComponent(entity, this.sceneCom);
            const fog = em.getComponent(entity, this.fogCom);
            const shaderData = em.getComponent(entity, this.shaderDataCom);
            const fogState = em.createComponent(this.fogStateCom);

            this._updateFogMode(fog, shaderData);
            this._updateFogColor(fog, shaderData);
            this._updateFogParams(shaderData, fog, fogState);

            this.que_initFog.defer(() => {
                em.setComponent(entity, this.fogStateCom, fogState);
            });
        });
    }

    setFogMode(entity, value) {
        const fog = this.em.getComponent(entity, this.fogCom);
        if (fog.fogMode === value)
            return;
        fog.fogMode = value;
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateFogMode(fog, shaderData);
    }
    _updateFogMode(fog, shaderData) {
        if (shaderData == null)
            return;
        this._fogModeMacro = this.glManager.enableMacro(shaderData, this._fogModeMacro, fog.fogMode);
    }
    setFogColor(entity, value) {
        const fog = this.em.getComponent(entity, this.fogCom);
        if (vec4.exactEquals(fog.fogColor, value))
            return;
        vec4.copy(fog.fogColor, value);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateFogColor(fog, shaderData);
    }
    _updateFogColor(fog, shaderData) {
        if (shaderData == null)
            return;
        this.glManager.setPropertyValue(shaderData, this._fogColorProp, fog.fogColor);
    }
    setFogStart(entity, value) {
        const fog = this.em.getComponent(entity, this.fogCom);
        if (fog.fogStart === value)
            return;
        fog.fogStart = value;
        const fogState = this.em.getComponent(entity, this.fogStateCom);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateFogParams(shaderData, fog, fogState);
    }
    setFogEnd(entity, value) {
        const fog = this.em.getComponent(entity, this.fogCom);
        if (fog.fogEnd === value)
            return;
        fog.fogEnd = value;
        const fogState = this.em.getComponent(entity, this.fogStateCom);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateFogParams(shaderData, fog, fogState);
    }
    setFogDensity(entity, value) {
        const fog = this.em.getComponent(entity, this.fogCom);
        if (fog.fogDensity === value)
            return;
        fog.fogDensity = value;
        const fogState = this.em.getComponent(entity, this.fogStateCom);
        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        this._updateFogParams(shaderData, fog, fogState);
    }
    _updateFogParams(shaderData, fog, fogState) {
        if (shaderData == null || fogState == null)
            return;
        const fogParams = fogState.fogParams;
        const fogRange = fog.fogEnd - fog.fogStart;

        fogParams[0] = -1 / fogRange;
        fogParams[1] = fog.fogEnd / fogRange;

        fogParams[2] = fog.fogDensity / Math.LN2;
        fogParams[3] = fog.fogDensity / Math.sqrt(Math.LN2);

        this.glManager.setPropertyValue(shaderData, this._fogParamsProp, fogParams);
    }
}
