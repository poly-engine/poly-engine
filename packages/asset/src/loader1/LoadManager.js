import { Util } from "@poly-engine/core";
import { AssetPromise } from "./AssetPromise.js";

/**
 * @class LoadManager
 */
export class LoadManager {

    constructor(world) {
        this.world = world;
        this.em = world.entityManager;
        this.am = world.assetManager;

        this._loaders = {};
        this._extTypeMapping = {};


        /** The number of retries after failing to load assets. */
        this.retryCount = 1;
        /** Retry delay time after failed to load assets, in milliseconds. */
        this.retryInterval = 0;
        /** The default timeout period for loading assets, in milliseconds. */
        this.timeout = Infinity;

        this._loadingPromises = {};
        this._assetPool = Object.create(null);
        this._assetUrlPool = Object.create(null);
        this._referResourcePool = Object.create(null);
        this._graphicResourcePool = Object.create(null);
        this._contentRestorerPool = Object.create(null);
    }
    //#region loader
    addLoader(type, loader, extNames) {
        this._loaders[type] = loader;
        for (let i = 0, len = extNames.length; i < len; i++) {
            this._extTypeMapping[extNames[i]] = type;
        }
    }
    _getTypeByUrl(url) {
        const path = url.split("?")[0];
        return this._extTypeMapping[path.substring(path.lastIndexOf(".") + 1)];
    }
    load(assetInfo) {
        // single item
        if (!Array.isArray(assetInfo)) {
            return this._loadSingleItem(assetInfo);
        }
        // multi items
        const promises = assetInfo.map((item) => this._loadSingleItem(item));
        return AssetPromise.all(promises);
    }
    cancelNotLoaded(url) {
        if (!url) {
            Util.objectValues(this._loadingPromises).forEach((promise) => {
                promise.cancel();
            });
        } else if (typeof url === "string") {
            this._loadingPromises[url]?.cancel();
        } else {
            url.forEach((p) => {
                this._loadingPromises[p]?.cancel();
            });
        }
    }
    _assignDefaultOptions(assetInfo) {
        assetInfo.type = assetInfo.type ?? AssetManager._getTypeByUrl(assetInfo.url);
        if (assetInfo.type === undefined) {
            throw `asset type should be specified: ${assetInfo.url}`;
        }
        assetInfo.retryCount = assetInfo.retryCount ?? this.retryCount;
        assetInfo.timeout = assetInfo.timeout ?? this.timeout;
        assetInfo.retryInterval = assetInfo.retryInterval ?? this.retryInterval;
        assetInfo.url = assetInfo.url ?? assetInfo.urls.join(",");
        return assetInfo;
    }

    _loadSingleItem(itemOrURL) {
        const item = this._assignDefaultOptions(typeof itemOrURL === "string" ? { url: itemOrURL } : itemOrURL);

        // Check url mapping
        const itemURL = item.url;
        // const url = this._virtualPathMap[itemURL] ? this._virtualPathMap[itemURL] : itemURL;
        const url = itemURL;

        // Parse url
        const { assetBaseURL, queryPath } = this._parseURL(url);
        const paths = queryPath ? this._parseQueryPath(queryPath) : [];

        // Check cache
        const cacheObject = this._assetUrlPool[assetBaseURL];
        if (cacheObject) {
            return new AssetPromise((resolve) => {
                resolve(this._getResolveResource(cacheObject, paths));
            });
        }

        // Get asset url
        let assetURL = assetBaseURL;
        if (queryPath) {
            assetURL += "?q=" + paths.shift();
        }

        // Check is loading
        const loadingPromises = this._loadingPromises;
        const loadingPromise = loadingPromises[assetURL];
        if (loadingPromise) {
            return new AssetPromise((resolve, reject) => {
                loadingPromise
                    .then((resource) => {
                        resolve(this._getResolveResource(resource, paths));
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }

        // Check loader
        const loader = this._loaders[item.type];
        if (!loader) {
            throw `loader not found: ${item.type}`;
        }

        // Load asset
        item.url = assetBaseURL;
        const promise = loader.load(item, this);
        if (promise instanceof AssetPromise) {
            loadingPromises[assetBaseURL] = promise;
            promise.then(
                (resource) => {
                    if (loader.useCache) {
                        this._addAsset(assetBaseURL, resource);
                    }
                    delete loadingPromises[assetBaseURL];
                },
                () => delete loadingPromises[assetBaseURL]
            );
            return promise;
        } else {
            for (let subURL in promise) {
                const subPromise = promise[subURL];
                const isMaster = assetBaseURL === subURL;
                loadingPromises[subURL] = subPromise;

                subPromise.then(
                    (resource) => {
                        if (isMaster) {
                            if (loader.useCache) {
                                this._addAsset(subURL, resource);
                                for (let k in promise) delete loadingPromises[k];
                            }
                        }
                    },
                    () => {
                        for (let k in promise) delete loadingPromises[k];
                    }
                );
            }

            return promise[assetURL].then((resource) => this._getResolveResource(resource, paths));
        }
    }
    _parseURL(path) {
        let assetBaseURL = path;
        const index = assetBaseURL.indexOf("?");
        if (index !== -1) {
            assetBaseURL = assetBaseURL.slice(0, index);
        }
        return { assetBaseURL, queryPath: this._getParameterByName("q", path) };
    }
    _getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    _parseQueryPath(str) {
        const result = [];
        if (str.charCodeAt(0) === charCodeOfDot) {
            result.push("");
        }
        str.replace(rePropName, (match, expression, quote, subString) => {
            let key = match;
            if (quote) {
                key = subString.replace(reEscapeChar, "$1");
            } else if (expression) {
                key = expression.trim();
            }
            result.push(key);
        });
        return result;
    }
    _getResolveResource(resource, paths) {
        let subResource = resource;
        if (paths) {
            for (let i = 0, n = paths.length; i < n; i++) {
                const path = paths[i];
                subResource = subResource[path];
            }
        }
        return subResource;
    }
    _addAsset(path, asset) {
        // this._assetPool[asset.instanceId] = path;
        this._assetUrlPool[path] = asset;

        this.am.addAssetData(asset);
    }

    //#endregion

    createAssetData(id, type, ...compNames) {
        return this.am.createAssetData(id, type, ...compNames);
        // let assetData = Object.create(null);
        // const asset = assetData.Asset = this.em.createComponent(this.assetCom);
        // asset.id = id;
        // asset.type = type;
        // for (let i = 0; i < compNames.length; i++) {
        //     let compName = compNames[i];
        //     let compId = this.em.getComponentId(compName);
        //     let comp = this.em.createComponent(compId);
        //     if (comp.id !== undefined)
        //         comp.id = id;
        //     assetData[compName] = comp;
        // }
        // return assetData;
    }
}

const charCodeOfDot = ".".charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
    // Match anything that isn't a dot or bracket.
    "[^.[\\]]+" +
    "|" +
    // Or match property names within brackets.
    "\\[(?:" +
    // Match a non-string expression.
    "([^\"'][^[]*)" +
    "|" +
    // Or match strings (supports escaping characters).
    "([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2" +
    ")\\]" +
    "|" +
    // Or match "" as the space between consecutive dots or empty brackets.
    "(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))",
    "g"
);