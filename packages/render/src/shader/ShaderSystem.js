import { BitSet, System, SystemGroupType } from "@poly-engine/core";
import { AssetSystem } from "@poly-engine/asset";
import { ShaderUtil } from "./ShaderUtil.js";
import { ShaderFactory } from "../shaderlib/ShaderFactory.js";

import { GLUtil } from "../webgl/GLUtil.js";
import { GLCapabilityType } from "../webgl/GLCapabilityType.js";

// export class ShaderProperty {
//     constructor(id, name) {
//         this.id = id;
//         this.name = name;
//     }
// }
// export class ShaderMacro {
//     constructor(id, name, value, key) {
//         this.id = id;
//         this.name = name;
//         this.value = value;
//         this.key = key;
//     }
// }
export class ShaderSystem extends System {
    static _shaderExtension = [
        "GL_EXT_shader_texture_lod",
        "GL_OES_standard_derivatives",
        "GL_EXT_draw_buffers"
    ];
    constructor(world) {
        super(world);
        this.groupId = SystemGroupType.RenderUpdate;
        this.index = 100;

        // this.macros = [];
        // // this.macros = [];
        // this.nextMacroId = 0;
        // this.nextMacroNameId = 0;
        // this.macroNameIdMap = new Map();
        // this.macroMap = new Map();

        // this.properties = [];
        // this.nextPropertyId = 0;
        // this.propertyMap = new Map();

        // this.attributes = [];
        // this.nextAttributeId = 0;
        // this.attributeMap = new Map();

        // this.em = this.world.entityManager;
        // this.qm = this.world.queryManager;
        this.cloneManager = this.world.cloneManager;
        // this.assetManager = this.world.assetManager;

        this.com_glState = this.em.getComponentId('GlState');
        this.com_shader = this.em.getComponentId('Shader');
        // this.com_shaderState = this.em.getComponentId('ShaderState');
        this.com_shaderProgram = this.em.getComponentId('ShaderProgram');
        this.com_texture = this.em.getComponentId('Texture');

        // this.que_shaderStateInit = this.qm.createQuery({
        //     all: [this.com_shader],
        //     none: [this.com_shaderState]
        // });
        // this.que_shaderStateReleae = this.qm.createQuery({
        //     all: [this.com_shaderState],
        //     none: [this.com_shader]
        // });
        this.que_shaderStateInit = this.qm.createQuery({
            all: [this.com_shader],
            none: [this.com_shaderProgram]
        });
        this.que_shaderStateReleae = this.qm.createQuery({
            all: [this.com_shaderProgram],
            none: [this.com_shader]
        });
    }
    init() {
        this.glManager = this.world.glManager;
        // this.assetSystem = this.sm.getSystem(AssetSystem);
        //add default shaders
        // let shader = this.em.createComponent(this.com_shader, 'unlit', unlitVs, unlitFs);
        // this.assetManager.addAssetData({
        //     Asset: { id: 'sha_unlit', type: 'Shader', },
        //     Shader: { id: 'sha_unlit', vSource: unlitVs, fSource: unlitFs, }
        // });
        // this.assetManager.addAssetData({
        //     Asset: { id: 'sha_phong', type: 'Shader', },
        //     Shader: { id: 'sha_phong', vSource: blinnPhongVs, fSource: blinnPhongFs, }
        // });
        // this.assetManager.addAssetData({
        //     Asset: { id: 'sha_pbr', type: 'Shader', },
        //     Shader: { id: 'sha_pbr', vSource: pbrVs, fSource: pbrFs, }
        // });
        // this.assetManager.addAssetData({
        //     Asset: { id: 'sha_pbrSpecular', type: 'Shader', },
        //     Shader: { id: 'sha_pbrSpecular', vSource: pbrVs, fSource: pbrSpecularFs, }
        // });
    }
    _update() {
        const em = this.em;
        // const com_glState = this.com_glState;
        const com_shader = this.com_shader;

        // let glState = em.getSingletonComponent(com_glState);
        // if (!glState)
        //     return;
        this.que_shaderStateInit.forEach(entity => {
            let shader = em.getComponent(entity, com_shader);
            // console.log(shader);
            this.que_shaderStateInit.defer(() => {
                em.setComponent(entity, this.com_shaderProgram);
            });
        });
        this.que_shaderStateReleae.forEach(entity => {
            this.que_shaderStateReleae.defer(() => {
                let buffer = em.getComponent(entity, this.com_shaderProgram);
                //release all programs in buffer
                em.removeComponent(entity, this.com_shaderProgram);
            });
        })
    }


    createShaderProgram(entity, macroBitset) {
        // let glState = this.em.getSingletonComponent(this.com_glState);
        const shader = this.em.getComponent(entity, this.com_shader);
        const programs = this.em.getComponent(entity, this.com_shaderProgram);
        if (programs == null)
            return null;
        let program = programs.find((p) => BitSet.equals2(macroBitset, p.macroBitset));
        if (!program) {
            program = this.em.createComponent(this.com_shaderProgram);
            program.macroBitset = macroBitset.clone();
            this._initShaderProgram(shader, program);
            programs.add(program);
        }
        program.refCount++;
        return program;
    }
    destroyShaderProgram(entity, macroBitset) {
        let glState = this.em.getSingletonComponent(this.com_glState);
        // const shader = this.em.getComponent(entity, this.com_shader);
        const programs = this.em.getComponent(entity, this.com_shaderProgram);
        let index = programs.findIndex((p) => BitSet.equals2(macroBitset, p.macroBitset));
        if (index < 0)
            return;
        const program = programs.get(index);
        program.refCount--;
        if (program.refCount <= 0) {
            programs.removeAt(index);
            this._releaseShaderProgram(program);
        }
    }
    _initShaderProgram(shader, shaderProgram) {
        let gl = this.glManager.gl;
        // let vertexSource = shader.vertexSource;
        // let fragmentSource = shader.fragmentSource;
        let macroBitset = shaderProgram.macroBitset;

        //rebuild source with macros
        const isWebGL2 = this.glManager.isWebGL2;
        const macroNameList = [];
        // macroBitset.forEachValues((value) => {
        //     macroNameList.push(this.macros[value].key);
        // });
        // console.log(macroNameList);
        this.glManager.getMacroNames(macroBitset, macroNameList);
        console.log("_initShaderProgram", macroNameList);

        const macroNameStr = ShaderFactory.parseCustomMacros(macroNameList);
        const versionStr = isWebGL2 ? "#version 300 es" : "#version 100";
        const graphicAPI = isWebGL2 ? "#define GRAPHICS_API_WEBGL2" : "#define GRAPHICS_API_WEBGL1";
        let precisionStr = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
          precision highp float;
          precision highp int;
        #else
          precision mediump float;
          precision mediump int;
        #endif
        `;
        // precisionStr += "#define HAS_DERIVATIVES\n";
        if (this.glManager.canIUse(GLCapabilityType.shaderTextureLod)) {
            precisionStr += "#define HAS_TEX_LOD\n";
        }
        if (this.glManager.canIUse(GLCapabilityType.standardDerivatives)) {
            precisionStr += "#define HAS_DERIVATIVES\n";
        }
        let vertexSource =
            ` ${versionStr}
            ${graphicAPI}
            ${macroNameStr}
            ` + ShaderFactory.parseIncludes(shader.vSource);
        let fragmentSource =
            ` ${versionStr}
            ${graphicAPI}
            ${isWebGL2 ? "" : ShaderFactory.parseExtension(ShaderSystem._shaderExtension)}
            ${precisionStr}
            ${macroNameStr}
            ` + ShaderFactory.parseIncludes(shader.fSource);

        if (isWebGL2) {
            vertexSource = ShaderFactory.convertTo300(vertexSource);
            fragmentSource = ShaderFactory.convertTo300(fragmentSource, true);
        }
        // console.log(vertexSource);
        // console.log(fragmentSource);


        // create and compile shader
        const vertexShader = ShaderUtil.createShader(gl, gl.VERTEX_SHADER, vertexSource);
        if (!vertexShader)
            return false;
        const fragmentShader = ShaderUtil.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        if (!fragmentShader)
            return false;
        let program = ShaderUtil.createProgram(gl, vertexShader, fragmentShader);
        if (!program) {
            return false;
        }
        shaderProgram.vertexShader = vertexShader;
        shaderProgram.fragmentShader = fragmentShader;
        shaderProgram.program = program;

        let attributes = ShaderUtil.pickupActiveAttributes(gl, program);
        let uniformMap = ShaderUtil.pickupActiveUniforms(gl, program);

        let uniforms = [];
        for (let propName in uniformMap) {
            let uniform = uniformMap[propName];
            let prop = this.glManager.getProperty(propName);
            uniforms[prop.id] = uniform;
        }

        shaderProgram.attributeMap = attributes;
        shaderProgram.uniformMap = uniformMap;
        shaderProgram.uniforms = uniforms;
        shaderProgram.macroBitset = macroBitset;

        return true;
    }
    _releaseShaderProgram(shaderProgram) {
        let gl = this.glManager.gl;
        shaderProgram.vertexShader && gl.deleteShader(shaderProgram.vertexShader);
        shaderProgram.fragmentShader && gl.deleteShader(shaderProgram.fragmentShader);
        shaderProgram.program && gl.deleteProgram(shaderProgram.program);
        shaderProgram.vertexShader = null;
        shaderProgram.fragmentShader = null;
        shaderProgram.program = null;
        shaderProgram.attributeMap = null;
        shaderProgram.uniformMap = null;

        const macroNameList = [];
        this.glManager.getMacroNames(shaderProgram.macroBitset, macroNameList);
        console.log("_releaseShaderProgram", macroNameList);
        shaderProgram.macroBitset = null;
    }

    // getProperty(name) {
    //     let property = this.propertyMap.get(name);
    //     if (property)
    //         return property;
    //     let id = this.nextPropertyId++;
    //     property = { id, name };
    //     this.properties[id] = property;
    //     this.propertyMap.set(name, property);
    //     return property;
    // }
    // getAttribute(name) {
    //     let attr = this.attributeMap.get(name);
    //     if (attr)
    //         return attr;
    //     let id = this.nextAttributeId++;
    //     attr = { id, name };
    //     this.attributes[id] = attr;
    //     this.attributeMap.set(name, attr);
    //     return attr;
    // }
    // getAttributeById(id) {
    //     return this.attributes[id];
    // }
    // getMacro(name, value) {
    //     const key = value != null ? name + ` ` + value : name;
    //     let macro = this.macroMap.get(key);
    //     if (macro)
    //         return macro;

    //     const id = this.nextMacroId++;
    //     let nameId = this.macroNameIdMap.get(name);
    //     if (nameId === undefined) {
    //         nameId = this.nextMacroNameId++;
    //         this.macroNameIdMap.set(name, nameId);
    //     }
    //     macro = { id, nameId, name, value, key };
    //     this.macros[nameId] = macro;
    //     this.macroMap.set(key, macro);
    //     return macro;
    // }
    // // getMacroById(id) {
    // //     return this.macros[id];
    // // }

    // setPropertyValue(shaderData, property, value) {
    //     if (typeof property === "string") {
    //         property = this.getProperty(property);
    //     }
    //     if (property._group !== shaderData.group) {
    //         if (property._group === undefined) {
    //             property._group = shaderData.group;
    //         } else {
    //             throw `Shader property ${property.name} has been used as ${ShaderDataGroup[property._group]} group.`;
    //         }
    //     }
    //     // if (property._type !== type) {
    //     //     if (property._type === undefined) {
    //     //         property._type = type;
    //     //     } else {
    //     //         throw `Shader property ${property.name} has been used as ${ShaderPropertyType[property._type]} type.`;
    //     //     }
    //     // }
    //     shaderData.uniforms[property.id] = value;
    // }
    // getPropertyValue(shaderData, property) {
    //     if (typeof property === "string") {
    //         property = this.getProperty(property);
    //     }
    //     return shaderData.uniforms[property.id];
    // }
    // enableMacro(shaderData, macro, value) {
    //     if (typeof macro === "string") {
    //         macro = this.getMacro(macro, value);
    //     }
    //     const nameId = macro.nameId;
    //     if (macro.value !== value) {
    //         macro = this.getMacro(macro.name, value);
    //     }
    //     // const lastMacro = this.macroNameIdMap.get(nameID);
    //     const lastMacro = this.macros[nameId];
    //     if (lastMacro !== macro) {
    //         this.macros[nameId] = macro;
    //     }
    //     shaderData.macros.or(nameId);
    //     return macro;
    // }
    // disableMacro(shaderData, macro) {
    //     let nameId;
    //     if (typeof macro === "string") {
    //         // macro = this.getMacro(macro, value);
    //         nameId = this.macroNameIdMap.get(macro);
    //         if (nameId === undefined)
    //             return;
    //     }
    //     else
    //         nameId = macro.nameId;
    //     const currentMacro = this.macros[nameId];
    //     if (currentMacro)
    //         shaderData.macros.not(nameId);
    // }
}
