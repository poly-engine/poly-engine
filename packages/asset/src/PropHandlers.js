export class AssetRefPropHandler {
    create(cloneManager, propSchema, prop) {
        prop ??= {};
        prop.id = null;
        prop.type = null;
    }
    fromJson(cloneManager, propSchema, prop, jsonValue, context) {
        prop.id = jsonValue.id;
        prop.type = jsonValue.type;
    }
    toJson(cloneManager, propSchema, value, context) {
        if (value.id === null && value.type === null)
            return undefined;
        return {
            id: value.id,
            type: value.type,
        };
    }
}
