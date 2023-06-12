// /**
//  * @typedef {Object} ModuleOptions
//  * @property {Function} init 
//  * @property {Function} release 
//  * @property {object} settings 
//  */

/**
 * @class Module
 */
export class Module{
    constructor(world){
        this.world = world;
        this.settings = {};
        this._init = null;
        this._release = null;

        this.em = world.entityManager;
        this.qm = world.queryManager;
        this.sm = world.systemManager;
    }
    init(){
        this._init?.(this.world, this.settings);
    }
    release(){
        this._release?.(this.world);
    }

    preUpdate(deltaTime){

    }
    lateUpdate(deltaTime){

    }
}