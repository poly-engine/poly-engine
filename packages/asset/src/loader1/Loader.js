import { AssetPromise } from "./AssetPromise.js";
import { request, RequestConfig } from "./request";

/**
 * Loader abstract class.
 * @calss Loader
 */
export class Loader {
  static registerClass(className, classDefine) {
    this._engineObjects[className] = classDefine;
  }
  static getClass(className) {
    return this._engineObjects[className];
  }
  static _engineObjects = {};

  constructor(useCache) {
    this.useCache = useCache;
    this.request = request;
  }

  load(item, manager){

  }
}
