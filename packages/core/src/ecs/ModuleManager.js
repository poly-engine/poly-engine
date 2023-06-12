import { Module } from "./Module.js";

/**
 * @typedef {Object} ModuleOptions
 * @property {Function} init 
 * @property {Function} release 
 * @property {object} settings 
 */

/**
 * @class ModuleManager
 */
export class ModuleManager {
    constructor(world) {
        this.world = world;

        //module
        /** 
         * @type {Map<string, Module>} 
         * @private
         */
        this._moduleMap = new Map();
    }

    /**
     * 
     * @param {string} name 
     * @param {Module} module 
     * @param {object} settings 
     */
    addModule(options, settings) {
        let name = options.name || options.constructor.name;
        let oldModule = this._moduleMap.get(name);
        if (oldModule)
            oldModule.release();
        let module = null;
        if(typeof options === 'function'){
            module = new options(this.world);
        }
        else if(options instanceof Module)
            module = options;
        else{
            module = new Module(this.world);
            module._init = options.init;
            module._release = options.release;
            if(options.settings) 
                module.settings = options.settings;
        }
        // module.world = this.world;
        module.name = name;
        if(settings)
            Object.assign(module.settings, settings);
        module.init();
        this._moduleMap.set(name, module);
        // this[name] = module;
    }
    getModule(name){
        return this._moduleMap.get(name);
    }
    preUpdate(deltaTime){
        this._moduleMap.forEach((module) => {
            module.preUpdate(deltaTime);
        })
    }
    lateUpdate(deltaTime){
        this._moduleMap.forEach((module) => {
            module.lateUpdate(deltaTime);
        })
    }
}