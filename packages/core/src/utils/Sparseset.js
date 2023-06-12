/**
 * @class SparseSet
 */
export class SparseSet {
    constructor() {
        /**
         * @type {number[]}
         */
        this.values = [];
        /**
         * @type {number[]}
         */
        this.indices = [];
    }
    /**
     * @method
     * @param {number} x 
     * @returns {boolean}
     */
    has(x) {
        return this.indices[x] < this.values.length && this.values[this.indices[x]] === x;
    }
    /**
     * @method
     * @param {number} x 
     */
    add(x) {
        if (this.has(x)) return;
        this.indices[x] = this.values.length;
        this.values.push(x);
    }
    /**
     * @method
     * @param {number} x 
     */
    remove(x) {
        if (this.has(x)) {
            const last = this.values.pop();
            if (x !== last) {
                const index = this.indices[x];
                this.indices[last] = index;
                this.values[index] = last;
            }
        }
    }
    indexOf(x) {
        return this.indices[x];
    }
    /**
     * @method
     */
    clear() {
        this.values.length = 0;
        this.indices.length = 0;
    }
}
