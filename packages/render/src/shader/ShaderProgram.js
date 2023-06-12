import { CompMode, CompType } from "@poly-engine/core";

export const ShaderProgramDef = {
    type: CompType.Buffered,
    mode: CompMode.State,
    schema: {
        vSource: { type: 'string', default: null },
        fSource: { type: 'string', default: null },
        macroBitSet: { type: 'object', default: null },
        refCount: { type: 'number', default: 0 },

        program: { type: 'object', default: null },
        vertexShader: { type: 'object', default: null },
        fragmentShader: { type: 'object', default: null },

        attributeMap: { type: 'object', default: {} },
        uniformMap: { type: 'object', default: {} },
        uniforms: { type: 'array', default: {} },
    }
};