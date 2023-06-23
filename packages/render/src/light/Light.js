import { Layer } from "../constants/Layer.js";
import { ShadowType } from "../constants/ShadowType.js";

export const LightDef = {
    // type: CompType.Shared,
    schema: {
        color: { type: 'vec4', default: [1, 1, 1, 1] },
        intensity: { type: 'number', default: 1 },
        cullingMask: { type: 'number', default: Layer.Everything },

        shadowType: { type: 'number', default: ShadowType.None },
        shadowBias: { type: 'number', default: 1 },
        shadowNormalBias: { type: 'number', default: 1 },
        shadowNearPlane: { type: 'number', default: 0.1 },
        shadowStrength: { type: 'number', default: 1.0 },
    }
};

// export const LightStateDef = {
//     // type: CompType.Shared,
//     schema: {
//         color: { type: 'vec3', default: [1, 1, 1] },
//         // cullingMask: { type: 'number', default: Layer.Everything },
//     }
// };
