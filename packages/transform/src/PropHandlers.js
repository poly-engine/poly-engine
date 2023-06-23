import { mat4, quat, vec2, vec3, vec4 } from "@poly-engine/math";

export class Vec2PropHandler{
    create(cloneManager, propSchema, prop){
        let propDefault = propSchema.default;
        return propDefault ? vec2.clone(propDefault) : null;
    }
    fromJson(cloneManager, propSchema, prop, jsonValue, context){
        prop ??= [0, 0];
        vec2.copy(prop, jsonValue);
        return prop;
    }
    toJson(cloneManager, propSchema, value, context){
        let propDefault = propSchema.default;
        let outDefault = context.outDefault === true;
        let jsonValue = undefined;
        if (outDefault || !vec2.exactEquals(value, propDefault))
            jsonValue = vec2.clone(value);
        return jsonValue;
    }
}

export class Vec3PropHandler{
    create(cloneManager, propSchema, prop){
        let propDefault = propSchema.default;
        return propDefault ? vec3.clone(propDefault) : null;
    }
    fromJson(cloneManager, propSchema, prop, jsonValue, context){
        prop ??= [0, 0, 0];
        vec3.copy(prop, jsonValue);
        return prop;
    }
    toJson(cloneManager, propSchema, value, context){
        let propDefault = propSchema.default;
        let outDefault = context.outDefault === true;
        let jsonValue = undefined;outDefault
        if (outDefault ||!vec3.exactEquals(value, propDefault))
            jsonValue = vec3.clone(value);
        return jsonValue;
    }
}

export class Vec4PropHandler{
    create(cloneManager, propSchema, prop){
        let propDefault = propSchema.default;
        return propDefault ? vec4.clone(propDefault) : null;
    }
    fromJson(cloneManager, propSchema, prop, jsonValue, context){
        prop ??= [0, 0, 0, 0];
        vec4.copy(prop, jsonValue);
        return prop;
    }
    toJson(cloneManager, propSchema, value, context){
        let propDefault = propSchema.default;
        let outDefault = context.outDefault === true;
        let jsonValue = undefined;
        if (outDefault || !vec4.exactEquals(value, propDefault))
            jsonValue = vec4.clone(value);
        return jsonValue;
    }
}

export class QuatPropHandler{
    create(cloneManager, propSchema, prop){
        let propDefault = propSchema.default;
        return propDefault ? quat.clone(propDefault) : null;
    }
    fromJson(cloneManager, propSchema, prop, jsonValue, context){
        prop ??= [0, 0, 0, 0];
        quat.copy(prop, jsonValue);
        return prop;
    }
    toJson(cloneManager, propSchema, value, context){
        let propDefault = propSchema.default;
        let outDefault = context.outDefault === true;
        let jsonValue = undefined;
        if (outDefault || !quat.exactEquals(value, propDefault))
            jsonValue = quat.clone(value);
        return jsonValue;
    }
}

export class Mat4PropHandler{
    create(cloneManager, propSchema, prop){
        let propDefault = propSchema.default;
        return propDefault ? mat4.clone(propDefault) : null;
    }
    fromJson(cloneManager, propSchema, prop, jsonValue, context){
        prop ??= mat4.create();
        mat4.copy(prop, jsonValue);
        return prop;
    }
    toJson(cloneManager, propSchema, value, context){
        let propDefault = propSchema.default;
        let outDefault = context.outDefault === true;
        let jsonValue = undefined;
        if (outDefault || !mat4.exactEquals(value, propDefault))
            jsonValue = mat4.clone(value);
        return jsonValue;
    }
}