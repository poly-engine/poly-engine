import { AssetPromise, Loader } from "@poly-engine/asset";
import { Util } from "@poly-engine/core";
import { TextureFilterMode } from "../texture/TextureFilterMode";
import { TextureWrapMode } from "../texture/TextureWrapMode";

export class Texture2DLoader extends Loader {
  load(item, manager) {
    return new AssetPromise((resolve, reject) => {
      const url = item.url;
      const requestConfig = {
        ...item,
        type: "image"
      };
      this.request(url, requestConfig)
        .then((image) => {
          const params = item.params;

          // if (url.indexOf("data:") !== 0) {
          //   const index = url.lastIndexOf("/");
          //   texture.name = url.substring(index + 1);
          // }
          const id = Util.createUUID();
          let data = manager.createAssetData(id, "Texture2D", "Texture", "Texture2D");
          let texture = data.Texture;
          let texture2D = data.Texture2D;
          texture.width = image.width;
          texture.height = image.height;
          texture.filterMode = TextureFilterMode.Bilinear;
          texture.wrapModeU = texture.wrapModeV = TextureWrapMode.Repeat;
          if (params?.format != null)
            texture.format = params?.format;
          if (params?.mipmap != null)
            texture.mipmap = params?.mipmap;
          texture2D.image = image;

          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
