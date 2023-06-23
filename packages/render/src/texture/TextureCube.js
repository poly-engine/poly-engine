import { CompMode, CompType } from "@poly-engine/core";

export const TextureCubeDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        // image: { type: 'object', default: null },
        images: { type: 'array', default: null },
        pixelBuffers: { type: 'array', default: null, value:{
            type: 'bin', default: null
        }},
    }
};

export const TextureCubeStateDef = {
    mode: CompMode.State,
    schema: {
        // texture: { type: 'object', default: null },
        // target: { type: 'number', default: 0 },
        // isDepthTexture: { type: 'boolean', default: false }
        compressedFaceFilled: {type: 'bin', default: [0, 0, 0, 0, 0, 0]}
    }
};