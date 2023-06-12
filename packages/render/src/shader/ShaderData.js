import { BitSet } from "@poly-engine/core";

export const ShaderDataDef = {
    // group: com_shader,
    schema: {
        macros: {
            type: 'object', default: () => new BitSet()
        },
        uniforms: {
            // type: 'object', default: {}
            type: 'array', default: []
        }
    }
};