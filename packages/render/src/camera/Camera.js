import { CompMode } from "@poly-engine/core";
import { mat4 } from "@poly-engine/math";
import { CameraClearFlags } from "./enums/CameraClearFlags";

export const CameraDef = {
    schema: {
        clearColor: { type: 'vec4', default: [0.9, 0.9, 0.9, 1] },
        clearFlag: { type: 'number', default: CameraClearFlags.All },
        perspective: { type: 'boolean', default: true },
        // fov: [0,0],
        // fovX: { type: 'number', default: 0 },
        // fovY: { type: 'number', default: 0 },
        nearClipPlane: { type: 'number', default: 0.1 },
        farClipPlane: { type: 'number', default: 100 },

        aspectRatio: { type: 'number', default: 0 },
        fieldOfView: { type: 'number', default: 45 },
        orthographicSize: { type: 'number', default: 10 },
        viewport: { type: 'vec4', default: [0, 0, 1, 1] },

        targetEntity: { type: 'entity', default: -1 },
    }
};

export const CameraStateDef = {
    mode: CompMode.State,
    schema: {
        viewportWidth: { type: 'number', default: 0 },
        viewportHeight: { type: 'number', default: 0 },
        aspectRatio: { type: 'number', default: 0 },
        pvMat: { type: 'mat4', default: mat4.create() },
        position: { type: 'vec3', default: [0, 0, 0] },
        worldMat: { type: 'mat4', default: mat4.create() },
        pMat: { type: 'mat4', default: mat4.create() },
        pMatInv: { type: 'mat4', default: mat4.create() },
        viewMat: { type: 'mat4', default: mat4.create() },

        //uniform data
        // uniformData: { type: 'object', default: {} }
    }
};