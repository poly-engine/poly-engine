import { System, SystemGroupType } from "@poly-engine/core";
import { mat4, vec4 } from "@poly-engine/math";
import { TransformUtil } from "@poly-engine/transform";

export class SpotLightSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 670;

        this.lightCom = this.em.getComponentId('Light');
        this.spotLightCom = this.em.getComponentId('SpotLight');
        // this.directLightStateCom = this.em.getComponentId('DirectLightState');
        this.sceneCom = this.em.getComponentId('Scene');
        this.sceneSpotLightCom = this.em.getComponentId('SceneSpotLight');
        this.shaderDataCom = this.em.getComponentId('ShaderData');
        this.ltwCom = this.em.getComponentId('LocalToWorld');

        this.que_spotLight = this.qm.createQuery({
            all: [this.lightCom, this.spotLightCom, this.ltwCom]
        });
        this.que_sceneSpotLight = this.qm.createQuery({
            all: [this.sceneCom, this.sceneSpotLightCom, this.shaderDataCom]
        });

        this._lightColor = [0, 0, 0, 0];
        this._worldPos = [0, 0, 0];
        this._worldForward = [0, 0, 0];
    }

    init() {
        this.glManager = this.world.glManager;
        this.sceneManager = this.world.sceneManager;

        this._cullingMaskProp = this.glManager.getProperty('scene_SpotLightCullingMask');
        this._colorProp = this.glManager.getProperty('scene_SpotLightColor');
        this._positionProp = this.glManager.getProperty('scene_SpotLightPosition');
        this._directionProp = this.glManager.getProperty('scene_SpotLightDirection');
        this._distanceProp = this.glManager.getProperty('scene_SpotLightDistance');
        this._angleCosProp = this.glManager.getProperty('scene_SpotLightAngleCos');
        this._penumbraCosProp = this.glManager.getProperty('scene_SpotLightPenumbraCos');

        this._spotLightCountMacro = this.glManager.getMacro('SCENE_SPOT_LIGHT_COUNT', 0);
    }

    _update() {
        const em = this.em;

        this.que_spotLight.forEach(entity => {
            const scenEnt = this.sceneManager.getEntityScene(entity);
            if (scenEnt === -1)
                return;
            const sceneLight = em.getComponent(scenEnt, this.sceneSpotLightCom);
            const entities = sceneLight.entities;
            sceneLight.entities.push(entity);
        });

        this.que_sceneSpotLight.forEach(entity => {
            const shaderData = em.getComponent(entity, this.shaderDataCom);
            const sceneLight = em.getComponent(entity, this.sceneSpotLightCom);
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
                this.glManager.setPropertyValue(shaderData, this._directionProp, sceneLight.direction);
                this.glManager.setPropertyValue(shaderData, this._distanceProp, sceneLight.distance);
                this.glManager.setPropertyValue(shaderData, this._angleCosProp, sceneLight.angleCos);
                this.glManager.setPropertyValue(shaderData, this._penumbraCosProp, sceneLight.penumbraCos);
                this._spotLightCountMacro = this.glManager.enableMacro(shaderData, this._spotLightCountMacro, lightNum);
            } else {
                this.glManager.disableMacro(shaderData, this._spotLightCountMacro);
            }
            sceneLight.dirty = false;
            entities.length = 0;
        });
    }
    _updateLightData(entity, index, data) {
        const em = this.em;
        const light = em.getComponent(entity, this.lightCom);
        const spotLight = em.getComponent(entity, this.spotLightCom);
        const ltw = em.getComponent(entity, this.ltwCom);

        const cullingMaskStart = index * 2;
        const colorStart = index * 3;
        const positionStart = index * 3;
        const directionStart = index * 3;
        const distanceStart = index;
        const penumbraCosStart = index;
        const angleCosStart = index;

        const lightColor = vec4.scale(this._lightColor, light.color, light.intensity);
        const position = mat4.getTranslation(this._worldPos, ltw.worldMat);
        const direction = TransformUtil.getForward(this._worldForward, ltw.worldMat);
        const distance = spotLight.distance;

        const cullingMask = light.cullingMask;
        data.cullingMask[cullingMaskStart] = cullingMask & 65535;
        data.cullingMask[cullingMaskStart + 1] = (cullingMask >>> 16) & 65535;

        data.color[colorStart] = lightColor[0];
        data.color[colorStart + 1] = lightColor[1];
        data.color[colorStart + 2] = lightColor[2];
        data.position[positionStart] = position[0];
        data.position[positionStart + 1] = position[1];
        data.position[positionStart + 2] = position[2];
        data.direction[directionStart] = direction[0];
        data.direction[directionStart + 1] = direction[1];
        data.direction[directionStart + 2] = direction[2];
        data.distance[distanceStart] = distance;
        data.angleCos[angleCosStart] = Math.cos(spotLight.angle);
        data.penumbraCos[penumbraCosStart] = Math.cos(spotLight.angle + spotLight.penumbra);
    }
}
