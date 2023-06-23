import { System, SystemGroupType } from "@poly-engine/core";
import { TransformUtil } from "@poly-engine/transform";
import { mat4, vec4 } from "@poly-engine/math";

export class PointLightSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 660;

        this.lightCom = this.em.getComponentId('Light');
        this.pointLightCom = this.em.getComponentId('PointLight');
        // this.directLightStateCom = this.em.getComponentId('DirectLightState');
        this.sceneCom = this.em.getComponentId('Scene');
        this.scenePointLightCom = this.em.getComponentId('ScenePointLight');
        this.shaderDataCom = this.em.getComponentId('ShaderData');
        this.ltwCom = this.em.getComponentId('LocalToWorld');

        this.que_pointLight = this.qm.createQuery({
            all: [this.lightCom, this.pointLightCom, this.ltwCom]
        });
        this.que_scenePointLight = this.qm.createQuery({
            all: [this.sceneCom, this.scenePointLightCom, this.shaderDataCom]
        });

        this._lightColor = [0, 0, 0, 0];
        this._worldPos = [0, 0, 0];
    }

    init() {
        this.glManager = this.world.glManager;
        this.sceneManager = this.world.sceneManager;

        this._cullingMaskProp = this.glManager.getProperty('scene_PointLightCullingMask');
        this._colorProp = this.glManager.getProperty('scene_PointLightColor');
        this._positionProp = this.glManager.getProperty('scene_PointLightPosition');
        this._distanceProp = this.glManager.getProperty('scene_PointLightDistance');

        this._pointLightCountMacro = this.glManager.getMacro('SCENE_POINT_LIGHT_COUNT', 0);
    }

    _update() {
        const em = this.em;

        this.que_pointLight.forEach(entity => {
            const scenEnt = this.sceneManager.getEntityScene(entity);
            if(scenEnt === -1)
                return;
            const sceneLight = em.getComponent(scenEnt, this.scenePointLightCom);
            const entities = sceneLight.entities;
            sceneLight.entities.push(entity);
        });

        this.que_scenePointLight.forEach(entity => {
            const shaderData = em.getComponent(entity, this.shaderDataCom);
            const sceneLight = em.getComponent(entity, this.scenePointLightCom);
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
                this.glManager.setPropertyValue(shaderData, this._positionProp, sceneLight.position);
                this.glManager.setPropertyValue(shaderData, this._distanceProp, sceneLight.distance);
                // shaderData.setIntArray(DirectLight._cullingMaskProperty, data.cullingMask);
                // shaderData.setFloatArray(DirectLight._colorProperty, data.color);
                // shaderData.setFloatArray(DirectLight._directionProperty, data.direction);
                this._pointLightCountMacro = this.glManager.enableMacro(shaderData, this._pointLightCountMacro, lightNum);
                // shaderData.enableMacro("SCENE_DIRECT_LIGHT_COUNT", directLightCount.toString());
            } else {
                this.glManager.disableMacro(shaderData, this._pointLightCountMacro);
                // shaderData.disableMacro("SCENE_DIRECT_LIGHT_COUNT");
            }
            sceneLight.dirty = false;
            entities.length = 0;
        });
    }
    _updateLightData(entity, index, data) {
        const em = this.em;
        const light = em.getComponent(entity, this.lightCom);
        const pointLight = em.getComponent(entity, this.pointLightCom);
        const ltw = em.getComponent(entity, this.ltwCom);

        const cullingMaskStart = index * 2;
        const colorStart = index * 3;
        const positionStart = index * 3;
        const distanceStart = index;

        const lightColor = vec4.scale(this._lightColor, light.color, light.intensity);
        const position = mat4.getTranslation(this._worldPos, ltw.worldMat);
        const distance = pointLight.distance;

        const cullingMask = light.cullingMask;
        data.cullingMask[cullingMaskStart] = cullingMask & 65535;
        data.cullingMask[cullingMaskStart + 1] = (cullingMask >>> 16) & 65535;

        data.color[colorStart] = lightColor[0];
        data.color[colorStart + 1] = lightColor[1];
        data.color[colorStart + 2] = lightColor[2];
        data.position[positionStart] = position[0];
        data.position[positionStart + 1] = position[1];
        data.position[positionStart + 2] = position[2];
        data.distance[distanceStart] = distance;
    }
}
