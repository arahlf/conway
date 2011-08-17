/**
 * @class GOL.model.RainbowCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define('GOL.model.RainbowCell', {
    extend: 'GOL.model.AgingCell',
    
    MAX_AGE: 7,
    
    persist: function() {
        if (this.tempAge > 0 && this.age < this.MAX_AGE && this.tempAge < this.MAX_AGE) {
            this.tempAge++;
        }
        return this;
    }
});