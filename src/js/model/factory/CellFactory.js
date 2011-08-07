/**
 * @class GOL.model.factory.CellFactory
 * 
 * An interface for Cell factories.
 */
Ext.define('GOL.model.factory.CellFactory', {
    /**
     * Creates a new Cell model.
     * @param {Number} row
     * @param {Number} col
     */
    create: GOL.abstractFn
});