import { ArrayUtil, CompMode } from "@poly-engine/core";
import { sh3 } from "@poly-engine/math";
import { DiffuseMode } from "./DiffuseMode";

export const AmbientLightDef = {
    schema: {
        diffuseSH: { type: 'bin', default: sh3.create() },
        diffuseSolidColor: { type: 'vec4', default: [0.212, 0.227, 0.259, 1.0] },
        diffuseIntensity: { type: 'number', default: 1.0 },
        specularTextureRef: { type: 'assetRef', default: null, assetType: 'Texture' },
        specularIntensity: { type: 'number', default: 1.0 },
        diffuseMode: { type: 'number', default: DiffuseMode.SolidColor },
        specularTextureDecodeRGBM: { type: 'boolean', default: false },
    }
};

export const AmbientLightStateDef = {
    mode: CompMode.State,
    schema: {
        // fogParams: { type: 'vec4', default: [0, 0, 0, 0] },
        shArray: { type: 'bin', default: sh3.create() },
        specularTextureEnt: { type: 'entity', default: -1 },
    }
};
