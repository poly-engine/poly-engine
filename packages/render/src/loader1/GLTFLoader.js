import { Loader } from "@poly-engine/asset";
import { GLTFPipeline } from "./gltf/GLTFPipeline.js";
import { GLTFResource } from "./gltf/GLTFResource.js";
import { GLTFParserContext } from "./gltf/parser/GLTFParserContext.js";
import { GLTFContentRestorer } from "./GLTFContentRestorer.js";

export class GLTFLoader extends Loader {

  load(item, manager) {
    const { url } = item;
    const params = item.params;
    const context = new GLTFParserContext(url);
    const glTFResource = new GLTFResource(url);
    const restorer = new GLTFContentRestorer(glTFResource);
    const masterPromiseInfo = context.masterPromiseInfo;

    context.manager= manager;
    context.contentRestorer = restorer;
    context.glTFResource = glTFResource;
    context.keepMeshData = params?.keepMeshData ?? false;

    masterPromiseInfo.onCancel(() => {
      const { chainPromises } = context;
      for (const promise of chainPromises) {
        promise.cancel();
      }
    });

    const pipeline = (params?.pipeline || GLTFPipeline.defaultPipeline);

    pipeline._parse(context)
      .then((glTFResource) => {
        // resourceManager.addContentRestorer(restorer);
        masterPromiseInfo.resolve(glTFResource);
      })
      .catch((e) => {
        console.error(e);
        masterPromiseInfo.reject(`Error loading glTF model from ${url} .`);
      });

    return context.promiseMap;
  }
}
