import { World } from "../src";
// import * as testModule from "./testModule";
import { TestModule } from "./TestModule1";

/** @type {World} */
let world;
let em;
// let compManager;

beforeAll(() => {
    world = new World();
    world.moduleManager.addModule(TestModule, { value: 100 });

    em = world.entityManager;
    // compManager = world.componentManager;
});
afterAll(() => {
    world.destroy();
});

describe('component', () => {
    it('registerComponent', () => {
        // let comp1Store = compManager.com_1;
        const compId = em.getComponentId('com_1');
        const compName = em.getComponentName(compId);
        expect(compName).toBe('com_1');
    });
    it('setComponent / removeComponent', () => {
        const com_1 = em.getComponentId('com_1');
        // let com_1 = compManager.com_1;
        // let comp1Store = world.getComponentStore("com_1");
        const e = em.createEntity();

        em.setComponent(e, com_1);
        expect(em.hasComponent(e, com_1)).toBeTruthy;

        let comp1 = em.getComponent(e, com_1);
        expect(comp1.value).toBe(5);
        // expect(com_1.toJson(comp1)).toEqual({ value: 5 });
        comp1.value = 6;

        em.removeComponent(e, com_1);
        expect(em.hasComponent(e, com_1)).toBeFalsy;
        expect(comp1.value).toBe(5);

        let comp2 = em.setComponent(e, com_1);
        expect(comp1).toEqual(comp2);

        let comp3 = em.setComponent(e, com_1, em.createComponent(com_1, 12));
        expect(comp3).not.toEqual(comp2);
        expect(em.getComponent(e, com_1).value).toBe(12);

        comp3 = em.setComponent(e, com_1, em.componentFromJson(com_1, { value: 13 }));
        expect(em.getComponent(e, com_1).value).toBe(13);

        em.removeComponent(e, com_1);
        expect(em.hasComponent(e, com_1)).toBeFalsy;

        world.update(1);
        expect(em.hasEntity(e)).toBeFalsy();
    });
    it('component pool', () => {
        // let com_1 = compManager.com_1;
        const com_1 = em.getComponentId('com_1');

        const e1 = em.createEntity();
        let comp1 = em.setComponent(e1, com_1);
        let comp2 = em.setComponent(e1, com_1, em.createComponent(com_1, 12));

        const e2 = em.createEntity();
        let comp3 = em.setComponent(e2, com_1);
        expect(comp1).toEqual(comp3);
    });
    it('buffer component', () => {
        const com_1 = em.getComponentId('com_1');
        const com_2 = em.getComponentId('com_2');
        // const com_1 = compManager.com_1;
        // const com_2 = compManager.com_2;

        const e2 = em.createEntity(com_1, com_2);
        // let buf2 = com_2.get(e2);
        let buf2 = em.getComponent(e2, com_2);
        expect(buf2.length).toBe(0);

        buf2.add(em.createComponent(com_2, 'dian'));
        expect(buf2.get(0).str).toBe('dian');
        buf2.add(em.componentFromJson(com_2, { str: 'yan' }));
        expect(buf2.get(1).str).toBe('yan');

        expect(em.componentToJson(com_2, buf2)).toEqual([{ str: 'dian' }, { str: 'yan' }]);

        let buf3 = em.componentFromJson(com_2, [{ str: 'a' }, { str: 'b' }]);
        em.setComponent(e2, com_2, buf3);
        buf2 = em.getComponent(e2, com_2);
        // buf2 = com_2.get(e2);
        expect(buf2.get(1).str).toBe('b');
    });
    it('buffer pool', () => {
        // const com_2 = compManager.com_2;
        const com_2 = em.getComponentId('com_2');

        const e1 = em.createEntity(com_2);
        let buf1 = em.getComponent(e1, com_2);
        buf1.add(em.createComponent(com_2, 'dian'));
        let comp1 = buf1.get(0);
        expect(comp1.str).toBe('dian');

        em.removeComponent(e1, com_2);
        let buf2 = em.setComponent(e1, com_2);
        let comp2 = buf2.add();

        expect(comp1).toEqual(comp2);
        expect(comp1).toEqual(comp2);
        expect(comp2.str).toBe('huo');
    });
    it('shared component', () => {
        // const com_4 = compManager.com_4;
        const com_4 = em.getComponentId('com_4');

        const e1 = em.createEntity(com_4);
        let comp1 = em.getComponent(e1, com_4);
        console.log(comp1.id);
        expect(comp1.id).toBeDefined();
        expect(em.getSharedComponent(com_4, comp1.id)).toEqual(comp1);
        // expect(com_4.getShared(comp1.id)).toEqual(comp1);
    });
    it('group component', () => {
        const com_5 = em.getComponentId('com_5');
        const com_groupData1 = em.getComponentId('com_groupData1');
        const com_groupData2 = em.getComponentId('com_groupData2');

        const e1 = em.createEntity(com_5, com_groupData1);
        let compId = em.getComponentIdByGroup(e1, com_5);
        expect(compId).toBe(com_groupData1);

        em.setComponent(e1, com_groupData2);
        expect(em.hasComponent(e1, com_groupData1)).toBe(false);
        // expect(entityManager.getSharedComponent(com_4, comp1.id)).toEqual(comp1);
        // expect(com_4.getShared(comp1.id)).toEqual(comp1);
    });
    it('event component', () => {
        const com_1 = em.getComponentId('com_1');
        const testEventCom = em.getComponentId('TestEvent0');

        const e1 = em.createEntity(com_1, testEventCom);

        world.update(1);
        expect(em.hasComponent(e1, testEventCom)).toBe(false);
    });
});
