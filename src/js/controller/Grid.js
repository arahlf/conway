/**
 * @class GOL.controller.Grid
 */
Ext.define("GOL.controller.Grid", {
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    mouseDown: false,
    
    constructor: function(rows, cols, cellFactory, rules) {
        this.model = new GOL.model.Grid(rows, cols, rules);
        this.model.configure(cellFactory);
        
        this.view = Ext.create("GOL.view.Grid", {
            model: this.model
        });
        
        this.addEvents("generationchange");
        this.relayEvents(this.model, ["generationchange"]);
        
        this.setupMouseListeners();
    },
    
    applyPattern: function(pattern) {
        this.model.applyPattern(pattern);
    },
    
    nextGeneration: function() {
        this.model.nextGeneration();
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
    },
    
    killCells: function() {
        this.model.killCells();
    },
    
    destroy: function() {
        Ext.getDoc().un("mouseup", this.onDocumentMouseUp, this);
        
        this.view.un("cellmousedown", this.onCellMouseDown, this);
        this.view.un("cellmouseover", this.onCellMouseOver, this);
    }
});
