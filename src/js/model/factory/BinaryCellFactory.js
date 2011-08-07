/**
 * @class GOL.model.factory.BinaryCellFactory
 * @extends GOL.model.factory.CellFactory
 * 
 * A factory that creates BinaryCells.
 */
Ext.define('GOL.model.factory.BinaryCellFactory', {
    extend: 'GOL.model.factory.CellFactory',
    
    create: function(row, col) {
        return new GOL.model.BinaryCell(row, col);
    }
});

GOL.registerCellFactory('Binary', new GOL.model.factory.BinaryCellFactory());