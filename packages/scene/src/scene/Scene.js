import { CompMode, CompType, SparseSet } from "@poly-engine/core";

export const SceneDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        entDatas: { type: 'array', default: null }
    }
};

export const SceneStateDef = {
    mode: CompMode.State,
    schema: {
        entities: { type: 'array', default: null },
        entSet: { type: 'object', default: null }
    }
};

export const SceneFlagDef = {
    mode: CompMode.State,
    schema: {
        entity: { type: 'entity', default: -1 }
    }
};

export const SceneChangedDef = {
    mode: CompMode.Event,
    schema: {
        lastEnt: { type: 'entity', default: -1 },
        curEnt: { type: 'entity', default: -1 }
    }
};