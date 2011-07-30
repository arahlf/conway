Ext.ns("GOL.view");

GOL.view.CellFactory = {
    /**
     * Determines and creates the appropriate view for the given model.
     */
    createView: function(model, renderTo) {
        switch (model.$className) {
            case "GOL.model.BinaryCell":
                return new GOL.view.BinaryCell(model, renderTo);
            case "GOL.model.AgingCell":
                return new GOL.view.RainbowCell(model, renderTo);
            case "GOL.model.MortalCell":
                return new GOL.view.MortalCell(model, renderTo);
        };
        
        throw new Error("Could not determine view for model of type: " + model.$className);
    }
};