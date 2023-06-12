import { AssetPromise } from "@poly-engine/asset";
import { Logger } from "@poly-engine/core";
import { GLTFParser } from "./GLTFParser.js";
import { GLTFParserContext } from "./GLTFParserContext.js";

export class GLTFValidator extends GLTFParser {
  parse(context) {
    const {
      asset: { version },
      extensionsUsed,
      extensionsRequired
    } = context.glTF;

    const glTFVersion = Number(version);
    if (!(glTFVersion >= 2 && glTFVersion < 3)) {
      throw "Only support glTF 2.x.";
    }
    const promises = [];
    if (extensionsUsed) {
      Logger.info("extensionsUsed: ", extensionsUsed);
      for (let i = 0; i < extensionsUsed.length; i++) {
        const extensionUsed = extensionsUsed[i];
        if (!GLTFParser.hasExtensionParser(extensionUsed)) {
          Logger.warn(`Extension ${extensionUsed} is not implemented, you can customize this extension in gltf.`);
        }
      }
    }

    if (extensionsRequired) {
      Logger.info(`extensionsRequired: ${extensionsRequired}`);
      for (let i = 0; i < extensionsRequired.length; i++) {
        const extensionRequired = extensionsRequired[i];

        if (!GLTFParser.hasExtensionParser(extensionRequired)) {
          Logger.error(`GLTF parser has not supported required extension ${extensionRequired}.`);
        } else {
          promises.push(GLTFParser.executeExtensionsInitialize(extensionRequired));
        }
      }
    }

    return AssetPromise.all(promises).then(null);
  }
}
