/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
export const EPSILON = 0.000001;
export let ARRAY_TYPE =
  typeof Float32Array !== "undefined" ? Float32Array : Array;
export let RANDOM = Math.random;
export let ANGLE_ORDER = "zyx";

/**
 * Symmetric round
 * see https://www.npmjs.com/package/round-half-up-symmetric#user-content-detailed-background
 *
 * @param {Number} a value to round
 */
export function round(a) {
  if (a >= 0)
    return Math.round(a);

  return (a % 0.5 === 0) ? Math.floor(a) : Math.round(a);
}

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */
export function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}

const degree = Math.PI / 180;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
export function toRadian(a) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
export function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

/**
 * Clamps the specified value.
 * @param {Number} v - The specified value
 * @param {Number} min - The min value
 * @param {Number} max - The max value
 * @returns {Number} The result of clamping a value between min and max
 */
export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

const radToDegreeFactor = 180 / Math.PI;
/** The conversion factor that degree to radian. */
const degreeToRadFactor = Math.PI / 180;

/**
 * Modify the specified r from radian to degree.
 * @param {Number} r - The specified r
 * @returns {Number} The degree value
 */
export function radianToDegree(r) {
  return r * radToDegreeFactor;
}

/**
 * Modify the specified d from degree to radian.
 * @param {Number} d - The specified d
 * @returns {Number} The radian value
 */
export function degreeToRadian(d) {
  return d * degreeToRadFactor;
}