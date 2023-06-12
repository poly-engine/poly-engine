import { CompType } from "@poly-engine/core";

export const ShaderDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        vSource: { type: 'string', default: null },
        fSource: { type: 'string', default: null },
    }
};