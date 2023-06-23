import { CompMode } from "@poly-engine/core";
import { FogMode } from "./FogMode.js";

export const FogDef = {
    schema: {
        fogMode: { type: 'number', default: FogMode.None },
        fogColor: { type: 'vec4', default: [0.5, 0.5, 0.5, 1.0] },
        fogStart: { type: 'number', default: 0 },
        fogEnd: { type: 'number', default: 300 },
        fogDensity: { type: 'number', default: 0.01 },
    }
};

export const FogStateDef = {
    mode: CompMode.Flag,
    schema: {
        fogParams: { type: 'vec4', default: [0, 0, 0, 0] },
    }
};