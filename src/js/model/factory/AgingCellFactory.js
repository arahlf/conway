Ext.define('GOL.model.factory.AgingCellFactory', {
    extend: 'GOL.model.factory.CellFactory',
    
    createModel: function(row, col) {
        return new GOL.model.AgingCell(row, col);
    }
});

GOL.registerCellFactory('Aging', new GOL.model.factory.AgingCellFactory());