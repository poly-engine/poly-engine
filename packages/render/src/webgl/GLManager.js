import { vec4 } from "@poly-engine/math";
import { BlendFactor } from "../render/enums/BlendFactor";
import { BlendOperation } from "../render/enums/BlendOperation";
import { ColorWriteMask } from "../render/enums/ColorWriteMask";
import { CompareFunction } from "../render/enums/CompareFunction";
import { CullMode } from "../render/enums/CullMode";
import { StencilOperation } from "../render/enums/StencilOperation";
import { GLCapabilityType } from "./GLCapabilityType";

/**
 * @class GLManager
 */
export class GLManager {
    constructor(world) {
        this.world = world;
        this.htmlManager = world.htmlManager;

        this.canvasElement = null;
        this.gl = null;
        this.isWebGL2 = false;

        this.activeTextureID = 0;
        this.activeTextures = [];

        this.capabilities = {};
        this.extensions = {};
        this.parameters = {};

        this.renderState = null;
        this._enableGlobalDepthBias = false;
        // this.shaderData = null;

        this.materialEntity = -1;
        this.shaderEntity = -1;
        this.frontFace = 0;
        this.doubleSided = false;

        this.nextMacroId = 0;
        this.macros = [];
        this.nextMacroNameId = 0;
        this.macroNameIdMap = new Map();
        this.macros1 = [];
        this.macroMap = new Map();

        this.properties = [];
        this.nextPropertyId = 0;
        this.propertyMap = new Map();

        this.attributes = [];
        this.nextAttributeId = 0;
        this.attributeMap = new Map();

        // this._fogModeMacro = this.getMacro('SCENE_FOG_MODE', FogMode.None);
        // this._shadowCCMacro = this.getMacro('SCENE_SHADOW_CASCADED_COUNT', ShadowCascadesMode.NoCascades);
        this._readFrameBuffer = null;

        this.init();
    }
    init() {
        this.canvasElement = this.htmlManager.canvasElement;
        this.gl = this.canvasElement.getContext("webgl2");
        this.isWebGL2 = true;

        this._updateGLRenderState();
        this._updateGLCapabilities();
        this._updateGLParameters();

        this._compatibleAllInterface();

        this.renderStateCom = this.world.entityManager.getComponentId("RenderState");
        this.renderState = this.world.entityManager.createComponent(this.renderStateCom);

        // //init shader data
        // const shaderDataCom = this.world.entityManager.getComponentId("ShaderData");
        // this.shaderData = this.world.entityManager.createComponent(shaderDataCom);

        // this.enableMacro(this.shaderData, this._fogModeMacro, FogMode.None);
        // this.enableMacro(this.shaderData, this._shadowCCMacro, ShadowCascadesMode.NoCascades);
    }

    _updateGLRenderState() {
        const gl = this.gl;

        // init blend state same as BlendState default value.
        gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        gl.colorMask(true, true, true, true);
        gl.blendColor(0, 0, 0, 0);
        gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);

        // init depth state same as DepthState default value.
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        gl.depthMask(true);

        // init stencil state same as StencilState default value.
        gl.disable(gl.STENCIL_TEST);
        gl.stencilFuncSeparate(gl.FRONT, gl.ALWAYS, 0, 0xff);
        gl.stencilFuncSeparate(gl.BACK, gl.ALWAYS, 0, 0xff);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMask(0xff);

        // init raster state same as RasterState default value.
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(0, 0);

        this.activeTextureID = gl.TEXTURE0;
        gl.activeTexture(gl.TEXTURE0);
    }
    _updateGLParameters() {
        const gl = this.gl;
        const params = this.parameters;
        params.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        params.maxDrawBuffers = this.canIUse(GLCapabilityType.drawBuffers) ? gl.getParameter(gl.MAX_DRAW_BUFFERS) : 1;
        const ext = this.requireExtension(GLCapabilityType.textureFilterAnisotropic);
        params.maxAnisoLevel = ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
        params.maxAntiAliasing = this.canIUse(GLCapabilityType.multipleSample) ? gl.getParameter(gl.MAX_SAMPLES) : 1;
    }
    _updateGLCapabilities() {
        const isWebGL2 = this.isWebGL2;
        const requireExtension = (ext) => this.requireExtension(ext);
        const cap = this.capabilities;

        const {
            shaderVertexID,
            standardDerivatives,
            shaderTextureLod,
            elementIndexUint,
            depthTexture,
            vertexArrayObject,
            instancedArrays,
            multipleSample,
            drawBuffers,

            astc,
            astc_webkit,
            etc,
            etc_webkit,
            etc1,
            etc1_webkit,
            pvrtc,
            pvrtc_webkit,
            s3tc,
            s3tc_webkit,

            textureFloat,
            textureHalfFloat,
            textureFloatLinear,
            textureHalfFloatLinear,
            WEBGL_colorBufferFloat,
            colorBufferFloat,
            colorBufferHalfFloat,
            textureFilterAnisotropic
        } = GLCapabilityType;
        cap[shaderVertexID] = isWebGL2;
        cap[standardDerivatives] = isWebGL2 || !!requireExtension(standardDerivatives);
        cap[shaderTextureLod] = isWebGL2 || !!requireExtension(shaderTextureLod);
        cap[elementIndexUint] = isWebGL2 || !!requireExtension(elementIndexUint);
        cap[depthTexture] = isWebGL2 || !!requireExtension(depthTexture);
        cap[vertexArrayObject] = isWebGL2 || !!requireExtension(vertexArrayObject);
        cap[instancedArrays] = isWebGL2 || !!requireExtension(instancedArrays);
        cap[multipleSample] = isWebGL2;
        cap[drawBuffers] = isWebGL2 || !!requireExtension(drawBuffers);
        cap[textureFloat] = isWebGL2 || !!requireExtension(textureFloat);
        cap[textureHalfFloat] = isWebGL2 || !!requireExtension(textureHalfFloat);
        cap[textureFloatLinear] = !!requireExtension(textureFloatLinear);
        cap[textureHalfFloatLinear] = isWebGL2 || !!requireExtension(textureHalfFloatLinear);
        cap[colorBufferFloat] = (isWebGL2 && !!requireExtension(colorBufferFloat)) || !!requireExtension(WEBGL_colorBufferFloat);
        cap[colorBufferHalfFloat] = (isWebGL2 && !!requireExtension(colorBufferFloat)) || !!requireExtension(colorBufferHalfFloat);
        cap[textureFilterAnisotropic] = !!requireExtension(textureFilterAnisotropic);

        cap[astc] = !!(requireExtension(astc) || requireExtension(astc_webkit));
        cap[etc] = !!(requireExtension(etc) || requireExtension(etc_webkit));
        cap[etc1] = !!(requireExtension(etc1) || requireExtension(etc1_webkit));
        cap[pvrtc] = !!(requireExtension(pvrtc) || requireExtension(pvrtc_webkit));
        cap[s3tc] = !!(requireExtension(s3tc) || requireExtension(s3tc_webkit));

        cap.canIUseMoreJoints = cap.textureFloat && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
        cap.canUseFloatTextureBlendShape = cap.shaderVertexID && cap.textureFloat && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
    }

    requireExtension(ext) {
        const gl = this.gl;
        const exts = this.extensions;
        let result = exts[ext];
        if (result !== undefined) {
            return result;
        }
        result = exts[ext] = gl.getExtension(ext);
        return result;
    }

    canIUse(capabilityType) {
        const cap = this.capabilities;
        return cap[capabilityType];
    }

    activeTexture(textureID) {
        const gl = this.gl;
        if (this.activeTextureID !== textureID) {
            gl.activeTexture(textureID);
            this.activeTextureID = textureID;
        }
    }

    _compatibleInterface(capabilityType, flatItem) {
        const gl = this.gl;
        let ext = null;

        if ((ext = this.requireExtension(capabilityType))) {
            for (let glKey in flatItem) {
                const extensionKey = flatItem[glKey];
                const extensionVal = ext[extensionKey];

                // Mini game hack the native function,use “.bind” to smooth out if is “Funcion”.
                if (extensionVal?.bind) {
                    gl[glKey] = extensionVal.bind(ext);
                } else {
                    gl[glKey] = extensionVal;
                }
            }
        }
    }

    _compatibleAllInterface() {
        const {
            depthTexture,
            vertexArrayObject,
            instancedArrays,
            drawBuffers,
            textureFilterAnisotropic,
            textureHalfFloat,
            colorBufferHalfFloat,
            WEBGL_colorBufferFloat
        } = GLCapabilityType;
        const { isWebGL2 } = this;

        if (!isWebGL2) {
            this._compatibleInterface(depthTexture, {
                UNSIGNED_INT_24_8: "UNSIGNED_INT_24_8_WEBGL"
            });
            this._compatibleInterface(vertexArrayObject, {
                createVertexArray: "createVertexArrayOES",
                deleteVertexArray: "deleteVertexArrayOES",
                isVertexArray: "isVertexArrayOES",
                bindVertexArray: "bindVertexArrayOES"
            });
            this._compatibleInterface(instancedArrays, {
                drawArraysInstanced: "drawArraysInstancedANGLE",
                drawElementsInstanced: "drawElementsInstancedANGLE",
                vertexAttribDivisor: "vertexAttribDivisorANGLE"
            });
            this._compatibleInterface(drawBuffers, {
                MAX_DRAW_BUFFERS: "MAX_DRAW_BUFFERS_WEBGL"
            });
            const items = {};
            if (this.canIUse(GLCapabilityType.drawBuffers)) {
                const maxDrawBuffers = this.maxDrawBuffers;
                for (let i = 0; i < maxDrawBuffers; i++) {
                    i != 0 && (items[`COLOR_ATTACHMENT${i}`] = `COLOR_ATTACHMENT${i}_WEBGL`);
                    items[`DRAW_BUFFER${i}`] = `DRAW_BUFFER${i}_WEBGL`;
                }
                this._compatibleInterface(drawBuffers, {
                    drawBuffers: "drawBuffersWEBGL",
                    ...items
                });
            }
            this._compatibleInterface(textureHalfFloat, {
                HALF_FLOAT: "HALF_FLOAT_OES"
            });
            this._compatibleInterface(colorBufferHalfFloat, {
                RGBA16F: "RBGA16F_EXT"
            });
            this._compatibleInterface(WEBGL_colorBufferFloat, {
                RGBA32F: "RBGA32F_EXT"
            });
        }

        this._compatibleInterface(textureFilterAnisotropic, {
            TEXTURE_MAX_ANISOTROPY_EXT: "TEXTURE_MAX_ANISOTROPY_EXT"
        });
    }

    bindTexture(textureState) {
        const gl = this.gl;
        const index = this.activeTextureID - gl.TEXTURE0;
        const texture = textureState.texture;
        if (this.activeTextures[index] !== texture) {
            gl.bindTexture(textureState.target, texture);
            this.activeTextures[index] = texture;
        }
    }

    //#region  property/macro

    getProperty(name) {
        let property = this.propertyMap.get(name);
        if (property)
            return property;
        let id = this.nextPropertyId++;
        property = { id, name };
        this.properties[id] = property;
        this.propertyMap.set(name, property);
        return property;
    }
    getAttribute(name) {
        let attr = this.attributeMap.get(name);
        if (attr)
            return attr;
        let id = this.nextAttributeId++;
        attr = { id, name };
        this.attributes[id] = attr;
        this.attributeMap.set(name, attr);
        return attr;
    }
    getAttributeById(id) {
        return this.attributes[id];
    }
    getMacro(name, value) {
        const key = value != null ? name + ` ` + value : name;
        let macro = this.macroMap.get(key);
        if (macro)
            return macro;

        const id = this.nextMacroId++;
        let nameId = this.macroNameIdMap.get(name);
        if (nameId === undefined) {
            nameId = this.nextMacroNameId++;
            this.macroNameIdMap.set(name, nameId);
        }
        macro = { id, nameId, name, value, key };
        this.macros[id] = macro;
        this.macroMap.set(key, macro);
        return macro;
    }
    // getMacroById(id) {
    //     return this.macros[id];
    // }

    setPropertyValue(shaderData, property, value) {
        if (typeof property === "string") {
            property = this.getProperty(property);
        }
        if (property._group !== shaderData.group) {
            if (property._group === undefined) {
                property._group = shaderData.group;
            } else {
                throw `Shader property ${property.name} has been used as ${ShaderDataGroup[property._group]} group.`;
            }
        }
        // if (property._type !== type) {
        //     if (property._type === undefined) {
        //         property._type = type;
        //     } else {
        //         throw `Shader property ${property.name} has been used as ${ShaderPropertyType[property._type]} type.`;
        //     }
        // }
        shaderData.uniforms[property.id] = value;
    }
    getPropertyValue(shaderData, property) {
        if (typeof property === "string") {
            property = this.getProperty(property);
        }
        return shaderData.uniforms[property.id];
    }
    enableMacro(shaderData, macro, value) {
        if (typeof macro === "string") {
            macro = this.getMacro(macro, value);
        }
        const nameId = macro.nameId;
        if (macro.value !== value) {
            macro = this.getMacro(macro.name, value);
        }
        // const lastMacro = this.macroNameIdMap.get(nameID);
        // const lastMacro = this.macros[nameId];
        // if (lastMacro !== macro) {
        //     this.macros[nameId] = macro;
        // }
        // shaderData.macros.or(nameId);
        const lastMacro = this.macros1[nameId];
        if (lastMacro !== macro) {
            this.macros1[nameId] = macro;
            if (lastMacro != null)
                shaderData.macros.not(lastMacro.id);

        }
        shaderData.macros.or(macro.id);
        return macro;
    }
    disableMacro(shaderData, macro) {
        let nameId;
        if (typeof macro === "string") {
            // macro = this.getMacro(macro, value);
            nameId = this.macroNameIdMap.get(macro);
            if (nameId === undefined)
                return;
        }
        else
            nameId = macro.nameId;
        // const currentMacro = this.macros[nameId];
        // if (currentMacro)
        //     shaderData.macros.not(nameId);
        const currentMacro = this.macros1[nameId];
        if (currentMacro)
            shaderData.macros.not(currentMacro.id);
    }
    getMacroNames(macroBitset, macroNameList) {
        macroBitset.forEachValues((value) => {
            macroNameList.push(this.macros[value].key);
        });
        // console.log(macroNameList);
    }
    //#endregion

    _getReadFrameBuffer() {
        let frameBuffer = this._readFrameBuffer;
        if (!frameBuffer) {
            this._readFrameBuffer = frameBuffer = this.gl.createFramebuffer();
        }
        return frameBuffer;
    }

    //#region renderState const

    //#endregion

    //#region renderState
    applyRenderState(renderState, frontFaceInvert) {
        const lastRenderState = this.renderState;
        // this.blendState._apply(hardwareRenderer, lastRenderState);
        this._applyBlendState(renderState.blendState, lastRenderState.blendState);
        // this.depthState._apply(hardwareRenderer, lastRenderState);
        this._applyDepthState(renderState.depthState, lastRenderState.depthState);
        // this.stencilState._apply(hardwareRenderer, lastRenderState);
        this._applyStencilState(renderState.stencilState, lastRenderState.stencilState);
        // this.rasterState._apply(hardwareRenderer, lastRenderState, frontFaceInvert);
        this._applyRasterState(renderState.rasterState, lastRenderState.rasterState, frontFaceInvert);
    }
    _getGLBlendFactor(blendFactor) {
        const gl = this.gl;
        switch (blendFactor) {
            case BlendFactor.Zero:
                return gl.ZERO;
            case BlendFactor.One:
                return gl.ONE;
            case BlendFactor.SourceColor:
                return gl.SRC_COLOR;
            case BlendFactor.OneMinusSourceColor:
                return gl.ONE_MINUS_SRC_COLOR;
            case BlendFactor.DestinationColor:
                return gl.DST_COLOR;
            case BlendFactor.OneMinusDestinationColor:
                return gl.ONE_MINUS_DST_COLOR;
            case BlendFactor.SourceAlpha:
                return gl.SRC_ALPHA;
            case BlendFactor.OneMinusSourceAlpha:
                return gl.ONE_MINUS_SRC_ALPHA;
            case BlendFactor.DestinationAlpha:
                return gl.DST_ALPHA;
            case BlendFactor.OneMinusDestinationAlpha:
                return gl.ONE_MINUS_DST_ALPHA;
            case BlendFactor.SourceAlphaSaturate:
                return gl.SRC_ALPHA_SATURATE;
            case BlendFactor.BlendColor:
                return gl.CONSTANT_COLOR;
            case BlendFactor.OneMinusBlendColor:
                return gl.ONE_MINUS_CONSTANT_COLOR;
        }
    }
    _getGLBlendOperation(blendOperation) {
        const gl = this.gl;
        switch (blendOperation) {
            case BlendOperation.Add:
                return gl.FUNC_ADD;
            case BlendOperation.Subtract:
                return gl.FUNC_SUBTRACT;
            case BlendOperation.ReverseSubtract:
                return gl.FUNC_REVERSE_SUBTRACT;
            case BlendOperation.Min:
                if (!this.canIUse(GLCapabilityType.blendMinMax)) {
                    throw new Error("BlendOperation.Min is not supported in this context");
                }
                return gl.MIN; // in webgl1.0 is an extension
            case BlendOperation.Max:
                if (!this.canIUse(GLCapabilityType.blendMinMax)) {
                    throw new Error("BlendOperation.Max is not supported in this context");
                }
                return gl.MAX; // in webgl1.0 is an extension
        }
    }
    _applyBlendState(state, lastState) {
        const gl = this.gl;

        const enabled = state.enabled;
        if (enabled !== lastState.enabled) {
            if (enabled) {
                gl.enable(gl.BLEND);
            } else {
                gl.disable(gl.BLEND);
            }
            lastState.enabled = enabled;
        }
        const sourceColorBlendFactor = state.sourceColorBlendFactor;
        const destinationColorBlendFactor = state.destinationColorBlendFactor;
        const sourceAlphaBlendFactor = state.sourceAlphaBlendFactor;
        const destinationAlphaBlendFactor = state.destinationAlphaBlendFactor;
        const colorBlendOperation = state.colorBlendOperation;
        const alphaBlendOperation = state.alphaBlendOperation;
        if (enabled) {
            // apply blend factor.
            if (
                sourceColorBlendFactor !== lastState.sourceColorBlendFactor ||
                destinationColorBlendFactor !== lastState.destinationColorBlendFactor ||
                sourceAlphaBlendFactor !== lastState.sourceAlphaBlendFactor ||
                destinationAlphaBlendFactor !== lastState.destinationAlphaBlendFactor
            ) {
                gl.blendFuncSeparate(
                    this._getGLBlendFactor(sourceColorBlendFactor),
                    this._getGLBlendFactor(destinationColorBlendFactor),
                    this._getGLBlendFactor(sourceAlphaBlendFactor),
                    this._getGLBlendFactor(destinationAlphaBlendFactor)
                );
                lastState.sourceColorBlendFactor = sourceColorBlendFactor;
                lastState.destinationColorBlendFactor = destinationColorBlendFactor;
                lastState.sourceAlphaBlendFactor = sourceAlphaBlendFactor;
                lastState.destinationAlphaBlendFactor = destinationAlphaBlendFactor;
            }

            // apply blend operation.
            if (
                colorBlendOperation !== lastState.colorBlendOperation ||
                alphaBlendOperation !== lastState.alphaBlendOperation
            ) {
                gl.blendEquationSeparate(
                    this._getGLBlendOperation(colorBlendOperation),
                    this._getGLBlendOperation(alphaBlendOperation)
                );
                lastState.colorBlendOperation = colorBlendOperation;
                lastState.alphaBlendOperation = alphaBlendOperation;
            }

            // apply blend color.
            const blendColor = state.blendColor;
            // if (!Color.equals(lastState.blendColor, blendColor)) {
            if (!vec4.equals(lastState.blendColor, blendColor)) {
                gl.blendColor(blendColor[0], blendColor[1], blendColor[2], blendColor[3]);
                // lastState.blendColor.copyFrom(blendColor);
                lastState.blendColor.copyFrom(blendColor);
                vec4.copy(lastState.blendColor, blendColor)
            }
        }

        // apply color mask.
        const colorWriteMask = state.colorWriteMask;
        if (colorWriteMask !== lastState.colorWriteMask) {
            gl.colorMask(
                (colorWriteMask & ColorWriteMask.Red) !== 0,
                (colorWriteMask & ColorWriteMask.Green) !== 0,
                (colorWriteMask & ColorWriteMask.Blue) !== 0,
                (colorWriteMask & ColorWriteMask.Alpha) !== 0
            );
            lastState.colorWriteMask = colorWriteMask;
        }

        // apply alpha to coverage.
        const alphaToCoverage = state.alphaToCoverage;
        if (alphaToCoverage !== lastState.alphaToCoverage) {
            if (alphaToCoverage) {
                gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
            } else {
                gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
            }
            lastState.alphaToCoverage = alphaToCoverage;
        }
    }

    _getGLCompareFunction(compareFunction) {
        const gl = this.gl;
        switch (compareFunction) {
            case CompareFunction.Never:
                return gl.NEVER;
            case CompareFunction.Less:
                return gl.LESS;
            case CompareFunction.Equal:
                return gl.EQUAL;
            case CompareFunction.LessEqual:
                return gl.LEQUAL;
            case CompareFunction.Greater:
                return gl.GREATER;
            case CompareFunction.NotEqual:
                return gl.NOTEQUAL;
            case CompareFunction.GreaterEqual:
                return gl.GEQUAL;
            case CompareFunction.Always:
                return gl.ALWAYS;
        }
    }
    _applyDepthState(state, lastState) {
        const gl = this.gl;

        const { enabled, compareFunction, writeEnabled } = state;

        if (enabled != lastState.enabled) {
            if (enabled) {
                gl.enable(gl.DEPTH_TEST);
            } else {
                gl.disable(gl.DEPTH_TEST);
            }
            lastState.enabled = enabled;
        }

        if (enabled) {
            // apply compare func.
            if (compareFunction != lastState.compareFunction) {
                gl.depthFunc(this._getGLCompareFunction(compareFunction));
                lastState.compareFunction = compareFunction;
            }

            // apply write enabled.
            if (writeEnabled != lastState.writeEnabled) {
                gl.depthMask(writeEnabled);
                lastState.writeEnabled = writeEnabled;
            }
        }
    }

    // _getGLCompareFunction(compareFunction) {
    //     const gl = rhi.gl;

    //     switch (compareFunction) {
    //         case CompareFunction.Never:
    //             return gl.NEVER;
    //         case CompareFunction.Less:
    //             return gl.LESS;
    //         case CompareFunction.Equal:
    //             return gl.EQUAL;
    //         case CompareFunction.LessEqual:
    //             return gl.LEQUAL;
    //         case CompareFunction.Greater:
    //             return gl.GREATER;
    //         case CompareFunction.NotEqual:
    //             return gl.NOTEQUAL;
    //         case CompareFunction.GreaterEqual:
    //             return gl.GEQUAL;
    //         case CompareFunction.Always:
    //             return gl.ALWAYS;
    //     }
    // }
    _getGLStencilOperation(compareFunction) {
        const gl = this.gl;
        switch (compareFunction) {
            case StencilOperation.Keep:
                return gl.KEEP;
            case StencilOperation.Zero:
                return gl.ZERO;
            case StencilOperation.Replace:
                return gl.REPLACE;
            case StencilOperation.IncrementSaturate:
                return gl.INCR;
            case StencilOperation.DecrementSaturate:
                return gl.DECR;
            case StencilOperation.Invert:
                return gl.INVERT;
            case StencilOperation.IncrementWrap:
                return gl.INCR_WRAP;
            case StencilOperation.DecrementWrap:
                return gl.DECR_WRAP;
        }
    }
    _applyStencilState(state, lastState) {
        const gl = this.gl;

        const {
            enabled,
            referenceValue,
            mask,
            compareFunctionFront,
            compareFunctionBack,
            failOperationFront,
            zFailOperationFront,
            passOperationFront,
            failOperationBack,
            zFailOperationBack,
            passOperationBack,
            writeMask
        } = state;

        if (enabled != lastState.enabled) {
            if (enabled) {
                gl.enable(gl.STENCIL_TEST);
            } else {
                gl.disable(gl.STENCIL_TEST);
            }
            lastState.enabled = enabled;
        }

        if (enabled) {
            // apply stencil func.
            const referenceOrMaskChange = referenceValue !== lastState.referenceValue || mask !== lastState.mask;
            if (referenceOrMaskChange || compareFunctionFront !== lastState.compareFunctionFront) {
                gl.stencilFuncSeparate(
                    gl.FRONT,
                    this._getGLCompareFunction(compareFunctionFront),
                    referenceValue,
                    mask
                );
                lastState.compareFunctionFront = compareFunctionFront;
            }

            if (referenceOrMaskChange || compareFunctionBack !== lastState.compareFunctionBack) {
                gl.stencilFuncSeparate(gl.BACK, this._getGLCompareFunction(compareFunctionBack), referenceValue, mask);
                lastState.compareFunctionBack = this.compareFunctionBack;
            }
            if (referenceOrMaskChange) {
                lastState.referenceValue = this.referenceValue;
                lastState.mask = this.mask;
            }

            // apply stencil operation.
            if (
                failOperationFront !== lastState.failOperationFront ||
                zFailOperationFront !== lastState.zFailOperationFront ||
                passOperationFront !== lastState.passOperationFront
            ) {
                gl.stencilOpSeparate(
                    gl.FRONT,
                    this._getGLStencilOperation(failOperationFront),
                    this._getGLStencilOperation(zFailOperationFront),
                    this._getGLStencilOperation(passOperationFront)
                );
                lastState.failOperationFront = failOperationFront;
                lastState.zFailOperationFront = zFailOperationFront;
                lastState.passOperationFront = passOperationFront;
            }

            if (
                failOperationBack !== lastState.failOperationBack ||
                zFailOperationBack !== lastState.zFailOperationBack ||
                passOperationBack !== lastState.passOperationBack
            ) {
                gl.stencilOpSeparate(
                    gl.BACK,
                    this._getGLStencilOperation(failOperationBack),
                    this._getGLStencilOperation(zFailOperationBack),
                    this._getGLStencilOperation(passOperationBack)
                );
                lastState.failOperationBack = failOperationBack;
                lastState.zFailOperationBack = zFailOperationBack;
                lastState.passOperationBack = passOperationBack;
            }

            // apply write mask.
            if (writeMask !== lastState.writeMask) {
                gl.stencilMask(writeMask);
                lastState.writeMask = writeMask;
            }
        }
    }

    _applyRasterState(state, lastState, frontFaceInvert) {
        const gl = this.gl;

        const { cullMode, depthBias, slopeScaledDepthBias } = state;

        const cullFaceEnable = cullMode !== CullMode.Off;
        if (cullFaceEnable !== lastState._cullFaceEnable) {
            if (cullFaceEnable) {
                gl.enable(gl.CULL_FACE);
            } else {
                gl.disable(gl.CULL_FACE);
            }
            lastState._cullFaceEnable = cullFaceEnable;
        }

        // apply front face.
        if (cullFaceEnable) {
            if (cullMode !== lastState.cullMode) {
                if (cullMode == CullMode.Back) {
                    gl.cullFace(gl.BACK);
                } else {
                    gl.cullFace(gl.FRONT);
                }
                lastState.cullMode = cullMode;
            }
        }

        if (frontFaceInvert !== lastState._frontFaceInvert) {
            if (frontFaceInvert) {
                gl.frontFace(gl.CW);
            } else {
                gl.frontFace(gl.CCW);
            }
            lastState._frontFaceInvert = frontFaceInvert;
        }

        // apply polygonOffset.
        if (!this._enableGlobalDepthBias) {
            if (depthBias !== lastState.depthBias || slopeScaledDepthBias !== lastState.slopeScaledDepthBias) {
                if (depthBias !== 0 || slopeScaledDepthBias !== 0) {
                    gl.enable(gl.POLYGON_OFFSET_FILL);
                    gl.polygonOffset(slopeScaledDepthBias, depthBias);
                } else {
                    gl.disable(gl.POLYGON_OFFSET_FILL);
                }
                lastState.depthBias = depthBias;
                lastState.slopeScaledDepthBias = slopeScaledDepthBias;
            }
        }
    }

    setGlobalDepthBias(bias, slopeBias) {
        const gl = this._gl;
        const enable = bias !== 0 || slopeBias !== 0;
        if (enable) {
            gl.enable(gl.POLYGON_OFFSET_FILL);
            gl.polygonOffset(slopeBias, bias);
        } else {
            gl.disable(gl.POLYGON_OFFSET_FILL);
        }
        this._enableGlobalDepthBias = enable;
    }
    //#endregion
}