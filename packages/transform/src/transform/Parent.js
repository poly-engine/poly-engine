import { CompMode, CompType } from "@poly-engine/core";

export const ParentDef = {
    schema: {
        entity: { type: 'entity', default: -1 }
    }
};

export const ParentDirtyDef = {
    // type: CompType.Tag,
    mode: CompMode.Flag,
    schema: {
        lastEnt: { type: 'entity', default: -1 },
        curEnt: { type: 'entity', default: -1 }
    }
};