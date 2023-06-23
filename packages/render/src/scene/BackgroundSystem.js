import { System, SystemGroupType } from "@poly-engine/core";
import { vec4 } from "@poly-engine/math";
import { FogMode } from "./FogMode.js";
import { ShadowCascadesMode } from "./ShadowCascadesMode.js";

export class BackgroundSystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 620;

        this.sceneCom = this.em.getComponentId('Scene');
        this.backgroundCom = this.em.getComponentId('Background');
        this.backgroundStateCom = this.em.getComponentId('BackgroundState');

        this.shaderDataCom = this.em.getComponentId('ShaderData');
        // this.ltwCom = this.em.getComponentId('LocalToWorld');

        // this.que_initShaderData = this.qm.createQuery({
        //     all: [this.sceneCom],
        //     none: [this.shaderDataCom]
        // });

        this.que_initBackground = this.qm.createQuery({
            all: [this.sceneCom, this.backgroundCom],
            none: [this.backgroundStateCom]
        });
        this.que_releaseBackground = this.qm.createQuery({
            all: [this.backgroundStateCom],
            none: [this.backgroundCom]
        });

        this.assetManager = this.world.assetManager;
    }

    init() {
        this.glManager = this.world.glManager;

        this._baseTextureProp = this.glManager.getProperty('material_BaseTexture');

        // this._fogModeMacro = this.glManager.getMacro('SCENE_FOG_MODE', FogMode.None);
        // this._shadowCCMacro = this.glManager.getMacro('SCENE_SHADOW_CASCADED_COUNT', ShadowCascadesMode.NoCascades);

        // this._fogColorProp = this.glManager.getProperty('scene_FogColor');
        // this._fogParamsProp = this.glManager.getProperty('scene_FogParams');
    }

    _update() {
        const em = this.em;

        this.que_initBackground.forEach(entity => {
            // const scene = em.getComponent(entity, this.sceneCom);
            const backgound = em.getComponent(entity, this.backgroundCom);
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            const backgroundState = em.createComponent(this.backgroundStateCom);

            this._updateAmbientLight(backgound, shaderData, backgroundState);
            // this._updateTexture(backgound, shaderData, backgroundState);
            // this._updateFogColor(backgound, shaderData);
            // this._updateFogParams(shaderData, backgound, backgroundState);

            this.que_initBackground.defer(() => {
                em.setComponent(entity, this.backgroundStateCom, backgroundState);
            });
        });
        this.que_releaseBackground.forEach(entity => {
            this.que_releaseBackground.defer(() => {
                const backgroundState = em.getComponent(entity, this.backgroundStateCom);
                this.assetManager.unloadAssetEntity(backgroundState.ambientLightEnt);
                // this.assetManager.unloadAssetEntity(backgroundState.textureEnt);
                em.removeComponent(entity, this.backgroundStateCom);
            });
        });

    }

    // setMode(entity, value) {
    //     const background = this.em.getComponent(entity, this.backgroundCom);
    //     if (background.mode === value)
    //         return;
    //     background.mode = value;

    //     const shaderData = this.em.getComponent(entity, this.shaderDataCom);
    //     const backgroundState = this.em.getComponent(entity, this.backgroundStateCom);
    //     this._updateMode(background, shaderData, backgroundState);
    // }
    // _updateMode(background, shaderData, backgroundState) {
    //     let ent = backgroundState.ambientLightEnt;
    //     if (ent !== -1)
    //         this.assetManager.unloadAssetEntity(ent);
    //     ent = backgroundState.ambientLightEnt = this.assetManager.loadAssetEntity(background.ambientLightRef);
    // }

    setAmbientLight(entity, value) {
        const background = this.em.getComponent(entity, this.backgroundCom);
        if (background.ambientLightRef === value)
            return;
        background.ambientLightRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const backgroundState = this.em.getComponent(entity, this.backgroundStateCom);
        this._updateAmbientLight(background, shaderData, backgroundState);
    }
    _updateAmbientLight(background, shaderData, backgroundState) {
        let ent = backgroundState.ambientLightEnt;
        if (ent !== -1)
            this.assetManager.unloadAssetEntity(ent);
        ent = backgroundState.ambientLightEnt = this.assetManager.loadAssetEntity(background.ambientLightRef);
    }
    // setTexture(entity, value) {
    //     const background = this.em.getComponent(entity, this.backgroundCom);
    //     if (background.textureRef === value)
    //         return;
    //     background.textureRef = value;

    //     const shaderData = this.em.getComponent(entity, this.shaderDataCom);
    //     const backgroundState = this.em.getComponent(entity, this.backgroundStateCom);
    //     this._updateTexture(background, shaderData, backgroundState);
    // }
    // _updateTexture(background, shaderData, backgroundState) {
    //     if (backgroundState.textureEnt !== -1)
    //         this.assetManager.unloadAssetEntity(backgroundState.textureEnt);
    //     backgroundState.textureEnt = this.assetManager.loadAssetEntity(background.textureRef);

    //     this.glManager.setPropertyValue(shaderData, this._baseTextureProp, backgroundState.textureEnt);
    // }

}
