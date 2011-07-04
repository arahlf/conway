/**
 * @class GOL.model.BinaryCell
 * @extends GOL.model.AbstractCell
 *
 * Simple Cell implementation that is either dead or alive.
 */
Ext.define("GOL.model.BinaryCell", {
    extend: "GOL.model.AbstractCell",

    alive: false,
    tempAlive: false,

    getAge: function() {
        return this.alive ? 1 : 0;
    },

    isAlive: function() {
        return this.alive;
    },

    onCommit: function() {
        this.alive = this.tempAlive;
        return this;
    },

    kill: function() {
        this.tempAlive = false;
        return this;
    },

    persist: function() {
        return this;
    },

    revive: function() {
        this.tempAlive = true;
        return this;
    }
});