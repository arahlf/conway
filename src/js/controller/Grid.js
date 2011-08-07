/**
 * @class GOL.controller.Grid
 */
Ext.define('GOL.controller.Grid', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    /**
     * @type Boolean
     * @property mouseDown
     * @private
     */
    mouseDown: false,
    
    /**
     * Creates a new Grid controller.
     * @param rows {Number} The number of rows in the Grid.
     * @param cols {Number} The number of columns in the Grid.
     * @param cellFactory {GOL.model.factory.CellFactory} The Cell model factory to use.
     * @param rules {GOL.rules.Rules} The rules for the Grid to follow.
     */
    constructor: function(rows, cols, cellFactory, rules) {
        this.model = new GOL.model.Grid(rows, cols, cellFactory, rules);
        
        this.view = Ext.create('GOL.view.Grid', {
            model: this.model
        });
        
        this.addEvents(
            /**
             * @event generationchange
             * @param {Number} count The new generation count.
             */
            'generationchange'
        );
        
        this.relayEvents(this.model, ['generationchange']);
        
        this.setupMouseListeners();
    },
    
    /**
     * Applies the given pattern to the Grid.
     * @param {GOL.pattern.Pattern} pattern
     */
    applyPattern: function(pattern) {
        this.model.applyPattern(pattern);
    },
    
    /**
     * Creates the next generation of Cells.
     */
    nextGeneration: function() {
        this.model.nextGeneration();
    },
    
    /**
     * Gets the controller's view.
     * @returns {GOL.view.Grid}
     */
    getView: function() {
        return this.view;
    },
    
    /**
     * Kills all of the Grid's Cells.
     */
    killAllCells: function() {
        this.model.killAllCells();
    },
    
    /**
     * Reconfigures the Grid.
     * @param {GOL.model.factory.CellFactory} cellFactory
     */
    reconfigure: function(cellFactory) {
        this.model.reconfigure(cellFactory);
    },
    
    /**
     * Destroys the controller and its associated model + view.
     */
    destroy: function() {
        Ext.getDoc().un('mouseup', this.onDocumentMouseUp, this);
        
        this.view.un('cellmousedown', this.onCellMouseDown, this);
        this.view.un('cellmouseover', this.onCellMouseOver, this);
        
        Ext.destroy(this.model, this.view);
        
        this.model = null;
        this.view = null;
    },
    
    setupMouseListeners: function() {
        Ext.getDoc().on('mouseup', this.onDocumentMouseUp, this);
        
        this.view.on('cellmousedown', this.onCellMouseDown, this);
        this.view.on('cellmouseover', this.onCellMouseOver, this);
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
