Ext.ns("GOL.view");

GOL.view.CellFactory = {
    /**
     * Determines and creates the appropriate view for the given model.
     */
    create: function(model, renderTo) {
        var name = model.$className.replace(/^GOL\.model/, "GOL.view");
        var constructor = Ext.ClassManager.get(name);
        
        if (constructor !== null) {
            return new constructor(model, renderTo);
        }
        
        throw new Error("Could not determine view for model of type: " + model.$className);
    }
};