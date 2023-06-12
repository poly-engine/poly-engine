import { CompMode, CompType } from "@poly-engine/core";
import { BlendMode, RenderFace, RenderQueueType } from "../constants.js";

export const UnlitMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        // baseColor: { type: 'vec4', default: [1, 1, 1, 1] },
        // baseTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        // tilingOffset: { type: 'vec4', default: [1, 1, 0, 0] },
    }
};

export const UnlitMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        // baseTextureEnt: { type: 'entity', default: -1 },
    }
};