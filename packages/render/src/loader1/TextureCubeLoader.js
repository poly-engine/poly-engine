import { AssetPromise, Loader } from "@poly-engine/asset";
import { Util } from "@poly-engine/core";
import { TextureFilterMode } from "../texture/TextureFilterMode";
import { TextureFormat } from "../texture/TextureFormat";
import { TextureWrapMode } from "../texture/TextureWrapMode";

// @resourceLoader(AssetType.TextureCube, [""])
export class TextureCubeLoader extends Loader {
  load(item, resourceManager) {
    return new AssetPromise((resolve, reject) => {
      const urls = item.urls;
      const requestConfig = {
        ...item,
        type: "image"
      };

      Promise.all(urls.map((url) => this.request(url, requestConfig)))
        .then((images) => {
          const { width, height } = images[0];

          if (width !== height) {
            console.error("The cube texture must have the same width and height");
            return;
          }

          let data = manager.createAssetData(null, "TextureCube", "Texture", "TextureCube");
          // const texture = new TextureCube(resourceManager.engine, width);
          let texture = data.Texture;
          let textureCube = data.TextureCube;
          texture.width = width;
          texture.height = height;
          texture.filterMode = TextureFilterMode.Bilinear;
          texture.wrapModeU = texture.wrapModeV = TextureWrapMode.Clamp;
          texture.format = TextureFormat.R8G8B8A8;
          // texture.mipmap = true;
          texture.mipmapCount = TextureUtil._getMipmapCount(texture);
          textureCube.images = [];
          for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            // texture.setImageSource(TextureCubeFace.PositiveX + faceIndex, images[faceIndex], 0);
            textureCube.images[faceIndex] = images[faceIndex];
          }
          // texture.generateMipmaps();

          // resourceManager.addContentRestorer(new TextureCubeContentRestorer(texture, urls, requestConfig));
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
