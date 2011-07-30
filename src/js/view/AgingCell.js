/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.AgingCell", {
    extend: "GOL.view.Cell",
    
    updateView: function() {
        var dom = this.getEl().dom;
        
        if (this.model.isAlive()) {
            dom.className = "gol-cell-alive gol-cell-aging";
            dom.style.backgroundColor = this.getAgeAsColor();
        }
        else {
            dom.className = "gol-cell-dead";
            dom.style.backgroundColor = "transparent";
        }
    },

    /**
     * Creates an RGB color string to represent the Cell based on its age.
     */
    getAgeAsColor: function() {
        var code = Math.max(255 - (this.getModel().getAge() * 15), 75);
        
        return Ext.String.format("rgb({0}, {1}, {2})", code, code, code);
    },
    
    destroy: function() {
        this.getEl().dom.style.backgroundColor = "transparent";
        this.callParent();
    }
});