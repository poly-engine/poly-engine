
export class ColorUtil {
    /**
     * Modify a value from the gamma space to the linear space.
     * @param value - The value in gamma space
     * @returns The value in linear space
     */
    static gammaToLinearSpace(value) {
        // https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_framebuffer_sRGB.txt
        // https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_texture_sRGB_decode.txt

        if (value <= 0.0) return 0.0;
        else if (value <= 0.04045) return value / 12.92;
        else if (value < 1.0) return Math.pow((value + 0.055) / 1.055, 2.4);
        else return Math.pow(value, 2.4);
    }

    /**
     * Modify a value from the linear space to the gamma space.
     * @param value - The value in linear space
     * @returns The value in gamma space
     */
    static linearToGammaSpace(value) {
        // https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_framebuffer_sRGB.txt
        // https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_texture_sRGB_decode.txt

        if (value <= 0.0) return 0.0;
        else if (value < 0.0031308) return 12.92 * value;
        else if (value < 1.0) return 1.055 * Math.pow(value, 0.41666) - 0.055;
        else return Math.pow(value, 0.41666);
    }
}