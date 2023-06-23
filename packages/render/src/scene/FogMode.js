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