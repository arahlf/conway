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
        var el = this.getEl();
        
        if (this.model.isAlive()) {
            el.addCls(this.aliveCls);
            el.removeCls(this.deadCls);
        }
        else {
            el.addCls(this.deadCls);
            el.removeCls(this.aliveCls);
        }
    }
});
