/**
 * Asset Loading Promise.
 * @class AssetPromise
 */
export class AssetPromise {
  /**
   * Return a new resource Promise through the provided asset promise collection.
   * The resolved of the new AssetPromise will be triggered when all the Promises in the provided set are completed.
   */
  static all(promises) {
    return new AssetPromise((resolve, reject, setProgress) => {
      const count = promises.length;
      const results = new Array(count);
      let completed = 0;

      if (count === 0) {
        return resolve(results);
      }

      function onComplete(index, resultValue) {
        completed++;
        results[index] = resultValue;
        setProgress(completed / count);
        if (completed === count) {
          resolve(results);
        }
      }

      function onProgress(promise, index) {
        if (promise instanceof Promise || promise instanceof AssetPromise) {
          promise.then(function (value) {
            onComplete(index, value);
          }, reject);
        } else {
          Promise.resolve().then(() => {
            onComplete(index, promise);
          });
        }
      }

      for (let i = 0; i < count; i++) {
        onProgress(promises[i], i);
      }
    });
  }

  get [Symbol.toStringTag]() {
    return "AssetPromise";
  }

  _promise = null;
  _state = PromiseState.Pending;
  _onProgressCallback = [];
  _onCancelHandler = null;
  _reject = null;

  /**
   * Create an asset loading Promise.
   * a resolve callback used to resolve the promise with a value or the result of another promise,
   * and a reject callback used to reject the promise with a provided reason or error.
   * and a setProgress callback used to set promise progress with a percent.
   */
  constructor(executor) {
    this._promise = new Promise((resolve, reject) => {
      this._reject = reject;
      const onResolve = (value) => {
        if (this._state === PromiseState.Pending) {
          resolve(value);
          this._state = PromiseState.Fulfilled;
          this._onProgressCallback = undefined;
        }
      };
      const onReject = (reason) => {
        if (this._state === PromiseState.Pending) {
          reject(reason);
          this._state = PromiseState.Rejected;
          this._onProgressCallback = undefined;
        }
      };
      const onCancel = (callback) => {
        if (this._state === PromiseState.Pending) {
          this._onCancelHandler = callback;
        }
      };
      const setProgress = (progress) => {
        if (this._state === PromiseState.Pending) {
          this._onProgressCallback.forEach((callback) => callback(progress));
        }
      };

      executor(onResolve, onReject, setProgress, onCancel);
    });
  }

  /**
   * Progress callback.
   */
  onProgress(callback) {
    this._onProgressCallback.push(callback);
    return this;
  }

  then(
    onfulfilled,
    onrejected
  ) {
    return new AssetPromise((resolve, reject) => {
      this._promise.then(onfulfilled, onrejected).then(resolve).catch(reject);
    });
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   */
  catch(onRejected) {
    return new AssetPromise((resolve, reject) => {
      this._promise.catch(onRejected).then(resolve).catch(reject);
    });
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   */
  finally() {
    return this._promise.finally(onFinally);
  }

  /**
   * Cancel promise request.
   */
  cancel() {
    if (this._state !== PromiseState.Pending) {
      return;
    }
    this._state = PromiseState.Canceled;
    this._reject("canceled");
    this._onCancelHandler && this._onCancelHandler();
    return this;
  }
}

// interface AssetPromiseExecutor<T> {
//   (
//     resolve: (value?: T | PromiseLike<T>) => void,
//     reject?: (reason?: any) => void,
//     setProgress?: (progress: number) => void,
//     onCancel?: (callback: () => void) => void
//   ): void;
// }

/** @internal 
 * @enum {string}
*/
const PromiseState = {
  Pending: "pending",
  Fulfilled: "fulfilled",
  Rejected: "rejected",
  Canceled: "canceled"
}
