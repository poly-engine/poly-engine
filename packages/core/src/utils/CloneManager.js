// import { vec2, Vec3, vec4, quat, mat4 } from "../math/index.js";
import { Util } from "./Util.js";

const isArray = Array.isArray;
const objectKeys = Object.keys;

export class CloneManager {
    constructor() {
        this._propHandlerMap = new Map;
    }

    registerPropHandler(type, handler) {
        this._propHandlerMap.set(type, handler);
    }
    _createProp(propSchema, prop) {
        let propDefault = propSchema.default;
        let type = propSchema.type;
        let handler = this._propHandlerMap.get(type);
        if (handler) {
            prop = handler.create(this, propSchema, prop);
        }
        else if (type === 'string' || type === 'number' || type === 'boolean' || type === 'entity') {
            prop = propDefault;
        }
        else if (type === 'array') {
            if (!propDefault)
                prop = null;
            else {
                let arr = prop || [];
                let valueSchema = propSchema.value;
                for (let j = 0; j < propDefault.length; j++) {
                    if (!valueSchema)
                        arr[j] = propDefault[j];
                    else
                        arr[j] = this._createProp(valueSchema, arr[j]);
                }
                prop = arr;
            }
        }
        else if (type === 'bin') {
            if (!propDefault)
                prop = null;
            else {
                let arr = prop || [];
                for (let j = 0; j < propDefault.length; j++) {
                    arr[j] = propDefault[j];
                }
                prop = arr;
            }
        }
        // else if (type === 'map') {
        //     if (!propDefault)
        //         prop = null;
        //     else {
        //         let map = prop || [];
        //         prop = propSchema.schema ? this.createObj(propSchema.schema, prop) : propDefault;
        //     }
        // }
        else if (type === 'object') {
            if (!propDefault)
                prop = null;
            else if (typeof propDefault === 'function') {
                prop = propDefault(prop);
            }
            else if (propSchema.schema != null) {
                prop = this.createObj(propSchema.schema, prop);
            }
            else {
                prop = prop == null ? Util.deepClone(propDefault) : Util.deepCopy(propDefault, prop);
            }
        }
        else {
            prop = Util.deepClone(propDefault);
        }
        return prop;
    }
    createObj(objSchema, obj) {
        obj ??= {};
        let keys = objectKeys(objSchema);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let propSchema = objSchema[key];
            obj[key] = this._createProp(propSchema, obj[key]);
        }
        return obj;
    }
    initObjFromArgs(schema, obj, ...args) {
        let keys = objectKeys(schema);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let arg = args[i];
            if (arg !== undefined)
                obj[key] = arg;
        }
    }
    _loadPropFromJson(propSchema, prop, jsonValue, context) {
        let propDefault = propSchema.default;
        let type = propSchema.type;
        let handler = this._propHandlerMap.get(type);
        if (handler) {
            prop = handler.fromJson(this, propSchema, prop, jsonValue, context);
        }
        else if (type === 'string' || type === 'number' || type === 'boolean') {
            prop = jsonValue;
        }
        else if (type === 'entity') {
            let entity = prop = jsonValue;
            if (context?.entMap && entity >= 0)
                prop = context?.entMap[entity];
        }
        // else if (type === 'vec2') {
        //     prop ??= [0, 0];
        //     vec2.copy(prop, jsonValue);
        // }
        // else if (type === 'vec3') {
        //     prop ??= [0, 0, 0];
        //     Vec3.copy(prop, jsonValue);
        // }
        // else if (type === 'vec4') {
        //     prop ??= [0, 0, 0, 0];
        //     vec4.copy(prop, jsonValue);
        // }
        // else if (type === 'quat') {
        //     prop ??= [0, 0, 0, 1];
        //     quat.copy(prop, jsonValue);
        // }
        // else if (type === 'mat4') {
        //     prop ??= mat4.create();
        //     mat4.copy(prop, jsonValue);
        // }
        else if (type === 'array') {
            let arr = jsonValue;
            prop ??= new Array(arr.length);
            let objArr = prop;
            let valueSchema = propSchema.value;
            for (let j = 0; j < arr.length; j++) {
                if (!valueSchema)
                    objArr[j] = arr[j];
                else
                    objArr[j] = this._loadPropFromJson(valueSchema, objArr[j], arr[j], context);
            }
        }
        else if (type === 'bin') {
            let arr = jsonValue;
            prop ??= new jsonValue.constructor(arr.length);
            let objArr = prop;
            // let valueSchema = propSchema.value;
            for (let j = 0; j < arr.length; j++) {
                objArr[j] = arr[j];
            }
        }
        else if (type === 'object') {
            let objSchema = propSchema.schema;
            if (!objSchema)
                // prop = Util.deepClone(jsonValue);
                prop = jsonValue;
            else
                prop = this.loadObjFromJson(objSchema, prop, jsonValue, context);
        }
        else
            prop = Util.deepClone(jsonValue);

        return prop;
    }
    loadObjFromJson(objSchema, obj, json, context) {
        obj ??= {};
        let keys = objectKeys(objSchema);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let propSchema = objSchema[key];
            let jsonValue = json[key];
            if (jsonValue === undefined)
                continue;
            obj[key] = this._loadPropFromJson(propSchema, obj[key], jsonValue, context);
        }
        return obj;
    }
    _isPrimitiveType(type) {
        return type === 'number' || type === 'boolean' || type === 'string';
    }
    _savePropToJson(propSchema, value, context, isItem) {
        let propDefault = propSchema.default;
        let type = propSchema.type;
        let jsonValue = undefined;
        let handler = this._propHandlerMap.get(type);
        if (handler) {
            jsonValue = handler.toJson(this, propSchema, value, context);
        }
        else if (type === 'string' || type === 'number' || type === 'boolean') {
            if (value !== propDefault || isItem)
                jsonValue = value;
        }
        else if (type === 'entity') {
            let entity = value;
            if (entity !== propDefault || isItem) {
                if (context?.entMap)
                    if (entity != undefined && entity >= 0)
                        jsonValue = context?.entMap[entity];
            }
        }
        // else if (type === 'vec2') {
        //     if (!vec2.exactEquals(value, propDefault))
        //         jsonValue = vec2.clone(value);
        // }
        // else if (type === 'vec3') {
        //     if (!Vec3.exactEquals(value, propDefault))
        //         jsonValue = Vec3.clone(value);
        // }
        // else if (type === 'vec4') {
        //     if (!vec4.exactEquals(value, propDefault))
        //         jsonValue = vec4.clone(value);
        // }
        // else if (type === 'quat') {
        //     if (!quat.exactEquals(value, propDefault))
        //         jsonValue = quat.clone(value);
        // }
        // else if (type === 'mat4') {
        //     if (!mat4.exactEquals(value, propDefault))
        //         jsonValue = mat4.clone(value);
        // }
        else if (type === 'array') {
            // console.log(value + ', ' + propDefault);
            if (!Util.deepEqual(value, propDefault)) {
                let arr = [];
                let objArr = value;
                let valueSchema = propSchema.value;
                for (let j = 0; j < objArr.length; j++) {
                    if (!valueSchema)
                        arr[j] = objArr[j];
                    else
                        arr[j] = this._savePropToJson(valueSchema, objArr[j], context, true);
                }
                jsonValue = arr;
            }
        }
        else if (type === 'bin') {
            if (!Util.deepEqual(value, propDefault)) {
                let arr = [];
                let objArr = value;
                for (let j = 0; j < objArr.length; j++) {
                    arr[j] = objArr[j];
                }
                jsonValue = arr;
            }
        }
        else if (type === 'object') {
            if (!Util.deepEqual(value, propDefault) || isItem) {
                if (!propSchema.schema)
                    // jsonValue = Util.deepClone(value);
                    jsonValue = value;
                else
                    jsonValue = this.saveObjToJson(propSchema.schema, value, context);
            }
        }
        else
            jsonValue = Util.deepClone(value);
        return jsonValue;
    }
    saveObjToJson(objSchema, obj, context) {
        let json = {};
        let keys = objectKeys(objSchema);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = obj[key];
            if (value == null)
                continue;
            let propSchema = objSchema[key];
            json[key] = this._savePropToJson(propSchema, value, context);
        }
        return json;
    }

    //#region json

    // loadFromJson(obj, json, context) {
    //     if (json._type != null && context.classMap != null) {
    //         const classType = context.classMap[json._type];

    //         return obj.toJson(context);
    //     }

    //     obj ??= {};
    //     let keys = objectKeys(obj);
    //     for (let i = 0; i < keys.length; i++) {
    //         let key = keys[i];
    //         let propSchema = objSchema[key];
    //         let jsonValue = json[key];
    //         if (jsonValue === undefined)
    //             continue;
    //         obj[key] = this._loadPropFromJson(propSchema, obj[key], jsonValue, context);
    //     }
    //     return obj;
    // }

    // _savePropToJson(value, context, isItem) {
    //     const type = typeof value;
    //     let jsonValue = undefined;
    //     if (type === 'string' || type === 'number' || type === 'boolean') {
    //         jsonValue = value;
    //     }
    //     else if (type === 'array') {
    //         let arr = [];
    //         let objArr = value;
    //         for (let j = 0; j < objArr.length; j++) {
    //             arr[j] = this._saveToJson(objArr[j], context, true);
    //         }
    //         jsonValue = arr;
    //     }
    //     else if (type === 'object') {
    //         jsonValue = this.saveToJson(value, context);
    //     }
    //     else
    //         jsonValue = Util.deepClone(value);
    //     return jsonValue;
    // }
    // saveToJson(obj, context) {
    //     if (obj.toJson != null) {
    //         return obj.toJson(context);
    //     }
    //     let json = {};
    //     let keys = objectKeys(obj);
    //     for (let i = 0; i < keys.length; i++) {
    //         let key = keys[i];
    //         let value = obj[key];
    //         if (value == null)
    //             continue;
    //         json[key] = this._saveToJson(value, context);
    //     }
    //     return json;
    // }

    //#endregion
}