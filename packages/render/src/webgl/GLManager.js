import { FogMode, ShadowCascadesMode } from "../constants";
import { GLCapabilityType } from "./GLCapabilityType";

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
        this.shaderData = null;

        this.materialEntity = -1;
        this.shaderEntity = -1;
        this.frontFace = 0;
        this.doubleSided = false;

        this.macros = [];
        // this.macros = [];
        this.nextMacroId = 0;
        this.nextMacroNameId = 0;
        this.macroNameIdMap = new Map();
        this.macroMap = new Map();

        this.properties = [];
        this.nextPropertyId = 0;
        this.propertyMap = new Map();

        this.attributes = [];
        this.nextAttributeId = 0;
        this.attributeMap = new Map();

        this._fogModeMacro = this.getMacro('SCENE_FOG_MODE', FogMode.None);
        this._shadowCCMacro = this.getMacro('SCENE_SHADOW_CASCADED_COUNT', ShadowCascadesMode.NoCascades);

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
        
        //init shader data
        const shaderDataCom = this.world.entityManager.getComponentId("ShaderData");
        this.shaderData = this.world.entityManager.createComponent(shaderDataCom);

        this.enableMacro(this.shaderData, this._fogModeMacro, FogMode.None);
        this.enableMacro(this.shaderData, this._shadowCCMacro, ShadowCascadesMode.NoCascades);
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
        this.macros[nameId] = macro;
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
        const lastMacro = this.macros[nameId];
        if (lastMacro !== macro) {
            this.macros[nameId] = macro;
        }
        shaderData.macros.or(nameId);
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
        const currentMacro = this.macros[nameId];
        if (currentMacro)
            shaderData.macros.not(nameId);
    }
    getMacroNames(macroBitset, macroNameList) {
        macroBitset.forEachValues((value) => {
            macroNameList.push(this.macros[value].key);
        });
        console.log(macroNameList);
    }
    //#endregion
}