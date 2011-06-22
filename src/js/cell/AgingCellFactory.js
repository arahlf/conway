Ext.define("GOL.cell.AgingCellFactory", {
    extend: "GOL.cell.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.AgingCell(row, col);
    }
});

GOL.registerCellFactory("Aging", new GOL.cell.AgingCellFactory());