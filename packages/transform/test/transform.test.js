import { World } from "@poly-engine/core";
import { mat4, quat, vec3 } from "@poly-engine/math";
import { TransformModule } from "../src/index.js";

/** @type {World} */
let world;
// let compManager;
let em;
let systemManager;
let moduleManager;
let transformManager;
let com_transform, com_localToWorld, com_parent;

beforeAll(() => {
    world = new World();
    // compManager = world.componentManager;
    em = world.entityManager;
    systemManager = world.systemManager;
    moduleManager = world.moduleManager;

    moduleManager.addModule(TransformModule);
    transformManager = world.transformManager;
    // transformSystem = systemManager.getSystem('TransformSystem');

    com_transform = em.getComponentId('Transform');
    com_localToWorld = em.getComponentId('LocalToWorld');
    com_parent = em.getComponentId('Parent');
});
afterAll(() => {
    world.destroy();
});

describe('transform module', () => {
    it('transform', () => {

        let e0 = em.createEntity(com_transform);
        let e00 = em.createEntity(com_transform);
        let e01 = em.createEntity(com_transform);

        let transform = em.getComponent(e0, com_transform);
        transform.position[0] = 1;
        transform = em.getComponent(e00, com_transform);
        transform.position[0] = 2;
        transform = em.getComponent(e01, com_transform);
        transform.position[0] = 3;

        transformManager.setParent(e00, e0);
        transformManager.setParent(e01, e0);

        world.update(1);
        expect(em.hasComponent(e0, com_localToWorld)).toBeTruthy();
        expect(em.getComponent(e00,com_parent).entity).toBe(e0);
        expect(em.getComponent(e01,com_parent).entity).toBe(e0);

        let position = [0, 0, 0];
        let ltw = em.getComponent(e00, com_localToWorld);
        mat4.getTranslation(position, ltw.localMat);
        expect(position[0]).toBe(2);
        mat4.getTranslation(position, ltw.worldMat);
        expect(position[0]).toBe(3);

        ltw = em.getComponent(e01, com_localToWorld);
        mat4.getTranslation(position, ltw.worldMat);
        expect(position[0]).toBe(4);

        transformManager.setParent(e01, e00);
        world.update(1);

        ltw = em.getComponent(e01, com_localToWorld);
        mat4.getTranslation(position, ltw.worldMat);
        expect(position[0]).toBe(6);

        const rootEnt = transformManager.getRootEntity(e01);
        expect(rootEnt).toBe(e0);

        let prefab = transformManager.hierachyToJson([e00]);
        console.log(JSON.stringify(prefab));

        em.destroyEntity(e0);
        em.destroyEntity(e00);
        em.destroyEntity(e01);
    });
    it('set pos/matrix', () => {
        let e0 = em.createEntity(com_transform);
        let e00 = em.createEntity(com_transform);
        let transform = em.getComponent(e0, com_transform);

        world.update(1);

        const axisY = [0,1,0];
        let matrix = mat4.create();
        let rot = quat.create();
        let pos = [1,2,3];
        quat.setAxisAngle(rot, axisY, Math.PI/4);
        mat4.fromRotationTranslation(matrix, rot, pos);

        transformManager.setWorldMatrix(e0, matrix);

        expect(vec3.equals(pos, transform.position)).toBe(true);
        expect(quat.equals(rot, transform.rotation)).toBe(true);

    });
})