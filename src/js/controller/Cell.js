/**
 * @class GOL.controller.Cell
 */
Ext.define('GOL.controller.Cell', {
    /**
     * Creates a new Cell controller.
     * @param {GOL.model.Cell} model A Cell model to control.
     * @param {Ext.Element} renderTo The render target for the view.
     */
    constructor: function(model, renderTo) {
        this.model = model;
        this.view = GOL.view.CellFactory.create(model, renderTo);
    },
    
    /**
     * Kills the Cell.
     */
    kill: function() {
        if (this.model.isAlive()) {
            this.model.revive().commit();
        }
    },
    
    /**
     * Revives the Cell.
     */
    revive: function() {
        if (!this.model.isAlive()) {
            this.model.revive().commit();
        }
    },
    
    /**
     * Destroys the Cell and its underlying state.
     */
    destroy: function() {
        Ext.destroy(this.model, this.view);
        
        this.model = null;
        this.view = null;
    }
});