Ext.define("GOL.model.factory.RainbowCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        return new GOL.model.RainbowCell(row, col);
    }
});

GOL.registerCellFactory("Rainbow", new GOL.model.factory.RainbowCellFactory());