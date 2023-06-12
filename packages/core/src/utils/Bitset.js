const mod32 = 0x0000001f;
/**
 * @class BitSet
 */
export class BitSet {
    constructor(size = 1) {
        this.size = size;
        this.mask = new Uint32Array(size);
    }
    _grow(index) {
        if (index >= this.size) {
            const oldMask = this.mask;
            this.size = index + 1;
            // this.size = index;
            this.mask = new Uint32Array(this.size);
            this.mask.set(oldMask, 0);
        }
    }
    _resize(newSize) {
        if (newSize > this.size) {
            const oldMask = this.mask;
            this.size = newSize;
            // this.size = index;
            this.mask = new Uint32Array(this.size);
            this.mask.set(oldMask, 0);
        }
    }
    has(value) {
        const index = value >>> 5;
        if (index >= this.size) return false;
        return Boolean(this.mask[index] & (1 << (value & mod32)));
    }
    xor(value) {
        const index = value >>> 5;
        this._grow(index);
        this.mask[index] ^= 1 << (value & mod32);
        return this;
    }
    or(value) {
        const index = value >>> 5;
        this._grow(index);
        this.mask[index] |= 1 << (value & mod32);
        return this;
    }
    not(value) {
        const index = value >>> 5;
        this._grow(index);
        this.mask[index] &= ~(1 << (value & mod32));
        return this;
    }
    equals(other) {
        if (other.mask === this.mask) return true;
        let a = this.mask;
        let b = other.mask;
        return a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
    contains(other) {
        if (other.mask === this.mask) return true;
        for (let i = 0; i < other.mask.length; i++) {
            const a = this.mask[i] || 0;
            const b = other.mask[i];
            if ((a & b) !== b) return false;
        }
        return true;
    }
    intersects(other) {
        if (other.mask === this.mask) return true;
        const length = Math.min(this.mask.length, other.mask.length);
        for (let i = 0; i < length; i++) {
            const a = this.mask[i];
            const b = other.mask[i];
            if ((a & b) !== 0) return true;
        }
        return false;
    }
    union(other) {
        if (other.mask === this.mask) return;
        if (this.size < other.size)
            this._resize(other.size);
        for (let i = 0; i < this.size; i++) {
            const a = this.mask[i] || 0;
            const b = other.mask[i] || 0;
            this.mask[i] = a | b;
        }
    }
    clear() {
        this.mask.fill(0);
    }
    toString(radix = 16) {
        if (this.mask.length == 0) return '0';
        return this.mask.reduceRight((str, n) => str.concat(n.toString(radix)), '')
    }
    clone() {
        const set = new BitSet(this.size);
        set.mask.set(this.mask, 0);
        return set;
    }
    getValues(values) {
        values ??= [];
        for (let i = 0, l = this.mask.length; i < l; i++) {
            const bits = this.mask[i];
            for (let shift = 0; shift < 32; shift++) {
                if (bits & (1 << shift)) {
                    values.push(i << 5 | shift);
                }
            }
        }
        return values;
    }
    forEachValues(callback) {
        for (let i = 0, l = this.mask.length; i < l; i++) {
            const bits = this.mask[i];
            for (let shift = 0; shift < 32; shift++) {
                if (bits & (1 << shift)) {
                    callback(i << 5 | shift);
                }
            }
        }
    }

    static union2(out, set1, set2) {
        let size = Math.max(set1.size, set2.size);
        out._resize(size);
        for (let i = 0; i < out.size; i++) {
            const a = set1.mask[i] || 0;
            const b = set2.mask[i] || 0;
            out.mask[i] = a | b;
        }
    }

    static equals2(set1, set2){
        let size = Math.max(set1.size, set2.size);
        const m1 = set1.mask;
        const m2 = set2.mask;
        for (let i = 0; i < size; i++) {
            const a = m1[i] || 0;
            const b = m2[i] || 0;
            if (a !== b) return false;
        }
        return true;
    }
}