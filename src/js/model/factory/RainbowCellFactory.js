/**
 * @class GOL.model.factory.RainbowCellFactory
 * @extends GOL.model.factory.CellFactory
 * 
 * A factory that creates RainbowCells.
 */
Ext.define('GOL.model.factory.RainbowCellFactory', {
    extend: 'GOL.model.factory.CellFactory',
    
    create: function(row, col) {
        return new GOL.model.RainbowCell(row, col);
    }
});

GOL.registerCellFactory('Rainbow', new GOL.model.factory.RainbowCellFactory());