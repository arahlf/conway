/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.AgingCell", {
    extend: "GOL.view.Cell",
    
    constructor: function() {
        this.callParent(arguments);
        this.updateView();
    },
    
    updateView: function() {
        var el = this.getEl();
        
        // clean this up...
        if (this.model.isAlive()) {
            el.dom.className = "gol-cell-alive gol-cell-aging";
            el.setStyle("background-color", this.getAgeAsColor());
        }
        else {
            el.dom.className = "gol-cell-dead";
            el.setStyle("background-color", "transparent");
        }
    },

    /**
     * Creates an RGB color string to represent the Cell based on its age.
     */
    getAgeAsColor: function() {
        var code = Math.max(255 - (this.getModel().getAge() * 15), 75);

        return Ext.String.format("rgb({0}, {1}, {2})", code, code, code);
    }
});