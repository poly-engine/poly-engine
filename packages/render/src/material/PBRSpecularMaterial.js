import { CompMode, CompType } from "@poly-engine/core";

export const PBRSpecularMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },

        specularColor: { type: 'vec4', default: [1, 1, 1, 1] },
        glossiness: { type: 'number', default: 1.0 },

        specularGlossinessTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
    }
};

export const PBRSpecularMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        specularGlossinessTextureEnt: { type: 'entity', default: -1 },
    }
};