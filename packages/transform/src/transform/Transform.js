import { CompMode, CompType } from "@poly-engine/core";

export const TransformDef = {
    schema: {
        position: { type: 'vec3', default: [0, 0, 0] },
        rotation: { type: 'quat', default: [0, 0, 0, 1] },
        scale: { type: 'vec3', default: [1, 1, 1] },
    }
};

export const TransformDirtyDef = {
    type: CompType.Tag,
    mode: CompMode.Flag
};