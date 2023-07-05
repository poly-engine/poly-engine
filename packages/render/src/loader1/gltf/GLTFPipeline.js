import { AssetPromise } from "@poly-engine/asset";
// import { GLTFAnimationParser } from "./parser/GLTFAnimationParser.js";
import { GLTFBufferParser } from "./parser/GLTFBufferParser.js";
import { GLTFEntityParser } from "./parser/GLTFEntityParser.js";
import { GLTFMaterialParser } from "./parser/GLTFMaterialParser.js";
import { GLTFMeshParser } from "./parser/GLTFMeshParser.js";
import { GLTFSceneParser } from "./parser/GLTFSceneParser.js";
// import { GLTFSkinParser } from "./parser/GLTFSkinParser.js";
import { GLTFTextureParser } from "./parser/GLTFTextureParser.js";
import { GLTFValidator } from "./parser/GLTFValidator.js";

/**
 * GLTF pipeline.
 * @class GLTFPipeline
 */
export class GLTFPipeline {
  /**
   * Default pipeline.
   */
  static defaultPipeline = new GLTFPipeline(
    GLTFBufferParser,
    GLTFValidator,
    GLTFTextureParser,
    GLTFMaterialParser,
    GLTFMeshParser,
    GLTFEntityParser,
    // GLTFSkinParser,
    // GLTFAnimationParser,
    GLTFSceneParser
  );

  _parsers = [];

  /**
   * Constructor of GLTFPipeline.
   * @param parsers - Parsers to be executed in order
   */
  constructor(...parsers) {
    parsers.forEach((pipe, index) => {
      this._parsers[index] = new pipe();
    });
  }

  /**
   * @internal
   */
  _parse(context) {
    const glTFResource = context.glTFResource;
    let lastParser;

    return new AssetPromise ((resolve, reject) => {
      this._parsers.forEach((parser) => {
        if (lastParser) {
          lastParser = lastParser.then(() => {
            return parser.parse(context);
          });
          if (lastParser.cancel) {
            context.chainPromises.push(lastParser);
          }
        } else {
          lastParser = parser.parse(context);
        }
      });

      if (lastParser) {
        lastParser
          .then(() => {
            resolve(glTFResource);
          })
          .catch(reject);
      }
    });
  }
}
