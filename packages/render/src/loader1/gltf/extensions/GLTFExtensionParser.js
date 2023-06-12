
/**
 * Base class of glTF extension parser.
 */
export class GLTFExtensionParser {
  /**
   * @internal
   * The extension mode.
   */
  _mode;

  /**
   * Initialize the parser.
   * @remarks Some plugins require initialization.
   * @returns The void or promise
   */
  initialize() { }

  /**
   * Create and parse the resource.
   * @remarks This method overrides the default resource creation.
   * @param context - The parser context
   * @param extensionSchema - The extension schema
   * @param extensionOwnerSchema - The extension owner schema
   * @returns The resource or promise
   */
  createAndParse(
    context,
    extensionSchema,
    extensionOwnerSchema,
    ...extra
  ) {
    throw "Not implemented.";
  }

  /**
   * Additive parse to the resource.
   * @param context - The parser context
   * @param parseResource - The parsed resource
   * @param extensionSchema - The extension schema
   * @param extensionOwnerSchema - The extension owner schema
   * @returns The void or promise
   */
  additiveParse(
    context,
    parseResource,
    extensionSchema,
    extensionOwnerSchema,
    ...extra
  ) {
    throw "Not implemented.";
  }
}

/**
 * glTF Extension mode.
 */
export const GLTFExtensionMode = {
  /**
   * Cerate instance and parse mode.
   * @remarks
   * If the glTF property has multiple extensions of `CreateAndParse` mode, only execute the last one.
   * If this method is registered, the default pipeline processing will be ignored.
   */
  CreateAndParse: 0,

  /** Additive parse mode. */
  AdditiveParse: 1
}
