/**
 * @class GOL.view.BinaryCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.BinaryCell", {
    extend: "GOL.view.Cell",
    
    aliveCls: "gol-cell-alive",
    deadCls: "gol-cell-dead",
    
    constructor: function() {
        this.callParent(arguments);
        this.updateView();
    },
    
    updateView: function() {
        // profiler shows directly setting the DOM className is at
        // least twice as fast as using Element's addCls + removeCls
        var dom = this.getEl().dom;
        
        if (this.model.isAlive()) {
            dom.className = this.aliveCls;
        }
        else {
            dom.className = this.deadCls;
        }
    }
});
