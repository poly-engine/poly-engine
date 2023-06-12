import { SparseSet } from "../src";

describe('SparseSet', () => {
    it('has 0', () => {
        const set = new SparseSet();
        set.add(0);
        expect(set.has(0)).toBeTruthy();
    })

    it('has not 0', () => {
        const set = new SparseSet();
        expect(set.has(0)).toBeFalsy();
    })

    it('has no longer 0', () => {
        const set = new SparseSet();
        set.add(0);
        set.remove(0);
        expect(set.has(0)).toBeFalsy();
    })
})