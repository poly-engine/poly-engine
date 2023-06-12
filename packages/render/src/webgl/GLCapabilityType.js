/**
 * GL Capabilities
 * Some capabilities can be smoothed out by extension, and some capabilities must use WebGL 2.0.
 * @enum {string}
 * */
export const GLCapabilityType = {
    shaderVertexID: "shaderVertexID",
    standardDerivatives: "OES_standard_derivatives",
    shaderTextureLod: "EXT_shader_texture_lod",
    elementIndexUint: "OES_element_index_uint",
    depthTexture: "WEBGL_depth_texture",
    drawBuffers: "WEBGL_draw_buffers",
    vertexArrayObject: "OES_vertex_array_object",
    instancedArrays: "ANGLE_instanced_arrays",
    multipleSample: "multipleSampleOnlySupportedInWebGL2",
    textureFloat: "OES_texture_float",
    textureFloatLinear: "OES_texture_float_linear",
    textureHalfFloat: "OES_texture_half_float",
    textureHalfFloatLinear: "OES_texture_half_float_linear",
    WEBGL_colorBufferFloat: "WEBGL_color_buffer_float",
    colorBufferFloat: "EXT_color_buffer_float",
    colorBufferHalfFloat: "EXT_color_buffer_half_float",
    textureFilterAnisotropic: "EXT_texture_filter_anisotropic",
    blendMinMax: "EXT_blend_minmax",

    astc: "WEBGL_compressed_texture_astc",
    astc_webkit: "WEBKIT_WEBGL_compressed_texture_astc",
    etc: "WEBGL_compressed_texture_etc",
    etc_webkit: "WEBKIT_WEBGL_compressed_texture_etc",
    etc1: "WEBGL_compressed_texture_etc1",
    etc1_webkit: "WEBKIT_WEBGL_compressed_texture_etc1",
    pvrtc: "WEBGL_compressed_texture_pvrtc",
    pvrtc_webkit: "WEBKIT_WEBGL_compressed_texture_pvrtc",
    s3tc: "WEBGL_compressed_texture_s3tc",
    s3tc_webkit: "WEBKIT_WEBGL_compressed_texture_s3tc",
    // atc: "WEBGL_compressed_texture_atc",
    // s3tc_srgb: "WEBGL_compressed_texture_s3tc_srgb"

    WEBGL_lose_context: "WEBGL_lose_context"
};