import { System, SystemGroupType } from "@poly-engine/core";
import { TransformUtil } from "@poly-engine/transform";
import { vec4 } from "@poly-engine/math";

export class DirectLightSystem extends System {
    // static _combinedData = {
    //     cullingMask: new Int32Array(LightUtil._maxLight * 2),
    //     color: new Float32Array(LightUtil._maxLight * 3),
    //     direction: new Float32Array(LightUtil._maxLight * 3)
    // };
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 650;

        // this.glStateCom = this.em.getComponentId('GlState');
        this.lightCom = this.em.getComponentId('Light');
        this.directLightCom = this.em.getComponentId('DirectLight');
        // this.directLightStateCom = this.em.getComponentId('DirectLightState');
        this.sceneCom = this.em.getComponentId('Scene');
        this.sceneDirectLightCom = this.em.getComponentId('SceneDirectLight');
        this.shaderDataCom = this.em.getComponentId('ShaderData');
        this.ltwCom = this.em.getComponentId('LocalToWorld');

        this.que_directLight = this.qm.createQuery({
            all: [this.lightCom, this.directLightCom, this.ltwCom]
        });
        // this.que_directLightData = this.qm.createQuery({
        //     all: [this.directLightDataCom, this.shaderDataCom]
        // });
        // this.que_initState = this.qm.createQuery({
        //     all: [this.directLightCom],
        //     none: [this.directLightStateCom],
        // });
        this.que_sceneDirectLight = this.qm.createQuery({
            all: [this.sceneCom, this.sceneDirectLightCom, this.shaderDataCom]
        });
        // this.que_materialStateRelease = this.qm.createQuery({
        //     all: [this.directLightCom],
        //     none: [this.lightCom],
        // });

        this._lightColor = [0, 0, 0, 0];
        this._worldForward = [0, 0, 0];
    }

    init() {
        this.glManager = this.world.glManager;
        this.sceneManager = this.world.sceneManager;

        // /** @type {ShaderSystem} */
        // this.glManager = this.glManager;//this.sm.getSystem(ShaderSystem);

        this._cullingMaskProp = this.glManager.getProperty('scene_DirectLightCullingMask');
        this._colorProp = this.glManager.getProperty('scene_DirectLightColor');
        this._directionProp = this.glManager.getProperty('scene_DirectLightDirection');

        this._directLightCountMacro = this.glManager.getMacro('SCENE_DIRECT_LIGHT_COUNT', 0);

        // private static _cullingMaskProperty: ShaderProperty = ShaderProperty.getByName("scene_DirectLightCullingMask");
        // private static _colorProperty: ShaderProperty = ShaderProperty.getByName("scene_DirectLightColor");
        // private static _directionProperty: ShaderProperty = ShaderProperty.getByName("scene_DirectLightDirection");

    }

    _update() {
        const em = this.em;

        // this.que_initState.forEach(entity => {
        //     const light = em.getComponent(entity, this.lightCom);
        //     const directLight = em.getComponent(entity, this.directLightCom);

        //     const scenEnt = this.sceneManager.getEntityScene(entity);
        //     const sceneLight = em.getComponent(scenEnt, this.sceneDirectLightCom);
        //     sceneLight.entities.push(entity);
        //     sceneLight.dirty = true;
        //     // buffer.add(entity)

        //     const state = em.createComponent(entity, this.directLightStateCom);
        //     this.que_initState.defer(() => {
        //         em.setComponent(entity, this.directLightStateCom, state);
        //     });
        // });
        // this.que_sceneDirectLight.forEach(entity => {
        //     const buffer = em.getComponent(entity, this.sceneDirectLightCom);
        //     buffer.clear();
        // });

        this.que_directLight.forEach(entity => {
            const scenEnt = this.sceneManager.getEntityScene(entity);
            if (scenEnt === -1)
                return;
            const sceneLight = em.getComponent(scenEnt, this.sceneDirectLightCom);
            // const shaderData = em.getComponent(scenEnt, this.shaderDataCom);
            // buffer.add1(-1, null, entity);
            const entities = sceneLight.entities;
            sceneLight.entities.push(entity);
        });

        this.que_sceneDirectLight.forEach(entity => {
            const shaderData = em.getComponent(entity, this.shaderDataCom);
            // shaderData.getMacro("SCENE_DIRECT_LIGHT_COUNT", directLightCount.toString());
            const sceneLight = em.getComponent(entity, this.sceneDirectLightCom);
            const entities = sceneLight.entities;
            // if (!sceneLight.dirty)// && this._directLightCountMacro.value === entities.length
            //     return;
            // this._directLightCountMacro.value
            const lightNum = entities.length;
            for (let i = 0, l = lightNum; i < l; i++) {
                const lightEnt = entities[i];
                this._updateLightData(lightEnt, i, sceneLight);
            }

            //apply data to shaderdata
            if (lightNum) {
                // DirectLight._updateShaderData(shaderData);
                this.glManager.setPropertyValue(shaderData, this._cullingMaskProp, sceneLight.cullingMask);
                this.glManager.setPropertyValue(shaderData, this._colorProp, sceneLight.color);
                this.glManager.setPropertyValue(shaderData, this._directionProp, sceneLight.direction);
                // shaderData.setIntArray(DirectLight._cullingMaskProperty, data.cullingMask);
                // shaderData.setFloatArray(DirectLight._colorProperty, data.color);
                // shaderData.setFloatArray(DirectLight._directionProperty, data.direction);
                this._directLightCountMacro = this.glManager.enableMacro(shaderData, this._directLightCountMacro, lightNum);
                // shaderData.enableMacro("SCENE_DIRECT_LIGHT_COUNT", directLightCount.toString());
            } else {
                this.glManager.disableMacro(shaderData, this._directLightCountMacro);
                // shaderData.disableMacro("SCENE_DIRECT_LIGHT_COUNT");
            }
            sceneLight.dirty = false;
            entities.length = 0;
        });

        // let lightIndex = 0;
        // const data = DirectLightSystem._combinedData;
        // this.que_directLight.forEach(entity => {
        //     const light = em.getComponent(entity, this.lightCom);
        //     const directLight = em.getComponent(entity, this.directLightCom);
        //     const ltw = em.getComponent(entity, this.ltwCom);

        //     const scenEnt = this.sceneManager.getEntityScene(entity);
        //     const shaderData = em.getComponent(scenEnt, this.shaderDataCom);

        //     const cullingMaskStart = lightIndex * 2;
        //     const colorStart = lightIndex * 3;
        //     const directionStart = lightIndex * 3;
        //     const lightColor = vec4.scale(this._lightColor, light.color, light.intensity);
        //     const direction = TransformUtil.getForward(this._worldForward, ltw.worldMat);


        //     const cullingMask = light.cullingMask;
        //     data.cullingMask[cullingMaskStart] = cullingMask & 65535;
        //     data.cullingMask[cullingMaskStart + 1] = (cullingMask >>> 16) & 65535;

        //     data.color[colorStart] = lightColor[0];
        //     data.color[colorStart + 1] = lightColor[1];
        //     data.color[colorStart + 2] = lightColor[2];
        //     data.direction[directionStart] = direction[0];
        //     data.direction[directionStart + 1] = direction[1];
        //     data.direction[directionStart + 2] = direction[2];

        //     lightIndex++;
        // });

        // //apply data to shaderdata
        // if (lightIndex) {
        //     // DirectLight._updateShaderData(shaderData);
        //     this.shaderSystem.setPropertyValue(shaderData, this._cullingMaskProp, data.cullingMask);
        //     this.shaderSystem.setPropertyValue(shaderData, this._colorProp, data.color);
        //     this.shaderSystem.setPropertyValue(shaderData, this._directionProp, data.direction);
        //     // shaderData.setIntArray(DirectLight._cullingMaskProperty, data.cullingMask);
        //     // shaderData.setFloatArray(DirectLight._colorProperty, data.color);
        //     // shaderData.setFloatArray(DirectLight._directionProperty, data.direction);
        //     this._directLightCountMacro = this.shaderSystem.enableMacro(shaderData, this._directLightCountMacro, lightIndex.toString());
        //     // shaderData.enableMacro("SCENE_DIRECT_LIGHT_COUNT", directLightCount.toString());
        // } else {
        //     this.shaderSystem.disableMacro(shaderData, this._directLightCountMacro);
        //     // shaderData.disableMacro("SCENE_DIRECT_LIGHT_COUNT");
        // }
    }
    _updateLightData(entity, index, data) {
        const em = this.em;
        const light = em.getComponent(entity, this.lightCom);
        const directLight = em.getComponent(entity, this.directLightCom);
        const ltw = em.getComponent(entity, this.ltwCom);

        const cullingMaskStart = index * 2;
        const colorStart = index * 3;
        const directionStart = index * 3;
        
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
    }

    setIntensity(entity, value) {
        const light = this.em.getComponent(entity, this.lightCom);
        if (light.intensity === value)
            return;
        light.intensity = value;
        // const sceneEnt = this.sceneManager.getEntityScene(entity);
        // const buffer = this.em.getComponent(sceneEnt, this.sceneDirectLightCom);
        // const sceneLight = buffer.find((item) => item.entity === entity);
        // if(sceneLight == null)
        //     return;
        // vec4.scale(sceneLight.color, light.color, light.intensity);
    }
    // _updateFogMode(fog, shaderData) {
    //     this.glManager.enableMacro(shaderData, this._fogModeMacro, fog.fogMode);
    // }

}
