import { CompMode, CompType } from "@poly-engine/core";

export const PBRMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        ior: { type: 'number', default: 1.5 },
        metallic: { type: 'number', default: 1.0 },
        roughness: { type: 'number', default: 1.0 },

        roughnessMetallicTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
    }
};

export const PBRMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        roughnessMetallicTextureEnt: { type: 'entity', default: -1 },
    }
};