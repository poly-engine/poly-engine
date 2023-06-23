import { ArrayUtil, CompMode } from "@poly-engine/core";
import { BackgroundMode } from "./BackgroundMode";
import { BackgroundTextureFillMode } from "./BackgroundTextureFillMode";
import { DiffuseMode } from "./DiffuseMode";

export const BackgroundDef = {
    schema: {
        // mode: { type: 'number', default: BackgroundMode.SolidColor },
        solidColor: { type: 'vec4', default: [0.25, 0.25, 0.25, 1.0] },

        ambientLightRef: { type: 'assetRef', default: null, assetType: 'AmbientLight' },
        
        // //sky / texture data
        // textureFillMode: { type: 'number', default: BackgroundTextureFillMode.AspectFitHeight },
        // textureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
    }
};
export const BackgroundStateDef = {
    mode: CompMode.State,
    schema: {
        ambientLightEnt: { type: 'entity', default: -1 },

        // textureEnt: { type: 'entity', default: -1 },

        // //memory data
        // materialEnt: { type: 'entity', default: -1 },
        // geoEnt: { type: 'entity', default: -1 },
    }
};
