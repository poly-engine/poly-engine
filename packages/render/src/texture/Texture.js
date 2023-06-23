import { CompMode, CompType } from "@poly-engine/core";
import { TextureDepthCompareFunction } from "./TextureDepthCompareFunction.js";
import { TextureFilterMode } from "./TextureFilterMode.js";
import { TextureFormat } from "./TextureFormat.js";
import { TextureWrapMode } from "./TextureWrapMode.js";

export const TextureDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },

        width: { type: 'number', default: 0 },
        height: { type: 'number', default: 0 },
        format: { type: 'number', default: TextureFormat.R8G8B8A8 },

        mipmap: { type: 'boolean', default: false },
        mipmapCount: { type: 'number', default: 0 },

        wrapModeU: { type: 'number', default: TextureWrapMode.Repeat },
        wrapModeV: { type: 'number', default: TextureWrapMode.Repeat },
        filterMode: { type: 'number', default: TextureFilterMode.Bilinear },
        anisoLevel: { type: 'number', default: 1 },

        depthCompareFunction: { type: 'number', default: TextureDepthCompareFunction.Never },
        useDepthCompareMode: { type: 'boolean', default: false },

        flipY: { type: 'boolean', default: false },
        premultiplyAlpha: { type: 'boolean', default: false },

        // mipmaps: { type: 'array', default: [] },
        // border: { type: 'number', default: 0 },
        // format: { type: 'number', default: PIXEL_FORMAT.RGBA },
        // internalformat: { type: 'number', default: null },
        // type: { type: 'number', default: PIXEL_TYPE.UNSIGNED_BYTE },
        // magFilter: { type: 'number', default: TEXTURE_FILTER.LINEAR },
        // minFilter: { type: 'number', default: TEXTURE_FILTER.LINEAR_MIPMAP_LINEAR },
        // wrapS: { type: 'number', default: TEXTURE_WRAP.CLAMP_TO_EDGE },
        // wrapT: { type: 'number', default: TEXTURE_WRAP.CLAMP_TO_EDGE },
        // anisotropy: { type: 'number', default: 1 },
        // generateMipmaps: { type: 'boolean', default: true },
        // encoding: { type: 'string', default: TEXEL_ENCODING_TYPE.LINEAR },
        // flipY: { type: 'boolean', default: true },
        // premultiplyAlpha: { type: 'boolean', default: false },
        // unpackAlignment: { type: 'number', default: 4 },
    }
};

export const TextureStateDef = {
    mode: CompMode.State,
    schema: {
        texture: { type: 'object', default: null },
        target: { type: 'number', default: 0 },
        formatDetail: { type: 'object', default: {} },

        isDepthTexture: { type: 'boolean', default: false }
    }
};