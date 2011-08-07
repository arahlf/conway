/**
 * @class GOL.pattern.Registry
 * Serves as a registry of Patterns.
 */
Ext.define('GOL.pattern.Registry', {
    extend: 'GOL.registry.Registry',
    singleton: true
});

/**
 * Shortcut for {GOL.pattern.Registry#register}
 * @member GOL
 * @method registerPattern
 */
GOL.registerPattern = Ext.bind(GOL.pattern.Registry.register, GOL.pattern.Registry);