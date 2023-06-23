import { CameraType } from "../GLTFSchema.js";
import { GLTFParser } from "./GLTFParser.js";

export class GLTFSceneParser extends GLTFParser {
  static _defaultMaterial;

  static _getDefaultMaterial(engine) {
    if (!GLTFSceneParser._defaultMaterial) {
      GLTFSceneParser._defaultMaterial = new BlinnPhongMaterial(engine);
    }

    return GLTFSceneParser._defaultMaterial;
  }

  parse(context) {
    const { glTFResource, glTF } = context;
    const { entities } = glTFResource;
    // const { nodes, cameras } = glTF;
    // if (!nodes) return;
    const defaultSceneRootPromiseInfo = context.defaultSceneRootPromiseInfo;

    const entityManager = context.manager.world.entityManager;
    const assetManager = context.manager.world.assetManager;

    // for (let i = 0; i < nodes.length; i++) {
    //   const glTFNode = nodes[i];
    //   const { camera: cameraID, mesh: meshID, extensions } = glTFNode;

    //   const entity = entities[i];

    //   // if (cameraID !== undefined) {
    //   //   this._createCamera(glTFResource, cameras[cameraID], entity);
    //   // }

    //   // if (meshID !== undefined) {
    //   //   this._createRenderer(context, glTFNode, entity);
    //   // }

    //   GLTFParser.executeExtensionsAdditiveAndParse(extensions, context, entity, glTFNode);
    // }

    // if (glTFResource.defaultSceneRoot) {
    //   this._createAnimator(context);
    // }

    const { scene: sceneID = 0, scenes } = context.glTF;

    if (!scenes) return;

    const sceneRoots = [];

    for (let i = 0; i < scenes.length; i++) {
      const { nodes } = scenes[i];

      if (!nodes) continue;

      // let sceneData = [];
      const sceneData = assetManager.createAssetData(null, "Scene", "Scene");
      const entDatas = [];
      sceneData.Scene.entDatas = entDatas;

      for (let j = 0; j < nodes.length; j++) {
        let prefabData = [];
        this._getHeriachyNodes(nodes[j], entities, prefabData);
        entityManager.copyEntityDatas(prefabData, entities, entDatas, { outDefault: true });
      }

      sceneRoots[i] = sceneData;
      // if (nodes.length === 1) {
      //   sceneRoots[i] = entities[nodes[0]];
      // } else {
      //   const rootEntity = new Entity(engine, "GLTF_ROOT");
      //   for (let j = 0; j < nodes.length; j++) {
      //     rootEntity.addChild(entities[nodes[j]]);
      //   }
      //   sceneRoots[i] = rootEntity;
      // }
    }
    console.log(sceneRoots);

    glTFResource.sceneRoots = sceneRoots;
    glTFResource.defaultSceneRoot = sceneRoots[sceneID];

    defaultSceneRootPromiseInfo.resolve(glTFResource.defaultSceneRoot);

    return defaultSceneRootPromiseInfo.promise;
  }
  _getHeriachyNodes(node, entDatas, nodes) {
    const entData = entDatas[node];
    const children = entData.Children;
    nodes.push(node);
    if (children == null)
      return;
    for (let i = 0; i < children.length; i++) {
      const childNode = children[i].entity;
      // nodes.push(childNode);
      this._getHeriachyNodes(childNode, entDatas, nodes);
    }
    // children.forEach(element => nodes.push(element.entity));
  }

  // _createCamera(context, cameraSchema, entity) {
  //   const { orthographic, perspective, type } = cameraSchema;
  //   const camera = entity.addComponent(Camera);

  //   if (type === CameraType.ORTHOGRAPHIC) {
  //     const { xmag, ymag, zfar, znear } = orthographic;

  //     camera.isOrthographic = true;

  //     if (znear !== undefined) {
  //       camera.nearClipPlane = znear;
  //     }
  //     if (zfar !== undefined) {
  //       camera.farClipPlane = zfar;
  //     }

  //     camera.orthographicSize = Math.max(ymag ?? 0, xmag ?? 0) / 2;
  //   } else if (type === CameraType.PERSPECTIVE) {
  //     const { aspectRatio, yfov, zfar, znear } = perspective;

  //     if (aspectRatio !== undefined) {
  //       camera.aspectRatio = aspectRatio;
  //     }
  //     if (yfov !== undefined) {
  //       camera.fieldOfView = (yfov * 180) / Math.PI;
  //     }
  //     if (zfar !== undefined) {
  //       camera.farClipPlane = zfar;
  //     }
  //     if (znear !== undefined) {
  //       camera.nearClipPlane = znear;
  //     }
  //   }

  //   if (!context.cameras) context.cameras = [];
  //   context.cameras.push(camera);
  //   // @todo: use engine camera by default
  //   camera.enabled = false;
  // }

  // _createRenderer(context, glTFNode, entity) {
  //   const { glTFResource, glTF } = context;
  //   const { meshes: glTFMeshes } = glTF;

  //   const { engine, meshes, materials, skins } = glTFResource;
  //   const { mesh: meshID, skin: skinID } = glTFNode;
  //   const glTFMesh = glTFMeshes[meshID];
  //   const glTFMeshPrimitives = glTFMesh.primitives;
  //   const blendShapeWeights = glTFNode.weights || glTFMesh.weights;

  //   for (let i = 0; i < glTFMeshPrimitives.length; i++) {
  //     const gltfPrimitive = glTFMeshPrimitives[i];
  //     const mesh = meshes[meshID][i];
  //     let renderer;

  //     if (skinID !== undefined || blendShapeWeights) {
  //       context.hasSkinned = true;
  //       const skinRenderer = entity.addComponent(SkinnedMeshRenderer);
  //       skinRenderer.mesh = mesh;
  //       if (skinID !== undefined) {
  //         skinRenderer.skin = skins[skinID];
  //       }
  //       if (blendShapeWeights) {
  //         skinRenderer.blendShapeWeights = new Float32Array(blendShapeWeights);
  //       }
  //       renderer = skinRenderer;
  //     } else {
  //       renderer = entity.addComponent(MeshRenderer);
  //       renderer.mesh = mesh;
  //     }

  //     const materialIndex = gltfPrimitive.material;
  //     const material = materials?.[materialIndex] || GLTFSceneParser._getDefaultMaterial(engine);
  //     renderer.setMaterial(material);

  //     // Enable vertex color if mesh has COLOR_0 vertex element
  //     mesh.vertexElements.forEach((element) => {
  //       if (element.semantic === "COLOR_0") {
  //         renderer.enableVertexColor = true;
  //       }
  //     });

  //     GLTFParser.executeExtensionsAdditiveAndParse(gltfPrimitive.extensions, context, renderer, gltfPrimitive);
  //   }
  // }

  // _createAnimator(context) {
  //   if (!context.hasSkinned && !context.glTFResource.animations) {
  //     return;
  //   }

  //   const { defaultSceneRoot, animations } = context.glTFResource;
  //   const animator = defaultSceneRoot.addComponent(Animator);
  //   const animatorController = new AnimatorController();
  //   const layer = new AnimatorControllerLayer("layer");
  //   const animatorStateMachine = new AnimatorStateMachine();
  //   animatorController.addLayer(layer);
  //   animator.animatorController = animatorController;
  //   layer.stateMachine = animatorStateMachine;
  //   if (animations) {
  //     for (let i = 0; i < animations.length; i++) {
  //       const animationClip = animations[i];
  //       const name = animationClip.name;
  //       const uniqueName = animatorStateMachine.makeUniqueStateName(name);
  //       if (uniqueName !== name) {
  //         console.warn(`AnimatorState name is existed, name: ${name} reset to ${uniqueName}`);
  //       }
  //       const animatorState = animatorStateMachine.addState(uniqueName);
  //       animatorState.clip = animationClip;
  //     }
  //   }
  // }
}
