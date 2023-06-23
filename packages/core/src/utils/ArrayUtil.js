
/**
 * @class ArrayUtil
 */
export class ArrayUtil {
    /**
     * 
     * @param {Array} from 
     * @param {Array} to 
     * @returns {Array}
     */
    static copy(from, to) {
        to ??= [];
        for (let i = 0, l = from.length; i < l; i++) {
            to[i] = from[i];
        }
        return to;
    }

    static fill(out, size, value = 0) {
        out ??= [];
        for (let i = 0; i < size; i++)
            out[i] = value;
        return out;
    }
}