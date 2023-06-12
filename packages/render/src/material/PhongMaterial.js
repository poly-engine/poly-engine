import { CompMode, CompType } from "@poly-engine/core";
import { BlendMode, RenderFace, RenderQueueType } from "../constants.js";

export const PhongMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },

        // baseColor: { type: 'vec4', default: [1, 1, 1, 1] },
        // baseTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        // tilingOffset: { type: 'vec4', default: [1, 1, 0, 0] },

        // normalTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        // normalIntensity: { type: 'number', default: 1 },
        // emissiveColor: { type: 'vec4', default: [0, 0, 0, 1] },
        // emissiveTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },

        specularColor: { type: 'vec4', default: [1, 1, 1, 1] },
        specularTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        shininess: { type: 'number', default: 16 },

    }
};

export const PhongMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        // baseTextureEnt: { type: 'entity', default: -1 },

        // emissiveTextureEnt: { type: 'entity', default: -1 },
        // normalTextureEnt: { type: 'entity', default: -1 },

        specularTextureEnt: { type: 'entity', default: -1 },
    }
};