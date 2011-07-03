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
        this.callParent();
        this.cells = cells;
    },
    
    /**
     * Iterates the Cells, calling the specified method on each Cell.
     * @param {String} methodName The method name to call on the composite.
     * @return {GOL.model.CompositeCell} this
     * @private
     */
    eachCell: function(methodName) {
        for (var i = 0; i < this.cells.length; i++) {
            (this.cells[i])[methodName]();
        }
        return this;
    },

    /**
     * Applies rules to the composite's Cells.
     */
    applyRules: function(rules) {
        for (var i = 0; i < this.cells.length; i++) {
            rules.applyRules(this.cells[i]);
        }
    },
    
    kill: function() {
        return this.eachCell("kill");
    },
    
    revive: function() {
        return this.eachCell("revive");
    },
    
    persist: function() {
        return this.eachCell("persist");
    },
    
    commit: function() {
        return this.eachCell("commit");
    },
    
    // unsupported methods
    getRow: GOL.unsupportedFn("CompositeCell.getRow"),
    getCol: GOL.unsupportedFn("CompositeCell.getCol"),
    getAliveNeighborsCount: GOL.unsupportedFn("CompositeCell.getAliveNeighborsCount"),
    setNeighbors: GOL.unsupportedFn("CompositeCell.setNeighbors"),
    getAge: GOL.unsupportedFn("CompositeCell.getAge"),
    isAlive: GOL.unsupportedFn("CompositeCell.isAlive")
});
