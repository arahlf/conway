Ext.ns("GOL.rules");

/**
 * @class GOL.rules.Registry
 * Serves as a registry of Rules.
 */
GOL.rules.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.pattern.Registry#register}
 * @member GOL
 * @method registerRules
 */
GOL.registerRules = Ext.bind(GOL.rules.Registry.register, GOL.rules.Registry);