import { GLTFExtensionMode, GLTFExtensionParser } from "../extensions/GLTFExtensionParser.js";

/**
 * Base class of glTF parser.
 */
export class GLTFParser {
  static _extensionParsers = {};

  /**
   * Execute all parses of extension to initialize plugin.
   * @remarks Some plugins require initialization.
   * @returns The void or promise
   */
  static executeExtensionsInitialize(extensionName) {
    const parsers = GLTFParser._extensionParsers[extensionName];
    const length = parsers?.length;

    if (length) {
      return parsers[length - 1].initialize();
    }
  }

  /**
   * Execute all parses of extension to create resource.
   * @param extensions - Related extensions field
   * @param context - The parser context
   * @param ownerSchema - The extension owner schema
   * @param extra - Extra params
   * @returns
   */
  static executeExtensionsCreateAndParse(
    extensions = {},
    context,
    ownerSchema,
    ...extra
  ) {
    let resource = null;

    const extensionArray = Object.keys(extensions);
    for (let i = extensionArray.length - 1; i >= 0; --i) {
      const extensionName = extensionArray[i];
      const extensionSchema = extensions[extensionName];

      resource = (
        GLTFParser._createAndParse(extensionName, context, extensionSchema, ownerSchema, ...extra)
      );
      if (resource) {
        return resource;
      }
    }
  }

  /**
   * Execute all parses of extension to parse resource.
   * @param extensions - Related extensions field
   * @param context - The parser context
   * @param parseResource -  The parsed resource
   * @param ownerSchema - The extension owner schema
   * @param extra - Extra params
   */
  static executeExtensionsAdditiveAndParse(
    extensions,
    context,
    parseResource,
    ownerSchema,
    ...extra
  ) {
    for (let extensionName in extensions) {
      const extensionSchema = extensions[extensionName];
      GLTFParser._additiveParse(extensionName, context, parseResource, extensionSchema, ownerSchema, ...extra);
    }
  }

  /**
   * Whether the plugin is registered.
   * @param extensionName - Extension name
   * @returns Boolean
   */
  static hasExtensionParser(extensionName) {
    return !!GLTFParser._extensionParsers[extensionName]?.length;
  }

  /**
   * Get the last plugin by glTF extension mode.
   * @param extensionName - Extension name
   * @param mode - GLTF extension mode
   * @returns GLTF extension parser
   */
  static getExtensionParser(extensionName, mode) {
    const parsers = GLTFParser._extensionParsers[extensionName];
    const length = parsers?.length;

    if (length) {
      // only use the last parser.
      for (let i = length - 1; i >= 0; --i) {
        const currentParser = parsers[i];
        if (currentParser._mode === mode) {
          return currentParser;
        }
      }
    }
  }

  /**
   * @internal
   */
  static _addExtensionParser(extensionName, extensionParser) {
    if (!GLTFParser._extensionParsers[extensionName]) {
      GLTFParser._extensionParsers[extensionName] = [];
    }
    GLTFParser._extensionParsers[extensionName].push(extensionParser);
  }

  static _createAndParse(
    extensionName,
    context,
    extensionSchema,
    ownerSchema,
    ...extra
  ) {
    const parser = GLTFParser.getExtensionParser(extensionName, GLTFExtensionMode.CreateAndParse);

    if (parser) {
      return parser.createAndParse(context, extensionSchema, ownerSchema, ...extra);
    }
  }

  static _additiveParse(
    extensionName,
    context,
    parseResource,
    extensionSchema,
    ownerSchema,
    ...extra
  ) {
    const parser = GLTFParser.getExtensionParser(extensionName, GLTFExtensionMode.AdditiveParse);

    if (parser) {
      parser.additiveParse(context, parseResource, extensionSchema, ownerSchema, ...extra);
    }
  }

  parse(context) {

  }
}
