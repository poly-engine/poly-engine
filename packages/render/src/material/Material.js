import { CompMode, CompType } from "@poly-engine/core";
import { BlendMode, RenderFace, RenderQueueType } from "../constants.js";

export const MaterialDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        // shaderEntity: { type: 'entity', default: -1 },
        shaderRef: { type: 'assetRef', default: null, assetType: 'Shader' },

        isTransparent: { type: 'boolean', default: false },
        blendMode: { type: 'number', default: BlendMode.Normal },
        renderFace: { type: 'number', default: RenderFace.Front },
        // queue: { type: 'number', default: RenderQueue.Opaque },
        // doubleSided: { type: 'boolean', default: true },
        // frontFace: { type: 'boolean', default: true },
        alphaCutoff: { type: 'number', default: 0 },
    }
};

export const MaterialStateDef = {
    mode: CompMode.State,
    schema: {
        shaderEnt: { type: 'entity', default: -1 },

        queue: { type: 'number', default: RenderQueueType.Opaque },
    }
};
