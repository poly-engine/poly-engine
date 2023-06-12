import { SparseSet, World } from "../src";
// import * as testModule from "./testModule";
import { TestModule } from "./TestModule1";

/** @type {World} */
let world;
let entityManager;
// let compManager;
let com_1, com_2, com_3, com_4, com_5;

beforeAll(() => {
    world = new World();
    world.moduleManager.addModule(TestModule, { value: 100 });

    entityManager = world.entityManager;
    // compManager = world.componentManager;

    com_1 = entityManager.getComponentId('com_1');
    com_2 = entityManager.getComponentId('com_2');
    com_3 = entityManager.getComponentId('com_3');
    com_4 = entityManager.getComponentId('com_4');
    com_5 = entityManager.getComponentId('com_5');
});
afterAll(() => {
    world.destroy();
});

describe('entity', () => {
    it('createEntity', () => {
        const e = entityManager.createEntity();
        expect(entityManager.hasEntity(e)).toBeTruthy();
    });
    it('destroyEntity', () => {
        const e = entityManager.createEntity();
        entityManager.destroyEntity(e);
        expect(entityManager.hasEntity(e)).toBeFalsy();
    });
    it('json', () => {
        const e = entityManager.createEntity();
        let json = [
            {
                com_1: { value: 1, entity: 1 }
            },
            {
                com_1: { value: 2, entity: 2 },
                com_2: [{ str: '1' }, { str: '2' }],
                com_4: { id: 'uuid_1', array: [1, 2, 3] },
            },
            {
                com_2: [{ str: '3' }],
                com_4: { id: 'uuid_1', array: [1, 2, 3] },
                com_5: { },
            }
        ];
        let ents = entityManager.entitiesFromJson(json);
        let comp = entityManager.getComponent(ents[0], com_1);
        expect(comp.value).toBe(1);
        expect(comp.entity).toBe(ents[1]);
        comp = entityManager.getComponent(ents[1], com_1);
        expect(comp.value).toBe(2);
        expect(comp.entity).toBe(ents[2]);

        expect(entityManager.getComponent(ents[1], com_2).length).toBe(2);
        expect(entityManager.getComponent(ents[1], com_2).get(1).str).toBe('2');
        expect(entityManager.getComponent(ents[2], com_2).get(0).str).toBe('3');
        // expect(entityManager.getComponent(ents[2], com_5)).toBe(true);

        expect(entityManager.getComponent(ents[1], com_4).array).toEqual([1, 2, 3]);

        ents.forEach((ent) => {
            entityManager.setComponent(ent, com_3);
        });
        let prefab1 = entityManager.entitiesToJson(ents);
        console.log(JSON.stringify(prefab1));
        expect(prefab1).toEqual(json);

    });
    it('prefab', () => {
        const e = entityManager.createEntity();
        let json = {
            stores: ['com_1', 'com_2', 'com_4', 'com_5'],
            ents: [
                [0, 0],
                [0, 1, 1, 0, 2, 0],
                [1, 1, 2, 0, 3, 0]
            ],
            comps: [
                [{ value: 1, entity: 1 }, { value: 2, entity: 2 }],
                [[{ str: '1' }, { str: '2' }], [{ str: '3' }]],
                [{ id: 'uuid_1', array: [1, 2, 3] }],
                [],
            ]
        };
        let ents = entityManager.createEntitiesFromPrefab(json);
        let comp = entityManager.getComponent(ents[0], com_1);
        expect(comp.value).toBe(1);
        expect(comp.entity).toBe(ents[1]);
        comp = entityManager.getComponent(ents[1], com_1);
        expect(comp.value).toBe(2);
        expect(comp.entity).toBe(ents[2]);

        expect(entityManager.getComponent(ents[1], com_2).length).toBe(2);
        expect(entityManager.getComponent(ents[1], com_2).get(1).str).toBe('2');
        expect(entityManager.getComponent(ents[2], com_2).get(0).str).toBe('3');
        // expect(entityManager.getComponent(ents[2], com_5)).toBe(true);

        expect(entityManager.getComponent(ents[1], com_4).array).toEqual([1, 2, 3]);

        ents.forEach((ent) => {
            entityManager.setComponent(ent, com_3);
        });

        let prefab1 = entityManager.createPrefabFromEntities(ents);
        // console.log(JSON.stringify(prefab1));
        expect(prefab1).toEqual(json);

        let ents1 = entityManager.createEntitiesFromPrefab(json);
        let prefab2 = entityManager.createPrefabFromEntities(entityManager.entities);
        // console.log(JSON.stringify(prefab2));
    });
});
// function createPrefab(entities) {
//     let ents = [];
//     let stores = [];
//     let comps = [];
//     // let entSet = new SparseSet();
//     let compStores = [];
//     let compStoreSet = new SparseSet();
//     let sharedRefs = [];
//     let ent = 0;
//     for (let i = 0, l = entities.length; i < l; i++) {
//         let entity = entities[i];
//         // entSet.add(ent);
//         let entComps = [];
//         let archetype = world.getEntityArchetype(entity);
//         if (archetype.compIds.length === 0)
//             continue;
//         archetype.compIds.forEach((compId) => {
//             let compStore = world.getCompStore(compId);
//             let has = compStoreSet.has(compId);
//             compStoreSet.add(compId);
//             let index = compStoreSet.indexOf(compId);
//             entComps.push(index);
//             if (!has) {
//                 comps[index] = [];
//                 compStores[index] = compStore;
//                 sharedRefs[index] = {};
//             }
//             let compDatas = comps[index];
//             let sharedRef = sharedRefs[index];
//             let dataIndex = compDatas.length;
//             if(!compStore.isTag){
//                 let comp = compStore.get(entity);
//                 // compDatas.push(compStore.toJson(comp));
//                 // comps[index][ent] = compStore.toJson(comp);
//                 if(compStore.type === ComponentType.Shared){
//                     let refIndex = sharedRef[comp.id];
//                     if(refIndex === undefined){
//                         refIndex = compDatas.length;
//                         compDatas.push(compStore.toJson(comp));
//                         sharedRef[comp.id] = refIndex;
//                     }
//                     dataIndex = refIndex;
//                 }
//                 else
//                     compDatas.push(compStore.toJson(comp));
//             }
//             entComps.push(dataIndex);
//         });
//         ents.push(entComps);
//         ent++;
//     }
//     stores = compStores.map((store) => store.name);
//     return { stores, ents, comps };
// }
// function createEntities(prefab) {
//     let ents = prefab.ents;
//     let stores = prefab.stores;
//     let comps = prefab.comps;
//     let entMap = ents.map((ent) => world.createEntity());
//     let compStoreMap = stores.map((compName) => world.getCompStore(compName));
//     let context = { entMap: entMap };

//     for (let i = 0, l = ents.length; i < l; i++) {
//         let ent = entMap[i];
//         // ents[i].forEach((cid) => {
//         //     let compStore = compStoreMap[cid];
//         //     if (compStore.isTag)
//         //         world.setComponent(ent, compStore);
//         //     else {
//         //         let comp = compStore.fromJson(comps[cid][i], context);
//         //         world.setComponent(ent, compStore, comp);
//         //     }
//         // });
//         let entComps = ents[i];
//         for(let j = 0, jl = entComps.length;j<jl;j++){
//             let cid = entComps[j];
//             let cindex = entComps[++j];
//             let compStore = compStoreMap[cid];
//             if (compStore.isTag)
//                 world.setComponent(ent, compStore);
//             else {
//                 let comp = compStore.fromJson(comps[cid][cindex], context);
//                 world.setComponent(ent, compStore, comp);
//             }
//         }
//     }
//     return entMap;
// }