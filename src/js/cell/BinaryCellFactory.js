Ext.define("GOL.cell.BinaryCellFactory", {
    extend: "GOL.cell.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.BinaryCell(row, col);
    }
});

GOL.registerCellFactory("Binary", new GOL.cell.BinaryCellFactory());