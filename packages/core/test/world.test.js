import { World } from "../src";
// import * as testModule from "./testModule";
import { TestModule } from "./TestModule1";

/** @type {World} */
let world;

beforeAll(() => {
    world = new World();
    world.moduleManager.addModule(TestModule, { value: 100 });
});
afterAll(() => {
    world.destroy();
});

describe('world', () => {
    it('module', () => {
        const mod_test = world.moduleManager.getModule('TestModule');
        expect(mod_test.settings.value).toBe(100);
    });
});