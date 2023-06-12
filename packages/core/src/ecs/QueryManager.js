import { Archetype } from "./Archetype.js";
import { Query } from "./Query.js";

/**
 * @class QueryManager
 */
export class QueryManager {
    constructor(world) {
        this.world = world;
        //query
        /** 
         * @type {Map<number, Query>} 
         * @private
         */
        this._queryMap = new Map;
    }

    //#region Query

    /**
     * 
     * @param {object} options 
     * @param {?StoreOrId[]} options.all 
     * @param {?StoreOrId[]} options.any 
     * @param {?StoreOrId[]} options.not 
     * @param {?StoreOrId[]} options.none 
     * @returns {Query}
     */
    createQuery(options) {
        // let query = this[id];
        // if (query !== undefined)
        //     return query;
        // const compManager = this.world.componentManager;
        const entityManager = this.world.entityManager;

        let everyIds = options.all;// && compManager._storeOrIdsToIds(...options.all);
        let someIds = options.any;// && compManager._storeOrIdsToIds(...options.any);
        let notIds = options.not;// && compManager._storeOrIdsToIds(...options.not);
        let noneIds = options.none;// && compManager._storeOrIdsToIds(...options.none);
        let hash = Query.hashCode(everyIds, someIds, notIds, noneIds);
        // let hash = Query.hashCode(options.all, options.any, options.not, options.none);
        let query = this._queryMap.get(hash);
        if (query !== undefined) {
            // query.refCount++;
            return query;
        }
        query = new Query(hash, everyIds, someIds, notIds, noneIds);
        this._queryMap.set(hash, query);
        // this[id] = query;
        entityManager._archetypes.forEach((archetype) => {
            query._tryAdd(archetype);
        })
        return query;
    }
    //#endregion

}