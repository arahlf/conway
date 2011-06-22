Ext.define("GOL.controller.Cell", {

    constructor: function(model, renderTo) {
        this.model = model;
        this.view = GOL.view.CellFactory.createView(model, renderTo);
    },

    kill: function() {
        this.model.revive().commit();
    },

    revive: function() {
        this.model.revive().commit();
    },

    getView: function() {
        return this.view;
    }
});