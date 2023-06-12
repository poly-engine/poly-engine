import { CompMode } from "@poly-engine/core";
import { mat4 } from "@poly-engine/math";
import { CameraClearFlags } from "../constants";

export const CameraDef = {
    schema: {
        clearColor: { type: 'vec4', default: [0.9, 0.9, 0.9, 1] },
        clearFlag: { type: 'number', default: (CameraClearFlags.Color | CameraClearFlags.Depth) },
        perspective: { type: 'boolean', default: true },
        // fov: [0,0],
        fovX: { type: 'number', default: 0 },
        fovY: { type: 'number', default: 0 },
        near: { type: 'number', default: 0.1 },
        far: { type: 'number', default: 1000 },
        targetEntity: { type: 'entity', default: -1 }
    }
};

export const CameraStateDef = {
    mode: CompMode.State,
    schema: {
        pvMat: { type: 'mat4', default: mat4.create() },
        position: { type: 'vec3', default: [0, 0, 0] },
        worldMat: { type: 'mat4', default: mat4.create() },
        viewportWidth: { type: 'number', default: 0 },
        viewportHeight: { type: 'number', default: 0 },
        pMat: { type: 'mat4', default: mat4.create() },
        pMatInv: { type: 'mat4', default: mat4.create() },

        //uniform data
        // uniformData: { type: 'object', default: {} }
    }
};