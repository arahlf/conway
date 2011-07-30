Ext.define("GOL.model.factory.BinaryCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.BinaryCell(row, col);
    }
});

GOL.registerCellFactory("Binary", new GOL.model.factory.BinaryCellFactory());