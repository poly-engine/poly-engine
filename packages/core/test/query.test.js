import { World } from "../src";
// import * as testModule from "./testModule";
import { TestModule } from "./TestModule1";

/** @type {World} */
let world;
let entityManager;
// let compManager;
let queryManager;
let com_1, com_2, com_3, com_4, com_5;

beforeAll(() => {
    world = new World();
    world.moduleManager.addModule(TestModule, { value: 100 });
    entityManager = world.entityManager;
    // compManager = world.componentManager;
    queryManager = world.queryManager;

    com_1 = entityManager.getComponentId('com_1');
    com_2 = entityManager.getComponentId('com_2');
    com_3 = entityManager.getComponentId('com_3');
    com_4 = entityManager.getComponentId('com_4');
    com_5 = entityManager.getComponentId('com_5');

});
afterAll(() => {
    world.destroy();
});

describe('archetype / query', () => {
    it('archetype / query', () => {
        // const com_1 = compManager.com_1;
        // const com_2 = compManager.com_2;
        // const com_3 = compManager.com_3;

        const arch1 = entityManager.getArchetype(com_1);
        const arch12 = entityManager.getArchetype(com_1, com_2);
        const arch123 = entityManager.getArchetype(com_1, com_2, com_3);
        const arch23 = entityManager.getArchetype(com_3, com_2);
        const arch3 = entityManager.getArchetype(com_3);

        const query1 = queryManager.createQuery({ all: [com_1] });
        const query12 = queryManager.createQuery({ all: [com_1, com_2] });
        const query123 = queryManager.createQuery({ all: [com_1, com_2, com_3] });
        const query12_3 = queryManager.createQuery({ all: [com_1, com_2], none: [com_3] });

        const e1 = entityManager.createEntity();
        entityManager.setComponent(e1, com_1);
        expect(entityManager.getEntityArchetype(e1)).toEqual(arch1);
        expect(query1.archetypes.includes(arch1)).toBe(true);

        entityManager.setComponent(e1, com_2);
        expect(entityManager.getEntityArchetype(e1).id).toEqual(arch12.id);
        expect(query1.archetypes.includes(arch12)).toBe(true);
        expect(query12.archetypes.includes(arch12)).toBe(true);
        expect(query12_3.archetypes.includes(arch12)).toBe(true);

        entityManager.setComponent(e1, com_3);
        expect(entityManager.getEntityArchetype(e1).id).toEqual(arch123.id);
        expect(query1.archetypes.includes(arch123)).toBe(true);
        expect(query12.archetypes.includes(arch123)).toBe(true);
        expect(query123.archetypes.includes(arch123)).toBe(true);
        expect(query12_3.archetypes.includes(arch123)).toBe(false);

        entityManager.removeComponent(e1, com_1);
        expect(entityManager.getEntityArchetype(e1).id).toEqual(arch23.id);
        entityManager.removeComponent(e1, com_2);
        expect(entityManager.getEntityArchetype(e1).id).toEqual(arch3.id);
        entityManager.removeComponent(e1, com_3);
        expect(entityManager.getEntityArchetype(e1).id).toBe(0);
    });
});
