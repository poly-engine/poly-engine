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
                com_5: {},
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
    it('copy data', () => {
        const e = entityManager.createEntity();
        let prefabData = [
            {
                com_1: { value: 1, entity: 1 }
            },
            {
                com_1: { value: 2, entity: 2 },
                com_2: [{ str: '1' }, { str: '2' }],
            },
            {
                com_1: { value: 3 },
                com_2: [{ str: '3' }],
            }
        ];
        let sceneData = [
            {
                com_5: {},
            },
            {
                com_5: {},
            },
            {
                com_5: {},
            }
        ];

        let toEnts = entityManager.copyEntityDatas(null, prefabData, sceneData);
        // console.log(JSON.stringify(sceneData));
        expect(toEnts).toEqual([3, 4, 5]);

        const prefabData1 = [];
        toEnts = entityManager.copyEntityDatas(toEnts, sceneData, prefabData1);
        expect(toEnts).toEqual([0, 1, 2]);

        expect(prefabData1).toEqual(prefabData);

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
