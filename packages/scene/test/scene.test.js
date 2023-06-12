import { World } from "@poly-engine/core";
import { AssetModule } from "@poly-engine/asset";
import { TransformModule } from "@poly-engine/transform";
import { SceneModule } from "../src/index.js";

/** @type {World} */
let world;
// let compManager;
let em;
let systemManager;
let moduleManager;
let transformManager;
let sceneManager;
let assetManager;

let sceneCom, sceneStateCom, transformCom;

beforeAll(() => {
    world = new World();
    em = world.entityManager;
    systemManager = world.systemManager;
    moduleManager = world.moduleManager;

    moduleManager.addModule(TransformModule);
    moduleManager.addModule(AssetModule);
    moduleManager.addModule(SceneModule);

    assetManager = world.assetManager;
    transformManager = world.transformManager;
    sceneManager = world.sceneManager;

    sceneCom = em.getComponentId('Scene');
    sceneStateCom = em.getComponentId('SceneState');
    transformCom = em.getComponentId('Transform');
});
afterAll(() => {
    world.destroy();
});

describe('scene', () => {
    it('create/add/remove', () => {
        //active
        const sceneEnt = sceneManager.createSceneEntity("scene0");
        expect(sceneManager.activeEntity).toBe(sceneEnt);

        //add trans1
        const e0 = em.createEntity(transformCom);
        const e00 = em.createEntity(transformCom);
        // let e01 = em.createEntity(transformCom);
        transformManager.setParent(e00, e0);

        world.update(1);

        const state = em.getComponent(sceneEnt, sceneStateCom);
        const ents = state.entSet.values;

        sceneManager.addEntityToScene(e0, sceneEnt);
        expect(sceneManager.getEntityScene(e0)).toBe(sceneEnt);
        expect(sceneManager.getEntityScene(e00)).toBe(sceneEnt);

        expect(ents).toEqual([e0]);

        transformManager.setParent(e00, -1);
        
        world.update(1);
        
        expect(ents).toEqual([e0, e00]);
    });
    it('scene/state', () => {
        //0
        let e0 = em.createEntity();

        let json = {
            Scene: {
                id: "scene1",
                entDatas: [
                    //0
                    {
                        Transform: {
                            position: [1, 0, 0]
                        },
                        Children: [{ entity: 1 }]
                    },
                    //1
                    {
                        Transform: {
                            position: [2, 0, 0]
                        },
                        Parent: { entity: 0 }
                    }
                ]
            }
        }
        //1
        let ent = em.entityFromJson(null, json);
        const e1 = ent + 1;
        const e2 = ent + 2;

        world.update(1);

        let state = em.getComponent(ent, sceneStateCom);
        const ents = state.entSet.values;
        expect(ents).toEqual([e1]);

        let position = [0, 0, 0];
        transformManager.getPosition(e1, position);
        expect(position[0]).toBe(1);
        transformManager.getPosition(e2, position);
        expect(position[0]).toBe(3);

        transformManager.setParent(e2, -1);

        world.update(1);
        
        expect(ents).toEqual([e1, e2]);
    });
    it('load/unload', () => {
        //0
        let e0 = em.createEntity();

        let sceneId = "scene2";
        let json = {
            Asset: { id: sceneId, type: "Scene" },
            Scene: {
                id: sceneId,
                entDatas: [
                    //0
                    {
                        Transform: {
                            position: [1, 0, 0]
                        },
                        Children: [{ entity: 1 }]
                    },
                    //1
                    {
                        Transform: {
                            position: [2, 0, 0]
                        },
                        Parent: { entity: 0 }
                    }
                ]
            }
        };
        assetManager.addAssetData(json);

        const scene2Ent = sceneManager.loadSceneEntity(sceneId, true);
        world.update(1);

        const scene1Ent = sceneManager.getSceneEntity("scene1");
        expect(scene1Ent !== -1).toBe(true);

        let state = em.getComponent(scene2Ent, sceneStateCom);
        const ents = state.entSet.values;
        expect(ents.length).toBe(1);
    });
})