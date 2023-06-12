
/**
 * @enum {number}
 * @prop {number} None 
 * @prop {number} Color 
 * @prop {number} Depth 
 * @prop {number} Stencil 
 * @prop {number} ColorDepth 
 * @prop {number} ColorStencil 
 * @prop {number} DepthStencil 
 * @prop {number} All 
 */
export const CameraClearFlags = {
	/* Do nothing. */
	None: 0x0,
	/* Clear color with scene background. */
	Color: 0x1,
	/* Clear depth only. */
	Depth: 0x2,
	/* Clear depth only. */
	Stencil: 0x4,

	/* Clear color with scene background and depth. */
	ColorDepth: 0x3,
	/* Clear color with scene background and stencil. */
	ColorStencil: 0x5,
	/* Clear depth and stencil. */
	DepthStencil: 0x6,

	/* Clear color with scene background, depth, and stencil. */
	All: 0x7
}

/**
 * @enum {number}
 * @prop {number} Points 
 * @prop {number} Lines 
 * @prop {number} LineLoop 
 * @prop {number} LineStrip 
 * @prop {number} Triangles 
 * @prop {number} TriangleStrip 
 * @prop {number} TriangleFan 
 */
export const MeshTopology = {
	/** Draws a single dot */
	Points: 0,
	/** Draws a line between a pair of vertices */
	Lines: 1,
	/** Draws a straight line to the next vertex, and connects the last vertex back to the first */
	LineLoop: 2,
	/** Draws a straight line to the next vertex. */
	LineStrip: 3,
	/** Draws a triangle for a group of three vertices */
	Triangles: 4,
	/** Draws a triangle strip */
	TriangleStrip: 5,
	/** Draws a triangle fan */
	TriangleFan: 6
}

// /**
//     * @enum {number}
//     * @prop {number} Float 
//     * @prop {number} Vector2 
//     * @prop {number} Vector3 
//     * @prop {number} Vector4 
//     * @prop {number} Byte4 
//     * @prop {number} UByte4 
//     * @prop {number} NormalizedByte4 
//     * @prop {number} NormalizedUByte4 
//     * @prop {number} Short2 
//     * @prop {number} UShort2 
//     * @prop {number} NormalizedShort2 
//     * @prop {number} NormalizedUShort2 
//     * @prop {number} Short4 
//     * @prop {number} UShort4 
//     * @prop {number} NormalizedShort4 
//     * @prop {number} NormalizedUShort4 
//  */
// export const VertexElementFormat = {
//     /** 32-bit float */
//     Float: 0,
//     /** Two-dimensional 32-bit float */
//     Vector2: 1,
//     /** Three-dimensional 32-bit float */
//     Vector3: 2,
//     /** Four-dimensional 32-bit float */
//     Vector4: 3,
//     /** Four-dimensional 8-bit integer,range is [-128,127] */
//     Byte4: 4,
//     /** Four-dimensional 8-bit Unsigned integer, range is [0,255] */
//     UByte4: 5,
//     /** Four-dimensional 8-bit Normalized integer, range is [-1,1] */
//     NormalizedByte4: 6,
//     /** Four-dimensional 8-bit Normalized unsigned integer, range is [0,1] */
//     NormalizedUByte4: 7,
//     /** Two-dimensional 16-bit integer, range is[-32768, 32767] */
//     Short2: 8,
//     /** Two-dimensional 16-bit Unsigned integer, range is [0, 65535] */
//     UShort2: 9,
//     /** Two-dimensional 16-bit Unsigned integer, range is [-1, 1] */
//     NormalizedShort2: 10,
//     /** Two-dimensional 16-bit Normalized unsigned integer, range is [0, 1] */
//     NormalizedUShort2: 11,
//     /** Four-dimensional 16-bit integer, range is [-32768, 32767] */
//     Short4: 12,
//     /** Four-dimensional 16-bit Unsigned integer, range is [0, 65535] */
//     UShort4: 13,
//     /** Four-dimensional 16-bit Normalized integer, range is[-1, 1] */
//     NormalizedShort4: 14,
//     /** Four-dimensional 16-bit Normalized unsigned integer, range is [0, 1] */
//     NormalizedUShort4: 15
// }
// /**
//  * 
//  * @param {WebGL2RenderingContext} gl 
//  * @param {*} format 
//  * @returns 
//  */
// export function getGlVertextElementFormat(gl, format) {
//     let size = 0;
//     let type = 0;
//     let normalized = false;

//     switch (format) {
//         case VertexElementFormat.Float:
//             size = 1;
//             type = gl.FLOAT;
//             break;
//         case VertexElementFormat.Vector2:
//             size = 2;
//             type = gl.FLOAT;
//             break;
//         case VertexElementFormat.Vector3:
//             size = 3;
//             type = gl.FLOAT;
//             break;
//         case VertexElementFormat.Vector4:
//             size = 4;
//             type = gl.FLOAT;
//             break;
//         case VertexElementFormat.Byte4:
//             size = 4;
//             type = gl.BYTE;
//             break;
//         case VertexElementFormat.UByte4:
//             size = 4;
//             type = gl.UNSIGNED_BYTE;
//             break;
//         case VertexElementFormat.NormalizedByte4:
//             size = 4;
//             type = gl.BYTE;
//             normalized = true;
//             break;
//         case VertexElementFormat.NormalizedUByte4:
//             size = 4;
//             type = gl.UNSIGNED_BYTE;
//             normalized = true;
//             break;
//         case VertexElementFormat.Short2:
//             size = 2;
//             type = gl.SHORT;
//             break;
//         case VertexElementFormat.UShort2:
//             size = 2;
//             type = gl.UNSIGNED_SHORT;
//             break;
//         case VertexElementFormat.NormalizedShort2:
//             size = 2;
//             type = gl.SHORT;
//             normalized = true;
//             break;
//         case VertexElementFormat.NormalizedUShort2:
//             size = 2;
//             type = gl.UNSIGNED_SHORT;
//             normalized = true;
//             break;
//         case VertexElementFormat.Short4:
//             size = 4;
//             type = gl.SHORT;
//             break;
//         case VertexElementFormat.UShort4:
//             size = 4;
//             type = gl.UNSIGNED_SHORT;
//             break;
//         case VertexElementFormat.NormalizedShort4:
//             size = 4;
//             type = gl.SHORT;
//             normalized = true;
//             break;
//         case VertexElementFormat.NormalizedUShort4:
//             size = 4;
//             type = gl.UNSIGNED_SHORT;
//             normalized = true;
//             break;
//         default:
//             break;
//     }
//     return { size, type, normalized };
// }

export const VertexElementType = {
	Float: 0,
	Byte: 1,
	UByte: 2,
	Short: 3,
	UShort: 4,
	Int: 5,
	UInt: 6
};
export const VertexBufferConstructors = [
	Float32Array,
	Int8Array,
	Uint8Array,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
];
export const VertexElementTypeSize = [
	4,//Float
	1,//Byte
	1,//UByte
	2,//Short
	2,//UShort
	4,
	4
];

/**
 * @enum {number}
 * @prop {number} Opaque 
 * @prop {number} AlphaTest 
 * @prop {number} Transparent 
 */
export const RenderQueueType = {
	/** Opaque queue. */
	Opaque: 0,
	/** Opaque queue, alpha cutoff. */
	AlphaTest: 1,
	/** Transparent queue, rendering from back to front to ensure correct rendering of transparent objects. */
	Transparent: 2
}

/**
 * @enum {number}
 * @prop {number} FogMode 
 * @prop {number} None 
 * @prop {number} Linear 
 * @prop {number} Exponential 
 * @prop {number} ExponentialSquared 
 */
export const FogMode = {
	/** Disable fog. */
	None: 0,
	/** Linear fog. */
	Linear: 1,
	/** Exponential fog. */
	Exponential: 2,
	/** Exponential squared fog. */
	ExponentialSquared: 3
}

/**
 * Number of cascades to use for directional light shadows.
 * @enum {number}
 * @prop {number} ShadowCascadesMode 
 * @prop {number} None 
 * @prop {number} Linear 
 * @prop {number} Exponential 
*/
export const ShadowCascadesMode = {
	/** No cascades */
	NoCascades: 1,
	/** Two cascades */
	TwoCascades: 2,
	/** Four cascades */
	FourCascades: 4
}

/**
 * Enum for pixel format.
 * @readonly
 * @enum {Number}
 */
export const PIXEL_FORMAT = {
	DEPTH_COMPONENT: 1000,
	DEPTH_STENCIL: 1001,
	STENCIL_INDEX8: 1002,
	ALPHA: 1003,
	RED: 1004,
	RGB: 1005,
	RGBA: 1006,
	LUMINANCE: 1007,
	LUMINANCE_ALPHA: 1008,
	/** Only webgl2 */
	RED_INTEGER: 1010,
	RG: 1011,
	RG_INTEGER: 1012,
	RGB_INTEGER: 1013,
	RGBA_INTEGER: 1014,
	/** Only internal formats and webgl2 */
	R32F: 1100,
	R16F: 1101,
	R8: 1102,
	RG32F: 1103,
	RG16F: 1104,
	RG8: 1105,
	RGB32F: 1106,
	RGB16F: 1107,
	RGB8: 1108,
	RGBA32F: 1109,
	RGBA16F: 1110,
	RGBA8: 1111,
	RGBA4: 1112,
	RGB5_A1: 1113,
	DEPTH_COMPONENT32F: 1114,
	DEPTH_COMPONENT24: 1115,
	DEPTH_COMPONENT16: 1116,
	DEPTH24_STENCIL8: 1117,
	DEPTH32F_STENCIL8: 1118,
	/** For compressed texture formats */
	RGB_S3TC_DXT1: 1200,
	RGBA_S3TC_DXT1: 1201,
	RGBA_S3TC_DXT3: 1202,
	RGBA_S3TC_DXT5: 1203,
	RGB_PVRTC_4BPPV1: 1204,
	RGB_PVRTC_2BPPV1: 1205,
	RGBA_PVRTC_4BPPV1: 1206,
	RGBA_PVRTC_2BPPV1: 1207,
	RGB_ETC1: 1208,
	RGBA_ASTC_4x4: 1209,
	RGBA_BPTC: 1210
};

/**
 * Enum for pixel Type.
 * @readonly
 * @enum {Number}
 */
export const PIXEL_TYPE = {
	UNSIGNED_BYTE: 1500,
	UNSIGNED_SHORT_5_6_5: 1501,
	UNSIGNED_SHORT_4_4_4_4: 1502,
	UNSIGNED_SHORT_5_5_5_1: 1503,
	UNSIGNED_SHORT: 1504,
	UNSIGNED_INT: 1505,
	UNSIGNED_INT_24_8: 1506,
	FLOAT: 1507,
	HALF_FLOAT: 1508,
	FLOAT_32_UNSIGNED_INT_24_8_REV: 1509,
	BYTE: 1510,
	SHORT: 1511,
	INT: 1512
};

/**
 * Enum for texture filter.
 * @readonly
 * @enum {Number}
 */
export const TEXTURE_FILTER = {
	NEAREST: 1600,
	LINEAR: 1601,
	NEAREST_MIPMAP_NEAREST: 1602,
	LINEAR_MIPMAP_NEAREST: 1603,
	NEAREST_MIPMAP_LINEAR: 1604,
	LINEAR_MIPMAP_LINEAR: 1605
};

/**
 * Enum for texture wrap.
 * @readonly
 * @enum {Number}
 */
export const TEXTURE_WRAP = {
	REPEAT: 1700,
	CLAMP_TO_EDGE: 1701,
	MIRRORED_REPEAT: 1702
};

/**
 * Enum for Texel Encoding Type.
 * @readonly
 * @enum {String}
 */
export const TEXEL_ENCODING_TYPE = {
	LINEAR: "linear",
	SRGB: "sRGB",
	RGBE: "RGBE",
	RGBM7: "RGBM7",
	RGBM16: "RGBM16",
	RGBD: "RGBD",
	GAMMA: "Gamma"
};

/**
 * Blend factor.
 * @remarks defines which function is used for blending pixel arithmetic
 * @enum {number}
 */
export const BlendFactor = {
	/** (0, 0, 0, 0)*/
	Zero: 0,
	/** (1, 1, 1, 1)*/
	One: 1,
	/** (Rs, Gs, Bs, As) */
	SourceColor: 2,
	/** (1 - Rs, 1 - Gs, 1 - Bs, 1 - As)*/
	OneMinusSourceColor: 3,
	/** (Rd, Gd, Bd, Ad)*/
	DestinationColor: 4,
	/** (1 - Rd, 1 - Gd, 1 - Bd, 1 - Ad)*/
	OneMinusDestinationColor: 5,
	/** (As, As, As, As)*/
	SourceAlpha: 6,
	/** (1 - As, 1 - As, 1 - As, 1 - As)*/
	OneMinusSourceAlpha: 7,
	/** (Ad, Ad, Ad, Ad)*/
	DestinationAlpha: 8,
	/** (1 - Ad, 1 - Ad, 1 - Ad, 1 - Ad)*/
	OneMinusDestinationAlpha: 9,
	/** (min(As, 1 - Ad), min(As, 1 - Ad), min(As, 1 - Ad), 10)*/
	SourceAlphaSaturate: 10,
	/** (Rc, Gc, Bc, Ac)*/
	BlendColor: 11,
	/** (1 - Rc, 1 - Gc, 1 - Bc, 1 - Ac)*/
	OneMinusBlendColor: 12
};

/**
 * Blend operation function.
 * @remarks defines how a new pixel is combined with a pixel.
 * @enum {number}
 */
export const BlendOperation = {
	/** src + dst. */
	Add: 0,
	/** src - dst. */
	Subtract: 1,
	/** dst - src. */
	ReverseSubtract: 2,
	/** Minimum of source and destination. */
	Min: 3,
	/** Maximum of source and destination. */
	Max: 4
};

/**
 * Set which face for render.
 * @enum {number}
 */
export const RenderFace = {
	/** Render front face. */
	Front: 0,
	/** Render back face. */
	Back: 1,
	/** Render double face. */
	Double: 2
};

/**
 * Alpha blend mode.
 * @enum {number}
 */
export const BlendMode = {
	/** SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
	Normal: 0,
	/** SRC ALPHA * SRC + ONE * DEST */
	Additive: 1
};

/**
 * Set which color channels can be rendered to frame buffer.
 * @remarks enumeration can be combined using bit operations.
 * @enum {number}
 */
export const ColorWriteMask = {
	/** Do not write to any channel. */
	None: 0,
	/** Write to the red channel. */
	Red: 0x1,
	/** Write to the green channel. */
	Green: 0x2,
	/** Write to the blue channel. */
	Blue: 0x4,
	/** Write to the alpha channel. */
	Alpha: 0x8,
	/** Write to all channel. */
	All: 0xf
};

/**
 * Depth/Stencil comparison function.
 * @remarks Specifies a function that compares incoming pixel depth/stencil to the current depth/stencil buffer value.
 * @enum {number}
 */
export const CompareFunction = {
	/** never pass. */
	Never: 0,
	/** pass if the incoming value is less than the depth/stencil buffer value. */
	Less: 1,
	/** pass if the incoming value equals the depth/stencil buffer value. */
	Equal: 2,
	/** pass if the incoming value is less than or equal to the depth/stencil buffer value. */
	LessEqual: 3,
	/** pass if the incoming value is greater than the depth/stencil buffer value. */
	Greater: 4,
	/** pass if the incoming value is not equal to the depth/stencil buffer value. */
	NotEqual: 5,
	/** pass if the incoming value is greater than or equal to the depth/stencil buffer value. */
	GreaterEqual: 6,
	/** always pass. */
	Always: 7
};

/**
 * Culling mode.
 * @remarks specifies whether or not front- and/or back-facing polygons can be culled.
 * @enum {number}
 */
export const CullMode = {
	/** Disable culling. */
	Off: 0,
	/** cut the front-face of the polygons. */
	Front: 1,
	/** cut the back-face of the polygons. */
	Back: 2
}

/**
 * Stencil operation mode.
 * @remarks sets the front and/or back-facing stencil test actions.
 * @enum {number}
 */
export const StencilOperation = {
	/** Keeps the current value. */
	Keep: 0,
	/** Sets the stencil buffer value to 0. */
	Zero: 1,
	/** Sets the stencil buffer value to the reference value. */
	Replace: 2,
	/** Increments the current stencil buffer value. Clamps to the maximum representable unsigned value. */
	IncrementSaturate: 3,
	/** Decrements the current stencil buffer value. Clamps to 0. */
	DecrementSaturate: 4,
	/** Inverts the current stencil buffer value bitwise. */
	Invert: 5,
	/** Increments the current stencil buffer value. Wraps stencil buffer value to zero when incrementing the maximum representable unsigned value. */
	IncrementWrap: 6,
	/** Decrements the current stencil buffer value. Wraps stencil buffer value to the maximum representable unsigned value when decrementing a stencil buffer value of 0. */
	DecrementWrap: 7
}
