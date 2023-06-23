import { CompMode, CompType } from "@poly-engine/core"
import { ControlHandlerType } from "./ControlHandlerType.js";
import { Spherical } from "./Spherical.js";


export const OrbitControlDef = {
    schema: {
        autoRotate: { type: 'boolean', default: false },
        autoRotateSpeed: { type: 'number', default: Math.PI },

        enableDamping: { type: 'boolean', default: true },

        rotateSpeed: { type: 'number', default: 1.0 },
        zoomSpeed: { type: 'number', default: 1.0 },
        keyPanSpeed: { type: 'number', default: 7.0 },

        dampingFactor: { type: 'number', default: 0.1 },
        zoomFactor: { type: 'number', default: 0.2 },

        minDistance: { type: 'number', default: 0.1 },
        maxDistance: { type: 'number', default: Infinity },

        minZoom: { type: 'number', default: 0.0 },
        maxZoom: { type: 'number', default: Infinity },

        minPolarAngle: { type: 'number', default: (1 / 180) * Math.PI },
        maxPolarAngle: { type: 'number', default: (179 / 180) * Math.PI },

        minAzimuthAngle: { type: 'number', default: -Infinity },
        maxAzimuthAngle: { type: 'number', default: Infinity },

        up: { type: 'vec3', default: [0, 1, 0] },
        target: { type: 'vec3', default: [0, 0, 0] },

        enableHandler: { type: 'number', default: ControlHandlerType.All },
    }
};

export const OrbitControlStateDef = {
    // mode: CompMode.State,
    schema: {
        atTheBack: { type: 'boolean', default: false },

        spherical: { type: 'object', default: (prop) => prop ? prop.clear() : new Spherical() },
        // sphericalDelta: { type: 'object', default: (prop) => prop ? prop.clear() : new Spherical() },
        sphericalDump: { type: 'object', default: (prop) => prop ? prop.clear() : new Spherical() },
        // spherical: { type: 'class', default: null, cons: Spherical },

        startX: { type: 'number', default: 0 },
        startY: { type: 'number', default: 0 },
        startPanX: { type: 'number', default: 0 },
        startPanY: { type: 'number', default: 0 },
        // isDown: { type: 'boolean', default: false },
        state: { type: 'number', default: -1 },

        // zoomFrag: { type: 'number', default: 0 },
        // scale: { type: 'number', default: 0 },
        // panOffset: { type: 'vec3', default: [0, 0, 0] },
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
