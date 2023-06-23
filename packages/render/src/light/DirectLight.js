import { CompMode, CompType } from "@poly-engine/core";
import { Layer } from "../constants/Layer";
import { LightUtil } from "./LightUtil";

export const DirectLightDef = {
    schema: {

    }
};
export const DirectLightStateDef = {
    schema: {
        // index: { type: 'number', default: -1 },
    }
};

// export const SceneDirectLightDef = {
//     type: CompType.Buffered,
//     schema: {
//         entity: { type: "entity", default: -1 },
//         // cullingMask: { type: 'number', default: Layer.Everything },
//         // color: { type: 'vec3', default: [1, 1, 1] },
//         // direction: { type: 'vec3', default: [0, 0, 0] },

//         // cullingMask: { type: 'bin', default: null },
//         // color: { type: 'bin', default: null },
//         // direction: { type: 'bin', default: null },
//     }
// }

export const SceneDirectLightDef = {
    mode: CompMode.Flag,
    schema: {
        entities: { type: "array", default: [] },
        dirty: { type: "boolean", default: false },
        // cullingMask: { type: 'number', default: Layer.Everything },
        // color: { type: 'vec3', default: [1, 1, 1] },
        // direction: { type: 'vec3', default: [0, 0, 0] },

        cullingMask: { type: 'bin', default: new Int32Array(LightUtil._maxLight * 2) },
        color: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
        direction: { type: 'bin', default: new Float32Array(LightUtil._maxLight * 3) },
    }
};
