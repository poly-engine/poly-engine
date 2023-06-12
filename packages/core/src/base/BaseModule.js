import { Module } from "../ecs/Module.js";
import { TimeManager } from "./TimeManager.js";

/**
 * @class BaseModule
 */
export class BaseModule extends Module {
    init() {
        const world = this.world;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        // //component
        // const canvasCom = em.registerComponent('Canvas', CanvasDef);
        // const canvasStateCom = em.registerComponent('CanvasState', CanvasStateDef);
        // const resizedCom = em.registerComponent('Resized', ResizedDef);

        // const winFocusCom = em.registerComponent('WinFocus', WinFocusDef);
        // const winBlurCom = em.registerComponent('WinBlur', WinBlurDef);

        // //system
        // //PreUpdate 100
        // const canvasSys = sm.addSystem(CanvasSystem);

        // canvasSys.init();

        //manager
        world.timeManager = new TimeManager();

    }
    lateUpdate(deltaTime){
        this.world.timeManager.update(deltaTime);
    }
}