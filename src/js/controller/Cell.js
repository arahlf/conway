/**
 * @class GOL.controller.Cell
 * 
 * A Cell controller.
 */
Ext.define('GOL.controller.Cell', {
    /**
     * Creates a new controller.
     * 
     * @param model The controller's model.
     * @param renderTo
     */
    constructor: function(model, renderTo) {
        this.model = model;
        this.view = GOL.view.CellFactory.create(model, renderTo);
    },

    kill: function() {
        if (this.model.isAlive()) {
            this.model.revive().commit();
        }
    },

    revive: function() {
        if (!this.model.isAlive()) {
            this.model.revive().commit();
        }
    },
    
    getView: function() {
        return this.view;
    },
    
    destroy: function() {
        this.model.destroy();
        this.view.destroy();
        
        this.model = null;
        this.view = null;
    }
});