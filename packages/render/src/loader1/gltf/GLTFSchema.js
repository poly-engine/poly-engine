
/**
 * The datatype of the components in the attribute
 */
export const AccessorComponentType = {
  /**
   * Byte
   */
  BYTE: 5120,
  /**
   * Unsigned Byte
   */
  UNSIGNED_BYTE: 5121,
  /**
   * Short
   */
  SHORT: 5122,
  /**
   * Unsigned Short
   */
  UNSIGNED_SHORT: 5123,
  /**
   * Unsigned Int
   */
  UNSIGNED_INT: 5125,
  /**
   * Float
   */
  FLOAT: 5126
}

/**
 * Specifies if the attirbute is a scalar, vector, or matrix
 */
export const AccessorType = {
  /**
   * Scalar
   */
  SCALAR: "SCALAR",
  /**
   * Vector2
   */
  VEC2: "VEC2",
  /**
   * Vector3
   */
  VEC3: "VEC3",
  /**
   * Vector4
   */
  VEC4: "VEC4",
  /**
   * Matrix2x2
   */
  MAT2: "MAT2",
  /**
   * Matrix3x3
   */
  MAT3: "MAT3",
  /**
   * Matrix4x4
   */
  MAT4: "MAT4"
}

/**
 * The name of the node's TRS property to modify, or the weights of the Morph Targets it instantiates
 */
export const AnimationChannelTargetPath = {
  /**
   * Translation
   */
  TRANSLATION: "translation",
  /**
   * Rotation
   */
  ROTATION: "rotation",
  /**
   * Scale
   */
  SCALE: "scale",
  /**
   * Weights
   */
  WEIGHTS: "weights"
}

/**
 * Interpolation algorithm
 */
export const AnimationSamplerInterpolation = {
  /**
   * The animated values are linearly interpolated between keyframes
   */
  Linear: "LINEAR",
  /**
   * The animated values remain constant to the output of the first keyframe, until the next keyframe
   */
  Step: "STEP",
  /**
   * The animation's interpolation is computed using a cubic spline with specified tangents
   */
  CubicSpine: "CUBICSPLINE"
}

/**
 * A camera's projection.  A node can reference a camera to apply a transform to place the camera in the scene
 */
export const CameraType = {
  /**
   * A perspective camera containing properties to create a perspective projection matrix
   */
  PERSPECTIVE: "perspective",
  /**
   * An orthographic camera containing properties to create an orthographic projection matrix
   */
  ORTHOGRAPHIC: "orthographic"
}

/**
 * The mime-type of the image
 */
export const ImageMimeType = {
  /**
   * JPEG Mime-type
   */
  JPEG: "image/jpeg",
  /**
   * PNG Mime-type
   */
  PNG: "image/png"
}

/**
 * The alpha rendering mode of the material
 */
export const MaterialAlphaMode = {
  /**
   * The alpha value is ignored and the rendered output is fully opaque
   */
  OPAQUE: "OPAQUE",
  /**
   * The rendered output is either fully opaque or fully transparent depending on the alpha value and the specified alpha cutoff value
   */
  MASK: "MASK",
  /**
   * The alpha value is used to composite the source and destination areas. The rendered output is combined with the background using the normal painting operation (i.e. the Porter and Duff over operator)
   */
  BLEND: "BLEND"
}

/**
 * Magnification filter.  Valid values correspond to WebGL enums: 9728 (NEAREST) and 9729 (LINEAR)
 */
export const TextureMagFilter = {
  /**
   * Nearest
   */
  NEAREST: 9728,
  /**
   * Linear
   */
  LINEAR: 9729
}

/**
 * Minification filter.  All valid values correspond to WebGL enums
 */
export const TextureMinFilter = {
  /**
   * Nearest
   */
  NEAREST: 9728,
  /**
   * Linear
   */
  LINEAR: 9729,
  /**
   * Nearest Mip-Map Nearest
   */
  NEAREST_MIPMAP_NEAREST: 9984,
  /**
   * Linear Mipmap Nearest
   */
  LINEAR_MIPMAP_NEAREST: 9985,
  /**
   * Nearest Mipmap Linear
   */
  NEAREST_MIPMAP_LINEAR: 9986,
  /**
   * Linear Mipmap Linear
   */
  LINEAR_MIPMAP_LINEAR: 9987
}

/**
 * S (U) wrapping mode.  All valid values correspond to WebGL enums
 */
export const TextureWrapMode = {
  /**
   * Clamp to Edge
   */
  CLAMP_TO_EDGE: 33071,
  /**
   * Mirrored Repeat
   */
  MIRRORED_REPEAT: 33648,
  /**
   * Repeat
   */
  REPEAT: 10497
}
