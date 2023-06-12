import { CloneManager } from "../src/utils/CloneManager.js";
import { Util } from "../src/utils/Util.js";


describe('util', () => {
    it('clone', () => {
        let comp = {
            num: 1,
            str: 'huo',
            array: [1, 2],
            // f32: new Float32Array([10, 20]),
            obj: {
                num: 1
            },
            entity: -1
        }
        let comp1 = Util.deepClone(comp);
        expect(comp).toEqual(comp1);

        comp1 = Util.deepCopy({ array: [2, 3] }, comp1);
        expect(comp1.array).toEqual([2, 3]);

        comp1 = Util.deepCopy(comp, comp1);
        expect(comp).toEqual(comp1);

        // let f32 = new Float32Array([3, 4]);
        // comp = util.deepCopy({ f32: f32 }, comp);
        // f32[0] = 5;
        // expect(comp.f32[0]).toBe(3);

    })
    it('schema', () => {
        const cloneManager = new CloneManager();

        let schema = {
            num: { type: 'number', default: -1 },
            ent: { type: 'entity', default: -1 },
            // vec3: { type: 'vec3', default: [1, 2, 3] },
            obj: {
                type: 'object', default: {}, schema: {
                    obj_str: { type: 'string', default: 'huo' }
                }
            },
            navtiveObj: {
                type: 'object', default: {}
            },
            array1: {
                type: 'array', default: [0, 0, 0], value: {
                    type: 'number', default: 0
                }
            },
            arrayObj: {
                type: 'array', default: [{}, {}], value: {
                    type: 'object', default: {}, schema: {
                        ao_str: { type: 'string', default: 'a' }
                    }
                }
            },
            // map: {
            //     type: 'map', default: {}, 
            //     key:{
            //         type: 'object', default: null, schema: {
            //             key_str: { type: 'string', default: 'key' }
            //         }
            //     },
            //     value: {
            //         type: 'object', default: {}, schema: {
            //             value_str: { type: 'string', default: 'value' }
            //         }
            //     }
            // },

        };
        let comp = cloneManager.createObj(schema);
        expect(comp.obj.obj_str).toEqual('huo');
        expect(comp.arrayObj[1].ao_str).toEqual('a');

        comp.obj = undefined;
        comp = cloneManager.createObj(schema, comp);
        expect(comp.obj.obj_str).toEqual('huo');

        let json = {
            ent: 2,
            obj: { obj_str: 'dian' },
            // vec3: [2, 3, 4],
            array1: [2, 3, 4],
            arrayObj: [{ ao_str: 'b' }, { ao_str: 'c' }]
        }
        let context = {
            entMap: [3, 2, 1, 0],
        }
        comp = cloneManager.loadObjFromJson(schema, comp, json, context);
        expect(comp.obj.obj_str).toEqual('dian');
        expect(comp.ent).toBe(context.entMap[2]);

        let json1 = cloneManager.saveObjToJson(schema, comp, context);
        console.log(JSON.stringify(json1));
        expect(json).toEqual(json1);
    })
})
