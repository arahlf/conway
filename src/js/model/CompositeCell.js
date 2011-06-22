/**
 * @class GOL.model.CompositeCell
 * @extends GOL.model.Cell
 * @constructor
 * @param {Array} cells An array of cell models.
 *
 * Serves as a <a href="http://en.wikipedia.org/wiki/Composite_pattern">composite</a>
 * of Cell model objects.
 */
Ext.define("GOL.model.CompositeCell", {
    extend: "GOL.model.Cell",
    
    constructor: function(cells) {
        this.cells = cells;
        this.callParent();
    },
    
    /**
     * Iterates the Cells, calling the specified method on each Cell.
     * Avoiding function-based iteration for better performance.
     * @param {String} methodName The method name to call on the composite.
     * @private
     */
    eachCell: function(methodName) {
        var cells = this.cells;
        
        for (var i = 0; i < cells.length; i++) {
            (cells[i])[methodName]();
        }
    },
    
    kill: function() {
        this.eachCell("kill");
        return this;
    },
    
    revive: function() {
        this.eachCell("revive");
        return this;
    },
    
    persist: function() {
        this.eachCell("persist");
        return this;
    },
    
    commit: function() {
        this.eachCell("commit");
        this.fireEvent("commit");
        return this;
    },
    
    applyRules: function(rules) {
        // maybe?
    },
    
    // unsupported methods
    getRow: GOL.unsupportedFn(),
    getCol: GOL.unsupportedFn("CompositeCell.getCol"),
    getAliveNeighborsCount: GOL.unsupportedFn("CompositeCell.getAliveNeighborsCount"),
    setNeighbors: GOL.unsupportedFn("CompositeCell.setNeighbors"),
    getAge: GOL.unsupportedFn("CompositeCell.getAge"),
    isAlive: GOL.unsupportedFn("CompositeCell.isAlive")
});
