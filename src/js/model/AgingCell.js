/**
 * @class GOL.model.AgingCell
 * @extends GOL.model.AbstractCell
 *
 * A Cell implementation that keeps track of its age.
 */
Ext.define("GOL.model.AgingCell", {
    extend: "GOL.model.AbstractCell",

    age: 0,
    tempAge: 0,

    isAlive: function() {
        return this.age > 0;
    },

    getAge: function() {
        return this.age;
    },

    commit: function() {
        this.age = this.tempAge;
        this.fireEvent("commit");
        return this;
    },

    kill: function() {
        this.tempAge = 0;
        return this;
    },

    persist: function() {
        this.tempAge++;
        return this;
    },

    revive: function() {
        this.tempAge = 1;
        return this;
    }

});