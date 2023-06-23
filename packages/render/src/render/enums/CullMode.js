/**
 * Culling mode.
 * @enum {number}
 * @remarks specifies whether or not front- and/or back-facing polygons can be culled.
 */
export const CullMode = {
  /** Disable culling. */
  Off: 0,
  /** cut the front-face of the polygons. */
  Front: 1,
  /** cut the back-face of the polygons. */
  Back: 2
}
