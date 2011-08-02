/**
 * @class GOL.model.RainbowCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define("GOL.model.RainbowCell", {
    extend: "GOL.model.AgingCell",
    
    MAX_AGE: 7,
    
    persist: function() {
        if (this.getAge() < this.MAX_AGE) {
            this.tempAge++;
        }
        return this;
    }
});