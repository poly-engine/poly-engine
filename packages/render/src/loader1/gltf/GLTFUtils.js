import { Util } from "@poly-engine/core";
import { VertexElementType } from "../../constants.js";
import { BufferDataRestoreInfo, RestoreDataAccessor } from "../GLTFContentRestorer.js";
import { AccessorComponentType, AccessorType } from "./GLTFSchema.js";
import { BufferInfo, GLTFParserContext } from "./parser/GLTFParserContext.js";

/**
 * @internal
 */
export class GLTFUtils {
  static floatBufferToVector2Array(buffer) {
    const bufferLen = buffer.length;
    const array = new Array(bufferLen / 2);
    for (let i = 0; i < bufferLen; i += 2) {
      array[i / 2] = [buffer[i], buffer[i + 1]];
    }
    return array;
  }

  static floatBufferToVector3Array(buffer) {
    const bufferLen = buffer.length;
    const array = new Array(bufferLen / 3);
    for (let i = 0; i < bufferLen; i += 3) {
      array[i / 3] = [buffer[i], buffer[i + 1], buffer[i + 2]];
    }
    return array;
  }

  static floatBufferToVector4Array(buffer) {
    const bufferLen = buffer.length;
    const array = new Array(bufferLen / 4);
    for (let i = 0; i < bufferLen; i += 4) {
      array[i / 4] = [buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]];
    }
    return array;
  }

  static floatBufferToColorArray(buffer, isColor3) {
    const bufferLen = buffer.length;
    const colors = new Array(bufferLen / (isColor3 ? 3 : 4));

    if (isColor3) {
      for (let i = 0; i < bufferLen; i += 3) {
        colors[i / 3] = [buffer[i], buffer[i + 1], buffer[i + 2], 1.0];
      }
    } else {
      for (let i = 0; i < bufferLen; i += 4) {
        colors[i / 4] = [buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]];
      }
    }

    return colors;
  }

  /**
   * Get the number of bytes occupied by accessor type.
   */
  static getAccessorTypeSize(accessorType) {
    switch (accessorType) {
      case AccessorType.SCALAR:
        return 1;
      case AccessorType.VEC2:
        return 2;
      case AccessorType.VEC3:
        return 3;
      case AccessorType.VEC4:
        return 4;
      case AccessorType.MAT2:
        return 4;
      case AccessorType.MAT3:
        return 9;
      case AccessorType.MAT4:
        return 16;
    }
  }

  /**
   * Get the TypedArray corresponding to the component type.
   */
  static getComponentType(componentType) {
    switch (componentType) {
      case AccessorComponentType.BYTE:
        return Int8Array;
      case AccessorComponentType.UNSIGNED_BYTE:
        return Uint8Array;
      case AccessorComponentType.SHORT:
        return Int16Array;
      case AccessorComponentType.UNSIGNED_SHORT:
        return Uint16Array;
      case AccessorComponentType.UNSIGNED_INT:
        return Uint32Array;
      case AccessorComponentType.FLOAT:
        return Float32Array;
    }
  }

  static getNormalizedComponentScale(componentType) {
    // Reference: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data
    switch (componentType) {
      case AccessorComponentType.BYTE:
        return 1 / 127;
      case AccessorComponentType.UNSIGNED_BYTE:
        return 1 / 255;
      case AccessorComponentType.SHORT:
        return 1 / 32767;
      case AccessorComponentType.UNSIGNED_SHORT:
        return 1 / 65535;
      default:
        throw new Error("Galacean.GLTFLoader: Unsupported normalized accessor component type.");
    }
  }

  static getAccessorBuffer(context, bufferViews, accessor) {
    const { buffers } = context;

    const componentType = accessor.componentType;
    const bufferView = bufferViews[accessor.bufferView];

    const bufferIndex = bufferView.buffer;
    const buffer = buffers[bufferIndex];
    const bufferByteOffset = bufferView.byteOffset || 0;
    const byteOffset = accessor.byteOffset || 0;

    const TypedArray = GLTFUtils.getComponentType(componentType);
    const dataElementSize = GLTFUtils.getAccessorTypeSize(accessor.type);
    const dataElementBytes = TypedArray.BYTES_PER_ELEMENT;
    const elementStride = dataElementSize * dataElementBytes;
    const accessorCount = accessor.count;
    const bufferStride = bufferView.byteStride;

    let bufferInfo;
    // According to the glTF official documentation only byteStride not undefined is allowed
    if (bufferStride !== undefined && bufferStride !== elementStride) {
      const bufferSlice = Math.floor(byteOffset / bufferStride);
      const bufferCacheKey = accessor.bufferView + ":" + componentType + ":" + bufferSlice + ":" + accessorCount;
      const accessorBufferCache = context.accessorBufferCache;
      bufferInfo = accessorBufferCache[bufferCacheKey];
      if (!bufferInfo) {
        const offset = bufferByteOffset + bufferSlice * bufferStride;
        const count = accessorCount * (bufferStride / dataElementBytes);
        const data = new TypedArray(buffer, offset, count);
        accessorBufferCache[bufferCacheKey] = bufferInfo = new BufferInfo(data, true, bufferStride);
        bufferInfo.restoreInfo = new BufferDataRestoreInfo(
          new RestoreDataAccessor(bufferIndex, TypedArray, offset, count)
        );
      }
    } else {
      const offset = bufferByteOffset + byteOffset;
      const count = accessorCount * dataElementSize;
      const data = new TypedArray(buffer, offset, count);
      bufferInfo = new BufferInfo(data, false, elementStride);
      bufferInfo.restoreInfo = new BufferDataRestoreInfo(
        new RestoreDataAccessor(bufferIndex, TypedArray, offset, count)
      );
    }

    if (accessor.sparse) {
      GLTFUtils.processingSparseData(bufferViews, accessor, buffers, bufferInfo);
    }
    return bufferInfo;
  }

  /**
   * @deprecated
   * Get accessor data.
   */
  static getAccessorData(glTF, accessor, buffers) {
    const bufferViews = glTF.bufferViews;
    const bufferView = bufferViews[accessor.bufferView];
    const arrayBuffer = buffers[bufferView.buffer];
    const accessorByteOffset = accessor.hasOwnProperty("byteOffset") ? accessor.byteOffset : 0;
    const bufferViewByteOffset = bufferView.hasOwnProperty("byteOffset") ? bufferView.byteOffset : 0;
    const byteOffset = accessorByteOffset + bufferViewByteOffset;
    const accessorTypeSize = GLTFUtils.getAccessorTypeSize(accessor.type);
    const length = accessorTypeSize * accessor.count;
    const byteStride = bufferView.byteStride ?? 0;
    const arrayType = GLTFUtils.getComponentType(accessor.componentType);
    let uint8Array;
    if (byteStride) {
      const accessorByteSize = accessorTypeSize * arrayType.BYTES_PER_ELEMENT;
      uint8Array = new Uint8Array(accessor.count * accessorByteSize);
      const originalBufferView = new Uint8Array(arrayBuffer, bufferViewByteOffset, bufferView.byteLength);
      for (let i = 0; i < accessor.count; i++) {
        for (let j = 0; j < accessorByteSize; j++) {
          uint8Array[i * accessorByteSize + j] = originalBufferView[i * byteStride + accessorByteOffset + j];
        }
      }
    } else {
      uint8Array = new Uint8Array(arrayBuffer.slice(byteOffset, byteOffset + length * arrayType.BYTES_PER_ELEMENT));
    }

    const typedArray = new arrayType(uint8Array.buffer);

    if (accessor.sparse) {
      const { count, indices, values } = accessor.sparse;
      const indicesBufferView = bufferViews[indices.bufferView];
      const valuesBufferView = bufferViews[values.bufferView];
      const indicesArrayBuffer = buffers[indicesBufferView.buffer];
      const valuesArrayBuffer = buffers[valuesBufferView.buffer];
      const indicesByteOffset = (indices.byteOffset ?? 0) + (indicesBufferView.byteOffset ?? 0);
      const indicesByteLength = indicesBufferView.byteLength;
      const valuesByteOffset = (values.byteOffset ?? 0) + (valuesBufferView.byteOffset ?? 0);
      const valuesByteLength = valuesBufferView.byteLength;

      const indicesType = GLTFUtils.getComponentType(indices.componentType);
      const indicesArray = new indicesType(
        indicesArrayBuffer,
        indicesByteOffset,
        indicesByteLength / indicesType.BYTES_PER_ELEMENT
      );
      const valuesArray = new arrayType(
        valuesArrayBuffer,
        valuesByteOffset,
        valuesByteLength / arrayType.BYTES_PER_ELEMENT
      );

      for (let i = 0; i < count; i++) {
        const replaceIndex = indicesArray[i];
        for (let j = 0; j < accessorTypeSize; j++) {
          typedArray[replaceIndex * accessorTypeSize + j] = valuesArray[i * accessorTypeSize + j];
        }
      }
    }

    return typedArray;
  }

  static getBufferViewData(bufferView, buffers) {
    const { byteOffset = 0 } = bufferView;
    const arrayBuffer = buffers[bufferView.buffer];

    return arrayBuffer.slice(byteOffset, byteOffset + bufferView.byteLength);
  }

  /**
   * Get accessor data.
   */
  static processingSparseData(
    bufferViews,
    accessor,
    buffers,
    bufferInfo
  ) {
    const { restoreInfo } = bufferInfo;
    const accessorTypeSize = GLTFUtils.getAccessorTypeSize(accessor.type);
    const TypedArray = GLTFUtils.getComponentType(accessor.componentType);
    const data = bufferInfo.data.slice();

    const { count, indices, values } = accessor.sparse;
    const indicesBufferView = bufferViews[indices.bufferView];
    const valuesBufferView = bufferViews[values.bufferView];
    const indicesBufferIndex = indicesBufferView.buffer;
    const valuesBufferIndex = valuesBufferView.buffer;
    const indicesArrayBuffer = buffers[indicesBufferIndex];
    const valuesArrayBuffer = buffers[valuesBufferIndex];
    const indicesByteOffset = (indices.byteOffset ?? 0) + (indicesBufferView.byteOffset ?? 0);
    const indicesByteLength = indicesBufferView.byteLength;
    const valuesByteOffset = (values.byteOffset ?? 0) + (valuesBufferView.byteOffset ?? 0);
    const valuesByteLength = valuesBufferView.byteLength;

    restoreInfo.typeSize = accessorTypeSize;
    restoreInfo.sparseCount = count;

    const IndexTypeArray = GLTFUtils.getComponentType(indices.componentType);

    const indexLength = indicesByteLength / IndexTypeArray.BYTES_PER_ELEMENT;
    const indicesArray = new IndexTypeArray(indicesArrayBuffer, indicesByteOffset, indexLength);
    restoreInfo.sparseIndices = new RestoreDataAccessor(
      indicesBufferIndex,
      IndexTypeArray,
      indicesByteOffset,
      indexLength
    );

    const valueLength = valuesByteLength / TypedArray.BYTES_PER_ELEMENT;
    const valuesArray = new TypedArray(valuesArrayBuffer, valuesByteOffset, valueLength);
    restoreInfo.sparseValues = new RestoreDataAccessor(valuesBufferIndex, TypedArray, valuesByteOffset, valueLength);

    for (let i = 0; i < count; i++) {
      const replaceIndex = indicesArray[i];
      for (let j = 0; j < accessorTypeSize; j++) {
        data[replaceIndex * accessorTypeSize + j] = valuesArray[i * accessorTypeSize + j];
      }
    }

    bufferInfo.data = data;
  }

  static getIndexFormat(type) {
    switch (type) {
      case AccessorComponentType.UNSIGNED_BYTE:
        return IndexFormat.UInt8;
      case AccessorComponentType.UNSIGNED_SHORT:
        return IndexFormat.UInt16;
      case AccessorComponentType.UNSIGNED_INT:
        return IndexFormat.UInt32;
    }
  }
  static getElementType(type) {
    switch (type) {
      case AccessorComponentType.FLOAT:
        return VertexElementType.Float;
      case AccessorComponentType.BYTE:
        return VertexElementType.Byte;
      case AccessorComponentType.SHORT:
        return VertexElementType.Short;
      case AccessorComponentType.UNSIGNED_BYTE:
        return VertexElementType.UByte;
      case AccessorComponentType.UNSIGNED_INT:
        return VertexElementType.UInt;
      case AccessorComponentType.UNSIGNED_SHORT:
        return VertexElementType.UShort;
    }
  }
  static getElementFormat(type, size, normalized = false) {
    if (type == AccessorComponentType.FLOAT) {
      switch (size) {
        case 1:
          return VertexElementFormat.Float;
        case 2:
          return VertexElementFormat.Vector2;
        case 3:
          return VertexElementFormat.Vector3;
        case 4:
          return VertexElementFormat.Vector4;
      }
    }

    if (type == AccessorComponentType.SHORT) {
      switch (size) {
        case 2:
          return normalized ? VertexElementFormat.NormalizedShort2 : VertexElementFormat.Short2;
        case 3:
        case 4:
          return normalized ? VertexElementFormat.NormalizedShort4 : VertexElementFormat.Short4;
      }
    }

    if (type == AccessorComponentType.UNSIGNED_SHORT) {
      switch (size) {
        case 2:
          return normalized ? VertexElementFormat.NormalizedUShort2 : VertexElementFormat.UShort2;
        case 3:
        case 4:
          return normalized ? VertexElementFormat.NormalizedUShort4 : VertexElementFormat.UShort4;
      }
    }

    if (type == AccessorComponentType.BYTE) {
      switch (size) {
        case 2:
        case 3:
        case 4:
          return normalized ? VertexElementFormat.NormalizedByte4 : VertexElementFormat.Byte4;
      }
    }

    if (type == AccessorComponentType.UNSIGNED_BYTE) {
      switch (size) {
        case 2:
        case 3:
        case 4:
          return normalized ? VertexElementFormat.NormalizedUByte4 : VertexElementFormat.UByte4;
      }
    }
  }

  /**
   * Load image buffer
   */
  static loadImageBuffer(imageBuffer, type) {
    return new Promise((resolve, reject) => {
      const blob = new window.Blob([imageBuffer], { type });
      const img = new Image();
      img.onerror = function () {
        reject(new Error("Failed to load image buffer"));
      };
      img.onload = function () {
        // Call requestAnimationFrame to avoid iOS's bug.
        requestAnimationFrame(() => {
          resolve(img);
          img.onload = null;
          img.onerror = null;
          img.onabort = null;
        });
      };
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Parse the glb format.
   */
  static parseGLB(
    context,
    glb
  ) {
    const UINT32_LENGTH = 4;
    const GLB_HEADER_MAGIC = 0x46546c67; // 'glTF'
    const GLB_HEADER_LENGTH = 12;
    const GLB_CHUNK_TYPES = { JSON: 0x4e4f534a, BIN: 0x004e4942 };

    const dataView = new DataView(glb);

    // read header
    const header = {
      magic: dataView.getUint32(0, true),
      version: dataView.getUint32(UINT32_LENGTH, true),
      length: dataView.getUint32(2 * UINT32_LENGTH, true)
    };

    if (header.magic !== GLB_HEADER_MAGIC) {
      console.error("Invalid glb magic number. Expected 0x46546C67, found 0x" + header.magic.toString(16));
      return null;
    }

    // read main data
    let chunkLength = dataView.getUint32(GLB_HEADER_LENGTH, true);
    let chunkType = dataView.getUint32(GLB_HEADER_LENGTH + UINT32_LENGTH, true);

    // read glTF json
    if (chunkType !== GLB_CHUNK_TYPES.JSON) {
      console.error("Invalid glb chunk type. Expected 0x4E4F534A, found 0x" + chunkType.toString(16));
      return null;
    }

    const glTFData = new Uint8Array(glb, GLB_HEADER_LENGTH + 2 * UINT32_LENGTH, chunkLength);
    const glTF = JSON.parse(Util.decodeText(glTFData));

    // read all buffers
    const buffers = [];
    let byteOffset = GLB_HEADER_LENGTH + 2 * UINT32_LENGTH + chunkLength;

    const restoreGLBBufferSlice = context.contentRestorer.glbBufferSlices;
    while (byteOffset < header.length) {
      chunkLength = dataView.getUint32(byteOffset, true);
      chunkType = dataView.getUint32(byteOffset + UINT32_LENGTH, true);

      if (chunkType !== GLB_CHUNK_TYPES.BIN) {
        console.error("Invalid glb chunk type. Expected 0x004E4942, found 0x" + chunkType.toString(16));
        return null;
      }

      const currentOffset = byteOffset + 2 * UINT32_LENGTH;
      const buffer = glb.slice(currentOffset, currentOffset + chunkLength);
      buffers.push(buffer);
      restoreGLBBufferSlice.push([currentOffset, chunkLength]);

      byteOffset += chunkLength + 2 * UINT32_LENGTH;
    }

    return {
      glTF,
      buffers
    };
  }

  static _formatRelativePath(path) {
    // For example input is "a/b", "/a/b", "./a/b", "./a/./b", "./a/../a/b", output is "a/b"
    return path
      .split("/")
      .filter(Boolean)
      .reduce((acc, cur) => {
        if (cur === "..") acc.pop();
        else if (cur !== ".") acc.push(cur);
        return acc;
      }, [])
      .join("/");
  }
}
