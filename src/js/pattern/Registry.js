Ext.ns('GOL.pattern');

/**
 * @class GOL.pattern.Registry
 * Serves as a registry of Patterns.
 */
GOL.pattern.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.pattern.Registry#register}
 * @member GOL
 * @method registerPattern
 */
GOL.registerPattern = Ext.bind(GOL.pattern.Registry.register, GOL.pattern.Registry);