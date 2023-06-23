import { CompMode, CompType } from "@poly-engine/core";
import { MeshTopology, VertexElementType } from "../constants.js";
import { BufferUsage } from "./BufferUsage.js";

export const GeometryDef = {
    type: CompType.Shared,
    schema: {
        id: { type: 'string', default: null },
        vertexBuffers: {
            type: 'array', default: [], value: {
                type: 'object', default: null, schema: {
                    stride: { type: 'number', default: 0 },
                    //buffer
                    byteLength: { type: 'number', default: 0 },
                    bufferUsage: { type: 'number', default: BufferUsage.Static },
                    type: { type: 'number', default: VertexElementType.Float },
                    data: {
                        type: 'bin', default: null
                    },
                    // elements: {
                    //     type: 'array', default: [], value: {
                    //         type: 'object', default: null, schema: {
                    //             name: { type: 'string', default: null },
                    //             size: { type: 'number', default: 0 },
                    //             offset: { type: 'number', default: 0 },
                    //             normalize: { type: 'boolean', default: false },
                    //         }
                    //     }
                    // },
                }
            }
        },
        vertexElements: {
            type: 'array', default: [], value: {
                type: 'object', default: null, schema: {
                    index: { type: 'number', default: 0 },
                    name: { type: 'string', default: null },
                    // stride: { type: 'number', default: 0 },
                    type: { type: 'number', default: VertexElementType.Float },
                    size: { type: 'number', default: 0 },
                    offset: { type: 'number', default: 0 },
                    normalize: { type: 'boolean', default: false },
                }
            }
        },
        indexBuffer: {
            // type: 'array', default: null, value: {
            //     type: 'number', default: 0
            // }
            type: 'object', default: null, schema: {
                // format: { type: 'number', default: IndexFormat.UInt16 },

                //buffer
                byteLength: { type: 'number', default: 0 },
                bufferUsage: { type: 'number', default: BufferUsage.Static },
                type: { type: 'number', default: VertexElementType.UShort },
                data: {
                    type: 'bin', default: null
                },
            }
        },
        mode: { type: 'number', default: MeshTopology.Triangles },
        offset: { type: 'number', default: 0 },
        count: { type: 'number', default: 0 },
    }
};

export const GeometryStateDef = {
    mode: CompMode.State,
    schema: {
        vertexBuffers: {
            type: 'array', default: [], value: {
                //gl buffer
                type: 'object', default: null
            }
        },
        indexBuffer: { type: 'object', default: null },
    }
};