import { GLTFParser } from "./GLTFParser.js";
import { mat4 } from "@poly-engine/math";

export class GLTFEntityParser extends GLTFParser {
  /** @internal */
  static _defaultName = "_GLTF_ENTITY_";

  parse(context) {
    const {
      glTFResource,
      glTF: { nodes, meshes, materials }
    } = context;

    const { engine } = glTFResource;
    const assetManager = context.manager.world.assetManager;

    if (!nodes) return;

    const entities = [];
    for (let i = 0; i < nodes.length; i++) {
      const entity = {
        Transform: {},
      };
      entities[i] = entity;
    }
    for (let i = 0; i < nodes.length; i++) {
      const gltfNode = nodes[i];
      const { matrix, translation, rotation, scale } = gltfNode;
      // const entity = new Entity(engine, gltfNode.name || `${GLTFEntityParser._defaultName}${i}`);
      // const entity = {
      //   Transform: {},
      // };
      const entity = entities[i];
      // const entity = assetManager.createAssetData(null, "Geometry", "Geometry");

      const transform = entity.Transform;
      // const { transform } = entity;
      if (matrix) {
        // const localMatrix = transform.localMatrix;
        // localMatrix.copyFromArray(matrix);
        // transform.localMatrix = localMatrix;
        transform.position = [0, 0, 0];
        transform.rotation = [0, 0, 0, 1];
        transform.scale = [1, 1, 1];
        mat4.decompose(transform.rotation, transform.position, transform.scale, matrix);
      } else {
        if (translation) {
          // transform.setPosition(translation[0], translation[1], translation[2]);
          entity.Transform.position = translation;
        }
        if (rotation) {
          // transform.setRotationQuaternion(rotation[0], rotation[1], rotation[2], rotation[3]);
          entity.Transform.rotation = rotation;
        }
        if (scale) {
          entity.Transform.scale = scale;
          // transform.setScale(scale[0], scale[1], scale[2]);
        }
      }

      if (gltfNode.mesh != null) {
        //add mesh
        const materialId = meshes[gltfNode.mesh].primitives[0].material;
        entity.MeshRenderer ??= {};
        entity.MeshRenderer.geoRef = glTFResource.meshes[gltfNode.mesh][0].Asset.id;
        entity.MeshRenderer.matRef = glTFResource.materials[materialId].Asset.id;
      }
      if (gltfNode.children != null) {
        //add children
        entity.Children = gltfNode.children.map((value) => { return { entity: value } });
        gltfNode.children.forEach((value) => {
          if (entities[value].Parent != null)
            console.error(`multi parent of index: ${value}`);
          entities[value].Parent = { entity: i };
        });
      }

      // entities[i] = entity;
    }

    glTFResource.entities = entities;
    console.log(entities);
    // this._buildEntityTree(context, glTFResource);
    // this._createSceneRoots(context, glTFResource);
  }

  // _buildEntityTree(context, glTFResource) {
  //   const {
  //     glTF: { nodes }
  //   } = context;
  //   const { entities } = glTFResource;

  //   for (let i = 0; i < nodes.length; i++) {
  //     const { children } = nodes[i];
  //     const entity = entities[i];

  //     if (children) {
  //       for (let j = 0; j < children.length; j++) {
  //         const childEntity = entities[children[j]];

  //         entity.addChild(childEntity);
  //       }
  //     }
  //   }
  // }

  // _createSceneRoots(context, glTFResource) {
  //   const { scene: sceneID = 0, scenes } = context.glTF;
  //   const { engine, entities } = glTFResource;

  //   if (!scenes) return;

  //   const sceneRoots = [];

  //   for (let i = 0; i < scenes.length; i++) {
  //     const { nodes } = scenes[i];

  //     if (!nodes) continue;

  //     if (nodes.length === 1) {
  //       sceneRoots[i] = entities[nodes[0]];
  //     } else {
  //       const rootEntity = new Entity(engine, "GLTF_ROOT");
  //       for (let j = 0; j < nodes.length; j++) {
  //         rootEntity.addChild(entities[nodes[j]]);
  //       }
  //       sceneRoots[i] = rootEntity;
  //     }
  //   }

  //   glTFResource.sceneRoots = sceneRoots;
  //   glTFResource.defaultSceneRoot = sceneRoots[sceneID];
  // }
}
