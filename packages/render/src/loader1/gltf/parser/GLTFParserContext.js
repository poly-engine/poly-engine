import { AssetPromise } from "@poly-engine/asset";

/**
 * @internal
 */
export class GLTFParserContext {
  glTF = null;
  buffers = null;
  glTFResource = null;
  keepMeshData = false;
  hasSkinned = false;
  chainPromises = [];
  accessorBufferCache = {};

  texturesPromiseInfo = new PromiseInfo();
  materialsPromiseInfo = new PromiseInfo();
  meshesPromiseInfo = new PromiseInfo();
  animationClipsPromiseInfo = new PromiseInfo();
  defaultSceneRootPromiseInfo = new PromiseInfo();
  masterPromiseInfo = new PromiseInfo();
  promiseMap = {};

  contentRestorer;

  manager = null;

  constructor(url) {
    const promiseMap = this.promiseMap;
    promiseMap[`${url}?q=textures`] = this._initPromiseInfo(this.texturesPromiseInfo);
    promiseMap[`${url}?q=materials`] = this._initPromiseInfo(this.materialsPromiseInfo);
    promiseMap[`${url}?q=meshes`] = this._initPromiseInfo(this.meshesPromiseInfo);
    promiseMap[`${url}?q=animations`] = this._initPromiseInfo(this.animationClipsPromiseInfo);
    promiseMap[`${url}?q=defaultSceneRoot`] = this._initPromiseInfo(this.defaultSceneRootPromiseInfo);
    promiseMap[`${url}`] = this._initPromiseInfo(this.masterPromiseInfo);
  }

  _initPromiseInfo(promiseInfo) {
    const promise = new AssetPromise((resolve, reject, setProgress, onCancel) => {
      promiseInfo.resolve = resolve;
      promiseInfo.reject = reject;
      promiseInfo.setProgress = setProgress;
      promiseInfo.onCancel = onCancel;
    });
    promiseInfo.promise = promise;
    return promise;
  }
}

/**
 * @internal
 */
export class BufferInfo {
  vertexBuffer = null;
  vertexBindingInfos = {};

  restoreInfo = null;

  constructor(data, interleaved, stride) {
    this.data = data;
    this.interleaved = interleaved;
    this.stride = stride;
  }
}

/**
 * @internal
 */
export class PromiseInfo {
  promise = null;
  resolve = null;
  reject = null;
  setProgress = null;
  onCancel = null;
}
