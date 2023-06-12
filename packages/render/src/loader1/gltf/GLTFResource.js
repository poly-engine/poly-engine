
/**
 * Product after glTF parser, usually, `defaultSceneRoot` is only needed to use.
 * @class GLTFResource
 */
export class GLTFResource {
  /** glTF file url. */
  url;
  /** Texture2D after TextureParser. */
  textures = null;
  /** Material after MaterialParser. */
  materials = null;
  /** ModelMesh after MeshParser. */
  meshes = null;
  /** Skin after SkinParser. */
  skins = null;
  /** AnimationClip after AnimationParser. */
  animations = null;
  /** Entity after EntityParser. */
  entities = null;
  /** Camera after SceneParser. */
  cameras = null;
  /** Export lights in extension KHR_lights_punctual. */
  lights = null;
  /** RootEntities after SceneParser. */
  sceneRoots = [];
  /** RootEntity after SceneParser. */
  defaultSceneRoot;
  /** Extensions data. */
  extensionsData = null;

  constructor(url) {
    this.url = url;
  }

}
