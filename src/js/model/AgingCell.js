/**
 * @class GOL.model.AgingCell
 * @extends GOL.model.AbstractCell
 * 
 * A Cell implementation that keeps track of its age.
 */
Ext.define('GOL.model.AgingCell', {
    extend: 'GOL.model.AbstractCell',
    
    age: 0,
    tempAge: 0,
    
    isAlive: function() {
        return this.age > 0;
    },
    
    getAge: function() {
        return this.age;
    },
    
    onCommit: function() {
        this.age = this.tempAge;
    },
    
    kill: function() {
        this.tempAge = 0;
        return this;
    },
    
    persist: function() {
        if (this.tempAge > 0) {
            this.tempAge++;
        }
        return this;
    },
    
    revive: function() {
        this.tempAge = 1;
        return this;
    }
});