import { System, SystemGroupType } from "@poly-engine/core";
import { TransformUtil } from "@poly-engine/transform";
import { ShaderSystem } from "../shader/ShaderSystem.js";
import { vec4 } from "@poly-engine/math";
import { LightUtil } from "./LightUtil.js";

export class DirectLightSystem extends System {
    static _combinedData = {
        cullingMask: new Int32Array(LightUtil._maxLight * 2),
        color: new Float32Array(LightUtil._maxLight * 3),
        direction: new Float32Array(LightUtil._maxLight * 3)
    };
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 600;

        // this.glStateCom = this.em.getComponentId('GlState');
        this.lightCom = this.em.getComponentId('Light');
        this.directLightCom = this.em.getComponentId('DirectLight');
        this.directLightDataCom = this.em.getComponentId('DirectLightData');
        this.shaderDataCom = this.em.getComponentId('ShaderData');
        this.ltwCom = this.em.getComponentId('LocalToWorld');

        this.que_directLight = this.qm.createQuery({
            all: [this.lightCom, this.directLightCom, this.ltwCom]
        });
        // this.que_directLightData = this.qm.createQuery({
        //     all: [this.directLightDataCom, this.shaderDataCom]
        // });
        // this.que_addDirectLightData = this.qm.createQuery({
        //     all: [this.glStateCom],
        //     none: [this.directLightDataCom],
        // });
        // this.que_materialStateRelease = this.qm.createQuery({
        //     all: [this.directLightCom],
        //     none: [this.lightCom],
        // });

        this._lightColor = [0, 0, 0, 0];
        this._worldForward = [0, 0, 0];
    }

    init() {
        this.glManager = this.world.glManager;

        /** @type {ShaderSystem} */
        this.shaderSystem = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._cullingMaskProp = this.shaderSystem.getProperty('scene_DirectLightCullingMask');
        this._colorProp = this.shaderSystem.getProperty('scene_DirectLightColor');
        this._directionProp = this.shaderSystem.getProperty('scene_DirectLightDirection');

        this._directLightCountMacro = this.shaderSystem.getMacro('SCENE_DIRECT_LIGHT_COUNT');

        // private static _cullingMaskProperty: ShaderProperty = ShaderProperty.getByName("scene_DirectLightCullingMask");
        // private static _colorProperty: ShaderProperty = ShaderProperty.getByName("scene_DirectLightColor");
        // private static _directionProperty: ShaderProperty = ShaderProperty.getByName("scene_DirectLightDirection");
      
    }

    _update() {
        const em = this.em;

        // let glEnt = em.getSingletonEntity(this.glStateCom);
        // if (glEnt === -1)
        //     return;
        // const shaderData = em.getComponent(glEnt, this.shaderDataCom);
        const shaderData = this.glManager.shaderData;

        let lightIndex = 0;
        const data = DirectLightSystem._combinedData;
        this.que_directLight.forEach(entity => {
            const light = em.getComponent(entity, this.lightCom);
            const directLight = em.getComponent(entity, this.directLightCom);
            const ltw = em.getComponent(entity, this.ltwCom);

            const cullingMaskStart = lightIndex * 2;
            const colorStart = lightIndex * 3;
            const directionStart = lightIndex * 3;
            const lightColor = vec4.scale(this._lightColor, light.color, light.intensity);
            const direction = TransformUtil.getForward(this._worldForward, ltw.worldMat);


            const cullingMask = light.cullingMask;
            data.cullingMask[cullingMaskStart] = cullingMask & 65535;
            data.cullingMask[cullingMaskStart + 1] = (cullingMask >>> 16) & 65535;

            data.color[colorStart] = lightColor[0];
            data.color[colorStart + 1] = lightColor[1];
            data.color[colorStart + 2] = lightColor[2];
            data.direction[directionStart] = direction[0];
            data.direction[directionStart + 1] = direction[1];
            data.direction[directionStart + 2] = direction[2];

            lightIndex++;
        });

        //apply data to shaderdata
        if (lightIndex) {
            // DirectLight._updateShaderData(shaderData);
            this.shaderSystem.setPropertyValue(shaderData, this._cullingMaskProp, data.cullingMask);
            this.shaderSystem.setPropertyValue(shaderData, this._colorProp, data.color);
            this.shaderSystem.setPropertyValue(shaderData, this._directionProp, data.direction);
            // shaderData.setIntArray(DirectLight._cullingMaskProperty, data.cullingMask);
            // shaderData.setFloatArray(DirectLight._colorProperty, data.color);
            // shaderData.setFloatArray(DirectLight._directionProperty, data.direction);
            this._directLightCountMacro = this.shaderSystem.enableMacro(shaderData, this._directLightCountMacro, lightIndex.toString());
            // shaderData.enableMacro("SCENE_DIRECT_LIGHT_COUNT", directLightCount.toString());
        } else {
            this.shaderSystem.disableMacro(shaderData, this._directLightCountMacro);
            // shaderData.disableMacro("SCENE_DIRECT_LIGHT_COUNT");
        }
    }
}
