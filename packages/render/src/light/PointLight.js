import { CompMode, CompType } from "@poly-engine/core";
import { Layer } from "../constants/Layer";
import { LightUtil } from "./LightUtil";

export const PointLightDef = {
    schema: {
        distance: { type: 'number', default: 100 },
    }
};
// export const DirectLightStateDef = {
//     schema: {
//         // index: { type: 'number', default: -1 },
//     }
// };

export const ScenePointLightDef = {
    mode: CompMode.Flag,
    schema: {
        entities: { type: "array", default: [] },
        dirty: { type: "boolean", default: false },

        cullingMask: { type: 'bin', default: new Int32Array(LightUtil._maxLight * 2) },
        color: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
        position: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
        distance: { type: 'bin', default: new Float32Array(LightUtil._maxLight) },
    }
};
