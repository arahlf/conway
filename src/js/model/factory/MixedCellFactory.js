Ext.define('GOL.model.factory.MixedCellFactory', {
    extend: 'GOL.model.factory.CellFactory',
    
    createModel: function(row, col) {
        switch (Math.ceil(Math.random() * 3)) {
            case 1:
                return new GOL.model.BinaryCell(row, col);
            case 2:
                return new GOL.model.AgingCell(row, col);
            case 3:
                return new GOL.model.RainbowCell(row, col);
        }
    }
});

GOL.registerCellFactory('Mixed', new GOL.model.factory.MixedCellFactory());