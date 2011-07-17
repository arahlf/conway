/**
 * @class GOL.controller.Grid
 */
Ext.define("GOL.controller.Grid", {
    
    mouseDown: false,
    
    constructor: function(model) {
        this.model = model;
        this.view = Ext.create("GOL.view.Grid", {
            model: model
        });
        this.setupMouseListeners();
    },
    
    setupMouseListeners: function() {
        Ext.getDoc().on("mouseup", this.onDocumentMouseUp, this);

        this.view.on("cellmousedown", this.onCellMouseDown, this);
        this.view.on("cellmouseover", this.onCellMouseOver, this);
    },

    getView: function() {
        return this.view;
    },

    onDocumentMouseUp: function() {
        this.mouseDown = false;
    },

    onCellMouseDown: function(cell) {
        this.mouseDown = true;
        cell.revive();
    },

    onCellMouseOver: function(cell) {
        if (this.mouseDown) {
            cell.revive();
        }
    }
});
