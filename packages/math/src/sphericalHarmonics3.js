import * as glMatrix from "./common.js";

/**
 * 3 Dimensional Vector
 * @module sh3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {shc3} a new 3D vector
 */
export function create() {
    let out = new glMatrix.ARRAY_TYPE(27);
    if (glMatrix.ARRAY_TYPE != Float32Array) {
        for (let i = 0; i < 27; i++)
            out[i] = 0;
    }
    return out;
}

/**
 * Creates a clone of this SphericalHarmonics3.
 * @param {sh3} a The first vector.
 * @returns {shc3} A clone of this SphericalHarmonics3
 */
export function clone(a) {
    const out = new glMatrix.ARRAY_TYPE(27);
    return copy(out, a);
}
/**
 * Creates a clone of this SphericalHarmonics3.
 * @param {sh3} out The first vector.
 * @param {sh3} a The first vector.
 * @returns {shc3} A clone of this SphericalHarmonics3
 */
export function copy(out, a) {
    for (let i = 0; i < 27; i++)
        out[i] = a[i];
    return out;
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {sh3} a The first vector.
 * @param {sh3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
export function exactEquals(a, b) {
    const len = a.length;
    for (let i = 0; i < len; i++)
        if (a[i] !== b[i])
            return false;
    return true;
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {sh3} a The first vector.
 * @param {sh3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
export function equals(a, b) {
    const len = a.length;
    for (let i = 0; i < len; i++) {
        const a0 = a[i];
        const b0 = b[i];
        if (Math.abs(a0 - b0) > glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)))
            return false;
    }
    return true;
}

/**
 * Add light to SphericalHarmonics3.
 * @param {sh3} coe - sh3
 * @param {vec3} direction - Light direction
 * @param {vec4} color - Light color
 * @param {number} deltaSolidAngle - The delta solid angle of the light
 */
export function addLight(coe, direction, color, deltaSolidAngle) {
    /**
     * Implements `EvalSHBasis` from [Projection from Cube maps] in http://www.ppsloan.org/publications/StupidSH36.pdf.
     *
     * Basis constants
     * 0: Math.sqrt(1/(4 * Math.PI))
     *
     * 1: -Math.sqrt(3 / (4 * Math.PI))
     * 2: Math.sqrt(3 / (4 * Math.PI))
     * 3: -Math.sqrt(3 / (4 * Math.PI))
     *
     * 4: Math.sqrt(15 / (4 * Math.PI))
     * 5: -Math.sqrt(15 / (4 * Math.PI))
     * 6: Math.sqrt(5 / (16 * Math.PI))
     * 7: -Math.sqrt(15 / (4 * Math.PI)）
     * 8: Math.sqrt(15 / (16 * Math.PI))
     */

    // vec4.scale(color, color, deltaSolidAngle)
    // color.scale(deltaSolidAngle);

    // const coe = this.coefficients;

    // const { _x: x, _y: y, _z: z } = direction;
    // const { r, g, b } = color;
    const x = direction[0];
    const y = direction[1];
    const z = direction[2];
    const r = color[0] * deltaSolidAngle;
    const g = color[1] * deltaSolidAngle;
    const b = color[2] * deltaSolidAngle;

    const bv0 = 0.282095; // basis0 = 0.886227
    const bv1 = -0.488603 * y; // basis1 = -0.488603
    const bv2 = 0.488603 * z; // basis2 = 0.488603
    const bv3 = -0.488603 * x; // basis3 = -0.488603
    const bv4 = 1.092548 * (x * y); // basis4 = 1.092548
    const bv5 = -1.092548 * (y * z); // basis5 = -1.092548
    const bv6 = 0.315392 * (3 * z * z - 1); // basis6 = 0.315392
    const bv7 = -1.092548 * (x * z); // basis7 = -1.092548
    const bv8 = 0.546274 * (x * x - y * y); // basis8 = 0.546274

    (coe[0] += r * bv0), (coe[1] += g * bv0), (coe[2] += b * bv0);

    (coe[3] += r * bv1), (coe[4] += g * bv1), (coe[5] += b * bv1);
    (coe[6] += r * bv2), (coe[7] += g * bv2), (coe[8] += b * bv2);
    (coe[9] += r * bv3), (coe[10] += g * bv3), (coe[11] += b * bv3);

    (coe[12] += r * bv4), (coe[13] += g * bv4), (coe[14] += b * bv4);
    (coe[15] += r * bv5), (coe[16] += g * bv5), (coe[17] += b * bv5);
    (coe[18] += r * bv6), (coe[19] += g * bv6), (coe[20] += b * bv6);
    (coe[21] += r * bv7), (coe[22] += g * bv7), (coe[23] += b * bv7);
    (coe[24] += r * bv8), (coe[25] += g * bv8), (coe[26] += b * bv8);

    // return coe;
}

/**
 * Evaluates the color for the specified direction.
 * @param {vec4} out - Out color
 * @param {sh3} coe - Out color
 * @param {vec3} direction - Specified direction
 * @returns {vec4} color
 */
export function evaluate(out, coe, direction) {
    /**
     * Equations based on data from: http://ppsloan.org/publications/StupidSH36.pdf
     *
     *
     * Basis constants
     * 0: Math.sqrt(1/(4 * Math.PI))
     *
     * 1: -Math.sqrt(3 / (4 * Math.PI))
     * 2: Math.sqrt(3 / (4 * Math.PI))
     * 3: -Math.sqrt(3 / (4 * Math.PI))
     *
     * 4: Math.sqrt(15 / (4 * Math.PI)）
     * 5: -Math.sqrt(15 / (4 * Math.PI))
     * 6: Math.sqrt(5 / (16 * Math.PI)）
     * 7: -Math.sqrt(15 / (4 * Math.PI)）
     * 8: Math.sqrt(15 / (16 * Math.PI)）
     *
     *
     * Convolution kernel
     * 0: Math.PI
     * 1: (2 * Math.PI) / 3
     * 2: Math.PI / 4
     */

    // const coe = this.coefficients;
    // const { _x: x, _y: y, _z: z } = direction;
    const x = direction[0];
    const y = direction[1];
    const z = direction[2];

    const bv0 = 0.886227; // kernel0 * basis0 = 0.886227
    const bv1 = -1.023327 * y; // kernel1 * basis1 = -1.023327
    const bv2 = 1.023327 * z; // kernel1 * basis2 = 1.023327
    const bv3 = -1.023327 * x; // kernel1 * basis3 = -1.023327
    const bv4 = 0.858086 * y * x; // kernel2 * basis4 = 0.858086
    const bv5 = -0.858086 * y * z; // kernel2 * basis5 = -0.858086
    const bv6 = 0.247708 * (3 * z * z - 1); // kernel2 * basis6 = 0.247708
    const bv7 = -0.858086 * z * x; // kernel2 * basis7 = -0.858086
    const bv8 = 0.429042 * (x * x - y * y); // kernel2 * basis8 = 0.429042

    // l0
    let r = coe[0] * bv0;
    let g = coe[1] * bv0;
    let b = coe[2] * bv0;

    // l1
    r += coe[3] * bv1 + coe[6] * bv2 + coe[9] * bv3;
    g += coe[4] * bv1 + coe[7] * bv2 + coe[10] * bv3;
    b += coe[5] * bv1 + coe[8] * bv2 + coe[11] * bv3;

    // l2
    r += coe[12] * bv4 + coe[15] * bv5 + coe[18] * bv6 + coe[21] * bv7 + coe[24] * bv8;
    g += coe[13] * bv4 + coe[16] * bv5 + coe[19] * bv6 + coe[22] * bv7 + coe[25] * bv8;
    b += coe[14] * bv4 + coe[17] * bv5 + coe[20] * bv6 + coe[23] * bv7 + coe[26] * bv8;

    // out.set(r, g, b, 1.0);
    out[0] = r;
    out[1] = g;
    out[2] = b;
    out[3] = 1.0;
    return out;
}

/**
 * Scale the coefficients.
 * @param {sh3} src
 * @param {number} s - The amount by which to scale the SphericalHarmonics3
 */
export function scale(src, s) {
    // const src = this.coefficients;

    (src[0] *= s), (src[1] *= s), (src[2] *= s);
    (src[3] *= s), (src[4] *= s), (src[5] *= s);
    (src[6] *= s), (src[7] *= s), (src[8] *= s);
    (src[9] *= s), (src[10] *= s), (src[11] *= s);
    (src[12] *= s), (src[13] *= s), (src[14] *= s);
    (src[15] *= s), (src[16] *= s), (src[17] *= s);
    (src[18] *= s), (src[19] *= s), (src[20] *= s);
    (src[21] *= s), (src[22] *= s), (src[23] *= s);
    (src[24] *= s), (src[25] *= s), (src[26] *= s);
}

