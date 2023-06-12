import { CompMode } from "@poly-engine/core";

export const MeshRendererDef = {
    schema: {
        geoRef: { type: 'assetRef', default: null, assetType: 'Geometry' },
        matRef: { type: 'assetRef', default: null, assetType: 'Material' },
    }
};

export const MeshRendererStateDef = {
    mode: CompMode.State,
    schema: {
        geoEnt: { type: 'entity', default: -1 },
        matEnt: { type: 'entity', default: -1 },
        shaderProgram: { type: 'object', default: null },
        layer: { type: 'vec4', default: [0, 0, 0, 0] }
    }
};