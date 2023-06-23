import { CameraClearFlags } from "../camera/enums/CameraClearFlags";
import { VertexElementType } from "../constants";
import { BufferUsage } from "../geometry/BufferUsage";


export class GLUtil {
    // static requireExtension(glState, ext) {
    //     const gl = glState.gl;
    //     const exts = glState.extensions;
    //     let result = exts[ext];
    //     if (result !== undefined) {
    //         return result;
    //     }
    //     result = exts[ext] = gl.getExtension(ext);
    //     return result;
    // }

    // static canIUse(glState, capabilityType) {
    //     const cap = glState.capabilities;
    //     return cap[capabilityType];
    // }

    // static activeTexture(glState, textureID) {
    //     const gl = glState.gl;
    //     if (glState.activeTextureID !== textureID) {
    //         gl.activeTexture(textureID);
    //         glState.activeTextureID = textureID;
    //     }
    // }

    // static bindTexture(glState, textureState) {
    //     const gl = glState.gl;
    //     const index = glState.activeTextureID - gl.TEXTURE0;
    //     const texture = textureState.texture;
    //     if (glState.activeTextures[index] !== texture) {
    //         gl.bindTexture(textureState.target, texture);
    //         glState.activeTextures[index] = texture;
    //     }
    // }

    //#region consts
    static getGlClearFlag(gl, clearFlag) {
        let result = 0;
        if (clearFlag & CameraClearFlags.Color) {
            result |= gl.COLOR_BUFFER_BIT;
        }
        if (clearFlag & CameraClearFlags.Depth) {
            result |= gl.DEPTH_BUFFER_BIT;
        }
        if (clearFlag & CameraClearFlags.Stencil) {
            result |= gl.STENCIL_BUFFER_BIT;
        }
        return result;
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {number} format 
     * @returns {number}
     */
    static getGlVertextElementType(gl, format) {
        switch (format) {
            case VertexElementType.Float: return gl.FLOAT;
            case VertexElementType.Byte: return gl.BYTE;
            case VertexElementType.UByte: return gl.UNSIGNED_BYTE;
            case VertexElementType.Short: return gl.SHORT;
            case VertexElementType.UShort: return gl.UNSIGNED_SHORT;
        }
    }
    static getGLBufferUsage(gl, bufferUsage) {
        switch (bufferUsage) {
            case BufferUsage.Static:
                return gl.STATIC_DRAW;
            case BufferUsage.Dynamic:
                return gl.DYNAMIC_DRAW;
            case BufferUsage.Stream:
                return gl.STREAM_DRAW;
        }
    }
    // static getGLIndexType(indexFormat) {
    //     switch (indexFormat) {
    //         case IndexFormat.UInt8:
    //             return DataType.UNSIGNED_BYTE;
    //         case IndexFormat.UInt16:
    //             return DataType.UNSIGNED_SHORT;
    //         case IndexFormat.UInt32:
    //             return DataType.UNSIGNED_INT;
    //     }
    // }

    // static getGLIndexByteCount(indexFormat) {
    //     switch (indexFormat) {
    //         case IndexFormat.UInt8:
    //             return 1;
    //         case IndexFormat.UInt16:
    //             return 2;
    //         case IndexFormat.UInt32:
    //             return 4;
    //     }
    // }
    //#endregion


}