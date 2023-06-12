import { AssetPromise } from "./AssetPromise";

const mimeType = {
  json: "json",
  gltf: "json",
  mtl: "json",
  prefab: "json",
  txt: "text",
  bin: "arraybuffer",
  png: "image",
  webp: "image",
  jpg: "image"
};

const defaultRetryCount = 1;
const defaultTimeout = Infinity;
const defaultInterval = 500;

// export type RequestConfig = {
//   type?: XMLHttpRequestResponseType | "image";
//   retryCount?: number;
//   retryInterval?: number;
//   timeout?: number;
// } & RequestInit;

/**
 * Web request.
 * @param {string} url - The link
 * @param {RequestConfig} config - Load configuration
 */
export function request(url, config = {}) {
  return new AssetPromise((resolve, reject, setProgress) => {
    const retryCount = config.retryCount ?? defaultRetryCount;
    const retryInterval = config.retryInterval ?? defaultInterval;
    config.timeout = config.timeout ?? defaultTimeout;
    config.type = config.type ?? getMimeTypeFromUrl(url);
    const realRequest = config.type === "image" ? requestImage : requestRes;
    let lastError;
    const executor = new MultiExecutor(
      () => {
        return realRequest(url, config)
          .onProgress(setProgress)
          .then((res) => {
            resolve(res);
            executor.stop();
          })
          .catch((err) => (lastError = err));
      },
      retryCount,
      retryInterval
    );
    executor.start(() => {
      reject(lastError);
    });
  });
}

function requestImage(url, config) {
  return new AssetPromise((resolve, reject) => {
    const { timeout } = config;
    const img = new Image();
    const onerror = () => {
      reject(new Error(`request ${url} fail`));
    };
    img.onerror = onerror;

    img.onabort = onerror;

    let timeoutId = -1;
    if (timeout != Infinity) {
      timeoutId = window.setTimeout(() => {
        reject(new Error(`request ${url} timeout`));
      }, timeout);
    }

    img.onload = ((timeoutId) => {
      return () => {
        // Call requestAnimationFrame to avoid iOS's bug.
        requestAnimationFrame(() => {
          //@ts-ignore
          resolve(img);
          img.onload = null;
          img.onerror = null;
          img.onabort = null;
        });
        clearTimeout(timeoutId);
      };
    })(timeoutId);

    img.crossOrigin = "anonymous";

    img.src = url;
  });
}

function requestRes(url, config) {
  return new AssetPromise((resolve, reject, setProgress) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = config.timeout;
    config.method = config.method ?? "get";
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`request failed from: ${url}`));
        return;
      }
      const result = xhr.response ?? xhr.responseText;
      resolve(result);
    };
    xhr.onerror = () => {
      reject(new Error(`request failed from: ${url}`));
    };
    xhr.ontimeout = () => {
      reject(new Error(`request timeout from: ${url}`));
    };
    xhr.onprogress = (e) => {
      setProgress(e.loaded / e.total);
    };
    xhr.open(config.method, url, true);
    xhr.withCredentials = config.credentials === "include";
    //@ts-ignore
    xhr.responseType = config.type;
    const headers = config.headers;
    if (headers) {
      Object.keys(headers).forEach((name) => {
        xhr.setRequestHeader(name, headers[name]);
      });
    }
    // @ts-ignore
    xhr.send(config.body);
  });
}

function getMimeTypeFromUrl(url) {
  const extname = url.substring(url.lastIndexOf(".") + 1);
  return mimeType[extname];
}

export class MultiExecutor {
  _timeoutId = -100;
  _currentCount = 0;
  constructor(execFunc, totalCount, interval) {
    this.execFunc = execFunc;
    this.totalCount = totalCount;
    this.interval = interval;
    this.exec = this.exec.bind(this);
  }

  // done: Function;
  start(done) {
    this.done = done;
    this.exec();
  }
  stop() {
    clearTimeout(this._timeoutId);
  }
  exec() {
    if (this._currentCount >= this.totalCount) {
      this.done && this.done();
      return;
    }
    this._currentCount++;
    this.execFunc(this._currentCount).then(() => {
      //@ts-ignore
      this._timeoutId = setTimeout(this.exec, this.interval);
    });
  }
}
