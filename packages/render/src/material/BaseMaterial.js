import { CompMode, CompType } from "@poly-engine/core";

export const BaseMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        baseColor: { type: 'vec4', default: [1, 1, 1, 1] },
        baseTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        tilingOffset: { type: 'vec4', default: [1, 1, 0, 0] },
    }
};

export const BaseMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        baseTextureEnt: { type: 'entity', default: -1 },
    }
};
