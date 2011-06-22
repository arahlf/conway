Ext.define("GOL.controller.Grid", {
    
    mouseDown: false,
    
    constructor: function(model) {
        this.model = model;
        this.view = Ext.create("GOL.view.Grid", {
            model: model
        });
        this.setupMouseListeners();
    },
    
    getView: function() {
        return this.view;
    },
    
    setupMouseListeners: function() {
        Ext.getDoc().on("mouseup", function() {
            this.mouseDown = false;
        }, this);
        
        this.view.on("cellmousedown", function(cell) {
            this.mouseDown = true;
            cell.revive();
        }, this);
        
        this.view.on("cellmouseover", function(cell) {
            if (this.mouseDown) {
                cell.revive();
            }
        }, this);
    },
    
    initialize: function() {
        
    },
    
    addRow: function() {
        
    }
});
