/**
 * @class GOL.model.CompositeCell
 * @extends GOL.model.Cell
 *
 * Serves as a <a href='http://en.wikipedia.org/wiki/Composite_pattern'>composite</a>
 * of Cell model objects.
 */
Ext.define('GOL.model.CompositeCell', {
    extend: 'GOL.model.Cell',
    
    /**
     * @param {Array} cells An array of cell models.
     */
    constructor: function(cells) {
        this.callParent();
        this.cells = cells;
    },
    
    /**
     * Retrieves the list of underlying Cells.
     * @return {Array}
     */
    getCells: function() {
        return this.cells;
    },
    
    /**
     * Calls the passed function for each element in this composite.
     * @param {Function} fn
     * @param {Object} scope
     * @return {GOL.model.CompositeCell} this
     */
    each: function(fn, scope) {
        Ext.Array.forEach(this.cells, fn, scope);
        return this;
    },
    
    kill: function() {
        return this.forEachCell('kill');
    },
    
    revive: function() {
        return this.forEachCell('revive');
    },
    
    persist: function() {
        return this.forEachCell('persist');
    },
    
    commit: function() {
        return this.forEachCell('commit');
    },
    
    /**
     * Calls the given method on each Cell in this composite (avoids function-based iteration).
     * @param {String} methodName
     * @return {GOL.model.CompositeCell} this
     * @private
     */
    forEachCell: function(methodName) {
        var cells = this.cells;
        
        for (var i = 0, length = cells.length; i < length; i++) {
            (cells[i])[methodName]();
        }
        return this;
    },
    
    // unsupported methods
    getRow: GOL.unsupportedFn('CompositeCell.getRow'),
    getCol: GOL.unsupportedFn('CompositeCell.getCol'),
    getAliveNeighborsCount: GOL.unsupportedFn('CompositeCell.getAliveNeighborsCount'),
    setNeighbors: GOL.unsupportedFn('CompositeCell.setNeighbors'),
    getAge: GOL.unsupportedFn('CompositeCell.getAge'),
    isAlive: GOL.unsupportedFn('CompositeCell.isAlive')
});
