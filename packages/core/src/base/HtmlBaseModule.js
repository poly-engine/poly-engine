import { BaseModule } from "./BaseModule.js";
import { HtmlManager } from "./HtmlManager.js";

/**
 * @class BaseModule
 */
export class HtmlBaseModule extends BaseModule {
    constructor(world, canvasElement) {
        super(world);
        this.canvasElement = canvasElement;
    }
    init() {
        super.init();
        const world = this.world;
        const em = world.entityManager;
        const qm = world.queryManager;
        const sm = world.systemManager;

        //manager
        world.htmlManager = new HtmlManager(world, this.canvasElement);

    }
    preUpdate(deltaTime) {
        super.preUpdate(deltaTime);
        this.world.htmlManager.update(deltaTime);
    }
}