Ext.define("GOL.model.factory.RandomCellFactory", {
    extend: "GOL.model.factory.CellFactory",
    
    createModel: function(row, col) {
        switch (Math.ceil(Math.random() * 3)) {
            case 1:
                return new GOL.model.BinaryCell(row, col);
            case 2:
                return new GOL.model.AgingCell(row, col);
            case 3:
                return new GOL.model.MortalCell(row, col);
        }
    }
});

GOL.registerCellFactory("Random", new GOL.model.factory.RandomCellFactory());