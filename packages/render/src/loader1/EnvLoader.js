import { AssetPromise, Loader } from "@poly-engine/asset";
import { Util } from "@poly-engine/core";
import { sh3 } from "@poly-engine/math";
import { DiffuseMode } from "../scene/DiffuseMode";
import { TextureFilterMode } from "../texture/TextureFilterMode";
import { TextureFormat } from "../texture/TextureFormat";
import { TextureUtil } from "../texture/TextureUtil";
import { TextureWrapMode } from "../texture/TextureWrapMode";

// @resourceLoader(AssetType.Env, ["env"])
export class EnvLoader extends Loader {
  load(item, manager) {
    return new AssetPromise((resolve, reject) => {
      this.request(item.url, { type: "arraybuffer" })
        .then((arraybuffer) => {
          const shArray = new Float32Array(arraybuffer, 0, 27);
          const shByteLength = 27 * 4;
          const size = new Uint16Array(arraybuffer, shByteLength, 1)?.[0];

          //TODO load texture cube
          let textureData = manager.createAssetData(null, "TextureCube", "Texture", "TextureCube");
          // const texture = new TextureCube(manager.engine, size);
          const texture = textureData.Texture;
          const textureCube = textureData.TextureCube;
          // texture.filterMode = TextureFilterMode.Trilinear;
          texture.width = size;
          texture.height = size;
          texture.filterMode = TextureFilterMode.Trilinear;
          texture.wrapModeU = texture.wrapModeV = TextureWrapMode.Clamp;
          texture.format = TextureFormat.R8G8B8A8;
          texture.mipmap = true;
          texture.mipmapCount = TextureUtil._getMipmapCount(texture);
          textureCube.pixelBuffers = [];

          const mipmapCount = texture.mipmapCount;
          // const mipmapCount = TextureUtil._getMipmapCount(texture);
          let offset = shByteLength + 2;

          for (let mipLevel = 0; mipLevel < mipmapCount; mipLevel++) {
            const mipSize = size >> mipLevel;

            for (let face = 0; face < 6; face++) {
              const dataSize = mipSize * mipSize * 4;
              const data = new Uint8Array(arraybuffer, offset, dataSize);
              offset += dataSize;
              // texture.setPixelBuffer(TextureCubeFace.PositiveX + face, data, mipLevel);
              if (mipLevel === 0)
                textureCube.pixelBuffers[face] = data;
            }
          }
          texture.mipmap = false;
          texture.mipmapCount = 1;
          
          manager._addAsset(item.url + "#texture", textureData);
          console.log(textureData);

          let ambientLightData = manager.createAssetData(null, "AmbientLight", "AmbientLight");

          const ambientLight = ambientLightData.AmbientLight;
          // const sh = new SphericalHarmonics3();

          ambientLight.diffuseMode = DiffuseMode.SphericalHarmonics;
          // sh.copyFromArray(shArray);
          sh3.copy(ambientLight.diffuseSH, shArray);
          // ambientLight.diffuseSH = sh;
          // ambientLight.specularTexture = texture;
          ambientLight.specularTextureRef = textureData.Asset.id;
          ambientLight.specularTextureDecodeRGBM = true;
          resolve(ambientLightData);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
