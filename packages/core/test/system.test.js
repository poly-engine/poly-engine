import { World } from "../src";
// import * as testModule from "./testModule";
import { TestModule } from "./TestModule1";

/** @type {World} */
let world;
let entityManager;
// let compManager;
let systemManager;
let com_1, com_2, com_3, com_4, com_5;

beforeAll(() => {
    world = new World();
    world.moduleManager.addModule(TestModule, { value: 100 });
    entityManager = world.entityManager;
    // compManager = world.componentManager;
    systemManager = world.systemManager;
    com_1 = entityManager.getComponentId('com_1');
    com_2 = entityManager.getComponentId('com_2');
    com_3 = entityManager.getComponentId('com_3');
    com_4 = entityManager.getComponentId('com_4');
    com_5 = entityManager.getComponentId('com_5');
});
afterAll(() => {
    world.destroy();
});

describe('system', () => {
    it('system', () => {
        // const com_1 = compManager.com_1;
        // const com_2 = compManager.com_2;
        // const com_3 = compManager.com_3;
        const arch12 = entityManager.getArchetype(com_1, com_2);
        const arch123 = entityManager.getArchetype(com_1, com_2, com_3);

        const e2 = entityManager.createEntity(com_1, com_2);

        expect(arch12.entitySet.has(e2)).toBeTruthy();
        expect(arch123.entitySet.has(e2)).toBeFalsy();

        const sys_add3 = systemManager.getSystem('Add3System');
        const sys_remove3 = systemManager.getSystem('Remove3System');
        sys_add3.update(1);
        expect(arch12.entitySet.has(e2)).toBeFalsy();
        expect(arch123.entitySet.has(e2)).toBeTruthy();

        entityManager.destroyEntity(e2);
        expect(entityManager.hasComponent(e2, com_3)).toBeTruthy();

        expect(entityManager.getSingletonEntity(com_3)).toBe(e2);

        sys_remove3.update(1);

        world.update(1);
        expect(entityManager.hasEntity(e2)).toBeFalsy();
    });
});
