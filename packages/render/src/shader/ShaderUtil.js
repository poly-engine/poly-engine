import { Logger } from "@poly-engine/core";

export class ShaderUtil {
    //#region shader
    static createShader(gl, shaderType, shaderSource) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    static createProgram(gl, vertexShader, fragmentShader) {
        // link program and shader
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            return null;
        }
        return program;
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @returns {Record<string, number>}
     */
    static pickupActiveAttributes(gl, program) {
        const amount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        let attributes = {};
        for (let i = 0; i < amount; i++) {
            const { name } = gl.getActiveAttrib(program, i);
            const location = gl.getAttribLocation(program, name);
            attributes[name] = location;
        }
        return attributes;
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @returns {Record<string, ShaderUniform>}
     */
    static pickupActiveUniforms(gl, program) {
        const amount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        let textureNum = 0;
        let uniforms = {};
        for (let i = 0; i < amount; i++) {
            let { name, size, type } = gl.getActiveUniform(program, i);
            const shaderUniform = {};
            let isArray = false;
            let isTexture = false;
            if (name.indexOf("[0]") > 0) {
                name = name.substr(0, name.length - 3);
                isArray = true;
            }
            const location = gl.getUniformLocation(program, name);
            shaderUniform.name = name;
            shaderUniform.location = location;
            shaderUniform.size = size;
            shaderUniform.type = type;

            let func = null;
            let indices = null;
            let textureTarget = gl.TEXTURE_2D;
            switch (type) {
                case gl.FLOAT:
                    func = isArray ? upload1fv : upload1f;
                    break;
                case gl.FLOAT_VEC2:
                    func = upload2fv;
                    break;
                case gl.FLOAT_VEC3:
                    func = upload3fv;
                    break;
                case gl.FLOAT_VEC4:
                    func = upload4fv;
                    break;
                case gl.BOOL:
                case gl.INT:
                    func = isArray ? upload1iv : upload1i;
                    break;
                case gl.BOOL_VEC2:
                case gl.INT_VEC2:
                    func = upload2iv;
                    break;
                case gl.BOOL_VEC3:
                case gl.INT_VEC3:
                    func = upload3iv;
                    break;
                case gl.BOOL_VEC4:
                case gl.INT_VEC4:
                    func = upload4iv;
                    break;
                case gl.FLOAT_MAT4:
                    func = uploadMat4v;
                    break;
                case gl.SAMPLER_2D:
                case gl.SAMPLER_CUBE:
                case gl.SAMPLER_2D_ARRAY:
                case gl.SAMPLER_2D_SHADOW:
                    isTexture = true;
                    const index = textureNum;
                    textureNum += size;
                    indices = new Int32Array(size);
                    if (isArray) {
                        for (let ii = 0; ii < size; ++ii) {
                            indices[ii] = index + ii;
                        }
                    }
                    else {
                        indices[0] = index;
                    }
                    if (type === gl.SAMPLER_CUBE)
                        textureTarget = gl.TEXTURE_CUBE_MAP;
                    func = uploadTexture;
                    break;
            }
            shaderUniform.applyFunc = func;
            shaderUniform.isArray = isArray;
            shaderUniform.isTexture = isTexture;
            shaderUniform.textureIndex = indices;
            shaderUniform.textureTarget = textureTarget;
            uniforms[name] = shaderUniform;
        }
        return uniforms;
    }
    //#endregion

    static parseCustomMacros(macros) {
        return macros.map((m) => `#define ${m}\n`).join("");
    }

    static parseIncludes(src) {
        const regex = /^[ \t]*#include +<([\w\d.]+)>/gm;

        function replace(match, slice) {
            var replace = ShaderLib[slice];

            if (replace === undefined) {
                Logger.error(`Shader slice "${match.trim()}" not founded.`);
                return "";
            }

            return ShaderFactory.parseIncludes(replace);
        }

        return src.replace(regex, replace);
    }

    /**
     * GLSL extension.
     * @param extensions - such as ["GL_EXT_shader_texture_lod"]
     * */
    static parseExtension(extensions) {
        return extensions.map((e) => `#extension ${e} : enable\n`).join("");
    }

    /**
     * Convert lower GLSL version to GLSL 300 es.
     * @param {string} shader - code
     * @param {boolean} isFrag - Whether it is a fragment shader.
     * @returns {string}
     * */
    static convertTo300(shader, isFrag) {
        /** replace attribute and in */
        shader = shader.replace(/\battribute\b/g, "in");
        shader = shader.replace(/\bvarying\b/g, isFrag ? "in" : "out");

        /** replace api */
        shader = shader.replace(/\btexture(2D|Cube)\b/g, "texture");
        shader = shader.replace(/\btexture(2D|Cube)LodEXT\b/g, "textureLod");
        if (isFrag) {
            const isMRT = /\bgl_FragData\[.+?\]/g.test(shader);
            if (isMRT) {
                shader = shader.replace(/\bgl_FragColor\b/g, "gl_FragData[0]");
                const result = shader.match(/\bgl_FragData\[.+?\]/g);
                shader = this._replaceMRTShader(shader, result);
            } else {
                shader = shader.replace(/void\s+?main\s*\(/g, `out vec4 glFragColor;\nvoid main(`);
                shader = shader.replace(/\bgl_FragColor\b/g, "glFragColor");
            }
        }

        return shader;
    }

    /**
     * 
     * @param {string} shader 
     * @param {string[]} result 
     * @returns {string}
     */
    static _replaceMRTShader(shader, result) {
        let declaration = "";
        const mrtIndexSet = new Set();

        for (let i = 0; i < result.length; i++) {
            const res = result[i].match(/\bgl_FragData\[(.+?)\]/);
            mrtIndexSet.add(res[1]);
        }

        mrtIndexSet.forEach((index) => {
            declaration += `layout(location=${index}) out vec4 fragOutColor${index};\n`;
        });
        declaration += `void main(`;

        shader = shader.replace(/\bgl_FragData\[(.+?)\]/g, "fragOutColor$1");

        shader = shader.replace(/void\s+?main\s*\(/g, declaration);
        return shader;
    }
}

//#region uniform upload functions
function upload1f(gl, shaderUniform, value) {
    gl.uniform1f(shaderUniform.location, value);
}
function upload1fv(gl, shaderUniform, value) {
    gl.uniform1fv(shaderUniform.location, value);
}
function upload2fv(gl, shaderUniform, value) {
    gl.uniform2fv(shaderUniform.location, value);
}
function upload3fv(gl, shaderUniform, value) {
    gl.uniform3fv(shaderUniform.location, value);
}
function upload4fv(gl, shaderUniform, value) {
    gl.uniform4fv(shaderUniform.location, value);
}
function upload1i(gl, shaderUniform, value) {
    gl.uniform1f(shaderUniform.location, value);
}
function upload1iv(gl, shaderUniform, value) {
    gl.uniform1iv(shaderUniform.location, value);
}
function upload2iv(gl, shaderUniform, value) {
    gl.uniform2iv(shaderUniform.location, value);
}
function upload3iv(gl, shaderUniform, value) {
    gl.uniform3iv(shaderUniform.location, value);
}
function upload4iv(gl, shaderUniform, value) {
    gl.uniform4iv(shaderUniform.location, value);
}
function uploadMat4v(gl, shaderUniform, value) {
    gl.uniformMatrix4fv(shaderUniform.location, false, value);
}
function uploadTexture(gl, shaderUniform, value) {
    const indices = shaderUniform.textureIndex;
    const length = indices.length;
    const location = shaderUniform.location;
    if (length === 1) {
        gl.uniform1i(location, indices[0]);
        gl.activeTexture(gl.TEXTURE0 + indices[0]);
        gl.bindTexture(shaderUniform.textureTarget, value);
    }
    else {
        gl.uniform1iv(location, indices);
        for (let i = 0; i < length; i++) {
            const texture = value[i];
            gl.activeTexture(gl.TEXTURE0 + indices[i]);
            gl.bindTexture(shaderUniform.textureTarget, texture);
        }
    }
}
//#endregion