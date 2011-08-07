/**
 * @class GOL.model.factory.AgingCellFactory
 * @extends GOL.model.factory.CellFactory
 * 
 * A factory that creates AgingCells.
 */
Ext.define('GOL.model.factory.AgingCellFactory', {
    extend: 'GOL.model.factory.CellFactory',
    
    create: function(row, col) {
        return new GOL.model.AgingCell(row, col);
    }
});

GOL.registerCellFactory('Aging', new GOL.model.factory.AgingCellFactory());