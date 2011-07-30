/**
 * @class GOL.view.AgingCell
 * @extends GOL.view.Cell
 * @constructor
 * @param {GOL.model.Cell} model A cell model.
 */
Ext.define("GOL.view.RainbowCell", {
    extend: "GOL.view.AgingCell",
    
    colors: ["#dd0000", "#fe6230", "#fef600", "#00bc00", "#009bfe", "#000083", "#30009b"],
    
    getAgeAsColor: function() {
        return this.colors[this.model.getAge() - 1];
    }
});