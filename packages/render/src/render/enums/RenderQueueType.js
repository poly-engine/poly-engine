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
