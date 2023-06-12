import { Archetype } from "./Archetype.js";
import { CompType, CompStore, CompMode } from "./CompStore.js";
import { QueryManager } from "./QueryManager.js";
import { SparseSet } from "../utils/Sparseset.js";
import { SystemManager } from "./SystemManager.js";
import { EntityManager } from "./EntityManager.js";
import { ModuleManager } from "./ModuleManager";
import { CloneManager } from "../utils/CloneManager.js";
import { EventAggregator } from "../utils/EventAggregator.js";

/**
 * @class World
 * @param {string} id 
 * @param {object} data 
 */
export class World {
    constructor(id = "default", data = undefined) {
        this.id = id;
        this.data = data;
        // this.initialized = false;

        this.cloneManager = new CloneManager();
        this.eventAggregator = new EventAggregator();

        this.entityManager = new EntityManager(this);
        // this.componentManager = new ComponentManager(this);
        this.queryManager = new QueryManager(this);
        this.systemManager = new SystemManager(this);
        this.moduleManager = new ModuleManager(this);
    }

    //#region world
    /**
     * 
     */
    destroy() {
    }
    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        this.moduleManager.preUpdate(delta);

        // if (!this.initialized) return;
        this.systemManager.update(delta);

        this.entityManager.update(delta);

        this.moduleManager.lateUpdate(delta);
    }
    //#endregion
}