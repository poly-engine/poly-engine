const isArray = Array.isArray;
const objectKeys = Object.keys;

/**
 * @class Util
 * @static
 */
export class Util {
    // export function createUUID() {
    //     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    //         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    //     )
    // }
    static _lut = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'];

    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
    /**
     * 
     * @returns {string}
     */
    static createUUID() {
        const _lut = Util._lut;
        const d0 = Math.random() * 0xffffffff | 0;
        const d1 = Math.random() * 0xffffffff | 0;
        const d2 = Math.random() * 0xffffffff | 0;
        const d3 = Math.random() * 0xffffffff | 0;
        const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
            _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
            _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
            _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

        // .toLowerCase() here flattens concatenated strings to save heap memory space.
        return uuid.toLowerCase();
    }

    /**
     * Is this number a power of two.
     * @method
     * @param {Number} value - The input number.
     * @return {Boolean} - Is this number a power of two.
     */
    static isPowerOfTwo(value) {
        return (value & (value - 1)) === 0 && value !== 0;
    }
    /**
     * Return the nearest power of two number of this number.
     * @method
     * @param {Number} value - The input number.
     * @return {Number} - The result number.
     */
    static nearestPowerOfTwo(value) {
        return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
    }

    /**
     * Return the next power of two number of this number.
     * @method
     * @param {Number} value - The input number.
     * @return {Number} - The result number.
     */
    static nextPowerOfTwo(value) {
        value--;
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        value++;

        return value;
    }

    static deepCopy(val, dest) {
        if (!val) {
            dest = val;
        } else if (isArray(val)) {
            var length = val.length;
            for (var i = 0; i < length; i++)
                dest[i] = Util.deepCopy(val[i], dest[i]);
        } else if (ArrayBuffer.isView(val)) {
            dest.set(val);
        } else if (typeof val === 'object') {
            var keys = objectKeys(val);
            for (var i = keys.length - 1; i > -1; i--) {
                var key = keys[i];
                dest[key] = Util.deepCopy(val[key], dest[key]);
            }
        } else {
            dest = val;
        }
        return dest;
    }
    static deepClone(val) {
        if (!val) return val;
        if (isArray(val)) {
            var arr = [];
            var length = val.length;
            for (var i = 0; i < length; i++) arr.push(Util.deepClone(val[i]))
            return arr;
        } else if (ArrayBuffer.isView(val)) {
            if (val instanceof Buffer) {
                return Buffer.from(val);
            }
            return new val.constructor(val.buffer.slice(), val.byteOffset, val.length);
        } else if (typeof val === 'object') {
            var keys = objectKeys(val);
            var newObject = {};
            for (var i = keys.length - 1; i > -1; i--) {
                var key = keys[i];
                newObject[key] = Util.deepClone(val[key]);
            }
            return newObject;
        }
        return val;
    }
    static isPrimitive(value) {
        return value !== Object(value);
    }
    static deepEqual(val, dest) {
        if (!val && !dest) {
            return true;
        } else if (isArray(val)) {
            var length = val.length;
            if (!isArray(dest) || length !== dest.length)
                return false;
            for (var i = 0; i < length; i++)
                if (!Util.deepEqual(val[i], dest[i]))
                    return false;
        } else if (ArrayBuffer.isView(val)) {
            var length = val.length;
            if (!ArrayBuffer.isView(dest) || length !== dest.length)
                return false;
            for (let i = 0; i < length; i++) {
                if (val[i] !== dest[i])
                    return false;
            }
        } else if (typeof val === 'object') {
            if (typeof dest !== 'object')
                return false;
            var keys = objectKeys(val);
            var keys1 = objectKeys(dest);
            let length = keys.length;
            if (keys1.length !== length)
                return false;
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (!Util.deepEqual(val[key], dest[key]))
                    return false;
            }
        } else {
            if (val !== dest)
                return false;
        }
        return true;
    }

    /**
     * Get the values of an object.
     */
    static objectValues(obj) {
        return Object.keys(obj).map((key) => obj[key]);
    }
    static decodeText(array) {
        if (typeof TextDecoder !== "undefined") {
            return new TextDecoder().decode(array);
        }

        // TextDecoder polyfill
        let s = "";

        for (let i = 0, il = array.length; i < il; i++) {
            s += String.fromCharCode(array[i]);
        }

        return decodeURIComponent(encodeURIComponent(s));
    }

    /**
     * Judge whether the url is absolute url.
     */
    static isAbsoluteUrl(url) {
        return /^(?:http|blob|data:|\/)/.test(url);
    }

    static resolveAbsoluteUrl(baseUrl, relativeUrl) {
        if (Util.isAbsoluteUrl(relativeUrl)) {
            return relativeUrl;
        }

        const char0 = relativeUrl.charAt(0);
        if (char0 === ".") {
            return Util._formatRelativePath(relativeUrl + relativeUrl);
        }

        return baseUrl.substring(0, baseUrl.lastIndexOf("/") + 1) + relativeUrl;
    }

    static _stringToPath(string) {
        const result = [];
        if (string.charCodeAt(0) === charCodeOfDot) {
            result.push("");
        }
        string.replace(rePropName, (match, expression, quote, subString) => {
            let key = match;
            if (quote) {
                key = subString.replace(reEscapeChar, "$1");
            } else if (expression) {
                key = expression.trim();
            }
            result.push(key);
        });
        return result;
    }

    static _formatRelativePath(value) {
        const parts = value.split("/");
        for (let i = 0, n = parts.length; i < n; i++) {
            if (parts[i] == "..") {
                parts.splice(i - 1, 2);
                i -= 2;
            }
        }
        return parts.join("/");
    }

    
}