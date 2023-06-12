import { World } from "@poly-engine/core";
import * as transformModule from "@poly-engine/transform";
import * as renderModule from "../../src/index.js";


glcheck("PicoGL.createApp", (t, canvas) => {
    const world = new World();
    world.addModule('mod_tranform', transformModule);
    world.addModule('mod_tranform', renderModule);

    const com_canvas = world.com_canvas;
    const com_glState = world.com_glState;
    let entity = world.createEntity();
    world.setComponent(entity, com_canvas, com_canvas.create('test', canvas));

    world.update(1);

    t.ok(com_glState.has(entity), "App was created");
    t.done();
});
