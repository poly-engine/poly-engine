
import { AssetPromise } from "@poly-engine/asset";
import { RenderFace } from "../../../material/enums/RenderFace.js";
import { MaterialSystem } from "../../../material/MaterialSystem.js";
import { TextureCoordinate } from "../../../material/enums/TextureCoordinate.js";
import { ColorUtil } from "../../../utils/ColorUtil.js";
import { MaterialAlphaMode } from "../GLTFSchema.js";
import { GLTFParser } from "./GLTFParser.js";

export class GLTFMaterialParser extends GLTFParser {
  /**
   * @internal
   */
  static _checkOtherTextureTransform(texture, textureName) {
    if (texture.extensions?.KHR_texture_transform) {
      Logger.warn(`${textureName} texture always use the KHR_texture_transform of the base texture.`);
    }
  }

  /**
   * @internal
   */
  static _parseStandardProperty(
    context,
    material,
    materialInfo
  ) {
    const { textures } = context.glTFResource;
    const {
      pbrMetallicRoughness,
      normalTexture,
      occlusionTexture,
      emissiveTexture,
      emissiveFactor,
      alphaMode,
      alphaCutoff,
      doubleSided
    } = materialInfo;

    if (pbrMetallicRoughness) {
      const { baseColorFactor, baseColorTexture, metallicFactor, roughnessFactor, metallicRoughnessTexture } =
        pbrMetallicRoughness;

      if (baseColorFactor) {
        material.BaseMaterial.baseColor = [
          ColorUtil.linearToGammaSpace(baseColorFactor[0]),
          ColorUtil.linearToGammaSpace(baseColorFactor[1]),
          ColorUtil.linearToGammaSpace(baseColorFactor[2]),
          baseColorFactor[3]
        ];
      }
      if (baseColorTexture) {
        // material.BaseMaterial.baseTexture = textures[baseColorTexture.index];
        material.BaseMaterial.baseTextureRef = textures[baseColorTexture.index].Asset.id;
        GLTFParser.executeExtensionsAdditiveAndParse(baseColorTexture.extensions, context, material, baseColorTexture);
      }

      if (material.PBRMaterial != null) {
        material.PBRMaterial.metallic = metallicFactor ?? 1;
        material.PBRMaterial.roughness = roughnessFactor ?? 1;
        if (metallicRoughnessTexture) {
          material.PBRMaterial.roughnessMetallicTextureRef = textures[metallicRoughnessTexture.index].Asset.id;
          GLTFMaterialParser._checkOtherTextureTransform(metallicRoughnessTexture, "Roughness metallic");
        }
      }
    }

    if (material.PhongBaseMaterial != null) {
      if (emissiveTexture) {
        material.PhongBaseMaterial.emissiveTextureRef = textures[emissiveTexture.index].Asset.id;
        GLTFMaterialParser._checkOtherTextureTransform(emissiveTexture, "Emissive");
      }

      if (emissiveFactor) {
        material.PhongBaseMaterial.emissiveColor = [
          ColorUtil.linearToGammaSpace(emissiveFactor[0]),
          ColorUtil.linearToGammaSpace(emissiveFactor[1]),
          ColorUtil.linearToGammaSpace(emissiveFactor[2]),
          1
        ];
      }

      if (normalTexture) {
        const { index, scale } = normalTexture;
        material.PhongBaseMaterial.normalTextureRef = textures[index].Asset.id;
        GLTFMaterialParser._checkOtherTextureTransform(normalTexture, "Normal");

        if (scale !== undefined) {
          material.PhongBaseMaterial.normalIntensity = scale;
        }
      }
    }
    if (material.PBRBaseMaterial != null) {
      if (occlusionTexture) {
        const { index, strength, texCoord } = occlusionTexture;
        material.PBRBaseMaterial.occlusionTextureRef = textures[index].Asset.id;
        GLTFMaterialParser._checkOtherTextureTransform(occlusionTexture, "Occlusion");

        if (strength !== undefined) {
          material.PBRBaseMaterial.occlusionIntensity = strength;
        }
        if (texCoord === TextureCoordinate.UV1) {
          material.PBRBaseMaterial.occlusionTextureCoord = TextureCoordinate.UV1;
        } else if (texCoord > TextureCoordinate.UV1) {
          Logger.warn("Occlusion texture uv coordinate must be UV0 or UV1.");
        }
      }
    }

    if (doubleSided) {
      material.Material.renderFace = RenderFace.Double;
    } else {
      material.Material.renderFace = RenderFace.Front;
    }

    switch (alphaMode) {
      case MaterialAlphaMode.OPAQUE:
        material.Material.isTransparent = false;
        break;
      case MaterialAlphaMode.BLEND:
        material.Material.isTransparent = true;
        break;
      case MaterialAlphaMode.MASK:
        material.Material.alphaCutoff = alphaCutoff ?? 0.5;
        break;
    }
  }

  parse(context) {
    const { glTF, glTFResource, materialsPromiseInfo } = context;
    if (!glTF.materials) return;

    const { engine } = glTFResource;
    const materialSys = context.manager.world.systemManager.getSystem(MaterialSystem);

    let materialPromises = [];

    for (let i = 0; i < glTF.materials.length; i++) {
      const materialInfo = glTF.materials[i];

      let material = (
        GLTFParser.executeExtensionsCreateAndParse(materialInfo.extensions, context, materialInfo)
      );

      if (!material) {
        material = materialSys.createPBRMaterialData();//new PBRMaterial(engine);
        // material = materialSys.createPhongMaterialData();//new PBRMaterial(engine);
        material.Asset.name = materialInfo.name;
        GLTFMaterialParser._parseStandardProperty(context, material, materialInfo);
      }

      materialPromises.push(material);
    }

    return AssetPromise.all(materialPromises).then((materials) => {
      glTFResource.materials = materials;
      for (let i = 0; i < glTF.materials.length; i++) {
        const materialInfo = glTF.materials[i];
        GLTFParser.executeExtensionsAdditiveAndParse(materialInfo.extensions, context, materials[i], materialInfo);
      }
      materialsPromiseInfo.resolve(materials);
      return materialsPromiseInfo.promise;
    });
  }
}
