import { BitSet, System, SystemGroupType } from "@poly-engine/core";
import { mat4 } from "@poly-engine/math";

export class SkySystem extends System {
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 620;

        this.sceneCom = this.em.getComponentId('Scene');
        this.skyCom = this.em.getComponentId('Sky');
        this.skyStateCom = this.em.getComponentId('SkyState');

        this.shaderDataCom = this.em.getComponentId('ShaderData');

        this.que_initState = this.qm.createQuery({
            all: [this.sceneCom, this.skyCom],
            none: [this.skyStateCom]
        });
        this.que_releaseState = this.qm.createQuery({
            all: [this.skyStateCom],
            none: [this.skyCom]
        });

        this.assetManager = this.world.assetManager;
    }

    init() {
        this.glManager = this.world.glManager;

        // this._vpMatrixProp = this.glManager.getProperty('camera_VPMat');
        // this._macroBitset = new BitSet(1);
    }

    _update() {
        const em = this.em;

        this.que_initState.forEach(entity => {
            const sky = em.getComponent(entity, this.skyCom);
            const shaderData = em.getComponent(entity, this.shaderDataCom);

            const skyState = em.createComponent(this.skyStateCom);

            this._updateMaterial(sky, shaderData, skyState);
            this._updateGeometry(sky, shaderData, skyState);

            this.que_initState.defer(() => {
                em.setComponent(entity, this.skyStateCom, skyState);
            });
        });
        this.que_releaseState.forEach(entity => {
            this.que_releaseState.defer(() => {
                const skyState = em.getComponent(entity, this.skyStateCom);
                this.assetManager.unloadAssetEntity(skyState.matEnt);
                this.assetManager.unloadAssetEntity(skyState.geoEnt);
                // this.assetManager.unloadAssetEntity(skyState.textureEnt);
                em.removeComponent(entity, this.skyStateCom);
            });
        });
    }


    setMaterial(entity, value) {
        const background = this.em.getComponent(entity, this.skyCom);
        if (background.matRef === value)
            return;
        background.matRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const skyState = this.em.getComponent(entity, this.skyStateCom);
        this._updateMaterial(background, shaderData, skyState);
    }
    _updateMaterial(background, shaderData, skyState) {
        if (skyState.matEnt !== -1)
            this.assetManager.unloadAssetEntity(skyState.matEnt);
        skyState.matEnt = this.assetManager.loadAssetEntity(background.matRef);

        // this.glManager.setPropertyValue(shaderData, this._baseTextureProp, skyState.textureEnt);
    }
    setGeometry(entity, value) {
        const background = this.em.getComponent(entity, this.skyCom);
        if (background.geoRef === value)
            return;
        background.geoRef = value;

        const shaderData = this.em.getComponent(entity, this.shaderDataCom);
        const skyState = this.em.getComponent(entity, this.skyStateCom);
        this._updateGeometry(background, shaderData, skyState);
    }
    _updateGeometry(background, shaderData, skyState) {
        if (skyState.geoEnt !== -1)
            this.assetManager.unloadAssetEntity(skyState.geoEnt);
        skyState.geoEnt = this.assetManager.loadAssetEntity(background.geoRef);

        // this.glManager.setPropertyValue(shaderData, this._baseTextureProp, skyState.textureEnt);
    }
}
