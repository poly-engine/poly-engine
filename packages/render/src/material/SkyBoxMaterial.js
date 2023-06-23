import { CompMode, CompType } from "@poly-engine/core";

export const SkyBoxMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        tintColor: { type: 'vec4', default: [1, 1, 1, 1] },
        textureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        textureDecodeRGBM: { type: 'boolean', default: false },
        rotation: { type: 'number', default: 0.0 },
        exposure: { type: 'number', default: 1.0 },
    }
};

export const SkyBoxMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        textureEnt: { type: 'entity', default: -1 },
    }
};
