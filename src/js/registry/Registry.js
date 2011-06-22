/**
 * @class GOL.registry.Registry
 */
Ext.define("GOL.registry.Registry", {
    /**
     * @constructor
     */
    constructor: function() {
        this.store = new Ext.data.Store({
            model: "GOL.registry.Register"
        });
    },

    /**
     * Register a new name/value.
     * @param {Mixed} key
     * @param {Mixed} value
     */
    register: function(name, value) {
        this.store.add({
            name: name,
            value: value
        });
    },

    /**
     * Gets the Registry's store.
     */
    getStore: function() {
        return this.store;
    },
    
    getDefaultValue: function() {
        return this.store.first().getValue();
    }
});