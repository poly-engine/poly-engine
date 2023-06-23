import { CompMode } from "@poly-engine/core";

export const SkyDef = {
    schema: {
        //sky
        // textureFillMode: { type: 'number', default: BackgroundTextureFillMode.AspectFitHeight },
        // textureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        matRef: { type: 'assetRef', default: null, assetType: 'Material' },
        geoRef: { type: 'assetRef', default: null, assetType: 'Geometry' },
    }
};

export const SkyStateDef = {
    mode: CompMode.State,
    schema: {
        matEnt: { type: 'entity', default: -1 },
        geoEnt: { type: 'entity', default: -1 },
    }
};
