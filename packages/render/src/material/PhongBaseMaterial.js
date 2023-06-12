import { CompMode, CompType } from "@poly-engine/core";
import { BlendMode, RenderFace, RenderQueueType } from "../constants.js";

export const PhongBaseMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        normalIntensity: { type: 'number', default: 1 },
        normalTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        emissiveColor: { type: 'vec4', default: [0, 0, 0, 1] },
        emissiveTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
    }
};

export const PhongBaseMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        normalTextureEnt: { type: 'entity', default: -1 },
        emissiveTextureEnt: { type: 'entity', default: -1 },
    }
};