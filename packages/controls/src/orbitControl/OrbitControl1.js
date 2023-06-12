import { CompMode, CompType } from "@poly-engine/core"
import { Spherical } from "./Spherical";


export const OrbitControl1Def = {
    schema: {
        isLockZ: { type: 'boolean', default: false },
        rotationXLimit: { type: 'number', default: 0 },
        isLockScale: { type: 'boolean', default: false },
        isLockRotate: { type: 'boolean', default: false },
        isLockMove: { type: 'boolean', default: false },



    }
};

export const OrbitControl1StateDef = {
    // mode: CompMode.State,
    schema: {
        startX: { type: 'number', default: 0 },
        startY: { type: 'number', default: 0 },
        isDown: { type: 'boolean', default: false },
        state: { type: 'number', default: -1 },
    }
};

// export const BaseControlBindingDef = {
//     type: CompType.Buffered,
//     schema: {
//         deviceType: { type: 'number', default: 0 },
//         controlId: { type: 'number', default: 0 },
//         buttonState: { type: 'number', default: 0 },

//         controls: {
//             type: 'array', default: null, value: {
//                 type: 'object', default: null, schema: {
//                     deviceType: { type: 'number', default: 0 },
//                     controlId: { type: 'number', default: 0 },
//                     isHeld: { type: 'boolean', default: false },
//                 }
//             }
//         },
//     }
// };
