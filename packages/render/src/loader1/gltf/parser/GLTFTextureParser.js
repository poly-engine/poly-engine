import { BufferTextureRestoreInfo } from "../../GLTFContentRestorer.js";
import { GLTFUtils } from "../GLTFUtils.js";
import { TextureMagFilter, TextureMinFilter, TextureWrapMode as GLTFTextureWrapMode } from "../GLTFSchema.js";
import { GLTFParser } from "./GLTFParser.js";
import { AssetPromise } from "@poly-engine/asset";
import { TextureWrapMode } from "../../../texture/TextureWrapMode.js";
import { Util } from "@poly-engine/core";
import { TextureFilterMode } from "../../../texture/TextureFilterMode.js";

export class GLTFTextureParser extends GLTFParser {
  static _wrapMap = {
    [GLTFTextureWrapMode.CLAMP_TO_EDGE]: TextureWrapMode.Clamp,
    [GLTFTextureWrapMode.MIRRORED_REPEAT]: TextureWrapMode.Mirror,
    [GLTFTextureWrapMode.REPEAT]: TextureWrapMode.Repeat
  };

  parse(context) {
    const { glTFResource, glTF, buffers } = context;
    const { url } = glTFResource;

    if (glTF.textures) {
      const texturesPromiseInfo = context.texturesPromiseInfo;
      AssetPromise.all(
        glTF.textures.map(({ sampler, source = 0, name: textureName }, index) => {
          const { uri, bufferView: bufferViewIndex, mimeType, name: imageName } = glTF.images[source];
          if (uri) {
            // TODO: support ktx extension https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_basisu/README.md
            const index = uri.lastIndexOf(".");
            const ext = uri.substring(index + 1);
            const type = ext.startsWith("ktx") ? "KTX" : "Texture2D";
            return context.manager
              .load ({
                url: Util.resolveAbsoluteUrl(url, uri),
                type: type
              })
                .then((texture) => {
                  if (!texture.Asset.name) {
                    texture.Asset.name = textureName || imageName || `texture_${index}`;
                  }
                  if (sampler !== undefined) {
                    this._parseSampler(texture, glTF.samplers[sampler]);
                  }
                  return texture;
                });
          } else {
            // const bufferView = glTF.bufferViews[bufferViewIndex];
            // const buffer = buffers[bufferView.buffer];
            // const imageBuffer = new Uint8Array(buffer, bufferView.byteOffset, bufferView.byteLength);

            // return GLTFUtils.loadImageBuffer(imageBuffer, mimeType).then((image) => {
            //   const texture = new Texture2D(engine, image.width, image.height);
            //   texture.setImageSource(image);
            //   texture.generateMipmaps();
            //   texture.name = textureName || imageName || `texture_${index}`;
            //   if (sampler !== undefined) {
            //     this._parseSampler(texture, glTF.samplers[sampler]);
            //   }
            //   const bufferTextureRestoreInfo = new BufferTextureRestoreInfo(texture, bufferView, mimeType);
            //   context.contentRestorer.bufferTextures.push(bufferTextureRestoreInfo);

            //   return texture;
            // });
          }
        })
      )
        .then((textures) => {
          glTFResource.textures = textures;
          texturesPromiseInfo.resolve(textures);
        })
        .catch(texturesPromiseInfo.reject);
      return texturesPromiseInfo.promise;
    }
  }

  _parseSampler(texture, sampler) {
    const { magFilter, minFilter, wrapS, wrapT } = sampler;

    if (magFilter || minFilter) {
      if (magFilter === TextureMagFilter.NEAREST) {
        texture.Texture.filterMode = TextureFilterMode.Point;
      } else if (minFilter <= TextureMinFilter.LINEAR_MIPMAP_NEAREST) {
        texture.Texture.filterMode = TextureFilterMode.Bilinear;
      } else {
        texture.Texture.filterMode = TextureFilterMode.Trilinear;
      }
    }

    if (wrapS) {
      texture.Texture.wrapModeU = GLTFTextureParser._wrapMap[wrapS];
    }

    if (wrapT) {
      texture.Texture.wrapModeV = GLTFTextureParser._wrapMap[wrapT];
    }
  }
}
