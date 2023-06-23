import { CompMode } from "@poly-engine/core";
import { RenderQueueType } from "./enums/RenderQueueType";
import { BlendOperation } from "./enums/BlendOperation";
import { BlendFactor } from "./enums/BlendFactor";
import { ColorWriteMask } from "./enums/ColorWriteMask";
import { CompareFunction } from "./enums/CompareFunction";
import { StencilOperation } from "./enums/StencilOperation";
import { CullMode } from "./enums/CullMode";

export const RenderStateDef = {
    mode: CompMode.Flag,
    schema: {
        renderQueueType: { type: 'number', default: RenderQueueType.Opaque },
        blendState: {
            type: 'object', default: {
                /** Constant blend color. */
                blendColor: [0, 0, 0, 0],
                /** Whether to use (Alpha-to-Coverage) technology. */
                alphaToCoverage: false,
                /** Whether to enable blend. */
                enabled: false,
                /** color (RGB) blend operation. */
                colorBlendOperation: BlendOperation.Add,
                /** alpha (A) blend operation. */
                alphaBlendOperation: BlendOperation.Add,
                /** color blend factor (RGB) for source. */
                sourceColorBlendFactor: BlendFactor.One,
                /** alpha blend factor (A) for source. */
                sourceAlphaBlendFactor: BlendFactor.One,
                /** color blend factor (RGB) for destination. */
                destinationColorBlendFactor: BlendFactor.Zero,
                /** alpha blend factor (A) for destination. */
                destinationAlphaBlendFactor: BlendFactor.Zero,
                /** color mask. */
                colorWriteMask: ColorWriteMask.All,
            }
        },
        depthState: {
            type: 'object', default: {
                /** Whether to enable the depth test. */
                enabled: true,
                /** Whether the depth value can be written.*/
                writeEnabled: true,
                /** Depth comparison function. */
                compareFunction: CompareFunction.Less,
            }
        },
        stencilState: {
            type: 'object', default: {
                /** Whether to enable stencil test. */
                enabled: false,
                /** Write the reference value of the stencil buffer. */
                referenceValue: 0,
                /** Specifying a bit-wise mask that is used to AND the reference value and the stored stencil value when the test is done. */
                mask: 0xff,
                /** Specifying a bit mask to enable or disable writing of individual bits in the stencil planes. */
                writeMask: 0xff,
                /** The comparison function of the reference value of the front face of the geometry and the current buffer storage value. */
                compareFunctionFront: CompareFunction.Always,
                /** The comparison function of the reference value of the back of the geometry and the current buffer storage value. */
                compareFunctionBack: CompareFunction.Always,
                /** specifying the function to use for front face when both the stencil test and the depth test pass. */
                passOperationFront: StencilOperation.Keep,
                /** specifying the function to use for back face when both the stencil test and the depth test pass. */
                passOperationBack: StencilOperation.Keep,
                /** specifying the function to use for front face when the stencil test fails. */
                failOperationFront: StencilOperation.Keep,
                /** specifying the function to use for back face when the stencil test fails. */
                failOperationBack: StencilOperation.Keep,
                /** specifying the function to use for front face when the stencil test passes, but the depth test fails. */
                zFailOperationFront: StencilOperation.Keep,
                /** specifying the function to use for back face when the stencil test passes, but the depth test fails. */
                zFailOperationBack: StencilOperation.Keep,

            }
        },
        rasterState: {
            type: 'object', default: {
                /** Specifies whether or not front- and/or back-facing polygons can be culled. */
                cullMode: CullMode.Back,
                /** The multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. */
                depthBias: 0,
                /** The scale factor for the variable depth offset for each polygon. */
                slopeScaledDepthBias: 0,
                cullFaceEnable: true,
                frontFaceInvert: false,
            }
        },
    }
};