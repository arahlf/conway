Ext.ns('GOL.cell');

/**
 * @class GOL.cell.Registry
 * Serves as a registry of Cell factories.
 */
GOL.cell.Registry = new GOL.registry.Registry();

/**
 * Shortcut for {GOL.cell.Registry#register}
 * @member GOL
 * @method registerCellFactory
 */
GOL.registerCellFactory = Ext.bind(GOL.cell.Registry.register, GOL.cell.Registry);