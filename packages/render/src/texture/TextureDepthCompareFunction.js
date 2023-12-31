/**
 * Define the compare mode of depth texture.
 */
export const TextureDepthCompareFunction = {
  /** never pass. */
  Never: 0,
  /** pass if the compare value is less than the sample value. */
  Less: 1,
  /** pass if the compare value equals the sample value. */
  Equal: 2,
  /** pass if the compare value is less than or equal to the sample value. */
  LessEqual: 3,
  /** pass if the compare value is greater than the sample value. */
  Greater: 4,
  /** pass if the compare value is not equal to the sample value. */
  NotEqual: 5,
  /** pass if the compare value is greater than or equal to the sample value. */
  GreaterEqual: 6,
  /** always pass. */
  Always: 7
}
