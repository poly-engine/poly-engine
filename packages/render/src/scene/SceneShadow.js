import { CompMode } from "@poly-engine/core";
import { DiffuseMode } from "./DiffuseMode";
import { ShadowCascadesMode } from "./ShadowCascadesMode";
import { ShadowResolution } from "./ShadowResolution";

export const SceneShadowDef = {
    schema: {
        castShadows: { type: 'boolean', default: true },
        shadowResolution: { type: 'number', default: ShadowResolution.Medium },
        shadowTwoCascadeSplits: { type: 'number', default: 1.0 / 3.0 },
        shadowFourCascadeSplits: { type: 'vec3', default: [1.0 / 15, 3.0 / 15.0, 7.0 / 15.0] },
        shadowDistance: { type: 'number', default: 50 },
        _shadowCascades: { type: 'number', default: ShadowCascadesMode.NoCascades },
    }
};
