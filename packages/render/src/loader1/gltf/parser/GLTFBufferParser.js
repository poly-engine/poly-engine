import { request } from "@poly-engine/asset";
import { Util } from "@poly-engine/core";
import { BufferRequestInfo } from "../../GLTFContentRestorer.js";
import { GLTFUtils } from "../GLTFUtils.js";
import { GLTFParser } from "./GLTFParser.js";

export class GLTFBufferParser extends GLTFParser {
  parse(context) {
    const { glTFResource, contentRestorer } = context;
    const { url } = glTFResource;
    const restoreBufferRequests = contentRestorer.bufferRequests;
    const requestConfig = { type: "arraybuffer" };
    const isGLB = this._isGLB(url);

    contentRestorer.isGLB = isGLB;
    if (isGLB) {
      return request(url, requestConfig)
        .then((glb) => {
          restoreBufferRequests.push(new BufferRequestInfo(url, requestConfig));
          return GLTFUtils.parseGLB(context, glb);
        })
        .then(({ glTF, buffers }) => {
          context.glTF = glTF;
          context.buffers = buffers;
        });
    } else {
      return request(url, {
        type: "json"
      }).then((glTF) => {
        context.glTF = glTF;

        return Promise.all(
          glTF.buffers.map((buffer) => {
            const absoluteUrl = Util.resolveAbsoluteUrl(url, buffer.uri);
            restoreBufferRequests.push(new BufferRequestInfo(absoluteUrl, requestConfig));
            return request(absoluteUrl, requestConfig);
          })
        ).then((buffers) => {
          context.buffers = buffers;
        });
      });
    }
  }

  _isGLB(url) {
    const index = url.lastIndexOf(".");
    return url.substring(index + 1, index + 4) === "glb";
  }
}
