Ext.define("GOL.controller.Cell", {

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
        
        delete this.model;
        delete this.view;
    }
});
/**
 * @class GOL.controller.Grid
 */
Ext.define("GOL.controller.Grid", {
    mixins: {
        observable: "Ext.util.Observable"
    },
    
    mouseDown: false,
    
    constructor: function(rows, cols, cellFactory, rules) {
        this.model = new GOL.model.Grid(rows, cols, cellFactory, rules);
        
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
    
    killAllCells: function() {
        this.model.killAllCells();
    },
    
    reconfigure: function(cellFactory) {
        this.model.reconfigure(cellFactory);
    },
    
    destroy: function() {
        Ext.getDoc().un("mouseup", this.onDocumentMouseUp, this);
        
        this.view.un("cellmousedown", this.onCellMouseDown, this);
        this.view.un("cellmouseover", this.onCellMouseOver, this);
    }
});

