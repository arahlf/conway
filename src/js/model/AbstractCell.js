/**
 * An abstract base class for Cells that provides common/shared functionality.
 */
Ext.define("GOL.model.AbstractCell", {
    extend: "GOL.model.Cell",
    
    constructor: function(row, col) {
        var me = this;
        
        me.row = row, me.col = col;
        me.callParent();
    },
    
    getRow: function() {
        return this.row;
    },
    
    getCol: function() {
        return this.col;
    },

    /**
     * A partial implementation that handles the firing of the commit event.
     */
    commit: function() {
        this.onCommit();
        this.fireEvent("commit", this);
    },

    /**
     * Template method called when the Cell's state needs to be committed.
     */
    onCommit: GOL.abstractFn,
    
    getAliveNeighborsCount: function() {
        var count = 0, neighbors = this.neighbors;
        
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isAlive()) {
                count++;
            }
        }
        
        return count;
    },
    
    setNeighbors: function(neighbors) {
        this.neighbors = neighbors;
    }
});
