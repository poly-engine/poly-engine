
/**
 * @class CompBuffer
 */
export class CompBuffer {
    get length() {
        return this.array.length;
    }
    constructor(store) {
        /** @type {CompStore} */
        this.store = store;
        this.array = [];
    }
    add(comp, index) {
        comp ??= this.store.create();
        if (index === undefined)
            this.array.push(comp);
        else {
            this.array.splice(index, 0, comp);
        }
        return comp;
    }
    add1(index, comp, ...args) {
        comp ??= this.store.create(...args);
        if (index === -1)
            this.array.push(comp);
        else {
            this.array.splice(index, 0, comp);
        }
        return comp;
    }
    removeAt(index) {
        if (index >= this.array.length)
            return;
        let comp = this.array[index];
        if (comp != undefined)
            this.store._destroy(comp);
        this.array.splice(index, 1);
    }
    set(index, comp) {
        let oldComp = this.array[index];
        if (oldComp != undefined)
            this.store._destroy(oldComp);
        comp ??= this.store.create();
        this.array[index] = comp;
    }
    get(index) {
        return this.array[index];
    }
    clear() {
        for (let i = 0, l = this.array.length; i < l; i++) {
            let comp = this.array[i];
            if (comp != undefined)
                this.store._destroy(comp);
        }
        this.array.length = 0;
    }
    findIndex(predicate) {
        return this.array.findIndex(predicate);
    }
    find(predicate) {
        return this.array.find(predicate);
    }
}