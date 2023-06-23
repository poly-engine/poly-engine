import { CompMode, CompType } from "@poly-engine/core";
import { LightUtil } from "./LightUtil";

export const SpotLightDef = {
    schema: {
        distance: { type: 'number', default: 100 },
        angle: { type: 'number', default: Math.PI / 6 },
        penumbra: { type: 'number', default: Math.PI / 12 },
    }
};
// export const DirectLightStateDef = {
//     schema: {
//         // index: { type: 'number', default: -1 },
//     }
// };

export const SceneSpotLightDef = {
    mode: CompMode.Flag,
    schema: {
        entities: { type: "array", default: [] },
        dirty: { type: "boolean", default: false },

        cullingMask: { type: 'bin', default: new Int32Array(LightUtil._maxLight * 2) },
        color: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
        position: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
        direction: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
        distance: { type: 'bin', default: new Float32Array(LightUtil._maxLight) },
        angleCos: { type: 'bin', default: new Float32Array(LightUtil._maxLight) },
        penumbraCos: { type: 'bin', default: new Float32Array(LightUtil._maxLight) },
    }
};
