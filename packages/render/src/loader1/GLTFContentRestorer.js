import { ContentRestorer } from "@poly-engine/asset";
import { GLTFResource } from "./gltf/GLTFResource";
import { GLTFUtils } from "./gltf/GLTFUtils";

/**
 * @internal
 */
export class GLTFContentRestorer extends ContentRestorer {
  isGLB = false;
  bufferRequests = [];
  glbBufferSlices = [];
  bufferTextures = [];
  meshes = [];
}
/**
 * @internal
 */
export class BufferRequestInfo {
  constructor( url,  config) {
    this.url = url;
    this.config = config;
  }
}

/**
 * @internal
 */
export class BufferTextureRestoreInfo {
  constructor( texture,  bufferView,  mimeType) {
    this.texture = texture;
    this.bufferView = bufferView;
    this.mimeType = mimeType;
  }
}

/**
 * @internal
 */
export class ModelMeshRestoreInfo {
   mesh = null;
   vertexBuffers = [];
   indexBuffer;
   blendShapes = [];
}

/**
 * @internal
 */
export class BufferRestoreInfo {
  constructor( buffer,  data) {
    this.buffer = buffer;
    this.data = data;
  }
}

/**
 * @internal
 */
export class BufferDataRestoreInfo {
  constructor(
     main,
     typeSize,
     sparseCount,
     sparseIndices,
     sparseValues
  ) {
    this.main = main;
    this.typeSize =typeSize;
    this.sparseCount = sparseCount;
    this.sparseIndices = sparseIndices;
    this.sparseValues = sparseValues;
  }
}

/**
 * @internal
 */
export class RestoreDataAccessor {
  constructor(
    bufferIndex,
    TypedArray,
    byteOffset,
    length
  ) {
    this.bufferIndex = bufferIndex;
    this.TypedArray = TypedArray;
    this.byteOffset = byteOffset;
    this.length = length;
  }
}

/**
 * @internal
 */
export class BlendShapeRestoreInfo {
  constructor(
    blendShape,
    position,
    normal,
    tangent
  ) {
    this.blendShape=blendShape;
    this.position=position;
    this.normal=normal;
    this.tangent=tangent;
  }
}
