import { CompMode, CompType } from "@poly-engine/core";

export const Texture2DDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        image: { type: 'object', default: null },
    }
};

export const Texture2DStateDef = {
    mode: CompMode.State,
    schema: {
        // texture: { type: 'object', default: null },
        // target: { type: 'number', default: 0 },
        // isDepthTexture: { type: 'boolean', default: false }
    }
};