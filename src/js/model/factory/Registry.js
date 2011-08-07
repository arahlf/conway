/**
 * @class GOL.model.factory.Registry
 * 
 * Serves as a registry of Cell factories.
 */
Ext.define('GOL.model.factory.Registry', {
    extend: 'GOL.registry.Registry',
    singleton: true
});

/**
 * Shortcut for {GOL.model.factory.Registry#register}.
 * @member GOL
 * @method registerCellFactory
 */
GOL.registerCellFactory = Ext.bind(GOL.model.factory.Registry.register, GOL.model.factory.Registry);