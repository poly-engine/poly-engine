import { CompMode, CompType } from "@poly-engine/core";
import { mat4 } from "@poly-engine/math";

export const LocalToWorldDef = {
    // mode: CompMode.Flag,
    schema: {
        localMat: { type: 'array', default: mat4.create() },
        worldMat: { type: 'array', default: mat4.create() },
        worldInvMat: { type: 'array', default: mat4.create() },
    }
};

export const LtwChangedDef = {
    type: CompType.Tag,
    mode: CompMode.Event
}