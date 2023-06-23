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
