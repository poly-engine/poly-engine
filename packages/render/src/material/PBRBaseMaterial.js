import { CompMode, CompType } from "@poly-engine/core";
import { TextureCoordinate } from "./enums/TextureCoordinate.js";

export const PBRBaseMaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        
        occlusionTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        occlusionIntensity: { type: 'number', default: 1 },
        occlusionTextureCoord: { type: 'number', default: TextureCoordinate.UV0 },

        //clear coat
        clearCoat: { type: 'number', default: 0 },
        clearCoatTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        clearCoatRoughness: { type: 'number', default: 0 },
        clearCoatRoughnessTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        clearCoatNormalTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
    }
};

export const PBRBaseMaterialStateDef = {
    mode: CompMode.State,
    schema: {
        occlusionTextureEnt: { type: 'entity', default: -1 },

        clearCoatTextureEnt: { type: 'entity', default: -1 },
        clearCoatRoughnessTextureEnt: { type: 'entity', default: -1 },
        clearCoatNormalTextureEnt: { type: 'entity', default: -1 },
    }
};